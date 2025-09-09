package com.vaayu.OrderInvertory.dto;

import com.vaayu.OrderInvertory.entity.Product;
import com.vaayu.OrderInvertory.entity.Customer;
import com.vaayu.OrderInvertory.entity.Store;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InventoryProductCustomerStoreDTO {
    private Product product;
    private Customer customer;
    private Store store;
}

