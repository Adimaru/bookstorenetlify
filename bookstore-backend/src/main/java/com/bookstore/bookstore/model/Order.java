package com.bookstore.bookstore.model;

import com.fasterxml.jackson.annotation.JsonManagedReference; 
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal; 
import java.time.LocalDateTime;
import java.util.ArrayList; 
import java.util.List; 

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "orders") 
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

   
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private LocalDateTime orderDate; 
    @Column(nullable = false, precision = 10, scale = 2) 
    private BigDecimal totalAmount; 

    @Enumerated(EnumType.STRING) 
    @Column(nullable = false)
    private OrderStatus status; 

    @JsonManagedReference
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> orderItems = new ArrayList<>(); 

    public enum OrderStatus {
        PENDING,
        COMPLETED,
        CANCELLED,
        SHIPPED
    }

    public void addOrderItem(OrderItem orderItem) {
        if (this.orderItems == null) {
            this.orderItems = new ArrayList<>();
        }
        this.orderItems.add(orderItem);
        orderItem.setOrder(this);
    }
}