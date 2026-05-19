package com.verpto.aeroga.controller;

import com.verpto.aeroga.dto.request.CreateBenefitRequest;
import com.verpto.aeroga.dto.response.ApiResponse;
import com.verpto.aeroga.model.ApiKey;
import com.verpto.aeroga.model.Benefit;
import com.verpto.aeroga.service.ApiKeyService;
import com.verpto.aeroga.service.BenefitService;
import com.verpto.aeroga.service.RateLimiterService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/benefits")
@RequiredArgsConstructor
@Tag(name = "Benefits", description = "Employee benefit package management")
@SecurityRequirement(name = "Bearer Authentication")
public class BenefitController {

    private final BenefitService benefitService;
    private final ApiKeyService apiKeyService;
    private final RateLimiterService rateLimiterService;

    @GetMapping
    @Operation(summary = "Get all active benefits")
    public ResponseEntity<ApiResponse<List<Benefit>>> getAllBenefits(
            @RequestHeader(value = "X-API-Key", required = false) String apiKeyHeader) {
        if (apiKeyHeader != null && !apiKeyHeader.isBlank()) {
            ApiKey apiKey = apiKeyService.findByKeyValue(apiKeyHeader);
            rateLimiterService.checkRateLimit(apiKey);
        }
        return ResponseEntity.ok(ApiResponse.success(benefitService.getAllActive()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a benefit by ID")
    public ResponseEntity<ApiResponse<Benefit>> getBenefitById(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success(benefitService.getById(id)));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create a new benefit (Admin only)")
    public ResponseEntity<ApiResponse<Benefit>> createBenefit(@Valid @RequestBody CreateBenefitRequest request) {
        Benefit benefit = benefitService.create(request);
        return ResponseEntity.ok(ApiResponse.success("Benefit created successfully", benefit));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update a benefit (Admin only)")
    public ResponseEntity<ApiResponse<Benefit>> updateBenefit(
            @PathVariable String id,
            @Valid @RequestBody CreateBenefitRequest request) {
        Benefit benefit = benefitService.update(id, request);
        return ResponseEntity.ok(ApiResponse.success("Benefit updated successfully", benefit));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Deactivate a benefit (Admin only)")
    public ResponseEntity<ApiResponse<Void>> deleteBenefit(@PathVariable String id) {
        benefitService.deactivate(id);
        return ResponseEntity.ok(ApiResponse.success("Benefit deactivated", null));
    }
}
