// repository/PaymentRepository.java
package com.example.demo.repository;

import com.example.demo.model.Payment;
import com.example.demo.model.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByStatus(PaymentStatus status);
    List<Payment> findByUserId(Long userId);
}