package com.vaayu.OrderInvertory.controller;

import com.vaayu.OrderInvertory.dto.OrderStatusCountDTO;
import com.vaayu.OrderInvertory.dto.StoreOrderDetailsDTO;
import com.vaayu.OrderInvertory.entity.Order;
import com.vaayu.OrderInvertory.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/api/v1/orders")
public class OrderController {
    @Autowired
    private OrderService orderService;

    @GetMapping
    public ResponseEntity<?> getAllOrders() {
        try {
            List<Order> orders = orderService.getAllOrders();
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An internal server error occurred while fetching all orders.");
        }
    }

    @PostMapping
    public ResponseEntity<?> addOrder(@RequestBody Order order) {
        try {
            orderService.addOrder(order);
            return ResponseEntity.ok("Record Created Successfully");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Invalid request. Please provide valid order data for creation.");
        }
    }

    @PutMapping
    public ResponseEntity<?> updateOrder(@RequestBody Order order) {
        try {
            orderService.updateOrder(order);
            return ResponseEntity.ok("Record Updated Successfully");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Invalid request. Please provide valid order data for updating.");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteOrder(@PathVariable Integer id) {
        try {
            orderService.deleteOrder(id);
            return ResponseEntity.ok("Record deleted Successfully");
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Order with the specified ID not found for deletion.");
        }
    }

    @GetMapping("/status")
    public ResponseEntity<?> getOrderStatusCounts() {
        try {
            List<OrderStatusCountDTO> counts = orderService.getOrderStatusCounts();
            return ResponseEntity.ok(counts);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An internal server error occurred while fetching the count of orders by status.");
        }
    }

    @GetMapping("/store/{store}")
    public ResponseEntity<?> getOrderDetailsByStoreName(@PathVariable String store) {
        try {
            List<StoreOrderDetailsDTO> details = orderService.getOrderDetailsByStoreName(store);
            return ResponseEntity.ok(details);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Orders with the specified store name not found.");
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getOrderById(@PathVariable Integer id) {
        try {
            Order order = orderService.getOrderById(id);
            return ResponseEntity.ok(order);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Order with the specified ID not found.");
        }
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<?> getOrdersByCustomerId(@PathVariable Integer customerId) {
        try {
            List<Order> orders = orderService.getOrdersByCustomerId(customerId);
            return ResponseEntity.ok(orders);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Orders for the specified customer ID not found.");
        }
    }

    @GetMapping("/{id}/cancel")
    public ResponseEntity<?> cancelOrder(@PathVariable Integer id) {
        try {
            String result = orderService.cancelOrder(id);
            return ResponseEntity.ok(result);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Order with the specified ID not found for cancellation.");
        }
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<?> getOrdersByStatus(@PathVariable String status) {
        try {
            List<Order> orders = orderService.getOrdersByStatus(status);
            return ResponseEntity.ok(orders);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Orders with the specified status not found.");
        }
    }

    @GetMapping("/date/{startDate}/{endDate}")
    public ResponseEntity<?> getOrdersByDateRange(@PathVariable String startDate, @PathVariable String endDate) {
        try {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");
            LocalDateTime start = LocalDateTime.parse(startDate, formatter);
            LocalDateTime end = LocalDateTime.parse(endDate, formatter);
            List<Order> orders = orderService.getOrdersByDateRange(Timestamp.valueOf(start), Timestamp.valueOf(end));
            return ResponseEntity.ok(orders);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Orders within the specified date range not found.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Invalid date format. Please use yyyy-MM-dd'T'HH:mm:ss");
        }
    }

    @GetMapping("/customer/email/{email}")
    public ResponseEntity<?> getOrdersByCustomerEmail(@PathVariable String email) {
        try {
            List<Order> orders = orderService.getOrdersByCustomerEmail(email);
            return ResponseEntity.ok(orders);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Orders for the specified customer email not found.");
        }
    }
}

