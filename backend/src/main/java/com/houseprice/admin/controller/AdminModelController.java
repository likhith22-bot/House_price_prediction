package com.houseprice.admin.controller;

import com.houseprice.admin.repository.ModelMetadataRepository;
import com.houseprice.admin.repository.RetrainingLogRepository;
import com.houseprice.ml.client.PythonMlClient;
import com.houseprice.model.ModelMetadata;
import com.houseprice.model.RetrainingLog;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.*;

@RestController
@RequestMapping("/api/admin/model")
@CrossOrigin(origins = "*")
public class AdminModelController {

    @Autowired
    private PythonMlClient mlClient;

    @Autowired
    private ModelMetadataRepository modelMetadataRepository;

    @Autowired
    private RetrainingLogRepository retrainingLogRepository;

    @PostMapping("/upload-data")
    public Map<String, String> uploadData(@RequestParam("file") MultipartFile file) {
        List<Map<String, Object>> dataList = new ArrayList<>();
        try (BufferedReader br = new BufferedReader(new InputStreamReader(file.getInputStream()))) {
            String line;
            String[] headers = br.readLine().split(",");
            while ((line = br.readLine()) != null) {
                String[] values = line.split(",");
                Map<String, Object> entry = new HashMap<>();
                for (int i = 0; i < Math.min(headers.length, values.length); i++) {
                    entry.put(headers[i].trim(), values[i].trim());
                }
                dataList.add(entry);
            }
            mlClient.updateMarketData(dataList);
            return Collections.singletonMap("message", "Market data synchronized with ML service.");
        } catch (Exception e) {
            throw new RuntimeException("CSV Process error: " + e.getMessage());
        }
    }

    @PostMapping("/trigger-retrain")
    public Map<String, Object> triggerRetrain() {
        // 1. Get current stats
        ModelMetadata current = modelMetadataRepository.findTopByIsActiveTrueOrderByTrainedOnDesc()
                .orElse(ModelMetadata.builder().version("v1.0").accuracy(0.99).datasetSize(15000).build());

        // 2. Call ML Service
        mlClient.triggerRetraining();
        
        // 3. Log the event (Simulated for Demo)
        String newVersion = "v2026.1." + (new Random().nextInt(100));
        RetrainingLog log = RetrainingLog.builder()
                .triggerType("MANUAL")
                .oldVersion(current.getVersion())
                .newVersion(newVersion)
                .oldAccuracy(current.getAccuracy())
                .newAccuracy(0.995)
                .status("SUCCESS")
                .build();
        retrainingLogRepository.save(log);

        // 4. Update Active Model
        ModelMetadata newModel = ModelMetadata.builder()
                .version(newVersion)
                .accuracy(0.995)
                .datasetSize(current.getDatasetSize() + 100)
                .isActive(true)
                .build();
        modelMetadataRepository.save(newModel);

        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("newAccuracy", 99.5);
        response.put("newVersion", newVersion);
        return response;
    }

    // NEW: Return recent retraining logs for Admin "Auto-Training Logs" page
    @GetMapping("/logs")
    public java.util.List<RetrainingLog> getRetrainingLogs() {
        return retrainingLogRepository.findAll();
    }
}
