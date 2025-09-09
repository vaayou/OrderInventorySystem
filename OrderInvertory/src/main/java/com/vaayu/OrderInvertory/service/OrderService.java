package com.vaayu.OrderInvertory.service;

import com.vaayu.OrderInvertory.dto.OrderStatusCountDTO;
import com.vaayu.OrderInvertory.dto.StoreOrderDetailsDTO;
import com.vaayu.OrderInvertory.entity.Order;
import com.vaayu.OrderInvertory.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.sql.Timestamp;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@Service
public class OrderService {
    @Autowired
    private OrderRepository orderRepository;

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public Order addOrder(Order order) {
        if (order == null || order.getOrderTms() == null || order.getCustomerId() == null || order.getOrderStatus() == null || order.getStoreId() == null) {
            throw new IllegalArgumentException("Invalid request. Please provide valid order data for creation.");
        }
        return orderRepository.save(order);
    }

    public Order updateOrder(Order order) {
        if (order == null || order.getOrderId() == null || !orderRepository.existsById(order.getOrderId())) {
            throw new IllegalArgumentException("Invalid request. Please provide valid order data for updating.");
        }
        return orderRepository.save(order);
    }

    public void deleteOrder(Integer id) {
        if (id == null || !orderRepository.existsById(id)) {
            throw new NoSuchElementException("Order with the specified ID not found for deletion.");
        }
        orderRepository.deleteById(id);
    }

    public List<OrderStatusCountDTO> getOrderStatusCounts() {
        return orderRepository.countOrdersByStatus();
    }

    public List<StoreOrderDetailsDTO> getOrderDetailsByStoreName(String storeName) {
        List<StoreOrderDetailsDTO> details = orderRepository.findOrderDetailsByStoreName(storeName);
        if (details.isEmpty()) {
            throw new NoSuchElementException("Orders with the specified store name not found.");
        }
        return details;
    }

    public Order getOrderById(Integer id) {
        return orderRepository.findById(id).orElseThrow(() -> new NoSuchElementException("Order with the specified ID not found."));
    }

    public List<Order> getOrdersByCustomerId(Integer customerId) {
        List<Order> orders = orderRepository.findByCustomerId(customerId);
        if (orders.isEmpty()) {
            throw new NoSuchElementException("Orders for the specified customer ID not found.");
        }
        return orders;
    }

    public List<Order> getOrdersByStatus(String status) {
        List<Order> orders = orderRepository.findByOrderStatus(status);
        if (orders.isEmpty()) {
            throw new NoSuchElementException("Orders with the specified status not found.");
        }
        return orders;
    }

    public List<Order> getOrdersByDateRange(Timestamp start, Timestamp end) {
        List<Order> orders = orderRepository.findByOrderTmsBetween(start, end);
        if (orders.isEmpty()) {
            throw new NoSuchElementException("Orders within the specified date range not found.");
        }
        return orders;
    }

    public List<Order> getOrdersByCustomerEmail(String email) {
        List<Order> orders = orderRepository.findByCustomerEmailAddress(email);
        if (orders.isEmpty()) {
            throw new NoSuchElementException("Orders for the specified customer email not found.");
        }
        return orders;
    }

    public String cancelOrder(Integer id) {
        Optional<Order> orderOpt = orderRepository.findById(id);
        if (orderOpt.isEmpty()) {
            throw new NoSuchElementException("Order with the specified ID not found for cancellation.");
        }
        Order order = orderOpt.get();
        order.setOrderStatus("CANCELLED");
        orderRepository.save(order);
        return "Order cancelled successfully.";
    }
}

