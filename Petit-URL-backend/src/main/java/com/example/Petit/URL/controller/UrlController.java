package com.example.Petit.URL.controller;

import com.example.Petit.URL.dto.CreateUrlRequest;
import com.example.Petit.URL.dto.UrlResponse;
import com.example.Petit.URL.service.UrlService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/urls")
public class UrlController {

    private final UrlService urlService;

    public UrlController(UrlService urlService) {
        this.urlService = urlService;
    }

    @PostMapping
    public UrlResponse create(@RequestBody CreateUrlRequest request) {
        return urlService.createShortUrl(request);
    }

    @GetMapping
    public List<UrlResponse> getMyLinks() {
        return urlService.getMyUrls();
    }

    @PutMapping("/{id}")
    public UrlResponse update(@PathVariable Long id,
                              @RequestBody CreateUrlRequest request) {
        return urlService.updateOriginalUrl(id, request);
    }
}
