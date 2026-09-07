package com.houseprice.common.utils;

import com.houseprice.auth.repository.UserRepository;
import com.houseprice.model.Property;
import com.houseprice.model.Feedback;
import com.houseprice.model.User;
import com.houseprice.user.repository.PropertyRepository;
import com.houseprice.user.repository.FeedbackRepository;
import org.springframework.stereotype.Component;
import java.io.BufferedReader;
import java.io.FileReader;
import java.io.File;
import java.util.Optional;

@Component
public class DataAutoLoader {

    public void loadInitialMarketData(PropertyRepository propertyRepository, 
                                     FeedbackRepository feedbackRepository, 
                                     UserRepository userRepository) {
        
        if (propertyRepository.count() > 0) {
            System.out.println("ℹ️ Database already has market data. Skipping auto-load.");
            return;
        }

        String csvPath = "ml-service/data/training_data.csv";
        File file = new File(csvPath);
        
        if (!file.exists()) {
            System.out.println("⚠️ Warning: training_data.csv not found at " + csvPath);
            return;
        }

        System.out.println("🚀 Starting Automatic Data Ingestion from CSV...");
        
        try (BufferedReader br = new BufferedReader(new FileReader(file))) {
            String line;
            String[] headers = br.readLine().split(","); // Read header
            
            Optional<User> admin = userRepository.findByUsername("admin");
            if (admin.isEmpty()) return;

            int count = 0;
            while ((line = br.readLine()) != null && count < 1000) { // Load first 1000 for quick startup
                String[] values = line.split(",");
                if (values.length >= 5) {
                    try {
                        // Mapping: location,total_sqft,bhk,bath,metro_dist,price
                        Property property = Property.builder()
                                .user(admin.get())
                                .location(values[0])
                                .totalSqft(Double.parseDouble(values[1]))
                                .bhk(Integer.parseInt(values[2]))
                                .bath(Integer.parseInt(values[3]))
                                .build();
                        
                        propertyRepository.save(property);

                        Feedback feedback = Feedback.builder()
                                .property(property)
                                .actualPrice(Double.parseDouble(values[5]))
                                .comments("Initial Auto-Loaded Data")
                                .build();
                        
                        feedbackRepository.save(feedback);
                        count++;
                    } catch (Exception e) {
                        // Skip malformed lines
                    }
                }
            }
            System.out.println("✅ Successfully auto-loaded " + count + " market records into Database.");
        } catch (Exception e) {
            System.out.println("❌ Error during Auto-loading: " + e.getMessage());
        }
    }
}
