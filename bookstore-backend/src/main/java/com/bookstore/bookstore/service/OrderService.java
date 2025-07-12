package com.bookstore.bookstore.service;

import com.bookstore.bookstore.exception.ResourceNotFoundException;
import com.bookstore.bookstore.model.Book;
import com.bookstore.bookstore.model.CartItem;
import com.bookstore.bookstore.model.Order;
import com.bookstore.bookstore.model.Order.OrderStatus;
import com.bookstore.bookstore.model.OrderItem;
import com.bookstore.bookstore.model.User;
import com.bookstore.bookstore.repository.BookRepository;
import com.bookstore.bookstore.repository.OrderRepository;
import com.bookstore.bookstore.repository.OrderItemRepository; 
import com.bookstore.bookstore.repository.UserRepository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private OrderItemRepository orderItemRepository;
    @Autowired
    private BookRepository bookRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private CartService cartService; 

    @Transactional
    public Order placeOrder(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
        List<CartItem> cartItems = cartService.getUserCart(user);

        if (cartItems.isEmpty()) {
            throw new IllegalStateException("Cannot place an order with an empty cart.");
        }

        BigDecimal totalOrderPrice = BigDecimal.ZERO;

        Order order = new Order();
        order.setUser(user);
        order.setOrderDate(LocalDateTime.now());
        order.setStatus(OrderStatus.PENDING);

        for (CartItem cartItem : cartItems) {
            Book book = cartItem.getBook();
            if (book == null) {
                throw new ResourceNotFoundException("Book not found for cart item ID: " + cartItem.getId() + ". Cart data inconsistency.");
            }
            OrderItem orderItem = new OrderItem();
            orderItem.setBook(book); 
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setPriceAtPurchase(book.getPrice()); 
            order.addOrderItem(orderItem); 
            totalOrderPrice = totalOrderPrice.add(book.getPrice().multiply(BigDecimal.valueOf(cartItem.getQuantity())));
        }
        order.setTotalAmount(totalOrderPrice);
        Order savedOrder = orderRepository.save(order);
        cartService.clearCart(user);
        return savedOrder;
    }

    @Transactional(readOnly = true)
    public List<Order> getUserOrders(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        List<Order> orders = orderRepository.findByUser(user);
        return orders;
    }

    @Transactional(readOnly = true)
    public Order getOrderById(String username, Long orderId) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        Order order = orderRepository.findByIdAndUser(orderId, user)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with ID: " + orderId + " or not belonging to user."));
        return order;
    }
}