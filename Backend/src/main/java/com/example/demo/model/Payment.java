// model/Payment.java
package com.example.demo.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
public class Payment {
 @Id
 @GeneratedValue(strategy = GenerationType.IDENTITY)
 private Long id;
 
 @ManyToOne
 @JoinColumn(name = "user_id")
 private User user;
 
 @ManyToOne
 @JoinColumn(name = "booking_id")
 private Booking booking;
 
 private BigDecimal amount;
 private LocalDateTime paymentDate;
 
 @Enumerated(EnumType.STRING)
 private PaymentStatus status = PaymentStatus.PENDING;
 
 private String paymentMethod;
 
 // Constructors
 public Payment() {
     this.paymentDate = LocalDateTime.now();
 }
 
 public Payment(User user, Booking booking, BigDecimal amount) {
     this();
     this.user = user;
     this.booking = booking;
     this.amount = amount;
 }
 
 // Getters and Setters
 public Long getId() { return id; }
 public void setId(Long id) { this.id = id; }
 
 public User getUser() { return user; }
 public void setUser(User user) { this.user = user; }
 
 public Booking getBooking() { return booking; }
 public void setBooking(Booking booking) { this.booking = booking; }
 
 public BigDecimal getAmount() { return amount; }
 public void setAmount(BigDecimal amount) { this.amount = amount; }
 
 public LocalDateTime getPaymentDate() { return paymentDate; }
 public void setPaymentDate(LocalDateTime paymentDate) { this.paymentDate = paymentDate; }
 
 public PaymentStatus getStatus() { return status; }
 public void setStatus(PaymentStatus status) { this.status = status; }
 
 public String getPaymentMethod() { return paymentMethod; }
 public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }
}