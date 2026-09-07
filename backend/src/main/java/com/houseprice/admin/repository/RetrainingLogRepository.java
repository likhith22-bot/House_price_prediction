package com.houseprice.admin.repository;

import com.houseprice.model.RetrainingLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RetrainingLogRepository extends JpaRepository<RetrainingLog, Long> {}
