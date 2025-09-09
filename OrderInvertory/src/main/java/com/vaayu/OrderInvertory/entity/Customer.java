package com.vaayu.OrderInvertory.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "customers", uniqueConstraints = {
    @UniqueConstraint(name = "customers_email_u", columnNames = "email_address")
})
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "customer_id")
    private Integer customerId;

    @Column(name = "email_address", nullable = false, length = 255, unique = true)
    private String emailAddress;

    @Column(name = "full_name", nullable = false, length = 255)
    private String fullName;

    // Lombok will generate getters and setters
}
