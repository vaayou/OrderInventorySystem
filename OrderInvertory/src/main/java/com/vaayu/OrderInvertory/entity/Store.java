package com.vaayu.OrderInvertory.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;
import java.sql.Date;

@Getter
@Setter
@Entity
@Table(name = "stores", uniqueConstraints = {
    @UniqueConstraint(name = "store_name_u", columnNames = "store_name")
})
public class Store {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "store_id")
    private Integer storeId;

    @Column(name = "store_name", nullable = false, length = 255, unique = true)
    private String storeName;

    @Column(name = "web_address", length = 100)
    private String webAddress;

    @Column(name = "physical_address", length = 512)
    private String physicalAddress;

    @Column(name = "latitude", precision = 9, scale = 6)
    private BigDecimal latitude;

    @Column(name = "longitude", precision = 9, scale = 6)
    private BigDecimal longitude;

    @Lob
    @Column(name = "logo")
    private byte[] logo;

    @Column(name = "logo_mime_type", length = 512)
    private String logoMimeType;

    @Column(name = "logo_filename", length = 512)
    private String logoFilename;

    @Column(name = "logo_charset", length = 512)
    private String logoCharset;

    @Column(name = "logo_last_updated")
    private Date logoLastUpdated;

    // Optionally, you can add a @PrePersist/@PreUpdate validation for the at-least-one-address constraint.
}

