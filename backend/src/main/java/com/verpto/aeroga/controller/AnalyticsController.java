package com.verpto.aeroga.controller;

import com.verpto.aeroga.dto.response.AnalyticsSummaryResponse;
import com.verpto.aeroga.dto.response.ApiResponse;
import com.verpto.aeroga.model.RequestLog;
import com.verpto.aeroga.service.AnalyticsService;
import com.verpto.aeroga.service.RequestLogService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Analytics", description = "Analytics and request log endpoints")
@SecurityRequirement(name = "Bearer Authentication")
public class AnalyticsController {

    private final AnalyticsService analyticsService;
    private final RequestLogService requestLogService;

    @GetMapping("/analytics/summary")
    @Operation(summary = "Get analytics summary")
    public ResponseEntity<ApiResponse<AnalyticsSummaryResponse>> getSummary() {
        return ResponseEntity.ok(ApiResponse.success(analyticsService.getSummary()));
    }

    @GetMapping("/analytics/requests-over-time")
    @Operation(summary = "Get request volume for the last 7 days")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getRequestsOverTime() {
        return ResponseEntity.ok(ApiResponse.success(analyticsService.getRequestsOverTime()));
    }

    @GetMapping("/analytics/top-endpoints")
    @Operation(summary = "Get top 5 most-called API endpoints")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getTopEndpoints() {
        return ResponseEntity.ok(ApiResponse.success(analyticsService.getTopEndpoints()));
    }

    @GetMapping("/logs")
    @Operation(summary = "Get paginated request logs")
    public ResponseEntity<ApiResponse<Page<RequestLog>>> getLogs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<RequestLog> logs = requestLogService.getLogs(PageRequest.of(page, size));
        return ResponseEntity.ok(ApiResponse.success(logs));
    }
}
