// service/VehicleService.java
package com.example.demo.service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.model.Vehicle;
import com.example.demo.model.VehicleType;
import com.example.demo.repository.VehicleRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class VehicleService {
    
    @Autowired
    private VehicleRepository vehicleRepository;
    
    public List<Vehicle> getAllVehicles() {
        return vehicleRepository.findAll();
    }
    
    public Optional<Vehicle> getVehicleById(Long id) {
        return vehicleRepository.findById(id);
    }
    
    public List<Vehicle> getVehiclesByType(VehicleType type) {
        return vehicleRepository.findByType(type);
    }
    
    public List<Vehicle> getAvailableVehicles() {
        return vehicleRepository.findByAvailable(true);
    }
    
    public List<Vehicle> getDamagedVehicles() {
        return vehicleRepository.findByDamaged(true);
    }
    
    public List<Vehicle> getAvailableVehiclesByType(VehicleType type) {
        return vehicleRepository.findByTypeAndAvailable(type, true);
    }
    
    public Vehicle saveVehicle(Vehicle vehicle) {
        return vehicleRepository.save(vehicle);
    }
    
    public void deleteVehicle(Long id) {
        vehicleRepository.deleteById(id);
    }
    
    public Vehicle markAsDamaged(Long id) {
        Optional<Vehicle> vehicleOpt = vehicleRepository.findById(id);
        if (vehicleOpt.isPresent()) {
            Vehicle vehicle = vehicleOpt.get();
            vehicle.setDamaged(true);
            vehicle.setAvailable(false);
            return vehicleRepository.save(vehicle);
        }
        return null;
    }
    
    public Vehicle markAsRepaired(Long id) {
        Optional<Vehicle> vehicleOpt = vehicleRepository.findById(id);
        if (vehicleOpt.isPresent()) {
            Vehicle vehicle = vehicleOpt.get();
            vehicle.setDamaged(false);
            vehicle.setAvailable(true);
            return vehicleRepository.save(vehicle);
        }
        return null;
    }
}