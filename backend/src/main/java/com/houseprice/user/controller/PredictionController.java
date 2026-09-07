package com.houseprice.user.controller;

import com.houseprice.ml.client.PythonMlClient;
import com.houseprice.ml.dto.MlPredictionRequest;
import com.houseprice.ml.dto.MlPredictionResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestClientResponseException;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/predictions")
@CrossOrigin(origins = "*")
public class PredictionController {

    @Autowired
    private PythonMlClient mlClient;

    @Autowired
    private com.houseprice.user.repository.PropertyRepository propertyRepository;

    @Autowired
    private com.houseprice.user.repository.PredictionRepository predictionRepository;

    @Autowired
    private com.houseprice.auth.repository.UserRepository userRepository;

    @PostMapping("/predict")
    public MlPredictionResponse predict(@RequestBody MlPredictionRequest request, @RequestParam(required = false) String username) {
        // 1. Get prediction from ML service
        MlPredictionResponse response;
        try {
            response = mlClient.predict(request);
        } catch (RestClientResponseException e) {
            String body = e.getResponseBodyAsString();
            String reason = (body != null && !body.isBlank()) ? body : "ML service error";
            throw new ResponseStatusException(e.getStatusCode(), reason);
        } catch (ResourceAccessException e) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE,
                    "ML service not reachable. Start ml-service before predicting.");
        }

        // 2. Save to database if user is logged in
        if (username != null) {
            com.houseprice.model.User user = userRepository.findByUsername(username).orElse(null);
            
            com.houseprice.model.Property property = com.houseprice.model.Property.builder()
                    .user(user)
                    .location(request.getLocation())
                    .totalSqft(request.getTotal_sqft())
                    .bhk(request.getBhk())
                    .bath(request.getBath())
                    .build();
            propertyRepository.save(property);

            com.houseprice.model.Prediction prediction = com.houseprice.model.Prediction.builder()
                    .property(property)
                    .predictedPrice(response.getPredicted_price())
                    .confidenceScore(response.getConfidence_score())
                    .explanation(response.getExplanation().toString())
                    .modelVersion("v2026.1.4")
                    .build();
            predictionRepository.save(prediction);
        }

        return response;
    }

    @GetMapping("/history")
    public java.util.List<com.houseprice.model.Prediction> getHistory(@RequestParam String username) {
        return predictionRepository.findByPropertyUserUsername(username);
    }
}
