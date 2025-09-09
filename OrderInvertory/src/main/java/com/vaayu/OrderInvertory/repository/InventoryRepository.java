package com.vaayu.OrderInvertory.repository;

import com.vaayu.OrderInvertory.entity.Inventory;
import com.vaayu.OrderInvertory.dto.InventoryProductStoreOrderDTO;
import com.vaayu.OrderInvertory.dto.InventoryWithShipmentDTO;
import com.vaayu.OrderInvertory.dto.InventoryProductCustomerStoreDTO;
import com.vaayu.OrderInvertory.dto.ShipmentStatusProductCountDTO;
import com.vaayu.OrderInvertory.dto.InventoryOrderDetailsDTO;
import com.vaayu.OrderInvertory.dto.InventoryByCategoryDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface InventoryRepository extends JpaRepository<Inventory, Integer> {
    // By storeId: product, store, order details
    @Query("SELECT new com.vaayu.OrderInvertory.dto.InventoryProductStoreOrderDTO(p, s, o) FROM Inventory i JOIN Product p ON i.productId = p.productId JOIN Store s ON i.storeId = s.storeId JOIN Order o ON o.storeId = s.storeId WHERE i.storeId = :storeId")
    List<InventoryProductStoreOrderDTO> findInventoryByStoreId(@Param("storeId") Integer storeId);

    // By shipment: inventory with shipment details
    @Query("SELECT new com.vaayu.OrderInvertory.dto.InventoryWithShipmentDTO(i, sh) FROM Inventory i JOIN Shipment sh ON i.storeId = sh.storeId")
    List<InventoryWithShipmentDTO> findInventoryWithShipments();

    // By orderId: product, customer, store details
    @Query("SELECT new com.vaayu.OrderInvertory.dto.InventoryProductCustomerStoreDTO(p, c, s) FROM Inventory i JOIN Product p ON i.productId = p.productId JOIN Store s ON i.storeId = s.storeId JOIN Order o ON o.orderId = :orderId JOIN Customer c ON o.customerId = c.customerId WHERE i.storeId = s.storeId AND i.productId = p.productId")
    List<InventoryProductCustomerStoreDTO> findInventoryByOrderId(@Param("orderId") Integer orderId);

    // Shipment status and count of sold products
    @Query("SELECT new com.vaayu.OrderInvertory.dto.ShipmentStatusProductCountDTO(sh.shipmentStatus, COUNT(i.productId)) FROM Inventory i JOIN Shipment sh ON i.storeId = sh.storeId GROUP BY sh.shipmentStatus")
    List<ShipmentStatusProductCountDTO> countShipmentStatusProductSold();

    // By productId and storeId
    List<Inventory> findByProductIdAndStoreId(Integer productId, Integer storeId);

    // By category (assuming Product has a 'category' field)
    @Query("SELECT i FROM Inventory i JOIN Product p ON i.productId = p.productId WHERE p.category = :category")
    List<Inventory> findInventoriesByCategory(@Param("category") String category);

    // For /api/v1/inventory/{orderid}/details: products in an order, store, shipment status, total amount
    // This is a complex query, so it may be implemented in the service layer using multiple repository calls.
}
