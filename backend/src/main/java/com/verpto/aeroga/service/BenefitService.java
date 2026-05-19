package com.verpto.aeroga.service;

import com.verpto.aeroga.dto.request.CreateBenefitRequest;
import com.verpto.aeroga.exception.ResourceNotFoundException;
import com.verpto.aeroga.model.Benefit;
import com.verpto.aeroga.repository.BenefitRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BenefitService {

    private final BenefitRepository benefitRepository;

    public List<Benefit> getAllActive() {
        return benefitRepository.findByActive(true);
    }

    public Benefit getById(String id) {
        return benefitRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Benefit not found with id: " + id));
    }

    public Benefit create(CreateBenefitRequest request) {
        Benefit benefit = Benefit.builder()
                .name(request.getName())
                .description(request.getDescription())
                .type(request.getType())
                .value(request.getValue())
                .currency(request.getCurrency())
                .eligibleDepartments(request.getEligibleDepartments() != null
                        ? request.getEligibleDepartments()
                        : new ArrayList<>())
                .active(request.isActive())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        return benefitRepository.save(benefit);
    }

    public Benefit update(String id, CreateBenefitRequest request) {
        Benefit benefit = getById(id);

        benefit.setName(request.getName());
        benefit.setDescription(request.getDescription());
        benefit.setType(request.getType());
        benefit.setValue(request.getValue());
        benefit.setCurrency(request.getCurrency());
        benefit.setEligibleDepartments(request.getEligibleDepartments() != null
                ? request.getEligibleDepartments()
                : new ArrayList<>());
        benefit.setActive(request.isActive());
        benefit.setUpdatedAt(LocalDateTime.now());

        return benefitRepository.save(benefit);
    }

    public void deactivate(String id) {
        Benefit benefit = getById(id);
        benefit.setActive(false);
        benefit.setUpdatedAt(LocalDateTime.now());
        benefitRepository.save(benefit);
    }
}
