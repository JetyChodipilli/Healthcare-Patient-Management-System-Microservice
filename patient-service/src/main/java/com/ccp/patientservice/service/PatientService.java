package com.ccp.patientservice.service;

import com.ccp.patientservice.dto.PatientRequestDTO;
import com.ccp.patientservice.dto.PatientResponseDTO;

import com.ccp.patientservice.exception.EmailAlredyExistsException;
import com.ccp.patientservice.exception.PatientNotFoundEXception;
import com.ccp.patientservice.grpc.BillingServiceGrpcClient;
import com.ccp.patientservice.kafka.KafkaProducer;
import com.ccp.patientservice.mapper.PaitentMapper;
import com.ccp.patientservice.model.Patient;
import com.ccp.patientservice.repository.PatientRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
public class PatientService {
    private final PatientRepository patientRepository;
    private final BillingServiceGrpcClient billingServiceGrpcClient;
    private final KafkaProducer kafkaProducer;



    public PatientService(PatientRepository patientRepository, BillingServiceGrpcClient billingServiceGrpcClient, KafkaProducer kafkaProducer) {
        this.patientRepository = patientRepository;
        this.billingServiceGrpcClient = billingServiceGrpcClient;
        this.kafkaProducer = kafkaProducer;
    }

    public List<PatientResponseDTO> getPatients() {
        List<Patient> patients = patientRepository.findAll();
        return patients.stream()
                .map(PaitentMapper::toDTO).toList();
    }

    public PatientResponseDTO createPatient(PatientRequestDTO patientRequestDTO) {
        if(patientRepository.existsByEmail(patientRequestDTO.getEmail())){
            throw new EmailAlredyExistsException("A patient is already registered with this Email"
                    +patientRequestDTO.getEmail());
        }
        Patient patient = patientRepository.save(
                PaitentMapper.toModel(patientRequestDTO)); //if we tried to enter patient as an entity it gives error
        //because type mismatching so create a method in mapper class as toModel() to convert entity class as request

        billingServiceGrpcClient.createBillingAccount(patient.getId().toString(), patient.getName(), patient.getEmail());

        kafkaProducer.sendEvent(patient);

      return PaitentMapper.toDTO(patient);

    }

    public PatientResponseDTO updatePatient(UUID id, PatientRequestDTO patientRequestDTO) {
        Patient patient = patientRepository.findById(id).orElseThrow(
                () -> new PatientNotFoundEXception("Patient is nit found with ID ::" + id));

        if(patientRepository.existsByEmailAndIdNot(patientRequestDTO.getEmail(),id)){
            throw new EmailAlredyExistsException(
                    "A patient is already registered with this Email" +patientRequestDTO.getEmail());

        }
        patient.setName(patientRequestDTO.getName());
        patient.setEmail(patientRequestDTO.getEmail());
        patient.setAddress(patientRequestDTO.getAddress());
        patient.setDateOfBirth(LocalDate.parse(patientRequestDTO.getDateOfBirth()));
        patient.setRegisteredDate(LocalDate.parse(patientRequestDTO.getRegisteredDate()));

        Patient updatedPatient = patientRepository.save(patient);
        return PaitentMapper.toDTO(updatedPatient);

    }

    public void deletePatient(UUID id) {
        patientRepository.deleteById(id);
    }
}
