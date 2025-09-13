package com.ccp.patientservice.exception;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String,String>>  handleMethodArgumentNotValidException(MethodArgumentNotValidException ex){
        Map<String,String> errors=new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(
                error ->errors.put(error.getField(),error.getDefaultMessage()));
        return ResponseEntity.badRequest().body(errors);
    }

    @ExceptionHandler(EmailAlredyExistsException.class)
    public ResponseEntity<Map<String,String>> handleEmailAlredyExistsException(EmailAlredyExistsException ex){
        log.warn("Email is Already Existed {}",ex.getMessage());
        Map<String,String> errors=new HashMap<>();
        errors.put("EmailAlredyExistsException",ex.getMessage());
        return ResponseEntity.badRequest().body(errors);
    }

    @ExceptionHandler(PatientNotFoundEXception.class)
    public ResponseEntity<Map<String,String>> handlePatientNotFoundEXception(PatientNotFoundEXception ex){
        log.warn("Patient Not Found {}",ex.getMessage());
        Map<String,String> errors =new HashMap<>();
        errors.put("message", "Patient Not Found");
        return ResponseEntity.badRequest().body(errors);
    }
}
