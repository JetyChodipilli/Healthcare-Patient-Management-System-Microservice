package com.ccp.patientservice.exception;

public class EmailAlredyExistsException extends RuntimeException {
    public EmailAlredyExistsException(String message){
        super(message);
    }
}
