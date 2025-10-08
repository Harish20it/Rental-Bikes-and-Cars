package com.example.demo.controller;

import com.example.demo.model.Rental;
import com.example.demo.service.RentalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class RentalController {

    @Autowired
    private RentalService rentalService;

    // Get all rentals - THIS FIXES THE 404 ERROR
    @GetMapping("/rentals")
    public ResponseEntity<List<Rental>> getAllRentals() {
        List<Rental> rentals = rentalService.findAll();
        return ResponseEntity.ok(rentals);
    }

    // Get rental by ID
    @GetMapping("/rentals/{id}")
    public ResponseEntity<Rental> getRentalById(@PathVariable Long id) {
        try {
            Rental rental = rentalService.findById(id);
            return ResponseEntity.ok(rental);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Get rentals by status
    @GetMapping("/rentals/status/{status}")
    public ResponseEntity<List<Rental>> getRentalsByStatus(@PathVariable String status) {
        List<Rental> rentals = rentalService.findByStatus(status);
        return ResponseEntity.ok(rentals);
    }

    // Confirm a rental
    @PutMapping("/rentals/{id}/confirm")
    public ResponseEntity<Rental> confirmRental(@PathVariable Long id) {
        try {
            Rental confirmedRental = rentalService.confirmRental(id);
            return ResponseEntity.ok(confirmedRental);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Reject a rental
    @PutMapping("/rentals/{id}/reject")
    public ResponseEntity<Rental> rejectRental(@PathVariable Long id) {
        try {
            Rental rejectedRental = rentalService.rejectRental(id);
            return ResponseEntity.ok(rejectedRental);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Complete a rental
    @PutMapping("/rentals/{id}/complete")
    public ResponseEntity<Rental> completeRental(@PathVariable Long id) {
        try {
            Rental completedRental = rentalService.completeRental(id);
            return ResponseEntity.ok(completedRental);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Create new rental
    @PostMapping("/rentals")
    public ResponseEntity<Rental> createRental(@RequestBody Rental rental) {
        Rental createdRental = rentalService.createRental(rental);
        return ResponseEntity.ok(createdRental);
    }

    // Update rental
    @PutMapping("/rentals/{id}")
    public ResponseEntity<Rental> updateRental(@PathVariable Long id, @RequestBody Rental rentalDetails) {
        try {
            Rental updatedRental = rentalService.updateRental(id, rentalDetails);
            return ResponseEntity.ok(updatedRental);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Delete rental
    @DeleteMapping("/rentals/{id}")
    public ResponseEntity<Void> deleteRental(@PathVariable Long id) {
        try {
            rentalService.deleteRental(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}