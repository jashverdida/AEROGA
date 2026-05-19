package com.verpto.aeroga.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "employees")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Employee {

    @Id
    private String id;

    private String name;
    private String email;
    private String department;
    private String position;
    private List<String> enrolledBenefitIds;
    private boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
