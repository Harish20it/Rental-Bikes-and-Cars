// service/PaymentService.java
package com.example.demo.service;

import com.example.demo.model.Payment;
import com.example.demo.model.PaymentStatus;
import com.example.demo.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    // Get all payments
    public List<Payment> findAll() {
        return paymentRepository.findAll();
    }

    // Get payment by ID
    public Payment findById(Long id) {
        Optional<Payment> payment = paymentRepository.findById(id);
        return payment.orElseThrow(() -> new RuntimeException("Payment not found with id: " + id));
    }

    // Get payments by status
    public List<Payment> findByStatus(PaymentStatus status) {
        return paymentRepository.findByStatus(status);
    }

    // Get payments by user ID
    public List<Payment> findByUserId(Long userId) {
        return paymentRepository.findByUserId(userId);
    }

    // Approve payment
    public Payment approvePayment(Long id) {
        Payment payment = findById(id);
        payment.setStatus(PaymentStatus.COMPLETED);
        return paymentRepository.save(payment);
    }

    // Reject payment
    public Payment rejectPayment(Long id) {
        Payment payment = findById(id);
        payment.setStatus(PaymentStatus.REJECTED);
        return paymentRepository.save(payment);
    }

    // Create new payment
    public Payment createPayment(Payment payment) {
        return paymentRepository.save(payment);
    }

    // Update payment
    public Payment updatePayment(Long id, Payment paymentDetails) {
        Payment payment = findById(id);
        payment.setAmount(paymentDetails.getAmount());
        payment.setStatus(paymentDetails.getStatus());
        payment.setPaymentMethod(paymentDetails.getPaymentMethod());
        return paymentRepository.save(payment);
    }

    // Delete payment
    public void deletePayment(Long id) {
        Payment payment = findById(id);
        paymentRepository.delete(payment);
    }
}