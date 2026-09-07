package com.houseprice.ml.client;

import com.houseprice.ml.dto.MlPredictionRequest;
import com.houseprice.ml.dto.MlPredictionResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class PythonMlClient {

    @Value("${ml.service.url:http://localhost:8001}")
    private String mlServiceUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    public MlPredictionResponse predict(MlPredictionRequest request) {
        return restTemplate.postForObject(mlServiceUrl + "/predict", request, MlPredictionResponse.class);
    }

    public void triggerRetraining() {
        restTemplate.postForObject(mlServiceUrl + "/retrain", null, String.class);
    }

    public void updateChatbotKnowledge(Object knowledge) {
        restTemplate.postForObject(mlServiceUrl + "/update_chatbot_knowledge", knowledge, String.class);
    }

    public void updateMarketData(Object data) {
        restTemplate.postForObject(mlServiceUrl + "/update_data", data, String.class);
    }
}
