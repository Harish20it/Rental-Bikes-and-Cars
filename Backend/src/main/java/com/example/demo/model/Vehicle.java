// model/Vehicle.java
package com.example.demo.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "vehicles")
public class Vehicle {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    
    private String model;
    
    @Column(unique = true)
    private String number;
    
    private BigDecimal rentCost;
    
    @Enumerated(EnumType.STRING)
    private VehicleType type;
    
    private boolean available = true;
    private boolean damaged = false;
    
    // Constructors - ADD THESE
    public Vehicle() {}
    
    public Vehicle(String name, String model, String number, BigDecimal rentCost, VehicleType type) {
        this.name = name;
        this.model = model;
        this.number = number;
        this.rentCost = rentCost;
        this.type = type;
    }
    
    // Getters and Setters - MAKE SURE ALL ARE PRESENT
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
    
    public VehicleType getType() { return type; }
    public void setType(VehicleType type) { this.type = type; }
    
    public boolean isAvailable() { return available; }
    public void setAvailable(boolean available) { this.available = available; }
    
    public boolean isDamaged() { return damaged; }
    public void setDamaged(boolean damaged) { this.damaged = damaged; }
}