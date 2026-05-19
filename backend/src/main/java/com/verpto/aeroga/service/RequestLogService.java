package com.verpto.aeroga.service;

import com.verpto.aeroga.model.RequestLog;
import com.verpto.aeroga.repository.RequestLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RequestLogService {

    private final RequestLogRepository requestLogRepository;

    public void save(RequestLog log) {
        requestLogRepository.save(log);
    }

    public Page<RequestLog> getLogs(Pageable pageable) {
        return requestLogRepository.findAllByOrderByTimestampDesc(pageable);
    }

    public List<RequestLog> getRecentLogs() {
        return requestLogRepository.findTop10ByOrderByTimestampDesc();
    }

    public List<RequestLog> getLogsSince(LocalDateTime since) {
        return requestLogRepository.findByTimestampAfter(since);
    }
}
