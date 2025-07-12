package com.bookstore.bookstore.controller;

import com.bookstore.bookstore.model.CartItem;
import com.bookstore.bookstore.model.User;
import com.bookstore.bookstore.service.CartService;
import com.bookstore.bookstore.service.CustomUserDetailsService;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.bookstore.bookstore.payload.response.MessageResponse;
import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private static final Logger logger = LoggerFactory.getLogger(CartController.class);

    private final CartService cartService;
    private final CustomUserDetailsService customUserDetailsService;

    private User getAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || authentication.getPrincipal().equals("anonymousUser")) {
            logger.warn("Attempted to get authenticated user but no valid authentication found. Throwing exception.");
            throw new IllegalStateException("User not authenticated.");
        }
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        logger.debug("Fetching user entity for username: {}", userDetails.getUsername());
        return customUserDetailsService.loadUserEntityByUsername(userDetails.getUsername());
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CartItemRequest {
        private Long bookId;
        private Integer quantity;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    private static class CartItemDTO {
        private Long id;
        private Long bookId;
        private String bookTitle;
        private String bookAuthor;
        private String bookImageUrl;
        private BigDecimal bookPrice;
        private Integer quantity;
        private BigDecimal subtotal;

        public CartItemDTO(CartItem cartItem) {
            this.id = cartItem.getId();
            this.bookId = cartItem.getBook().getId();
            this.bookTitle = cartItem.getBook().getTitle();
            this.bookAuthor = cartItem.getBook().getAuthor();
            this.bookImageUrl = cartItem.getBook().getImageUrl();
            this.bookPrice = cartItem.getBook().getPrice();
            this.quantity = cartItem.getQuantity();
            this.subtotal = cartItem.getBook().getPrice().multiply(BigDecimal.valueOf(cartItem.getQuantity()));
        }
    }

    @PostMapping("/add")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Object> addBookToCart(@RequestBody CartItemRequest request) { 
        logger.info("Received request to add book {} (qty {}) to cart.", request.bookId, request.quantity);
        try {
            User user = getAuthenticatedUser();
            cartService.addBookToCart(user, request.bookId, request.quantity);
            List<CartItem> updatedCartItems = cartService.getUserCart(user);
            List<CartItemDTO> cartItemDTOs = updatedCartItems.stream()
                                                              .map(CartItemDTO::new)
                                                              .collect(Collectors.toList());
            return new ResponseEntity<>(cartItemDTOs, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            logger.error("Error adding book to cart: {}", e.getMessage());
            return new ResponseEntity<>(new MessageResponse(e.getMessage()), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            logger.error("Unexpected error adding book to cart: {}", e.getMessage(), e);
            return new ResponseEntity<>(new MessageResponse("Error adding book to cart: " + e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<CartItemDTO>> getUserCart() {
        logger.info("Received request to get user's cart.");
        try {
            User user = getAuthenticatedUser();
            List<CartItem> cartItems = cartService.getUserCart(user);
            List<CartItemDTO> cartItemDTOs = cartItems.stream()
                                                    .map(CartItemDTO::new)
                                                    .collect(Collectors.toList());
            return ResponseEntity.ok(cartItemDTOs);
        } catch (IllegalStateException e) {
            logger.error("Authentication error getting cart: {}", e.getMessage());
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED); 
        } catch (Exception e) {
            logger.error("Unexpected error getting cart: {}", e.getMessage(), e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR); 
        }
    }

    @PutMapping("/update")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Object> updateCartItemQuantity(@RequestBody CartItemRequest request) { 
        logger.info("Received request to update cart item {} quantity to {}", request.getBookId(), request.getQuantity());
        try {
            User user = getAuthenticatedUser();
            cartService.updateCartItemQuantity(user, request.getBookId(), request.getQuantity());
            List<CartItem> updatedCartItems = cartService.getUserCart(user);
            List<CartItemDTO> cartItemDTOs = updatedCartItems.stream()
                                                              .map(CartItemDTO::new)
                                                              .collect(Collectors.toList());
            return ResponseEntity.ok(cartItemDTOs);
        } catch (RuntimeException e) {
            logger.error("Error updating cart item quantity for {}: {}", request.getBookId(), e.getMessage());
            return new ResponseEntity<>(new MessageResponse(e.getMessage()), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            logger.error("Unexpected error updating cart item quantity: {}", e.getMessage(), e);
            return new ResponseEntity<>(new MessageResponse("Error updating cart item quantity: " + e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/remove/{cartItemId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Object> removeCartItem(@PathVariable Long cartItemId) { 
        logger.info("Received request to remove cart item {}", cartItemId);
        try {
            User user = getAuthenticatedUser();
            cartService.removeCartItem(user, cartItemId);
            List<CartItem> updatedCartItems = cartService.getUserCart(user);
            List<CartItemDTO> cartItemDTOs = updatedCartItems.stream()
                                                              .map(CartItemDTO::new)
                                                              .collect(Collectors.toList());
            return ResponseEntity.ok(cartItemDTOs);
        } catch (RuntimeException e) {
            logger.error("Error removing cart item {}: {}", cartItemId, e.getMessage());
            return new ResponseEntity<>(new MessageResponse(e.getMessage()), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            logger.error("Unexpected error removing cart item: {}", e.getMessage(), e);
            return new ResponseEntity<>(new MessageResponse("Error removing cart item: " + e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/clear")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Object> clearCart() { 
        logger.info("Received request to clear user's cart.");
        try {
            User user = getAuthenticatedUser();
            cartService.clearCart(user);
            return ResponseEntity.ok(Collections.emptyList());
        } catch (Exception e) {
            logger.error("Unexpected error clearing cart: {}", e.getMessage(), e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}