package com.verpto.aeroga.repository;

import com.verpto.aeroga.model.Benefit;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BenefitRepository extends MongoRepository<Benefit, String> {
    List<Benefit> findByActive(boolean active);
    List<Benefit> findByActiveAndType(boolean active, String type);
    long countByActive(boolean active);
}
