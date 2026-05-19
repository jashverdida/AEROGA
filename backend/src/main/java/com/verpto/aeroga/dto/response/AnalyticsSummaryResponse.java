package com.verpto.aeroga.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnalyticsSummaryResponse {
    private long totalRequests;
    private long totalApiKeys;
    private long totalBenefits;
    private long totalEmployees;
    private double successRate;
    private double avgLatencyMs;
}
