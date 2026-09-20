package com.pm.authservice.controller;

import com.pm.authservice.dto.LoginRequestDTO;
import com.pm.authservice.dto.LoginResponseDTO;
import com.pm.authservice.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import java.util.Optional;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AuthController {

  private final AuthService authService;

  public AuthController(AuthService authService) {
    this.authService = authService;
  }

  @Operation(summary = "Generate token on user login")
  @PostMapping("/login")
  public ResponseEntity<LoginResponseDTO> login(
      @RequestBody LoginRequestDTO loginRequestDTO) {

    Optional<String> tokenOptional = authService.authenticate(loginRequestDTO);

    if (tokenOptional.isEmpty()) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    String token = tokenOptional.get();
    return ResponseEntity.ok(new LoginResponseDTO(token));
  }

  @Operation(summary = "Register a new user")
  @PostMapping("/register")
  public ResponseEntity<String> register(
      @RequestBody LoginRequestDTO loginRequestDTO) {

    // Only one Admin exists (pre-provisioned). Disallow public registration as ADMIN.
    if ("ADMIN".equalsIgnoreCase(loginRequestDTO.getRole())) {
      return ResponseEntity.status(HttpStatus.FORBIDDEN)
          .body("Administrator role cannot be registered publicly.");
    }

    boolean success = authService.registerUser(
        loginRequestDTO.getEmail(),
        loginRequestDTO.getPassword(),
        loginRequestDTO.getRole()
    );
    if (!success) {
      return ResponseEntity.status(HttpStatus.CONFLICT).body("User already exists");
    }
    return ResponseEntity.status(HttpStatus.CREATED).body("User registered successfully");
  }

  @Operation(summary = "Validate Token")
  @GetMapping("/validate")
  public ResponseEntity<Void> validateToken(
      @RequestHeader("Authorization") String authHeader) {

    // Authorization: Bearer <token>
    if(authHeader == null || !authHeader.startsWith("Bearer ")) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    return authService.validateToken(authHeader.substring(7))
        ? ResponseEntity.ok().build()
        : ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
  }
}
