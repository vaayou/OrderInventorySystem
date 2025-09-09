package com.vaayu.OrderInvertory.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.sql.Timestamp;

@Getter
@Setter
@Entity
@Table(name = "orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_id")
    private Integer orderId;

    @Column(name = "order_tms", nullable = false)
    private Timestamp orderTms;

    @Column(name = "customer_id", nullable = false)
    private Integer customerId;

    @Column(name = "order_status", nullable = false, length = 10)
    private String orderStatus;

    @Column(name = "store_id", nullable = false)
    private Integer storeId;

    // Relationships (optional, can be uncommented if related entities exist)
    // @ManyToOne(fetch = FetchType.LAZY)
    // @JoinColumn(name = "customer_id", referencedColumnName = "customer_id", foreignKey = @ForeignKey(name = "orders_customer_id_fk"), insertable = false, updatable = false)
    // private Customer customer;

    // @ManyToOne(fetch = FetchType.LAZY)
    // @JoinColumn(name = "store_id", referencedColumnName = "store_id", foreignKey = @ForeignKey(name = "orders_store_id_fk"), insertable = false, updatable = false)
    // private Store store;

    // Optionally, you can add an enum for orderStatus and a @PrePersist/@PreUpdate validation for the allowed values.
}

