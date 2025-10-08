package com.example.demo.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.model.Vehicle;
import com.example.demo.model.VehicleType;
import com.example.demo.service.VehicleService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/vehicles")
@CrossOrigin(origins = "http://localhost:5173")
public class VehicleController {
 
 @Autowired
 private VehicleService vehicleService;
 
 @GetMapping
 public ResponseEntity<Map<String, List<Vehicle>>> getAllVehicles() {
     List<Vehicle> cars = vehicleService.getVehiclesByType(VehicleType.CAR);
     List<Vehicle> bikes = vehicleService.getVehiclesByType(VehicleType.BIKE);
     
     Map<String, List<Vehicle>> response = new HashMap<>();
     response.put("cars", cars);
     response.put("bikes", bikes);
     
     return ResponseEntity.ok(response);
 }
 
 @GetMapping("/available")
 public ResponseEntity<List<Vehicle>> getAvailableVehicles() {
     return ResponseEntity.ok(vehicleService.getAvailableVehicles());
 }
 
 @GetMapping("/damaged")
 public ResponseEntity<List<Vehicle>> getDamagedVehicles() {
     return ResponseEntity.ok(vehicleService.getDamagedVehicles());
 }
 
 @PostMapping
 public ResponseEntity<Vehicle> addVehicle(@RequestBody Vehicle vehicle) {
     return ResponseEntity.ok(vehicleService.saveVehicle(vehicle));
 }
 
 @PutMapping("/{id}/damage")
 public ResponseEntity<Vehicle> markAsDamaged(@PathVariable Long id) {
     Vehicle vehicle = vehicleService.markAsDamaged(id);
     return vehicle != null ? ResponseEntity.ok(vehicle) : ResponseEntity.notFound().build();
 }
 
 @PutMapping("/{id}/repair")
 public ResponseEntity<Vehicle> markAsRepaired(@PathVariable Long id) {
     Vehicle vehicle = vehicleService.markAsRepaired(id);
     return vehicle != null ? ResponseEntity.ok(vehicle) : ResponseEntity.notFound().build();
 }
}