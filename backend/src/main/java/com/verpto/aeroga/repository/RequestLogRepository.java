package com.verpto.aeroga.repository;

import com.verpto.aeroga.model.RequestLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface RequestLogRepository extends MongoRepository<RequestLog, String> {
    Page<RequestLog> findAllByOrderByTimestampDesc(Pageable pageable);
    List<RequestLog> findByTimestampAfter(LocalDateTime after);
    long countByTimestampAfter(LocalDateTime after);
    List<RequestLog> findTop10ByOrderByTimestampDesc();
}
