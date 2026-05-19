package com.verpto.aeroga.service;

import com.verpto.aeroga.dto.request.CreateApiKeyRequest;
import com.verpto.aeroga.dto.response.ApiKeyResponse;
import com.verpto.aeroga.exception.ResourceNotFoundException;
import com.verpto.aeroga.model.ApiKey;
import com.verpto.aeroga.repository.ApiKeyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ApiKeyService {

    private final ApiKeyRepository apiKeyRepository;

    public List<ApiKeyResponse> getKeysForUser(String userId) {
        return apiKeyRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public ApiKeyResponse createKey(CreateApiKeyRequest request, String userId) {
        String rawUuid = UUID.randomUUID().toString().replace("-", "");
        String keyValue = "ak_" + rawUuid.substring(0, 24);

        ApiKey apiKey = ApiKey.builder()
                .keyValue(keyValue)
                .name(request.getName())
                .clientName(request.getClientName())
                .userId(userId)
                .requestsPerMinute(request.getRequestsPerMinute())
                .requestsThisWindow(0)
                .windowStart(null)
                .totalRequests(0L)
                .active(true)
                .createdAt(LocalDateTime.now())
                .build();

        apiKey = apiKeyRepository.save(apiKey);
        return toResponse(apiKey);
    }

    public ApiKeyResponse updateKey(String id, CreateApiKeyRequest request) {
        ApiKey apiKey = apiKeyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("API key not found with id: " + id));

        apiKey.setName(request.getName());
        apiKey.setClientName(request.getClientName());
        apiKey.setRequestsPerMinute(request.getRequestsPerMinute());

        apiKey = apiKeyRepository.save(apiKey);
        return toResponse(apiKey);
    }

    public void deleteKey(String id, boolean hard) {
        ApiKey apiKey = apiKeyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("API key not found with id: " + id));

        if (hard) {
            apiKeyRepository.delete(apiKey);
        } else {
            apiKey.setActive(false);
            apiKeyRepository.save(apiKey);
        }
    }

    public ApiKey findByKeyValue(String keyValue) {
        return apiKeyRepository.findByKeyValue(keyValue)
                .orElseThrow(() -> new ResourceNotFoundException("API key not found"));
    }

    private ApiKeyResponse toResponse(ApiKey apiKey) {
        return ApiKeyResponse.builder()
                .id(apiKey.getId())
                .keyValue(apiKey.getKeyValue())
                .name(apiKey.getName())
                .clientName(apiKey.getClientName())
                .userId(apiKey.getUserId())
                .requestsPerMinute(apiKey.getRequestsPerMinute())
                .totalRequests(apiKey.getTotalRequests())
                .active(apiKey.isActive())
                .createdAt(apiKey.getCreatedAt())
                .lastUsedAt(apiKey.getLastUsedAt())
                .build();
    }
}
