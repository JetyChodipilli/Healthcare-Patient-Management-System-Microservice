package com.ccp.patientservice.controller;

import com.ccp.patientservice.dto.PatientRequestDTO;
import com.ccp.patientservice.dto.PatientResponseDTO;
import com.ccp.patientservice.dto.validators.CreatePatientValidationGroup;
import com.ccp.patientservice.service.PatientService;
import jakarta.validation.groups.Default;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/patients")
public class PatientController {
    private final PatientService patientService;
    public PatientController(PatientService patientService) {
        this.patientService = patientService;
    }

    @GetMapping
    public ResponseEntity<List<PatientResponseDTO>> getPatients() {

        List<PatientResponseDTO> patients = patientService.getPatients();
        return ResponseEntity.ok().body(patients);
    }

    @PostMapping
    public ResponseEntity<PatientResponseDTO> createPatient(@Validated({Default.class, CreatePatientValidationGroup.class}) @RequestBody PatientRequestDTO patientRequestDTO) {
        PatientResponseDTO patientResponseDTO=patientService.createPatient(patientRequestDTO);
        return ResponseEntity.ok().body(patientResponseDTO);

    }

    @PutMapping("/{id}")
    public ResponseEntity<PatientResponseDTO> updatePatient(@Validated({Default.class}) @RequestBody PatientRequestDTO patientRequestDTO, @PathVariable UUID id) {

        PatientResponseDTO patientResponseDTO=patientService.updatePatient(id,patientRequestDTO);
        return ResponseEntity.ok().body(patientResponseDTO);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePatient(@PathVariable UUID id) {
        patientService.deletePatient(id);
        return ResponseEntity.noContent().build();
    }
}
