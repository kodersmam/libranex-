package com.example.jwt.controller;

import com.example.jwt.dto.AuthRequest;
import com.example.jwt.service.JwtService;
import com.example.jwt.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.Map;

@Tag(name = "Auth", description = "Authentication endpoints")
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;
    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;
    private final PasswordEncoder passwordEncoder;

    @Operation(summary = "Register new user")
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody AuthRequest request) {
        userService.registerUser(request.getUsername(), request.getPassword());
        return ResponseEntity.ok(Map.of("message", "User registered successfully"));
    }

    @Operation(summary = "Login user and get JWT token")
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody AuthRequest request) {
        String username = request.getUsername();
        String password = request.getPassword();

        UserDetails userDetails = userDetailsService.loadUserByUsername(username);

        if (!passwordEncoder.matches(password, userDetails.getPassword())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Bad credentials"));
        }

        String token = jwtService.generateToken(userDetails);
        return ResponseEntity.ok(Map.of("token mateusz", token));
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(Map.of(
                "username", userDetails.getUsername()
        ));
    }
}