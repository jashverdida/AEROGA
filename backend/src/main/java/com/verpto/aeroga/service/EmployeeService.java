package com.verpto.aeroga.service;

import com.verpto.aeroga.dto.request.CreateEmployeeRequest;
import com.verpto.aeroga.exception.ResourceNotFoundException;
import com.verpto.aeroga.model.Benefit;
import com.verpto.aeroga.model.Employee;
import com.verpto.aeroga.repository.BenefitRepository;
import com.verpto.aeroga.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final BenefitRepository benefitRepository;

    public List<Employee> getAllActive() {
        return employeeRepository.findByActive(true);
    }

    public Employee getById(String id) {
        return employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));
    }

    public Employee create(CreateEmployeeRequest request) {
        Employee employee = Employee.builder()
                .name(request.getName())
                .email(request.getEmail())
                .department(request.getDepartment())
                .position(request.getPosition())
                .enrolledBenefitIds(new ArrayList<>())
                .active(true)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        return employeeRepository.save(employee);
    }

    public Employee update(String id, CreateEmployeeRequest request) {
        Employee employee = getById(id);

        employee.setName(request.getName());
        employee.setEmail(request.getEmail());
        employee.setDepartment(request.getDepartment());
        employee.setPosition(request.getPosition());
        employee.setUpdatedAt(LocalDateTime.now());

        return employeeRepository.save(employee);
    }

    public void deactivate(String id) {
        Employee employee = getById(id);
        employee.setActive(false);
        employee.setUpdatedAt(LocalDateTime.now());
        employeeRepository.save(employee);
    }

    public Employee enroll(String employeeId, String benefitId) {
        Employee employee = getById(employeeId);

        benefitRepository.findById(benefitId)
                .orElseThrow(() -> new ResourceNotFoundException("Benefit not found with id: " + benefitId));

        List<String> enrolledIds = employee.getEnrolledBenefitIds();
        if (enrolledIds == null) {
            enrolledIds = new ArrayList<>();
        }

        if (!enrolledIds.contains(benefitId)) {
            enrolledIds.add(benefitId);
            employee.setEnrolledBenefitIds(enrolledIds);
            employee.setUpdatedAt(LocalDateTime.now());
            employeeRepository.save(employee);
        }

        return employee;
    }

    public Employee unenroll(String employeeId, String benefitId) {
        Employee employee = getById(employeeId);

        List<String> enrolledIds = employee.getEnrolledBenefitIds();
        if (enrolledIds != null) {
            enrolledIds.remove(benefitId);
            employee.setEnrolledBenefitIds(enrolledIds);
            employee.setUpdatedAt(LocalDateTime.now());
            employeeRepository.save(employee);
        }

        return employee;
    }

    public List<Benefit> getEnrolledBenefits(String employeeId) {
        Employee employee = getById(employeeId);
        List<String> ids = employee.getEnrolledBenefitIds();
        if (ids == null || ids.isEmpty()) {
            return new ArrayList<>();
        }
        return benefitRepository.findAllById(ids);
    }
}
