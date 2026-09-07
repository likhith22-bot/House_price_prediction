package com.houseprice.admin.controller;

import com.houseprice.admin.repository.ModelMetadataRepository;
import com.houseprice.model.ModelMetadata;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminDashboardController {

    @Autowired
    private ModelMetadataRepository modelMetadataRepository;

    @Autowired
    private com.houseprice.auth.repository.UserRepository userRepository;

    @Autowired
    private com.houseprice.user.repository.PredictionRepository predictionRepository;

    @GetMapping("/stats")
    public Map<String, Object> getStats() {
        ModelMetadata model = modelMetadataRepository.findTopByIsActiveTrueOrderByTrainedOnDesc()
                .orElse(ModelMetadata.builder().version("v1.0").accuracy(0.95).datasetSize(15000).build());

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", userRepository.count());
        stats.put("totalPredictions", predictionRepository.count());
        stats.put("accuracy", model.getAccuracy() * 100);
        stats.put("version", model.getVersion());
        stats.put("datasetSize", model.getDatasetSize());
        
        return stats;
    }
}
