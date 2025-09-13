package com.ccp.patientservice.mapper;

import com.ccp.patientservice.dto.PatientRequestDTO;
import com.ccp.patientservice.dto.PatientResponseDTO;
import com.ccp.patientservice.model.Patient;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

 public class PaitentMapper {
    public static PatientResponseDTO toDTO(Patient patient) {
        PatientResponseDTO patientDTO = new PatientResponseDTO();
        patientDTO.setId(patient.getId().toString());
        patientDTO.setName(patient.getName());
        patientDTO.setAddress(patient.getAddress());
        patientDTO.setEmail(patient.getEmail());
        patientDTO.setDateOfBirth(patient.getDateOfBirth() != null
                ? patient.getDateOfBirth().format(DateTimeFormatter.ISO_LOCAL_DATE)
                : "");
        return patientDTO;
    }
    public static Patient toModel(PatientRequestDTO patientRequestDTO) {
        Patient patient = new Patient();
        patient.setName(patientRequestDTO.getName());
        patient.setAddress(patientRequestDTO.getAddress());
        patient.setEmail(patientRequestDTO.getEmail());
        patient.setDateOfBirth(LocalDate.parse(patientRequestDTO.getDateOfBirth(), DateTimeFormatter.ISO_LOCAL_DATE));
        patient.setRegisteredDate(LocalDate.parse(patientRequestDTO.getRegisteredDate(), DateTimeFormatter.ISO_LOCAL_DATE));
        return patient;
    }
}
