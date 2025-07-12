package com.bookstore.bookstore.payload.response;

import com.bookstore.bookstore.model.OrderItem;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal; 

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemResponse {
    private Long id;
    private Long bookId;
    private String bookTitle;
    private String bookAuthor;   
    private String bookImageUrl; 
    private Integer quantity;
    private BigDecimal priceAtPurchase; 
    private BigDecimal subtotal; 

    public OrderItemResponse(OrderItem orderItem) {
        this.id = orderItem.getId();
        this.bookId = orderItem.getBook().getId();
        this.bookTitle = orderItem.getBook().getTitle();
        this.bookAuthor = orderItem.getBook().getAuthor(); 
        this.bookImageUrl = orderItem.getBook().getImageUrl(); 
        this.quantity = orderItem.getQuantity();
        this.priceAtPurchase = orderItem.getPriceAtPurchase();
        this.subtotal = orderItem.getPriceAtPurchase().multiply(BigDecimal.valueOf(orderItem.getQuantity()));
    }
}