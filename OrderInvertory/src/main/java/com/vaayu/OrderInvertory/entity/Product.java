package com.vaayu.OrderInvertory.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;

@Getter
@Setter
@Entity
@Table(name = "products")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "product_id")
    private Integer productId;

    @Column(name = "product_name", nullable = false, length = 255)
    private String productName;

    @Column(name = "unit_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal unitPrice;

    @Column(name = "colour", nullable = false, length = 45)
    private String colour;

    @Column(name = "brand", nullable = false, length = 45)
    private String brand;

    @Column(name = "size", nullable = false, length = 10)
    private String size;

    @Column(name = "rating", nullable = false)
    private Integer rating;

    @Column(name = "category", length = 100)
    private String category;
}
