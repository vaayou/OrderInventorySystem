package com.vaayu.OrderInvertory.service;

import com.vaayu.OrderInvertory.dto.*;
import com.vaayu.OrderInvertory.entity.Inventory;
import com.vaayu.OrderInvertory.entity.Product;
import com.vaayu.OrderInvertory.entity.Store;
import com.vaayu.OrderInvertory.entity.Order;
import com.vaayu.OrderInvertory.entity.Customer;
import com.vaayu.OrderInvertory.entity.Shipment;
import com.vaayu.OrderInvertory.repository.InventoryRepository;
import com.vaayu.OrderInvertory.repository.ProductRepository;
import com.vaayu.OrderInvertory.repository.StoreRepository;
import com.vaayu.OrderInvertory.repository.OrderRepository;
import com.vaayu.OrderInvertory.repository.CustomerRepository;
import com.vaayu.OrderInvertory.repository.ShipmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.*;
import java.math.BigDecimal;

@Service
public class InventoryService {
    @Autowired
    private InventoryRepository inventoryRepository;
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private StoreRepository storeRepository;
    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private CustomerRepository customerRepository;
    @Autowired
    private ShipmentRepository shipmentRepository;

    public List<Inventory> getAllInventory() {
        return inventoryRepository.findAll();
    }

    public List<InventoryProductStoreOrderDTO> getInventoryByStoreId(Integer storeId) {
        List<InventoryProductStoreOrderDTO> result = inventoryRepository.findInventoryByStoreId(storeId);
        if (result.isEmpty()) {
            throw new NoSuchElementException("Inventory records matching the specified store ID not found.");
        }
        return result;
    }

    public List<InventoryWithShipmentDTO> getInventoryWithShipments() {
        return inventoryRepository.findInventoryWithShipments();
    }

    public List<InventoryProductCustomerStoreDTO> getInventoryByOrderId(Integer orderId) {
        List<InventoryProductCustomerStoreDTO> result = inventoryRepository.findInventoryByOrderId(orderId);
        if (result.isEmpty()) {
            throw new NoSuchElementException("Store, product, and customer data for the specified order ID not found.");
        }
        return result;
    }

    public List<ShipmentStatusProductCountDTO> getShipmentStatusProductCount() {
        return inventoryRepository.countShipmentStatusProductSold();
    }

    public List<Inventory> getInventoryByProductAndStore(Integer productId, Integer storeId) {
        List<Inventory> result = inventoryRepository.findByProductIdAndStoreId(productId, storeId);
        if (result.isEmpty()) {
            throw new NoSuchElementException("Inventory records for the specified product and store not found.");
        }
        return result;
    }

    public List<InventoryByCategoryDTO> getInventoryByCategory(String category) {
        List<Inventory> inventories = inventoryRepository.findInventoriesByCategory(category);
        if (inventories.isEmpty()) {
            throw new NoSuchElementException("Inventory records for the specified category not found.");
        }
        // Group by category (though all should have the same category)
        InventoryByCategoryDTO dto = new InventoryByCategoryDTO(category, inventories);
        return List.of(dto);
    }

    public InventoryOrderDetailsDTO getOrderDetails(Integer orderId) {
        Optional<Order> orderOpt = orderRepository.findById(orderId);
        if (orderOpt.isEmpty()) {
            throw new NoSuchElementException("List of products in the specified order ID not found with store details, shipment status, and total amount.");
        }
        Order order = orderOpt.get();
        Store store = storeRepository.findById(order.getStoreId()).orElse(null);
        List<Inventory> inventories = inventoryRepository.findAll();
        List<Product> products = new ArrayList<>();
        BigDecimal totalAmount = BigDecimal.ZERO;
        for (Inventory inv : inventories) {
            if (inv.getStoreId().equals(order.getStoreId())) {
                Product product = productRepository.findById(inv.getProductId()).orElse(null);
                if (product != null) {
                    products.add(product);
                    totalAmount = totalAmount.add(product.getUnitPrice());
                }
            }
        }
        String shipmentStatus = shipmentRepository.findAll().stream()
                .filter(sh -> sh.getStoreId().equals(order.getStoreId()) && sh.getCustomerId().equals(order.getCustomerId()))
                .map(Shipment::getShipmentStatus)
                .findFirst().orElse(null);
        if (products.isEmpty() || store == null || shipmentStatus == null) {
            throw new NoSuchElementException("List of products in the specified order ID not found with store details, shipment status, and total amount.");
        }
        return new InventoryOrderDetailsDTO(products, store, shipmentStatus, totalAmount);
    }
}
