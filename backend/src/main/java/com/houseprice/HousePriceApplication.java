package com.houseprice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import com.houseprice.auth.repository.UserRepository;
import com.houseprice.model.User;
import com.houseprice.common.enums.Role;
import com.houseprice.admin.repository.ModelMetadataRepository;
import com.houseprice.model.ModelMetadata;
import com.houseprice.chatbot.repository.ChatbotKnowledgeRepository;
import com.houseprice.model.ChatbotKnowledge;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;

import com.houseprice.common.utils.DataAutoLoader;
import com.houseprice.user.repository.PropertyRepository;
import com.houseprice.user.repository.FeedbackRepository;

@SpringBootApplication
public class HousePriceApplication {
    public static void main(String[] args) {
        SpringApplication.run(HousePriceApplication.class, args);
    }

    @Bean
    CommandLineRunner initData(UserRepository userRepository, 
                               ModelMetadataRepository modelRepository,
                               ChatbotKnowledgeRepository chatbotRepository,
                               PropertyRepository propertyRepository,
                               FeedbackRepository feedbackRepository,
                               DataAutoLoader dataLoader) {
        return args -> {
            // 1. Basic Setup
            if (userRepository.findByUsername("admin").isEmpty()) {
                userRepository.save(User.builder()
                        .username("admin")
                        .email("admin@houseprice.com")
                        .password("admin123")
                        .role(Role.ADMIN)
                        .build());
                System.out.println("✅ Default Admin Created: admin/admin123");
            }

            // 2. Market Data Auto-Ingestion (NEW)
            dataLoader.loadInitialMarketData(propertyRepository, feedbackRepository, userRepository);

            // 3. Metadata and Chatbot
            if (modelRepository.count() == 0) {
                modelRepository.save(ModelMetadata.builder()
                        .version("v2026.1.4")
                        .accuracy(0.9947)
                        .datasetSize(15000)
                        .isActive(true)
                        .build());
            }

            // 3. Check & Insert Chatbot Knowledge
            if (chatbotRepository.count() == 0) {
                chatbotRepository.save(ChatbotKnowledge.builder()
                        .question("What is this project?")
                        .answer("This is an Intelligent House Price Prediction System with Auto-Learning ML and XAI.")
                        .category("System")
                        .build());
                System.out.println("✅ Initial Chatbot Knowledge Seeded");
            }
        };
    }
}
