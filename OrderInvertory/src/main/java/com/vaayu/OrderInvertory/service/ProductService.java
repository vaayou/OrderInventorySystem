package com.vaayu.OrderInvertory.service;

import com.vaayu.OrderInvertory.entity.Product;
import com.vaayu.OrderInvertory.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.util.List;
import java.util.NoSuchElementException;

@Service
public class ProductService {
    @Autowired
    private ProductRepository productRepository;

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product addProduct(Product product) {
        if (product == null || product.getProductName() == null || product.getUnitPrice() == null) {
            throw new IllegalArgumentException("Invalid request. Please provide valid product data for creation.");
        }
        return productRepository.save(product);
    }

    public Product updateProduct(Product product) {
        if (product == null || product.getProductId() == null || !productRepository.existsById(product.getProductId())) {
            throw new IllegalArgumentException("Invalid request. Please provide valid product data for updating.");
        }
        return productRepository.save(product);
    }

    public void deleteProduct(Integer id) {
        if (id == null || !productRepository.existsById(id)) {
            throw new NoSuchElementException("Product with the specified ID not found for deletion.");
        }
        productRepository.deleteById(id);
    }

    public List<Product> searchByProductName(String productName) {
        List<Product> products = productRepository.findByProductNameContainingIgnoreCase(productName);
        if (products.isEmpty()) {
            throw new NoSuchElementException("Product(s) with the specified name not found.");
        }
        return products;
    }

    public List<Product> searchByBrand(String brand) {
        List<Product> products = productRepository.findByBrandIgnoreCase(brand);
        if (products.isEmpty()) {
            throw new NoSuchElementException("Products with the specified brand not found.");
        }
        return products;
    }

    public List<Product> searchByColour(String colour) {
        List<Product> products = productRepository.findByColourIgnoreCase(colour);
        if (products.isEmpty()) {
            throw new NoSuchElementException("Products with the specified color not found.");
        }
        return products;
    }

    public List<Product> searchByUnitPriceRange(BigDecimal min, BigDecimal max) {
        if (min == null || max == null || min.compareTo(BigDecimal.ZERO) < 0 || max.compareTo(BigDecimal.ZERO) < 0 || min.compareTo(max) > 0) {
            throw new IllegalArgumentException("Invalid request. Please provide valid minimum and maximum unit prices.");
        }
        return productRepository.findByUnitPriceBetween(min, max);
    }

    public List<Product> getProductsSortedByField(String field) {
        try {
            return productRepository.findAll(Sort.by(field));
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid request. Please provide a valid field for sorting.");
        }
    }
}

