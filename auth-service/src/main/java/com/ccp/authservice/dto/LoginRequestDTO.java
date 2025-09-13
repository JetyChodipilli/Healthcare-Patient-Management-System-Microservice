package com.ccp.authservice.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class LoginRequestDTO {


    @NotBlank(message = "Email is Required")
    @Email(message = "Email should be valid Email Address")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password should be at least 8 Characters Long")
    private String password;

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }


}
