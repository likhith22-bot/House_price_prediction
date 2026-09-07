CREATE DATABASE IF NOT EXISTS house_price_db;
USE house_price_db;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('GUEST', 'USER', 'ADMIN') DEFAULT 'USER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Properties Table (Stores user inputs for prediction)
CREATE TABLE IF NOT EXISTS properties (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT,
    location VARCHAR(255) NOT NULL,
    total_sqft DOUBLE NOT NULL,
    bhk INT NOT NULL,
    bath INT,
    balcony INT,
    area_type VARCHAR(100),
    latitude DOUBLE,
    longitude DOUBLE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. Predictions Table
CREATE TABLE IF NOT EXISTS predictions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    property_id BIGINT,
    predicted_price DOUBLE NOT NULL,
    confidence_score DOUBLE,
    explanation TEXT, -- JSON or text summary from SHAP
    model_version VARCHAR(50),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
);

-- 4. Feedback Table (Actual prices for retraining)
CREATE TABLE IF NOT EXISTS feedback (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    property_id BIGINT,
    actual_price DOUBLE NOT NULL,
    sold_date DATE,
    comments TEXT,
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
);

-- 5. Model Metadata Table
CREATE TABLE IF NOT EXISTS model_metadata (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    version VARCHAR(50) NOT NULL UNIQUE,
    accuracy DOUBLE,
    rmse DOUBLE,
    trained_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    dataset_size INT,
    is_active BOOLEAN DEFAULT FALSE
);

-- 6. Retraining Logs
CREATE TABLE IF NOT EXISTS retraining_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    trigger_type VARCHAR(50), -- 'MANUAL', 'SCHEDULED', 'DRIFT'
    old_version VARCHAR(50),
    new_version VARCHAR(50),
    status VARCHAR(20), -- 'SUCCESS', 'FAILED'
    log_message TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. Chatbot Knowledge Table
CREATE TABLE IF NOT EXISTS chatbot_knowledge (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
