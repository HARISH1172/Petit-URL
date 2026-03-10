package com.example.Petit.URL.controller;

import com.example.Petit.URL.entity.Subscription;
import com.example.Petit.URL.service.SubscriptionService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/subscription")
public class SubscriptionController {

    private final SubscriptionService subscriptionService;

    public SubscriptionController(SubscriptionService subscriptionService) {
        this.subscriptionService = subscriptionService;
    }

    @GetMapping
    public Subscription getCurrentPlan() {
        return subscriptionService.getCurrentSubscription();
    }
}