package com.verpto.aeroga.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateApiKeyRequest {

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Client name is required")
    private String clientName;

    @Min(value = 1, message = "Requests per minute must be at least 1")
    private int requestsPerMinute = 60;
}
