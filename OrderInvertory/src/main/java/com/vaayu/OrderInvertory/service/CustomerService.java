package com.vaayu.OrderInvertory.service;

import com.vaayu.OrderInvertory.dto.CustomerWithOrdersDTO;
import com.vaayu.OrderInvertory.dto.CustomerWithShipmentsDTO;
import com.vaayu.OrderInvertory.dto.ShipmentStatusCountDTO;
import com.vaayu.OrderInvertory.entity.Customer;
import com.vaayu.OrderInvertory.entity.Order;
import com.vaayu.OrderInvertory.entity.Shipment;
import com.vaayu.OrderInvertory.repository.CustomerRepository;
import com.vaayu.OrderInvertory.repository.OrderRepository;
import com.vaayu.OrderInvertory.repository.ShipmentRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class CustomerService {
    @Autowired
    private CustomerRepository customerRepository;
    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private ShipmentRepository shipmentRepository;

    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    public Customer addCustomer(Customer customer) {
        return customerRepository.save(customer);
    }

    public Customer updateCustomer(Customer customer) {
        if (customer.getCustomerId() == null || !customerRepository.existsById(customer.getCustomerId())) {
            throw new IllegalArgumentException("Invalid request. Please provide valid customer data for updating.");
        }
        return customerRepository.save(customer);
    }

    public void deleteCustomer(Integer customerId) {
        if (customerId == null || !customerRepository.existsById(customerId)) {
            throw new IllegalArgumentException("Invalid request. Please provide valid customer ID for deletion.");
        }
        customerRepository.deleteById(customerId);
    }

    public List<Customer> searchByEmail(String email) {
        List<Customer> customers = customerRepository.findByEmailAddressContainingIgnoreCase(email);
        if (customers.isEmpty()) {
            throw new NoSuchElementException("Customer with the provided email ID not found.");
        }
        return customers;
    }

    public List<Customer> searchByName(String name) {
        List<Customer> customers = customerRepository.findByFullNameContainingIgnoreCase(name);
        if (customers.isEmpty()) {
            throw new NoSuchElementException("Customer with the provided name wildcard not found.");
        }
        return customers;
    }

    public List<ShipmentStatusCountDTO> getShipmentStatusCount() {
        List<Shipment> shipments = shipmentRepository.findAll();
        Map<String, Long> statusCount = shipments.stream()
                .collect(Collectors.groupingBy(Shipment::getShipmentStatus, Collectors.mapping(Shipment::getCustomerId, Collectors.toSet())))
                .entrySet().stream()
                .collect(Collectors.toMap(Map.Entry::getKey, e -> (long) e.getValue().size()));
        return statusCount.entrySet().stream()
                .map(e -> new ShipmentStatusCountDTO(e.getKey(), e.getValue()))
                .collect(Collectors.toList());
    }

    public CustomerWithOrdersDTO getCustomerWithOrders(Integer customerId) {
        Optional<Customer> customerOpt = customerRepository.findById(customerId);
        if (customerOpt.isEmpty()) {
            throw new NoSuchElementException("Orders for the specified customer ID not found.");
        }
        List<Order> orders = orderRepository.findByCustomerId(customerId);
        return new CustomerWithOrdersDTO(customerOpt.get(), orders);
    }

    public CustomerWithShipmentsDTO getCustomerWithShipments(Integer customerId) {
        Optional<Customer> customerOpt = customerRepository.findById(customerId);
        if (customerOpt.isEmpty()) {
            throw new NoSuchElementException("Shipment history for the specified customer ID not found.");
        }
        List<Shipment> shipments = shipmentRepository.findByCustomerId(customerId);
        return new CustomerWithShipmentsDTO(customerOpt.get(), shipments);
    }

    public List<Customer> getCustomersWithPendingShipments() {
        return customerRepository.findCustomersWithPendingShipments();
    }

    public List<Customer> getCustomersWithCompletedOrders() {
        return customerRepository.findCustomersWithCompletedOrders();
    }

    public List<Customer> getCustomersWithOverdueShipments() {
        return customerRepository.findCustomersWithOverdueShipments();
    }

    public List<Customer> getCustomersByOrderQuantityRange(int min, int max) {
        if (min < 0 || max < 0 || min > max) {
            throw new IllegalArgumentException("Invalid request. Please provide valid minimum and maximum quantities for orders.");
        }
        return customerRepository.findCustomersByOrderQuantityRange(min, max);
    }
}

