package com.bookstore.bookstore.model;

import jakarta.persistence.*; 
import lombok.Data; 
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;

@Entity 
@Table(name = "books") 
@Data 
@NoArgsConstructor 
@AllArgsConstructor
public class Book {

    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY) 
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String author;

    @Column(columnDefinition = "TEXT")
    private String description;

   @Column(nullable = false, precision = 10, scale = 2) 
    private BigDecimal price;
    
    @Column(nullable = false)
    private int quantity; 
    private String imageUrl;
}