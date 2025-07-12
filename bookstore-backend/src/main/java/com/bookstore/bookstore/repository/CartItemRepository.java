package com.bookstore.bookstore.repository;

import com.bookstore.bookstore.model.CartItem;
import com.bookstore.bookstore.model.Book;
import com.bookstore.bookstore.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {

    List<CartItem> findByUser(User user);

    Optional<CartItem> findByUserAndBook(User user, Book book);

    @Transactional 
    void deleteByUser(User user);

    @Transactional 
    void deleteByUserAndBook(User user, Book book);
}