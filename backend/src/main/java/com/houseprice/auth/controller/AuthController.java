package com.houseprice.auth.controller;

import com.houseprice.auth.dto.JwtResponse;
import com.houseprice.auth.dto.LoginRequest;
import com.houseprice.auth.dto.SignupRequest;
import com.houseprice.auth.repository.UserRepository;
import com.houseprice.common.enums.Role;
import com.houseprice.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/login")
    public JwtResponse login(@RequestBody LoginRequest request) {
        // 1. Check Admin credentials first
        if ("admin".equals(request.getUsername()) && "admin123".equals(request.getPassword())) {
            return new JwtResponse("mock-jwt-token-admin", "admin", "ADMIN");
        }

        // 2. Check regular users (by username OR email)
        User user = userRepository.findByUsername(request.getUsername())
                .orElseGet(() -> userRepository.findByEmail(request.getUsername()).orElse(null));

        if (user == null || !user.getPassword().equals(request.getPassword())) {
            throw new RuntimeException("Invalid Credentials");
        }

        String role = user.getRole() != null ? user.getRole().toString() : Role.USER.toString();
        return new JwtResponse("mock-jwt-token-" + user.getId(), user.getUsername(), role);
    }

    @PostMapping("/signup")
    public String signup(@RequestBody SignupRequest request) {
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new RuntimeException("Username already exists");
        }
        
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }
        
        // Validate and set role from request, default to USER if not provided or invalid
        Role userRole = Role.USER;
        if (request.getRole() != null && !request.getRole().isEmpty()) {
            try {
                userRole = Role.valueOf(request.getRole().toUpperCase());
                // Only allow BUYER, SELLER, INVESTOR for registration (not ADMIN or GUEST)
                if (userRole != Role.BUYER && userRole != Role.SELLER && userRole != Role.INVESTOR) {
                    userRole = Role.USER;
                }
            } catch (IllegalArgumentException e) {
                userRole = Role.USER; // Default to USER if invalid role
            }
        }
        
        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(request.getPassword())
                .role(userRole)
                .build();
        
        userRepository.save(user);
        return "User registered successfully";
    }
}
