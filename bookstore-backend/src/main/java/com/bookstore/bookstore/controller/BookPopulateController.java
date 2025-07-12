package com.bookstore.bookstore.controller;

import com.bookstore.bookstore.api.GoogleBooksApiService;
import com.bookstore.bookstore.service.BookService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;
import org.slf4j.Logger; 
import org.slf4j.LoggerFactory; 
import org.springframework.security.core.Authentication; 
import org.springframework.security.core.context.SecurityContextHolder; 


@RestController
@RequestMapping("/api/admin/books")
public class BookPopulateController {

    private static final Logger logger = LoggerFactory.getLogger(BookPopulateController.class); 

    private final GoogleBooksApiService googleBooksApiService;
    private final BookService bookService;

    public BookPopulateController(GoogleBooksApiService googleBooksApiService, BookService bookService) {
        this.googleBooksApiService = googleBooksApiService;
        this.bookService = bookService;
    }

    @PostMapping("/populate")
    public Mono<ResponseEntity<String>> populateBooks(
            @RequestParam(defaultValue = "programming") String query,
            @RequestParam(defaultValue = "20") int maxResults) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            logger.info("BookPopulateController received request from user: {} with authorities: {}",
                        authentication.getName(), authentication.getAuthorities());
        } else {
            logger.warn("BookPopulateController received request from an UNATHENTICATED user.");
        }
        if (maxResults > 40) {
            maxResults = 40;
        }

        return googleBooksApiService.searchBooks(query, maxResults)
                .flatMap(books -> {
                    if (books.isEmpty()) {
                        return Mono.just(ResponseEntity.ok("No books found for the given query, or an error occurred."));
                    }
                    books.forEach(bookService::addBook);
                    return Mono.just(ResponseEntity.ok(books.size() + " books populated successfully."));
                })
                .onErrorResume(e -> Mono.just(ResponseEntity.internalServerError().body("Error populating books: " + e.getMessage())));
    }
}