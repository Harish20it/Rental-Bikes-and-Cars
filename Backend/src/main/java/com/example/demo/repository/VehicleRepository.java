// repository/VehicleRepository.java
package com.example.demo.repository;

import com.example.demo.model.Vehicle;
import com.example.demo.model.VehicleType;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface VehicleRepository extends JpaRepository<Vehicle, Long> {
    List<Vehicle> findByType(VehicleType type);
    List<Vehicle> findByAvailable(boolean available);
    List<Vehicle> findByDamaged(boolean damaged);
    List<Vehicle> findByTypeAndAvailable(VehicleType type, boolean available);
}