package com.example.Petit.URL.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UrlResponse {
    private Long id;
    private String originalUrl;
    private String shortUrl;
    private Long clickCount;
}
