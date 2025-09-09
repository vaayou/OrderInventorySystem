package com.vaayu.OrderInvertory.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "shipments")
public class Shipment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "shipment_id")
    private Integer shipmentId;

    @Column(name = "store_id", nullable = false)
    private Integer storeId;

    @Column(name = "customer_id", nullable = false)
    private Integer customerId;

    @Column(name = "delivery_address", nullable = false, length = 512)
    private String deliveryAddress;

    @Column(name = "shipment_status", nullable = false, length = 100)
    private String shipmentStatus;

    // Relationships (optional, can be uncommented if related entities exist)
    // @ManyToOne(fetch = FetchType.LAZY)
    // @JoinColumn(name = "customer_id", referencedColumnName = "customer_id", foreignKey = @ForeignKey(name = "shipments_customer_id_fk"), insertable = false, updatable = false)
    // private Customer customer;

    // @ManyToOne(fetch = FetchType.LAZY)
    // @JoinColumn(name = "store_id", referencedColumnName = "store_id", foreignKey = @ForeignKey(name = "shipments_store_id_fk"), insertable = false, updatable = false)
    // private Store store;

    // Optionally, you can add an enum for shipmentStatus and a @PrePersist/@PreUpdate validation for the allowed values.
}

