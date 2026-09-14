package com.pm.patientservice.service;

import com.pm.patientservice.dto.PatientRequestDTO;
import com.pm.patientservice.dto.PatientResponseDTO;
import com.pm.patientservice.exception.EmailAlreadyExistsException;
import com.pm.patientservice.exception.PatientNotFoundException;
import com.pm.patientservice.grpc.BillingServiceGrpcClient;
import com.pm.patientservice.kafka.KafkaProducer;
import com.pm.patientservice.mapper.PatientMapper;
import com.pm.patientservice.model.Patient;
import com.pm.patientservice.repository.PatientRepository;
import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class PatientService {

  private static final Logger log = LoggerFactory.getLogger(PatientService.class);

  private final PatientRepository patientRepository;
  private final BillingServiceGrpcClient billingServiceGrpcClient;
  private final KafkaProducer kafkaProducer;

  public PatientService(PatientRepository patientRepository,
      BillingServiceGrpcClient billingServiceGrpcClient,
      KafkaProducer kafkaProducer) {
    this.patientRepository = patientRepository;
    this.billingServiceGrpcClient = billingServiceGrpcClient;
    this.kafkaProducer = kafkaProducer;
  }

  public List<PatientResponseDTO> getPatients() {
    List<Patient> patients = patientRepository.findAll();
    return patients.stream().map(PatientMapper::toDTO).toList();
  }

  public PatientResponseDTO createPatient(PatientRequestDTO patientRequestDTO) {
    // 1. Validate email uniqueness
    if (patientRepository.existsByEmail(patientRequestDTO.getEmail())) {
      throw new EmailAlreadyExistsException(
          "A patient with this email already exists " + patientRequestDTO.getEmail());
    }

    // 2. Parse date of birth safely
    LocalDate dob;
    try {
      dob = LocalDate.parse(patientRequestDTO.getDateOfBirth());
    } catch (DateTimeParseException e) {
      throw new IllegalArgumentException("Invalid date of birth format");
    }
    patientRequestDTO.setDateOfBirth(dob.toString()); // ensure stored as ISO string

    // 3. Persist patient first (so we have an ID for downstream calls)
    Patient newPatient = patientRepository.save(PatientMapper.toModel(patientRequestDTO));

    // 4. Try to create billing account; on failure roll back patient record
    try {
      billingServiceGrpcClient.createBillingAccount(newPatient.getId().toString(),
          newPatient.getName(), newPatient.getEmail());
    } catch (Exception e) {
      log.error("Billing service failed, rolling back patient creation", e);
      patientRepository.deleteById(newPatient.getId());
      throw e;
    }

    // 5. Publish event; on failure we keep the patient but log the incident
    try {
      kafkaProducer.sendEvent(newPatient);
    } catch (Exception e) {
      log.error("Failed to publish patient creation event", e);
      // No rollback – the patient exists, just the analytics pipeline missed it
    }

    return PatientMapper.toDTO(newPatient);
  }

  public PatientResponseDTO updatePatient(UUID id, PatientRequestDTO patientRequestDTO) {
    Patient patient = patientRepository.findById(id).orElseThrow(
        () -> new PatientNotFoundException("Patient not found with ID: " + id));

    if (patientRepository.existsByEmailAndIdNot(patientRequestDTO.getEmail(), id)) {
      throw new EmailAlreadyExistsException(
          "A patient with this email already exists " + patientRequestDTO.getEmail());
    }

    // Safe parsing of DOB
    try {
      patient.setDateOfBirth(LocalDate.parse(patientRequestDTO.getDateOfBirth()));
    } catch (DateTimeParseException e) {
      throw new IllegalArgumentException("Invalid date of birth format");
    }

    patient.setName(patientRequestDTO.getName());
    patient.setAddress(patientRequestDTO.getAddress());
    patient.setEmail(patientRequestDTO.getEmail());

    Patient updatedPatient = patientRepository.save(patient);
    return PatientMapper.toDTO(updatedPatient);
  }

  public void deletePatient(UUID id) {
    patientRepository.deleteById(id);
  }
}
