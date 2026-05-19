package com.verpto.aeroga.filter;

import com.verpto.aeroga.model.RequestLog;
import com.verpto.aeroga.service.RequestLogService;
import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.annotation.Order;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.LocalDateTime;

@Slf4j
@Component
@Order(2)
@RequiredArgsConstructor
public class RequestLoggingFilter implements Filter {

    private final RequestLogService requestLogService;

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest request = (HttpServletRequest) servletRequest;
        HttpServletResponse response = (HttpServletResponse) servletResponse;

        long startTime = System.currentTimeMillis();

        chain.doFilter(servletRequest, servletResponse);

        long latency = System.currentTimeMillis() - startTime;

        String userId = null;
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getPrincipal())) {
            userId = auth.getName();
        }

        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null || ip.isEmpty()) {
            ip = request.getRemoteAddr();
        }

        String apiKeyId = request.getHeader("X-API-Key");

        RequestLog requestLog = RequestLog.builder()
                .apiKeyId(apiKeyId)
                .userId(userId)
                .method(request.getMethod())
                .path(request.getRequestURI())
                .statusCode(response.getStatus())
                .latencyMs(latency)
                .ipAddress(ip)
                .timestamp(LocalDateTime.now())
                .build();

        try {
            requestLogService.save(requestLog);
        } catch (Exception e) {
            log.warn("Failed to save request log: {}", e.getMessage());
        }
    }
}
