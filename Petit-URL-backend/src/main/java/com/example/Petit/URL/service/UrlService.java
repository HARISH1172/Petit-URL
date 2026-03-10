package com.example.Petit.URL.service;

import com.example.Petit.URL.dto.CreateUrlRequest;
import com.example.Petit.URL.dto.UrlResponse;
import com.example.Petit.URL.entity.PlanType;
import com.example.Petit.URL.entity.Url;
import com.example.Petit.URL.entity.User;
import com.example.Petit.URL.repository.UrlRepository;
import com.example.Petit.URL.repository.UserRepository;
import com.example.Petit.URL.security.CustomUserDetails;
import com.example.Petit.URL.util.ShortCodeGenerator;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class UrlService {

    private final UrlRepository urlRepository;
    private final UserRepository userRepository;

    @Value("${app.base-url}")
    private String baseUrl;

    public UrlService(UrlRepository urlRepository,
                      UserRepository userRepository) {
        this.urlRepository = urlRepository;
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

    public UrlResponse createShortUrl(CreateUrlRequest request) {

        User user = getCurrentUser();

        // 🔒 Free Plan Validation
        if (PlanType.FREE.equals(user.getPlanType())
                && user.getLinksCreated() >= 3) {
            throw new RuntimeException("Free limit reached. Upgrade to ₹99 Premium.");
        }

        String shortCode;

        // Handle collision
        do {
            shortCode = ShortCodeGenerator.generate();
        } while (urlRepository.findByShortCode(shortCode).isPresent());

        Url url = Url.builder()
                .originalUrl(request.getOriginalUrl())
                .shortCode(shortCode)
                .clickCount(0L)
                .createdAt(LocalDateTime.now())
                .user(user)
                .build();

        urlRepository.save(url);

        user.setLinksCreated(user.getLinksCreated() + 1);
        userRepository.save(user);

        return UrlResponse.builder()
                .id(url.getId())
                .originalUrl(url.getOriginalUrl())
                .shortUrl(baseUrl + shortCode)
                .clickCount(url.getClickCount())
                .build();
    }

    public List<UrlResponse> getMyUrls() {

        User user = getCurrentUser();

        return urlRepository.findByUserId(user.getId())
                .stream()
                .map(url -> UrlResponse.builder()
                        .id(url.getId())
                        .originalUrl(url.getOriginalUrl())
                        .shortUrl(baseUrl + url.getShortCode())
                        .clickCount(url.getClickCount())
                        .build())
                .toList();
    }

    public UrlResponse updateOriginalUrl(Long id, CreateUrlRequest request) {

        User user = getCurrentUser();

        Url url = urlRepository.findById(id)
                .orElseThrow();

        if (!url.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        url.setOriginalUrl(request.getOriginalUrl());
        urlRepository.save(url);

        return UrlResponse.builder()
                .id(url.getId())
                .originalUrl(url.getOriginalUrl())
                .shortUrl(baseUrl + url.getShortCode())
                .clickCount(url.getClickCount())
                .build();
    }
}
