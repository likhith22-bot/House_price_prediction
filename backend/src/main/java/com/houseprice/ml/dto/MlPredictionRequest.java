package com.houseprice.ml.dto;

import lombok.Data;

@Data
public class MlPredictionRequest {
    private String location;
    private Double total_sqft;
    private Integer bhk;
    private Integer bath;
}
