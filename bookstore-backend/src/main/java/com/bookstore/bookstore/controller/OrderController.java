package com.bookstore.bookstore.controller;

import com.bookstore.bookstore.model.Order;
import com.bookstore.bookstore.payload.response.MessageResponse;
import com.bookstore.bookstore.payload.response.OrderResponse;
import com.bookstore.bookstore.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:5173", maxAge = 3600) 
public class OrderController {

    @Autowired 
    private OrderService orderService;
    
    @PostMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')") 
    public ResponseEntity<?> placeOrder() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        try {
            Order newOrder = orderService.placeOrder(username);
            return new ResponseEntity<>(new OrderResponse(newOrder), HttpStatus.CREATED); // 201 Created
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(new MessageResponse(e.getMessage()), HttpStatus.BAD_REQUEST); // 400 Bad Request
        } catch (Exception e) {
            return new ResponseEntity<>(new MessageResponse("Error placing order: " + e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR); // 500 Internal Server Error
        }
    }

    @GetMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<OrderResponse>> getUserOrders() {
        // Get the authenticated username
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        List<Order> orders = orderService.getUserOrders(username); 
        List<OrderResponse> orderDTOs = orders.stream()
                                             .map(OrderResponse::new) 
                                             .collect(Collectors.toList());
        return ResponseEntity.ok(orderDTOs); // 200 OK
    }

    @GetMapping("/{orderId}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> getOrderById(@PathVariable Long orderId) {
        // Get the authenticated username
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        try {
            Order order = orderService.getOrderById(username, orderId); 
            return ResponseEntity.ok(new OrderResponse(order)); // 200 OK
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(new MessageResponse(e.getMessage()), HttpStatus.NOT_FOUND); // 404 Not Found
        } catch (Exception e) {
            return new ResponseEntity<>(new MessageResponse("Error retrieving order: " + e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR); // 500 Internal Server Error
        }
    }
}