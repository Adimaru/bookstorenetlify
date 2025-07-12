package com.bookstore.bookstore.config;

import com.bookstore.bookstore.model.User;
import com.bookstore.bookstore.repository.UserRepository;
import com.bookstore.bookstore.service.BookService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.slf4j.Logger; 
import org.slf4j.LoggerFactory; 

@Configuration
public class DataInitializer {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);
    @Bean
    public CommandLineRunner initDatabase(UserRepository userRepository, PasswordEncoder passwordEncoder,
                                          BookService bookService) {
        return args -> {
            logger.info("Checking database for initial data...");

            // --- 1. Create Default Admin User (if not exists) ---
            if (userRepository.findByUsername("admin").isEmpty()) {
                User adminUser = new User();
                adminUser.setUsername("admin");
                adminUser.setPassword(passwordEncoder.encode("admin")); 
                adminUser.setEmail("admin@bookstore.com");
                adminUser.setRole("ROLE_ADMIN"); 
                userRepository.save(adminUser);
                logger.info("Default admin user 'admin/admin' created."); 
            }

            // --- 2. Create Default Regular User (if not exists) ---
            if (userRepository.findByUsername("user").isEmpty()) {
                User regularUser = new User();
                regularUser.setUsername("user");
                regularUser.setPassword(passwordEncoder.encode("user")); 
                regularUser.setEmail("user@bookstore.com");
                regularUser.setRole("ROLE_USER"); 
                userRepository.save(regularUser);
                logger.info("Default regular user 'user/user' created."); 
            }

            // --- 3. Populate Books (only if the database is empty) ---
            if (bookService.countBooks() == 0) {
                logger.info("No books found in the database. Populating from Google Books API...");
                try {
                    bookService.populateBooks("programming", 30); // 30 books
                    logger.info("Books populated successfully from Google Books API.");
                } catch (Exception e) {
                    logger.error("Failed to populate books on startup: {}", e.getMessage(), e);
                }
            } else {
                logger.info("Books already exist in the database. Skipping population.");
            }
        };
    }
}