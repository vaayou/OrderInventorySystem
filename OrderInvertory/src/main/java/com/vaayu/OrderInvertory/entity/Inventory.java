package com.vaayu.OrderInvertory.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "inventory", uniqueConstraints = {
    @UniqueConstraint(name = "inventory_store_product_u", columnNames = {"store_id", "product_id"})
})
public class Inventory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "inventory_id")
    private Integer inventoryId;

    @Column(name = "store_id", nullable = false)
    private Integer storeId;

    @Column(name = "product_id", nullable = false)
    private Integer productId;

    @Column(name = "product_inventory", nullable = false)
    private Integer productInventory;

    // Relationships (optional, can be uncommented if Product and Store entities exist)
    // @ManyToOne(fetch = FetchType.LAZY)
    // @JoinColumn(name = "product_id", referencedColumnName = "product_id", foreignKey = @ForeignKey(name = "inventory_product_id_fk"), insertable = false, updatable = false)
    // private Product product;

    // @ManyToOne(fetch = FetchType.LAZY)
    // @JoinColumn(name = "store_id", referencedColumnName = "store_id", foreignKey = @ForeignKey(name = "inventory_store_id_fk"), insertable = false, updatable = false)
    // private Store store;
}

