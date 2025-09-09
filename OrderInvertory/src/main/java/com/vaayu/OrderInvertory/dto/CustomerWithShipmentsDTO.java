package com.vaayu.OrderInvertory.dto;

import com.vaayu.OrderInvertory.entity.Customer;
import com.vaayu.OrderInvertory.entity.Shipment;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CustomerWithShipmentsDTO {
    private Customer customer;
    private List<Shipment> shipments;
}

