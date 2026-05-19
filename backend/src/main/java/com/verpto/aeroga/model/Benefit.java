package com.verpto.aeroga.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "benefits")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Benefit {

    @Id
    private String id;

    private String name;
    private String description;
    private String type;
    private double value;
    private String currency;
    private List<String> eligibleDepartments;
    private boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
