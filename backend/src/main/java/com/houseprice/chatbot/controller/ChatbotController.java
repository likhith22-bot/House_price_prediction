package com.houseprice.chatbot.controller;

import com.houseprice.chatbot.dto.ChatRequest;
import com.houseprice.chatbot.dto.ChatResponse;
import com.houseprice.chatbot.service.ChatbotService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chatbot")
@CrossOrigin(origins = "*")
public class ChatbotController {

    @Autowired
    private ChatbotService chatbotService;

    @PostMapping("/chat")
    public ChatResponse chat(@RequestBody ChatRequest request) {
        return chatbotService.getResponse(request);
    }
}
