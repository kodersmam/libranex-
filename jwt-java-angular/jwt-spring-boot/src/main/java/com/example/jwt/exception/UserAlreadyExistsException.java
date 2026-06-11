package com.example.jwt.exception;

import lombok.Getter;

@Getter
public class UserAlreadyExistsException extends RuntimeException {

    private final String username;

    public UserAlreadyExistsException(String username) {
        super("Użytkownik o nazwie \"" + username + "\" już istnieje. Zaloguj się lub wybierz inną nazwę.");
        this.username = username;
    }
}
