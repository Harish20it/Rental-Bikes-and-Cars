package com.example.demo.service;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import com.example.demo.model.User;

import javax.crypto.SecretKey;
import java.util.Date;

@Service
public class JwtService {
 
 private final SecretKey secretKey = Keys.secretKeyFor(SignatureAlgorithm.HS256);
 private final long expiration = 86400000; // 24 hours
 
 public String generateToken(User user) {
     return Jwts.builder()
             .setSubject(user.getEmail())
             .claim("role", user.getRole().name())
             .claim("userId", user.getId())
             .setIssuedAt(new Date())
             .setExpiration(new Date(System.currentTimeMillis() + expiration))
             .signWith(secretKey)
             .compact();
 }
 
 public String extractEmail(String token) {
     return Jwts.parserBuilder()
             .setSigningKey(secretKey)
             .build()
             .parseClaimsJws(token)
             .getBody()
             .getSubject();
 }
 
 public boolean validateToken(String token) {
     try {
         Jwts.parserBuilder()
             .setSigningKey(secretKey)
             .build()
             .parseClaimsJws(token);
         return true;
     } catch (JwtException e) {
         return false;
     }
 }
}