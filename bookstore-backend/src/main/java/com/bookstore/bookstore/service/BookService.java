package com.bookstore.bookstore.service;

import com.bookstore.bookstore.model.Book;
import com.bookstore.bookstore.repository.BookRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import com.bookstore.bookstore.api.GoogleBooksApiService; 
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.transaction.annotation.Transactional;


@Service
public class BookService {

    private static final Logger logger = LoggerFactory.getLogger(BookService.class); 
    private final BookRepository bookRepository;
    private final GoogleBooksApiService googleBooksApiService; 

    public BookService(BookRepository bookRepository, GoogleBooksApiService googleBooksApiService) { 
        this.bookRepository = bookRepository;
        this.googleBooksApiService = googleBooksApiService; 
    }

    public List<Book> getAllBooks() {
        return bookRepository.findAll();
    }

    public Optional<Book> getBookById(Long id) {
        return bookRepository.findById(id);
    }

    public Book addBook(Book book) {
        return bookRepository.save(book);
    }

    public Book updateBook(Long id, Book updatedBook) {
        Optional<Book> existingBookOptional = bookRepository.findById(id);
        if (existingBookOptional.isPresent()) {
            Book existingBook = existingBookOptional.get();
            existingBook.setTitle(updatedBook.getTitle());
            existingBook.setAuthor(updatedBook.getAuthor());
            existingBook.setDescription(updatedBook.getDescription());
            existingBook.setPrice(updatedBook.getPrice());
            existingBook.setQuantity(updatedBook.getQuantity());
            existingBook.setImageUrl(updatedBook.getImageUrl());
            return bookRepository.save(existingBook);
        } else {
            throw new RuntimeException("Book with ID " + id + " not found.");
        }
    }

    public void deleteBook(Long id) {
        bookRepository.deleteById(id);
    }

    public Book updateBookQuantity(Long id, int quantityChange) {
        Optional<Book> bookOptional = bookRepository.findById(id);
        if (bookOptional.isPresent()) {
            Book book = bookOptional.get();
            int newQuantity = book.getQuantity() + quantityChange;
            if (newQuantity < 0) {
                throw new IllegalArgumentException("Not enough stock for book ID: " + id);
            }
            book.setQuantity(newQuantity);
            return bookRepository.save(book);
        } else {
            throw new RuntimeException("Book with ID " + id + " not found.");
        }
    }

    @Transactional
    public void populateBooks(String query, int maxResults) {
        logger.info("Calling Google Books API to populate books with query: '{}', maxResults: {}", query, maxResults);
        googleBooksApiService.fetchAndSaveBooks(query, maxResults);
        logger.info("Finished populating books.");
    }

    public long countBooks() {
        return bookRepository.count();
    }

}