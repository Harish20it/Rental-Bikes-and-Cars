// repository/OfferRepository.java
package com.example.demo.repository;

import com.example.demo.model.Offer;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OfferRepository extends JpaRepository<Offer, Long> {
    List<Offer> findByActive(boolean active);
}