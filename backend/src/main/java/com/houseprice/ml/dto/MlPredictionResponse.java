package com.houseprice.ml.dto;

import lombok.Data;
import java.util.Map;

@Data
public class MlPredictionResponse {
    private Double predicted_price;
    private Double confidence_score;
    private Map<String, Object> explanation;
}
