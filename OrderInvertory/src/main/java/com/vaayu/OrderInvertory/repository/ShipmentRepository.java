package com.vaayu.OrderInvertory.repository;

import com.vaayu.OrderInvertory.entity.Shipment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ShipmentRepository extends JpaRepository<Shipment, Integer> {
    List<Shipment> findByCustomerId(Integer customerId);
}

