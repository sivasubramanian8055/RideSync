package com.app.ridesync.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.app.ridesync.dto.requests.AuthenticationRequest;
import com.app.ridesync.dto.requests.PasswordResetRequest;
import com.app.ridesync.dto.requests.RegisterRequest;
import com.app.ridesync.dto.responses.ApiResponse;
import com.app.ridesync.dto.responses.AuthenticationResponse;
import com.app.ridesync.entities.User;
import com.app.ridesync.services.AuthenticationService;
import com.app.ridesync.services.JwtService;

import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor

public class AuthenticationController {
    private final AuthenticationService service;

    @Autowired
    JwtService jwtService;

    @PostMapping("/register")
    @CrossOrigin(origins = "*")
    public ResponseEntity<AuthenticationResponse> register(
            @RequestBody RegisterRequest request) throws MessagingException {
        try {
            return ResponseEntity.ok(service.validateRequest(request));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(AuthenticationResponse.builder().success(false).message(e.getMessage()).build());
        }
    }

    @PostMapping("/authenticate")
    @CrossOrigin(origins = "*")
    public ResponseEntity<AuthenticationResponse> authenticate(
            @RequestBody AuthenticationRequest request) {
        try {
            return ResponseEntity.ok(service.authenticate(request));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(AuthenticationResponse.builder().success(false).message(e.getMessage()).build());
        }
    }

    @PostMapping("/forgotPassword")
    @CrossOrigin(origins = "*")
    public ResponseEntity<AuthenticationResponse> forgotPassword(
            @RequestBody AuthenticationRequest request) throws MessagingException {
        try {
            return ResponseEntity.ok(service.forgotPassword(request));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(AuthenticationResponse.builder().success(false).message(e.getMessage()).build());
        }
    }

    @GetMapping("/resetPassword")
    @CrossOrigin(origins = "*")
    public ResponseEntity<AuthenticationResponse> resetPassword(@RequestParam String token,
            @RequestParam Integer id) {
        try {
            return ResponseEntity.ok(service.resetPassword(id, token));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(AuthenticationResponse.builder().success(false).message(e.getMessage()).build());
        }
    }

    @GetMapping("/verifyEmail")
    @CrossOrigin(origins = "*")
    public ResponseEntity<AuthenticationResponse> verifyEmail(@RequestParam String email,
            @RequestParam Integer id) {
        try {
            return ResponseEntity.ok(service.verifyEmail(id, email));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(AuthenticationResponse.builder().success(false).message(e.getMessage()).build());
        }
    }

    @PostMapping("/newPassword")
    @CrossOrigin(origins = "*")
    public ResponseEntity<AuthenticationResponse> setNewPassword(@RequestBody PasswordResetRequest request) {
        try {
            return ResponseEntity.ok(service.setNewPassword(request));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(AuthenticationResponse.builder().success(false).message(e.getMessage()).build());
        }
    }

    @PutMapping("/updateUser")
    @CrossOrigin(origins = "*")
    public ResponseEntity<ApiResponse<User>> updateUserDetails(@RequestHeader("Authorization") String jwtToken,
            @RequestBody RegisterRequest request) {
        try {
            Integer userId = jwtService.extractUserId(jwtToken.substring(7));
            return ResponseEntity.status(HttpStatus.OK)
                    .body(new ApiResponse<>(service.updateUserDetails(request, userId), true,
                            "Result set was retrieved successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(null, false, "ERROR: " + e.getMessage()));
        }
    }
}
