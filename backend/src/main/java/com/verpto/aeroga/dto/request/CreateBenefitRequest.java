package com.verpto.aeroga.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.util.List;

@Data
public class CreateBenefitRequest {

    @NotBlank(message = "Name is required")
    private String name;

    private String description;

    @NotBlank(message = "Type is required")
    private String type;

    @Positive(message = "Value must be positive")
    private double value;

    @NotBlank(message = "Currency is required")
    private String currency = "USD";

    private List<String> eligibleDepartments;

    private boolean active = true;
}
