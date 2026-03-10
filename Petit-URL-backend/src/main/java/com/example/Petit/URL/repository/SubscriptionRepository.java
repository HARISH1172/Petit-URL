package com.example.Petit.URL.repository;

import com.example.Petit.URL.entity.Subscription;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;


public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {

    Optional<Subscription> findByUserId(Long userId);
}
