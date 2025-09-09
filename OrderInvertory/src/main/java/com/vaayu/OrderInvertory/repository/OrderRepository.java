package com.vaayu.OrderInvertory.repository;

import com.vaayu.OrderInvertory.entity.Order;
import com.vaayu.OrderInvertory.dto.StoreOrderDetailsDTO;
import com.vaayu.OrderInvertory.dto.OrderStatusCountDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.sql.Timestamp;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Integer> {
    List<Order> findByCustomerId(Integer customerId);
    List<Order> findByOrderStatus(String orderStatus);
    List<Order> findByOrderTmsBetween(Timestamp start, Timestamp end);

    @Query("SELECT o FROM Order o JOIN Customer c ON o.customerId = c.customerId WHERE c.emailAddress = :email")
    List<Order> findByCustomerEmailAddress(@Param("email") String email);

    @Query("SELECT new com.vaayu.OrderInvertory.dto.StoreOrderDetailsDTO(o.orderId, o.orderStatus, s.storeName, s.webAddress) FROM Order o JOIN Store s ON o.storeId = s.storeId WHERE s.storeName = :storeName")
    List<StoreOrderDetailsDTO> findOrderDetailsByStoreName(@Param("storeName") String storeName);

    @Query("SELECT new com.vaayu.OrderInvertory.dto.OrderStatusCountDTO(o.orderStatus, COUNT(o)) FROM Order o GROUP BY o.orderStatus")
    List<OrderStatusCountDTO> countOrdersByStatus();
}
