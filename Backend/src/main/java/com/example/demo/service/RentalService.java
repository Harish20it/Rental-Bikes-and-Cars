package com.example.demo.service;

import com.example.demo.model.Rental;
import com.example.demo.repository.RentalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class RentalService {

    @Autowired
    private RentalRepository rentalRepository;

    // Get all rentals
    public List<Rental> findAll() {
        return rentalRepository.findAll();
    }

    // Get rental by ID
    public Rental findById(Long id) {
        Optional<Rental> rental = rentalRepository.findById(id);
        return rental.orElseThrow(() -> new RuntimeException("Rental not found with id: " + id));
    }

    // Get rentals by status
    public List<Rental> findByStatus(String status) {
        return rentalRepository.findByStatus(status);
    }

    // Get rentals by user ID
    public List<Rental> findByUserId(Long userId) {
        return rentalRepository.findByUserId(userId);//This findByUserId will Not work in this program
    }

    // Confirm a rental
    public Rental confirmRental(Long id) {
        Rental rental = findById(id);
        rental.setStatus("CONFIRMED");
        return rentalRepository.save(rental);
    }

    // Reject a rental
    public Rental rejectRental(Long id) {
        Rental rental = findById(id);
        rental.setStatus("REJECTED");
        return rentalRepository.save(rental);
    }

    // Complete a rental
    public Rental completeRental(Long id) {
        Rental rental = findById(id);
        rental.setStatus("COMPLETED");
        return rentalRepository.save(rental);
    }

    // Create new rental
    public Rental createRental(Rental rental) {
        return rentalRepository.save(rental);
    }

    // Update rental
    public Rental updateRental(Long id, Rental rentalDetails) {
        Rental rental = findById(id);
        rental.setStartDate(rentalDetails.getStartDate());
        rental.setEndDate(rentalDetails.getEndDate());
        rental.setTotalCost(rentalDetails.getTotalCost());
        rental.setStatus(rentalDetails.getStatus());
        rental.setPickupLocation(rentalDetails.getPickupLocation());
        return rentalRepository.save(rental);
    }

    // Delete rental
    public void deleteRental(Long id) {
        Rental rental = findById(id);
        rentalRepository.delete(rental);
    }
}