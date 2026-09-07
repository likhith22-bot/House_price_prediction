package com.houseprice.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "predictions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Prediction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "property_id")
    private Property property;

    private Double predictedPrice;
    private Double confidenceScore;
    
    @Column(columnDefinition = "TEXT")
    private String explanation; // Store SHAP JSON string

    private String modelVersion;
    private LocalDateTime timestamp = LocalDateTime.now();
}
