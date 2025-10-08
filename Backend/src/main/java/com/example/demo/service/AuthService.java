// service/AuthService.java
package com.example.demo.service;

import com.example.demo.dto.AuthResponse;
import com.example.demo.dto.LoginRequest;
import com.example.demo.dto.RegisterRequest;
import com.example.demo.dto.UserDTO;
import com.example.demo.model.User;
import com.example.demo.model.Role;
import com.example.demo.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class AuthService {
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    public AuthResponse register(RegisterRequest request) {
        try {
            System.out.println("🔧 Starting registration for: " + request.getEmail());
            
            // Check if email already exists
            if (userService.emailExists(request.getEmail())) {
                System.out.println("❌ Email already exists: " + request.getEmail());
                return new AuthResponse(false, "Email already exists");
            }
            
            // Create new user
            User user = new User();
            user.setName(request.getName() != null ? request.getName().trim() : "");
            user.setEmail(request.getEmail().trim().toLowerCase());
            user.setPassword(passwordEncoder.encode(request.getPassword()));
            
            // Handle optional fields with null safety
            if (request.getPhone() != null) {
                user.setPhone(request.getPhone().trim());
            }
            if (request.getAddress() != null) {
                user.setAddress(request.getAddress().trim());
            }
            
            // Handle role assignment with enhanced null safety
            String userRole = request.getRole();
            if (userRole == null || userRole.trim().isEmpty()) {
                userRole = "USER";
            }
            
            if ("ADMIN".equalsIgnoreCase(userRole.trim())) {
                user.setRole(Role.ADMIN);
                System.out.println("👑 Setting role as ADMIN");
            } else {
                user.setRole(Role.USER);
                System.out.println("👤 Setting role as USER");
            }
            
            // Save user
            User savedUser = userService.saveUser(user);
            System.out.println("✅ User saved with ID: " + savedUser.getId());
            
            // Generate token
            String token = jwtUtil.generateToken(savedUser.getEmail(), savedUser.getRole().name());
            System.out.println("🔐 JWT Token generated");
            
            // Convert to DTO
            UserDTO userDTO = convertToDTO(savedUser);
            return new AuthResponse(true, token, savedUser.getRole().name(), userDTO);
            
        } catch (Exception e) {
            System.err.println("🚨 Registration error: " + e.getMessage());
            e.printStackTrace();
            return new AuthResponse(false, "Registration failed: " + e.getMessage());
        }
    }
    
    public AuthResponse login(LoginRequest request) {
        try {
            System.out.println("🔐 Login attempt for: " + request.getEmail());
            System.out.println("🎯 Requested role: " + request.getRole());
            
            // Find user by email
            Optional<User> userOpt = userService.getUserByEmail(request.getEmail());
            
            if (userOpt.isEmpty()) {
                System.out.println("❌ User not found: " + request.getEmail());
                return new AuthResponse(false, "Invalid email or password");
            }
            
            User user = userOpt.get();
            System.out.println("👤 Found user: " + user.getEmail() + " with role: " + user.getRole());
            
            // Check if password matches
            if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                System.out.println("❌ Password mismatch for: " + request.getEmail());
                return new AuthResponse(false, "Invalid email or password");
            }
            
            // Check if role matches (case-insensitive)
            if (!user.getRole().name().equalsIgnoreCase(request.getRole())) {
                System.out.println("❌ Role mismatch. User role: " + user.getRole() + ", Requested role: " + request.getRole());
                return new AuthResponse(false, "Invalid role selected for this account");
            }
            
            // Generate token and return response
            String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());
            UserDTO userDTO = convertToDTO(user);
            
            System.out.println("✅ Login successful for: " + user.getEmail());
            return new AuthResponse(true, token, user.getRole().name(), userDTO);
            
        } catch (Exception e) {
            System.err.println("🚨 Login error: " + e.getMessage());
            e.printStackTrace();
            return new AuthResponse(false, "Login failed: " + e.getMessage());
        }
    }
    
    private UserDTO convertToDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setPhone(user.getPhone());
        dto.setAddress(user.getAddress());
        dto.setRole(user.getRole().name());
        dto.setJoinDate(user.getJoinDate());
        dto.setTotalBookings(user.getTotalBookings());
        return dto;
    }
}