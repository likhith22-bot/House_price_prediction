package com.houseprice.chatbot.service;

import com.houseprice.chatbot.dto.ChatRequest;
import com.houseprice.chatbot.dto.ChatResponse;
import com.houseprice.chatbot.repository.ChatbotKnowledgeRepository;
import com.houseprice.model.ChatbotKnowledge;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class ChatbotService {

    @Autowired
    private ChatbotKnowledgeRepository knowledgeRepository;

    public ChatResponse getResponse(ChatRequest request) {
        String message = request.getMessage().toLowerCase();
        
        // 1. Check Database for matching knowledge (Real System Logic)
        Optional<ChatbotKnowledge> match = knowledgeRepository.findMatchingKnowledge(message);
        if (match.isPresent()) {
            return new ChatResponse(match.get().getAnswer());
        }

        // 2. Default fallback responses
        String reply;
        if (message.contains("hi") || message.contains("hello")) {
            reply = "Hello! I am your AI House Price Assistant. How can I help you today?";
        } else if (message.contains("predict") || message.contains("price")) {
            reply = "To predict a price, please use the 'Smart Prediction' form or type details like '1200 sqft, 2BHK in Gachibowli'.";
        } else if (message.contains("why")) {
            reply = "I use Explainable AI (SHAP) to show exactly how location, size, and amenities affect the price.";
        } else {
            reply = "I'm not sure about that. Try asking about 'price prediction', 'model accuracy', or upload new knowledge via Admin Portal.";
        }

        return new ChatResponse(reply);
    }
}
