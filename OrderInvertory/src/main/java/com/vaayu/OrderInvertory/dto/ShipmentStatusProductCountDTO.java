package com.vaayu.OrderInvertory.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ShipmentStatusProductCountDTO {
    private String shipmentStatus;
    private Long productCount;
}

