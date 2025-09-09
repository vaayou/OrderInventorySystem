package com.vaayu.OrderInvertory.dto;

import com.vaayu.OrderInvertory.entity.Product;
import com.vaayu.OrderInvertory.entity.Store;
import com.vaayu.OrderInvertory.entity.Order;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InventoryProductStoreOrderDTO {
    private Product product;
    private Store store;
    private Order order;
}

