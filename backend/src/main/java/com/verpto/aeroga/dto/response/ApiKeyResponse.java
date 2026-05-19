package com.verpto.aeroga.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApiKeyResponse {
    private String id;
    private String keyValue;
    private String name;
    private String clientName;
    private String userId;
    private int requestsPerMinute;
    private long totalRequests;
    private boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime lastUsedAt;
}
