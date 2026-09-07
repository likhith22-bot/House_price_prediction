package com.houseprice.admin.repository;

import com.houseprice.model.ModelMetadata;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface ModelMetadataRepository extends JpaRepository<ModelMetadata, Long> {
    Optional<ModelMetadata> findTopByIsActiveTrueOrderByTrainedOnDesc();
}
