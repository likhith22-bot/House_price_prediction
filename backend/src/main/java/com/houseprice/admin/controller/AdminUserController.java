package com.houseprice.admin.controller;

import com.houseprice.auth.repository.UserRepository;
import com.houseprice.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/users")
@CrossOrigin(origins = "*")
public class AdminUserController {

    @Autowired
    private UserRepository userRepository;

    // DTO to include password field for admin view
    record AdminUserDto(Long id, String username, String email, String password, String role, java.time.LocalDateTime createdAt) {}

    @GetMapping
    public List<AdminUserDto> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(u -> new AdminUserDto(u.getId(), u.getUsername(), u.getEmail(), u.getPassword(),
                        u.getRole() != null ? u.getRole().name() : "USER", u.getCreatedAt()))
                .collect(Collectors.toList());
    }
}

