package com.verpto.aeroga.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "api_keys")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApiKey {

    @Id
    private String id;

    private String keyValue;
    private String name;
    private String clientName;
    private String userId;

    private int requestsPerMinute;
    private int requestsThisWindow;
    private LocalDateTime windowStart;

    private long totalRequests;
    private boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime lastUsedAt;
}
