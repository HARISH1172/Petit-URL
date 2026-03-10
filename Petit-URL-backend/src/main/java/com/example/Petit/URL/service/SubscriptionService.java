package com.example.Petit.URL.service;

import com.example.Petit.URL.entity.PlanType;
import com.example.Petit.URL.entity.Subscription;
import com.example.Petit.URL.entity.User;
import com.example.Petit.URL.repository.SubscriptionRepository;
import com.example.Petit.URL.repository.UserRepository;
import com.example.Petit.URL.security.CustomUserDetails;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class SubscriptionService {

    private final SubscriptionRepository subscriptionRepository;
    private final UserRepository userRepository;

    public SubscriptionService(SubscriptionRepository subscriptionRepository,
                               UserRepository userRepository) {
        this.subscriptionRepository = subscriptionRepository;
        this.userRepository = userRepository;
    }

    private User getCurrentUser() {
        CustomUserDetails userDetails =
                (CustomUserDetails) SecurityContextHolder
                        .getContext()
                        .getAuthentication()
                        .getPrincipal();

        return userRepository.findByEmail(userDetails.getEmail())
                .orElseThrow();
    }

    public Subscription getCurrentSubscription() {

        User user = getCurrentUser();

        return subscriptionRepository.findByUserId(user.getId())
                .orElse(null);
    }

    public void activatePremium(User user) {

        System.out.println("ACTIVATE PREMIUM CALLED");
        Subscription subscription = Subscription.builder()
                .user(user)
                .planType(PlanType.PREMIUM)
                .amount(99.0)
                .startDate(LocalDateTime.now())
                .endDate(LocalDateTime.now().plusMonths(1))
                .status("ACTIVE")
                .build();

        subscriptionRepository.save(subscription);

        user.setPlanType(PlanType.PREMIUM);
        userRepository.save(user);
    }
}
