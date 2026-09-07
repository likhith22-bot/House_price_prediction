package com.houseprice.admin.controller;

import com.houseprice.ml.client.PythonMlClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/admin/chatbot")
@CrossOrigin(origins = "*")
public class AdminChatbotController {

    @Autowired
    private PythonMlClient mlClient;

    @Autowired
    private com.houseprice.chatbot.repository.ChatbotKnowledgeRepository knowledgeRepository;

    @PostMapping("/upload-knowledge")
    public Map<String, String> uploadKnowledge(@RequestParam("file") MultipartFile file) {
        List<Map<String, String>> knowledgeList = new ArrayList<>();
        List<com.houseprice.model.ChatbotKnowledge> dbKnowledgeList = new ArrayList<>();
        
        try (BufferedReader br = new BufferedReader(new InputStreamReader(file.getInputStream()))) {
            String line;
            br.readLine(); // Skip header
            while ((line = br.readLine()) != null) {
                String[] values = line.split(",");
                if (values.length >= 2) {
                    String question = values[0].trim();
                    String answer = values[1].trim();
                    
                    // Add to ML List
                    Map<String, String> entry = new HashMap<>();
                    entry.put("question", question);
                    entry.put("answer", answer);
                    knowledgeList.add(entry);

                    // Add to Database List
                    dbKnowledgeList.add(com.houseprice.model.ChatbotKnowledge.builder()
                            .question(question)
                            .answer(answer)
                            .category("Uploaded")
                            .build());
                }
            }
            
            // 1. Save to Database
            knowledgeRepository.saveAll(dbKnowledgeList);

            // 2. Forward to ML Service
            mlClient.updateChatbotKnowledge(knowledgeList);
            
            Map<String, String> response = new HashMap<>();
            response.put("message", "Successfully loaded " + knowledgeList.size() + " records. Retraining started.");
            return response;
        } catch (Exception e) {
            throw new RuntimeException("Failed to process CSV file: " + e.getMessage());
        }
    }
}
