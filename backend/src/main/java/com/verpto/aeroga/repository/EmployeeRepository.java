package com.verpto.aeroga.repository;

import com.verpto.aeroga.model.Employee;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmployeeRepository extends MongoRepository<Employee, String> {
    List<Employee> findByActive(boolean active);
    long countByActive(boolean active);
    boolean existsByEmail(String email);
}
