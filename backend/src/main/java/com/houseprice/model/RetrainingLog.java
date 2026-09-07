package com.houseprice.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "retraining_logs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RetrainingLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String triggerType; // 'MANUAL', 'DRIFT'
    private String oldVersion;
    private String newVersion;
    private Double oldAccuracy;
    private Double newAccuracy;
    private String status;
    private LocalDateTime timestamp = LocalDateTime.now();
}
