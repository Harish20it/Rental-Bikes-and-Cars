package com.example.demo.dto;

public class AuthResponse {
    private boolean success;
    private String message;
    private String token;
    private String role;
    private UserDTO user;
    
    // Constructors
    public AuthResponse(boolean success, String message) {
        this.success = success;
        this.message = message;
    }
    
    public AuthResponse(boolean success, String token, String role, UserDTO user) {
        this.success = success;
        this.token = token;
        this.role = role;
        this.user = user;
    }
    
    // Getters and Setters
    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }
    
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    
    public UserDTO getUser() { return user; }
    public void setUser(UserDTO user) { this.user = user; }
}
