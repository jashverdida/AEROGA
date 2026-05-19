package com.verpto.aeroga.service;

import com.verpto.aeroga.dto.response.AnalyticsSummaryResponse;
import com.verpto.aeroga.model.RequestLog;
import com.verpto.aeroga.repository.ApiKeyRepository;
import com.verpto.aeroga.repository.BenefitRepository;
import com.verpto.aeroga.repository.EmployeeRepository;
import com.verpto.aeroga.repository.RequestLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final RequestLogRepository requestLogRepository;
    private final ApiKeyRepository apiKeyRepository;
    private final BenefitRepository benefitRepository;
    private final EmployeeRepository employeeRepository;

    public AnalyticsSummaryResponse getSummary() {
        LocalDateTime yesterday = LocalDateTime.now().minusHours(24);
        List<RequestLog> recentLogs = requestLogRepository.findByTimestampAfter(yesterday);

        long totalRequests = requestLogRepository.count();
        long totalApiKeys = apiKeyRepository.countByActive(true);
        long totalBenefits = benefitRepository.countByActive(true);
        long totalEmployees = employeeRepository.countByActive(true);

        double successRate = 0.0;
        double avgLatencyMs = 0.0;

        if (!recentLogs.isEmpty()) {
            long successCount = recentLogs.stream()
                    .filter(l -> l.getStatusCode() >= 200 && l.getStatusCode() < 300)
                    .count();
            successRate = (double) successCount / recentLogs.size() * 100;

            avgLatencyMs = recentLogs.stream()
                    .mapToLong(RequestLog::getLatencyMs)
                    .average()
                    .orElse(0.0);
        }

        return AnalyticsSummaryResponse.builder()
                .totalRequests(totalRequests)
                .totalApiKeys(totalApiKeys)
                .totalBenefits(totalBenefits)
                .totalEmployees(totalEmployees)
                .successRate(Math.round(successRate * 100.0) / 100.0)
                .avgLatencyMs(Math.round(avgLatencyMs * 100.0) / 100.0)
                .build();
    }

    public List<Map<String, Object>> getRequestsOverTime() {
        List<Map<String, Object>> result = new ArrayList<>();
        LocalDateTime sevenDaysAgo = LocalDateTime.now().minusDays(7);
        List<RequestLog> logs = requestLogRepository.findByTimestampAfter(sevenDaysAgo);

        Map<LocalDate, Long> countByDate = logs.stream()
                .collect(Collectors.groupingBy(
                        l -> l.getTimestamp().toLocalDate(),
                        Collectors.counting()
                ));

        for (int i = 6; i >= 0; i--) {
            LocalDate date = LocalDate.now().minusDays(i);
            Map<String, Object> entry = new LinkedHashMap<>();
            entry.put("date", date.toString());
            entry.put("count", countByDate.getOrDefault(date, 0L));
            result.add(entry);
        }

        return result;
    }

    public List<Map<String, Object>> getTopEndpoints() {
        List<RequestLog> allLogs = requestLogRepository.findAll();

        Map<String, Long> countByPath = allLogs.stream()
                .collect(Collectors.groupingBy(RequestLog::getPath, Collectors.counting()));

        return countByPath.entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .limit(5)
                .map(e -> {
                    Map<String, Object> entry = new LinkedHashMap<>();
                    entry.put("path", e.getKey());
                    entry.put("count", e.getValue());
                    return entry;
                })
                .collect(Collectors.toList());
    }
}
