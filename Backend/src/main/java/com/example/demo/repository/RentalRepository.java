package com.example.demo.repository;

import com.example.demo.model.Rental;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RentalRepository extends JpaRepository<Rental, Long> {
    
    // This works - Spring Data JPA can infer this from field name
    List<Rental> findByStatus(String status);
    
    // Custom query for userId (since it's not a relationship)
    @Query("SELECT r FROM Rental r WHERE r.userId = :userId")
    List<Rental> findByUserId(@Param("userId") Long userId);
    
    // Optional: For vehicleId
    @Query("SELECT r FROM Rental r WHERE r.vehicleId = :vehicleId")
    List<Rental> findByVehicleId(@Param("vehicleId") Long vehicleId);
    
    // Find pending rentals
    List<Rental> findByStatusOrderByBookingDateDesc(String status);
    
    // Find rentals by user and status
    @Query("SELECT r FROM Rental r WHERE r.userId = :userId AND r.status = :status")
    List<Rental> findByUserIdAndStatus(@Param("userId") Long userId, @Param("status") String status);
}