package com.vaayu.OrderInvertory.dto;

import com.vaayu.OrderInvertory.entity.Inventory;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InventoryByCategoryDTO {
    private String category;
    private List<Inventory> inventories;
}

