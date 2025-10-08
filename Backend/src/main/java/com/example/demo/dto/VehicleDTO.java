// dto/VehicleDTO.java
package com.example.demo.dto;

import java.math.BigDecimal;

public class VehicleDTO {
    private Long id;
    private String name;
    private String model;
    private String number;
    private BigDecimal rentCost;
    private String type;
    private boolean available;
    private boolean damaged;
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getModel() { return model; }
    public void setModel(String model) { this.model = model; }
    
    public String getNumber() { return number; }
    public void setNumber(String number) { this.number = number; }
    
    public BigDecimal getRentCost() { return rentCost; }
    public void setRentCost(BigDecimal rentCost) { this.rentCost = rentCost; }
    
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    
    public boolean isAvailable() { return available; }
    public void setAvailable(boolean available) { this.available = available; }
    
    public boolean isDamaged() { return damaged; }
    public void setDamaged(boolean damaged) { this.damaged = damaged; }
}