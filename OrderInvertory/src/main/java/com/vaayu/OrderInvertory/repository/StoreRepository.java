package com.vaayu.OrderInvertory.repository;

import com.vaayu.OrderInvertory.entity.Store;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StoreRepository extends JpaRepository<Store, Integer> {
    // JpaRepository provides findById, findAll, etc.
}

