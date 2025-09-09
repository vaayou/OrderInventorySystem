package com.vaayu.OrderInvertory.controller;

import com.vaayu.OrderInvertory.entity.Product;
import com.vaayu.OrderInvertory.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.util.List;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/api/v1/products")
public class ProductController {
    @Autowired
    private ProductService productService;

    @GetMapping
    public ResponseEntity<?> getAllProducts() {
        try {
            List<Product> products = productService.getAllProducts();
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An internal server error occurred while fetching all products.");
        }
    }

    @PostMapping
    public ResponseEntity<?> addProduct(@RequestBody Product product) {
        try {
            productService.addProduct(product);
            return ResponseEntity.ok("Record Created Successfully");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Invalid request. Please provide valid product data for creation.");
        }
    }

    @PutMapping
    public ResponseEntity<?> updateProduct(@RequestBody Product product) {
        try {
            productService.updateProduct(product);
            return ResponseEntity.ok("Record Updated Successfully");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Invalid request. Please provide valid product data for updating.");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Integer id) {
        try {
            productService.deleteProduct(id);
            return ResponseEntity.ok("Record deleted Successfully");
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Product with the specified ID not found for deletion.");
        }
    }

    @GetMapping("/name/{productname}")
    public ResponseEntity<?> searchByProductName(@PathVariable String productname) {
        try {
            return ResponseEntity.ok(productService.searchByProductName(productname));
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Product(s) with the specified name not found.");
        }
    }

    @GetMapping("/brand/{brand}")
    public ResponseEntity<?> searchByBrand(@PathVariable String brand) {
        try {
            return ResponseEntity.ok(productService.searchByBrand(brand));
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Products with the specified brand not found.");
        }
    }

    @GetMapping("/colour/{colour}")
    public ResponseEntity<?> searchByColour(@PathVariable String colour) {
        try {
            return ResponseEntity.ok(productService.searchByColour(colour));
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Products with the specified color not found.");
        }
    }

    @GetMapping("/unitprice")
    public ResponseEntity<?> searchByUnitPriceRange(@RequestParam BigDecimal min, @RequestParam BigDecimal max) {
        try {
            return ResponseEntity.ok(productService.searchByUnitPriceRange(min, max));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Invalid request. Please provide valid minimum and maximum unit prices.");
        }
    }

    @GetMapping("/sort")
    public ResponseEntity<?> getProductsSortedByField(@RequestParam String field) {
        try {
            return ResponseEntity.ok(productService.getProductsSortedByField(field));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Invalid request. Please provide a valid field for sorting.");
        }
    }
}

