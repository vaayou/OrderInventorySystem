package com.vaayu.OrderInvertory.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ShipmentStatusCountDTO {
    private String shipmentStatus;
    private Long customerCount;
}

