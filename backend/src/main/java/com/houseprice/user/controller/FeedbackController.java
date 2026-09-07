package com.houseprice.user.controller;

import com.houseprice.model.Feedback;
import com.houseprice.model.Property;
import com.houseprice.user.repository.FeedbackRepository;
import com.houseprice.user.repository.PropertyRepository;
import com.houseprice.ml.client.PythonMlClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping("/api/feedback")
@CrossOrigin(origins = "*")
public class FeedbackController {

    @Autowired
    private FeedbackRepository feedbackRepository;

    @Autowired
    private PropertyRepository propertyRepository;

    @Autowired
    private PythonMlClient mlClient;

    @PostMapping("/submit")
    public Map<String, String> submitFeedback(@RequestBody Map<String, Object> payload) {
        Long propertyId = Long.parseLong(payload.get("propertyId").toString());
        Double actualPrice = Double.parseDouble(payload.get("actualPrice").toString());
        
        Property property = propertyRepository.findById(propertyId).orElseThrow();
        
        Feedback feedback = Feedback.builder()
                .property(property)
                .actualPrice(actualPrice)
                .build();
        feedbackRepository.save(feedback);

        // Trigger Auto-Learning: Send feedback to ML service to update training data
        Map<String, Object> mlData = new HashMap<>();
        mlData.put("location", property.getLocation());
        mlData.put("total_sqft", property.getTotalSqft());
        mlData.put("bhk", property.getBhk());
        mlData.put("bath", property.getBath());
        mlData.put("price", actualPrice);
        
        mlClient.updateMarketData(List.of(mlData));
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "Feedback received. Auto-learning engine updated!");
        return response;
    }
}
