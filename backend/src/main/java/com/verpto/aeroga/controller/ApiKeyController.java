package com.verpto.aeroga.controller;

import com.verpto.aeroga.dto.request.CreateApiKeyRequest;
import com.verpto.aeroga.dto.response.ApiKeyResponse;
import com.verpto.aeroga.dto.response.ApiResponse;
import com.verpto.aeroga.model.User;
import com.verpto.aeroga.repository.UserRepository;
import com.verpto.aeroga.service.ApiKeyService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/keys")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "API Keys", description = "Manage API keys for client access")
@SecurityRequirement(name = "Bearer Authentication")
public class ApiKeyController {

    private final ApiKeyService apiKeyService;
    private final UserRepository userRepository;

    @GetMapping
    @Operation(summary = "List all API keys for the authenticated admin")
    public ResponseEntity<ApiResponse<List<ApiKeyResponse>>> getAllKeys(
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow();
        List<ApiKeyResponse> keys = apiKeyService.getKeysForUser(user.getId());
        return ResponseEntity.ok(ApiResponse.success(keys));
    }

    @PostMapping
    @Operation(summary = "Create a new API key")
    public ResponseEntity<ApiResponse<ApiKeyResponse>> createKey(
            @Valid @RequestBody CreateApiKeyRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow();
        ApiKeyResponse key = apiKeyService.createKey(request, user.getId());
        return ResponseEntity.ok(ApiResponse.success("API key created. Save this key — it will not be shown again.", key));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an API key")
    public ResponseEntity<ApiResponse<ApiKeyResponse>> updateKey(
            @PathVariable String id,
            @Valid @RequestBody CreateApiKeyRequest request) {
        ApiKeyResponse key = apiKeyService.updateKey(id, request);
        return ResponseEntity.ok(ApiResponse.success("API key updated", key));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete or deactivate an API key")
    public ResponseEntity<ApiResponse<Void>> deleteKey(
            @PathVariable String id,
            @RequestParam(defaultValue = "false") boolean hard) {
        apiKeyService.deleteKey(id, hard);
        String message = hard ? "API key permanently deleted" : "API key deactivated";
        return ResponseEntity.ok(ApiResponse.success(message, null));
    }
}
