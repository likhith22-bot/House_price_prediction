package com.houseprice.chatbot.repository;

import com.houseprice.model.ChatbotKnowledge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface ChatbotKnowledgeRepository extends JpaRepository<ChatbotKnowledge, Long> {
    
    @Query(value = "SELECT * FROM chatbot_knowledge WHERE LOWER(question) LIKE LOWER(CONCAT('%', :query, '%')) LIMIT 1", nativeQuery = true)
    Optional<ChatbotKnowledge> findMatchingKnowledge(@Param("query") String query);
}
