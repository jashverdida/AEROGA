package com.verpto.aeroga.controller;

import com.verpto.aeroga.dto.request.CreateEmployeeRequest;
import com.verpto.aeroga.dto.response.ApiResponse;
import com.verpto.aeroga.model.Benefit;
import com.verpto.aeroga.model.Employee;
import com.verpto.aeroga.service.EmployeeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/employees")
@RequiredArgsConstructor
@Tag(name = "Employees", description = "Employee management and benefit enrollment")
@SecurityRequirement(name = "Bearer Authentication")
public class EmployeeController {

    private final EmployeeService employeeService;

    @GetMapping
    @Operation(summary = "Get all active employees")
    public ResponseEntity<ApiResponse<List<Employee>>> getAllEmployees() {
        return ResponseEntity.ok(ApiResponse.success(employeeService.getAllActive()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get an employee by ID")
    public ResponseEntity<ApiResponse<Employee>> getEmployee(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success(employeeService.getById(id)));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create a new employee (Admin only)")
    public ResponseEntity<ApiResponse<Employee>> createEmployee(@Valid @RequestBody CreateEmployeeRequest request) {
        Employee employee = employeeService.create(request);
        return ResponseEntity.ok(ApiResponse.success("Employee created successfully", employee));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update an employee (Admin only)")
    public ResponseEntity<ApiResponse<Employee>> updateEmployee(
            @PathVariable String id,
            @Valid @RequestBody CreateEmployeeRequest request) {
        Employee employee = employeeService.update(id, request);
        return ResponseEntity.ok(ApiResponse.success("Employee updated successfully", employee));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Deactivate an employee (Admin only)")
    public ResponseEntity<ApiResponse<Void>> deleteEmployee(@PathVariable String id) {
        employeeService.deactivate(id);
        return ResponseEntity.ok(ApiResponse.success("Employee deactivated", null));
    }

    @PostMapping("/{id}/enroll")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Enroll an employee in a benefit (Admin only)")
    public ResponseEntity<ApiResponse<Employee>> enrollBenefit(
            @PathVariable String id,
            @RequestBody Map<String, String> body) {
        String benefitId = body.get("benefitId");
        Employee employee = employeeService.enroll(id, benefitId);
        return ResponseEntity.ok(ApiResponse.success("Employee enrolled in benefit", employee));
    }

    @DeleteMapping("/{id}/benefits/{benefitId}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Remove a benefit enrollment from an employee (Admin only)")
    public ResponseEntity<ApiResponse<Employee>> unenrollBenefit(
            @PathVariable String id,
            @PathVariable String benefitId) {
        Employee employee = employeeService.unenroll(id, benefitId);
        return ResponseEntity.ok(ApiResponse.success("Benefit enrollment removed", employee));
    }

    @GetMapping("/{id}/benefits")
    @Operation(summary = "Get enrolled benefits for an employee")
    public ResponseEntity<ApiResponse<List<Benefit>>> getEnrolledBenefits(@PathVariable String id) {
        List<Benefit> benefits = employeeService.getEnrolledBenefits(id);
        return ResponseEntity.ok(ApiResponse.success(benefits));
    }
}
