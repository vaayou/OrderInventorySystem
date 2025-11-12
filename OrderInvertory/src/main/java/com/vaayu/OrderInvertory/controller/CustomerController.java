package com.vaayu.OrderInvertory.controller;

import com.vaayu.OrderInvertory.dto.CustomerWithOrdersDTO;
import com.vaayu.OrderInvertory.dto.CustomerWithShipmentsDTO;
import com.vaayu.OrderInvertory.dto.ShipmentStatusCountDTO;
import com.vaayu.OrderInvertory.entity.Customer;
import com.vaayu.OrderInvertory.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.NoSuchElementException;

@RestController
@RequestMapping({"/api/v1/customers", "/v1/customers"})
public class CustomerController {
    @Autowired
    private CustomerService customerService;

    @GetMapping
    public ResponseEntity<?> getAllCustomers() {
        try {
            return ResponseEntity.ok(customerService.getAllCustomers());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An internal server error occurred while fetching customers.");
        }
    }

    @PostMapping
    public ResponseEntity<?> addCustomer(@RequestBody Customer customer) {
        try {
            customerService.addCustomer(customer);
            return ResponseEntity.ok("Record Created Successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Invalid request. Please provide valid customer data.");
        }
    }

    @PutMapping
    public ResponseEntity<?> updateCustomer(@RequestBody Customer customer) {
        try {
            customerService.updateCustomer(customer);
            return ResponseEntity.ok("Record Updated Successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Invalid request. Please provide valid customer data for updating.");
        }
    }

    @DeleteMapping("/{customerId}")
    public ResponseEntity<?> deleteCustomer(@PathVariable Integer customerId) {
        try {
            customerService.deleteCustomer(customerId);
            return ResponseEntity.ok("Record deleted Successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Invalid request. Please provide valid customer ID for deletion.");
        }
    }

    @GetMapping("/{emailId}")
    public ResponseEntity<?> searchByEmail(@PathVariable String emailId) {
        try {
            return ResponseEntity.ok(customerService.searchByEmail(emailId));
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Customer with the provided email ID not found.");
        }
    }

    @GetMapping("/name/{name}")
    public ResponseEntity<?> searchByName(@PathVariable String name) {
        try {
            return ResponseEntity.ok(customerService.searchByName(name));
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Customer with the provided name wildcard not found.");
        }
    }

    @GetMapping("/shipment/status")
    public ResponseEntity<?> getShipmentStatusCount() {
        try {
            return ResponseEntity.ok(customerService.getShipmentStatusCount());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An internal server error occurred while fetching shipment status count.");
        }
    }

    @GetMapping("/{custId}/order")
    public ResponseEntity<?> getCustomerWithOrders(@PathVariable Integer custId) {
        try {
            CustomerWithOrdersDTO dto = customerService.getCustomerWithOrders(custId);
            return ResponseEntity.ok(dto);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Orders for the specified customer ID not found.");
        }
    }

    @GetMapping("/{custId}/shipment")
    public ResponseEntity<?> getCustomerWithShipments(@PathVariable Integer custId) {
        try {
            CustomerWithShipmentsDTO dto = customerService.getCustomerWithShipments(custId);
            return ResponseEntity.ok(dto);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Shipment history for the specified customer ID not found.");
        }
    }

    @GetMapping("/shipments/pending")
    public ResponseEntity<?> getCustomersWithPendingShipments() {
        try {
            return ResponseEntity.ok(customerService.getCustomersWithPendingShipments());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An internal server error occurred while fetching customers with pending shipments.");
        }
    }

    @GetMapping("/orders/completed")
    public ResponseEntity<?> getCustomersWithCompletedOrders() {
        try {
            return ResponseEntity.ok(customerService.getCustomersWithCompletedOrders());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An internal server error occurred while fetching customers with completed orders.");
        }
    }

    @GetMapping("/shipments/overdue")
    public ResponseEntity<?> getCustomersWithOverdueShipments() {
        try {
            return ResponseEntity.ok(customerService.getCustomersWithOverdueShipments());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An internal server error occurred while fetching customers with overdue shipments.");
        }
    }

    @GetMapping("/orders/quantity/{min}/{max}")
    public ResponseEntity<?> getCustomersByOrderQuantityRange(@PathVariable int min, @PathVariable int max) {
        try {
            return ResponseEntity.ok(customerService.getCustomersByOrderQuantityRange(min, max));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Invalid request. Please provide valid minimum and maximum quantities for orders.");
        }
    }
}
