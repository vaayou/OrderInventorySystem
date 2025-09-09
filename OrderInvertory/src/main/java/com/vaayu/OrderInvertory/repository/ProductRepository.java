package com.vaayu.OrderInvertory.repository;

import com.vaayu.OrderInvertory.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.math.BigDecimal;
import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Integer> {
    List<Product> findByProductNameContainingIgnoreCase(String productName);
    List<Product> findByBrandIgnoreCase(String brand);
    List<Product> findByColourIgnoreCase(String colour);
    List<Product> findByUnitPriceBetween(BigDecimal min, BigDecimal max);
    // Sorting is handled by JpaRepository's findAll(Sort sort)
}

