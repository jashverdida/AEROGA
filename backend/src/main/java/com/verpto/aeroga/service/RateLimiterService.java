package com.verpto.aeroga.service;

import com.verpto.aeroga.exception.RateLimitExceededException;
import com.verpto.aeroga.model.ApiKey;
import com.verpto.aeroga.repository.ApiKeyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

@Service
@RequiredArgsConstructor
public class RateLimiterService {

    private final ApiKeyRepository apiKeyRepository;

    public void checkRateLimit(ApiKey apiKey) {
        LocalDateTime now = LocalDateTime.now();

        if (apiKey.getWindowStart() == null ||
                ChronoUnit.SECONDS.between(apiKey.getWindowStart(), now) > 60) {
            apiKey.setRequestsThisWindow(0);
            apiKey.setWindowStart(now);
        }

        apiKey.setRequestsThisWindow(apiKey.getRequestsThisWindow() + 1);
        apiKey.setTotalRequests(apiKey.getTotalRequests() + 1);
        apiKey.setLastUsedAt(now);

        if (apiKey.getRequestsThisWindow() > apiKey.getRequestsPerMinute()) {
            apiKeyRepository.save(apiKey);
            long secondsUntilReset = 60 - ChronoUnit.SECONDS.between(apiKey.getWindowStart(), now);
            throw new RateLimitExceededException(secondsUntilReset);
        }

        apiKeyRepository.save(apiKey);
    }
}
