package com.vaayu.OrderInvertory.controller;

import com.vaayu.OrderInvertory.dto.*;
import com.vaayu.OrderInvertory.entity.Inventory;
import com.vaayu.OrderInvertory.service.InventoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/api/v1/inventory")
public class InventoryController {
    @Autowired
    private InventoryService inventoryService;

    @GetMapping
    public ResponseEntity<?> getAllInventory(@RequestParam(value = "storeid", required = false) Integer storeId) {
        try {
            if (storeId != null) {
                List<InventoryProductStoreOrderDTO> result = inventoryService.getInventoryByStoreId(storeId);
                return ResponseEntity.ok(result);
            } else {
                List<Inventory> result = inventoryService.getAllInventory();
                return ResponseEntity.ok(result);
            }
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Inventory records matching the specified store ID not found.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An internal server error occurred while fetching all inventory records.");
        }
    }

    @GetMapping("/shipment")
    public ResponseEntity<?> getInventoryWithShipments(@RequestParam(value = "count", required = false) Boolean count) {
        try {
            if (count != null && count) {
                List<ShipmentStatusProductCountDTO> result = inventoryService.getShipmentStatusProductCount();
                return ResponseEntity.ok(result);
            } else {
                List<InventoryWithShipmentDTO> result = inventoryService.getInventoryWithShipments();
                return ResponseEntity.ok(result);
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(count != null && count ?
                        "An internal server error occurred while fetching the count of shipment status and sold products."
                        : "An internal server error occurred while fetching inventory records matching shipments.");
        }
    }

    @GetMapping("/{orderid}")
    public ResponseEntity<?> getInventoryByOrderId(@PathVariable Integer orderid) {
        try {
            List<InventoryProductCustomerStoreDTO> result = inventoryService.getInventoryByOrderId(orderid);
            return ResponseEntity.ok(result);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Store, product, and customer data for the specified order ID not found.");
        }
    }

    @GetMapping("/{orderid}/details")
    public ResponseEntity<?> getOrderDetails(@PathVariable Integer orderid) {
        try {
            InventoryOrderDetailsDTO result = inventoryService.getOrderDetails(orderid);
            return ResponseEntity.ok(result);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("List of products in the specified order ID not found with store details, shipment status, and total amount.");
        }
    }

    @GetMapping("/product/{productId}/store/{storeId}")
    public ResponseEntity<?> getInventoryByProductAndStore(@PathVariable Integer productId, @PathVariable Integer storeId) {
        try {
            List<Inventory> result = inventoryService.getInventoryByProductAndStore(productId, storeId);
            return ResponseEntity.ok(result);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Inventory records for the specified product and store not found.");
        }
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<?> getInventoryByCategory(@PathVariable String category) {
        try {
            List<InventoryByCategoryDTO> result = inventoryService.getInventoryByCategory(category);
            return ResponseEntity.ok(result);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Inventory records for the specified category not found.");
        }
    }
}

