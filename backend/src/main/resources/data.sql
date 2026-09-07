-- Insert/Update Default Admin
INSERT INTO users (username, email, password, role) 
VALUES ('admin', 'admin@houseprice.com', 'admin123', 'ADMIN')
ON DUPLICATE KEY UPDATE
  email = VALUES(email),
  password = VALUES(password),
  role = VALUES(role);

-- Insert/Update Default Test User
INSERT INTO users (username, email, password, role) 
VALUES ('user', 'user@gmail.com', 'user123', 'USER')
ON DUPLICATE KEY UPDATE
  email = VALUES(email),
  password = VALUES(password),
  role = VALUES(role);

-- Insert Sample Model Metadata for Dashboard mapping
INSERT IGNORE INTO model_metadata (version, accuracy, rmse, dataset_size, is_active)
VALUES ('v2026.1.4', 0.9947, 1.25, 15000, 1);

-- Insert Initial Chatbot Knowledge
INSERT IGNORE INTO chatbot_knowledge (question, answer, category)
VALUES 
('What is this project?', 'This is an Intelligent House Price Prediction System with Auto-Learning ML and XAI.', 'System'),
('How accurate is the model?', 'The current model achieves 99.4% accuracy using the Hyderabad Real Estate dataset.', 'Accuracy'),
('Which locations are covered?', 'Currently, we cover Gachibowli, Madhapur, Kukatpally, and other major IT corridor hubs. We also include global datasets like Ames (US) for comparative analysis.', 'Location'),
('Does the system support global data?', 'Yes, the system is designed with a Hybrid Architecture that integrates both local Indian real estate data and global datasets like Ames Housing (USA), normalized for the Indian market.', 'Global Data');
