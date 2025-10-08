// model/Offer.java
package com.example.demo.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "offers")
public class Offer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    private String discount;
    
    private LocalDate validTill;
    private boolean active = true;
    
    // Constructors
    public Offer() {}
    
    public Offer(String title, String discount, LocalDate validTill) {
        this.title = title;
        this.discount = discount;
        this.validTill = validTill;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getDiscount() { return discount; }
    public void setDiscount(String discount) { this.discount = discount; }
    
    public LocalDate getValidTill() { return validTill; }
    public void setValidTill(LocalDate validTill) { this.validTill = validTill; }
    
    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
}