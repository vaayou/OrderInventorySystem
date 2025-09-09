package com.vaayu.OrderInvertory.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;

@Getter
@Setter
@Entity
@Table(name = "order_items", uniqueConstraints = {
    @UniqueConstraint(name = "order_items_product_u", columnNames = {"product_id", "order_id"})
})
public class OrderItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_id")
    private Integer orderId;

    @Column(name = "line_item_id", nullable = false)
    private Integer lineItemId;

    @Column(name = "product_id", nullable = false)
    private Integer productId;

    @Column(name = "unit_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal unitPrice;

    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    @Column(name = "shipment_id")
    private Integer shipmentId;

    // Relationships (optional, can be uncommented if related entities exist)
    // @ManyToOne(fetch = FetchType.LAZY)
    // @JoinColumn(name = "order_id", referencedColumnName = "order_id", foreignKey = @ForeignKey(name = "order_items_order_id_fk"), insertable = false, updatable = false)
    // private Order order;

    // @ManyToOne(fetch = FetchType.LAZY)
    // @JoinColumn(name = "product_id", referencedColumnName = "product_id", foreignKey = @ForeignKey(name = "order_items_product_id_fk"), insertable = false, updatable = false)
    // private Product product;

    // @ManyToOne(fetch = FetchType.LAZY)
    // @JoinColumn(name = "shipment_id", referencedColumnName = "shipment_id", foreignKey = @ForeignKey(name = "order_items_shipment_id_fk"), insertable = false, updatable = false)
    // private Shipment shipment;
}

