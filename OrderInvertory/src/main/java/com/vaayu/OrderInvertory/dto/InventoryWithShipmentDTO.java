package com.vaayu.OrderInvertory.dto;

import com.vaayu.OrderInvertory.entity.Inventory;
import com.vaayu.OrderInvertory.entity.Shipment;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InventoryWithShipmentDTO {
    private Inventory inventory;
    private List<Shipment> shipments;

    public InventoryWithShipmentDTO(Inventory inventory, Shipment shipment) {
        this.inventory = inventory;
        this.shipments = List.of(shipment);
    }
}
