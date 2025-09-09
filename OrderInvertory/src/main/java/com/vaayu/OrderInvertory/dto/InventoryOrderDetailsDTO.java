package com.vaayu.OrderInvertory.dto;

import com.vaayu.OrderInvertory.entity.Product;
import com.vaayu.OrderInvertory.entity.Store;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InventoryOrderDetailsDTO {
    private List<Product> products;
    private Store store;
    private String shipmentStatus;
    private BigDecimal totalAmount;
}

