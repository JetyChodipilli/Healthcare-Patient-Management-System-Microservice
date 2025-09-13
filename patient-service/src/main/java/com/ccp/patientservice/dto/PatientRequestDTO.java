package com.ccp.patientservice.dto;

import com.ccp.patientservice.dto.validators.CreatePatientValidationGroup;
import jakarta.validation.constraints.*;

public class PatientRequestDTO {
    @NotBlank
    @Size(max = 100, message = "name Cannot Exceeds 100")
    private String name;

    @NotBlank(message = "Email is Required")
    @Email(message = "Email should be Valid")
    private String email;

    @NotBlank(message = "Address is Required")
    private String address;

    @NotBlank(message = "Date Of Birth is Required")
    private String dateOfBirth;

    @NotBlank(groups = CreatePatientValidationGroup.class, message = "Registered date is Required")
    private String registeredDate;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(String dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public String getRegisteredDate() {
        return registeredDate;
    }

    public void setRegisteredDate(String registeredDate) {
        this.registeredDate = registeredDate;
    }
}
