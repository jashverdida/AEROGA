package com.verpto.aeroga.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "request_logs")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RequestLog {

    @Id
    private String id;

    private String apiKeyId;
    private String userId;
    private String method;
    private String path;
    private int statusCode;
    private long latencyMs;
    private String ipAddress;
    private LocalDateTime timestamp;
}
