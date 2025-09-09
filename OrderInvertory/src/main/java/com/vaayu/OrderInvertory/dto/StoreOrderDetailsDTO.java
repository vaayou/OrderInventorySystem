package com.vaayu.OrderInvertory.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StoreOrderDetailsDTO {
    private Integer orderId;
    private String orderStatus;
    private String storeName;
    private String webAddress;
}

