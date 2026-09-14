package com.pm.authservice.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class LoginRequestDTO {
  @NotBlank(message = "Email is required")
  @Email(message = "Email should be a valid email address")
  private String email;

  @NotBlank(message = "Password is required")
  @Size(min = 8, message = "Password must be at least 8 characters long")
  private String password;

  // Optional: only used during registration. Defaults to "STAFF" if not provided.
  private String role;

  public @NotBlank(message = "Email is required") @Email(message = "Email should be a valid email address") String getEmail() {
    return email;
  }

  public void setEmail(
      @NotBlank(message = "Email is required") @Email(message = "Email should be a valid email address") String email) {
    this.email = email;
  }

  public @NotBlank(message = "Password is required") @Size(min = 8, message = "Password must be at least 8 characters long") String getPassword() {
    return password;
  }

  public void setPassword(
      @NotBlank(message = "Password is required") @Size(min = 8, message = "Password must be at least 8 characters long") String password) {
    this.password = password;
  }

  public String getRole() {
    return role;
  }

  public void setRole(String role) {
    this.role = role;
  }
}
