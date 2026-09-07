package com.houseprice.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "model_metadata")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ModelMetadata {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String version;

    private Double accuracy;
    private Double rmse;
    private Integer datasetSize;
    private Boolean isActive = false;
    private LocalDateTime trainedOn = LocalDateTime.now();
}
