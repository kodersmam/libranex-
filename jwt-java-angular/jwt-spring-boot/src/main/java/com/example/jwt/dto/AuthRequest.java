package com.example.jwt.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Schema(description = "Credentials for registration or login")
public class AuthRequest {

    @NotBlank
    @Schema(description = "Unique username", example = "jan")
    private String username;

    @NotBlank
    @Schema(description = "User password", example = "haslo123")
    private String password;
}
