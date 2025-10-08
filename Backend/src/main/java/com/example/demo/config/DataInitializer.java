package com.example.demo.config;

import com.example.demo.model.*;
import com.example.demo.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import java.math.BigDecimal;
import java.time.LocalDate;

@Component
@Order(1) // Ensures this runs before other runners if you have multiple
public class DataInitializer implements CommandLineRunner {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private VehicleRepository vehicleRepository;
    
    @Autowired
    private OfferRepository offerRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Override
    public void run(String... args) throws Exception {
        try {
            System.out.println("🚀 Starting data initialization...");
            
            initializeAdminUser();
            initializeSampleUser();
            initializeVehicles();
            initializeOffers();
            
            System.out.println("🎉 Data initialization completed successfully!");
            
        } catch (Exception e) {
            System.err.println("❌ Critical error during data initialization: " + e.getMessage());
            e.printStackTrace();
            // Consider re-throwing if initialization is critical for app operation
            // throw new RuntimeException("Data initialization failed", e);
        }
    }
    
    private void initializeAdminUser() {
        if (userRepository.findByEmail("admin@rentx.com").isEmpty()) {
            User admin = new User();
            admin.setName("Admin User");
            admin.setEmail("admin@rentx.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole(Role.ADMIN);
            admin.setPhone("+91 9876543210");
            admin.setAddress("RentX Headquarters");
            userRepository.save(admin);
            System.out.println("✅ Admin user created: admin@rentx.com / admin123");
        } else {
            System.out.println("ℹ️  Admin user already exists");
        }
    }
    
    private void initializeSampleUser() {
        if (userRepository.findByEmail("user@rentx.com").isEmpty()) {
            User user = new User();
            user.setName("John Doe");
            user.setEmail("user@rentx.com");
            user.setPassword(passwordEncoder.encode("user123"));
            user.setPhone("+91 9876543210");
            user.setAddress("123 Main Street, City");
            user.setRole(Role.USER);
            userRepository.save(user);
            System.out.println("✅ Sample user created: user@rentx.com / user123");
        } else {
            System.out.println("ℹ️  Sample user already exists");
        }
    }
    
    private void initializeVehicles() {
        if (vehicleRepository.count() == 0) {
            Vehicle car1 = new Vehicle("Toyota Camry", "2023", "AB123CD", new BigDecimal("75"), VehicleType.CAR);
            Vehicle car2 = new Vehicle("Honda Accord", "2023", "EF456GH", new BigDecimal("80"), VehicleType.CAR);
            car2.setAvailable(false);
            car2.setDamaged(true);
            
            Vehicle bike1 = new Vehicle("Honda CBR", "2023", "XY789Z", new BigDecimal("40"), VehicleType.BIKE);
            Vehicle bike2 = new Vehicle("Yamaha R1", "2023", "PQ456R", new BigDecimal("50"), VehicleType.BIKE);
            
            vehicleRepository.saveAll(java.util.Arrays.asList(car1, car2, bike1, bike2));
            System.out.println("✅ Sample vehicles created");
        } else {
            System.out.println("ℹ️  Vehicles already initialized");
        }
    }
    
    private void initializeOffers() {
        if (offerRepository.count() == 0) {
            Offer offer1 = new Offer("New Year Offer", "15%", LocalDate.now().plusDays(30));
            Offer offer2 = new Offer("Weekend Special", "10%", LocalDate.now().plusDays(15));
            Offer offer3 = new Offer("First Time User", "20%", LocalDate.now().plusDays(60));
            
            offerRepository.saveAll(java.util.Arrays.asList(offer1, offer2, offer3));
            System.out.println("✅ Sample offers created");
        } else {
            System.out.println("ℹ️  Offers already initialized");
        }
    }
}