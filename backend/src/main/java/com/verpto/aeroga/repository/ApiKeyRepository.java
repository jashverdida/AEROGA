package com.verpto.aeroga.repository;

import com.verpto.aeroga.model.ApiKey;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApiKeyRepository extends MongoRepository<ApiKey, String> {
    List<ApiKey> findByUserIdOrderByCreatedAtDesc(String userId);
    Optional<ApiKey> findByKeyValue(String keyValue);
    long countByActive(boolean active);
    List<ApiKey> findByActive(boolean active);
}
