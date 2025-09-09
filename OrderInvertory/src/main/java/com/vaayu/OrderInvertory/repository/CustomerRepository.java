package com.vaayu.OrderInvertory.repository;

import com.vaayu.OrderInvertory.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface CustomerRepository extends JpaRepository<Customer, Integer> {
    List<Customer> findByEmailAddressContainingIgnoreCase(String emailAddress);
    List<Customer> findByFullNameContainingIgnoreCase(String fullName);

    // Customers with pending shipments (assuming 'CREATED' or 'IN-TRANSIT' means pending)
    @Query("SELECT DISTINCT c FROM Customer c JOIN Shipment s ON c.customerId = s.customerId WHERE s.shipmentStatus IN ('CREATED', 'IN-TRANSIT')")
    List<Customer> findCustomersWithPendingShipments();

    // Customers with overdue shipments (assuming 'IN-TRANSIT' for too long, logic to be handled in service)
    @Query("SELECT DISTINCT c FROM Customer c JOIN Shipment s ON c.customerId = s.customerId WHERE s.shipmentStatus = 'IN-TRANSIT'")
    List<Customer> findCustomersWithOverdueShipments();

    // Customers with completed orders (assuming 'COMPLETE' or 'PAID')
    @Query("SELECT DISTINCT c FROM Customer c JOIN Order o ON c.customerId = o.customerId WHERE o.orderStatus IN ('COMPLETE', 'PAID')")
    List<Customer> findCustomersWithCompletedOrders();

    // Customers with order quantities in a specified range
    @Query("SELECT DISTINCT c FROM Customer c JOIN Order o ON c.customerId = o.customerId JOIN OrderItem oi ON o.orderId = oi.orderId GROUP BY c.customerId HAVING SUM(oi.quantity) BETWEEN :min AND :max")
    List<Customer> findCustomersByOrderQuantityRange(@Param("min") int min, @Param("max") int max);
}

