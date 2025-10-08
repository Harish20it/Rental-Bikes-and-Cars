package com.example.demo.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.model.Offer;
import com.example.demo.repository.OfferRepository;

import java.util.List;

@RestController
@RequestMapping("/api/offers")
@CrossOrigin(origins = "http://localhost:5173")
public class OfferController {
 
 @Autowired
 private OfferRepository offerRepository;
 
 @GetMapping
 public ResponseEntity<List<Offer>> getActiveOffers() {
     return ResponseEntity.ok(offerRepository.findByActive(true));
 }
 
 @PostMapping
 public ResponseEntity<Offer> createOffer(@RequestBody Offer offer) {
     return ResponseEntity.ok(offerRepository.save(offer));
 }
}