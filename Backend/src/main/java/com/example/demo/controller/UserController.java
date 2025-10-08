package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.model.User;
import com.example.demo.service.UserService;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {
 
 @Autowired
 private UserService userService;
 
 @GetMapping
 public ResponseEntity<List<User>> getAllUsers() {
     return ResponseEntity.ok(userService.getAllUsers());
 }
 
 @GetMapping("/{id}")
 public ResponseEntity<User> getUserById(@PathVariable Long id) {
     return userService.getUserById(id)
             .map(ResponseEntity::ok)
             .orElse(ResponseEntity.notFound().build());
 }
}