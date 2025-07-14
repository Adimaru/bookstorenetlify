package com.bookstore.bookstore.api;

import com.bookstore.bookstore.model.Book;
import com.bookstore.bookstore.repository.BookRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import com.fasterxml.jackson.databind.JsonNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.time.Duration;
import java.math.BigDecimal;
import io.netty.channel.ChannelOption; // Added import
import io.netty.handler.timeout.ReadTimeoutHandler; // Added import
import io.netty.handler.timeout.WriteTimeoutHandler; // Added import
import org.springframework.http.client.reactive.ReactorClientHttpConnector; // Added import
import reactor.netty.http.client.HttpClient; // Added import

@Service
public class GoogleBooksApiService {
    private static final Logger logger = LoggerFactory.getLogger(GoogleBooksApiService.class);
    private final WebClient webClient;
    private final BookRepository bookRepository;

    private static final String GOOGLE_BOOKS_API_BASE_URL = "https://www.googleapis.com/books/v1/";

    public GoogleBooksApiService(WebClient.Builder webClientBuilder, BookRepository bookRepository) {
        this.bookRepository = bookRepository;

        // MODIFIED: Configure HttpClient with increased timeouts
        HttpClient httpClient = HttpClient.create()
            .option(ChannelOption.CONNECT_TIMEOUT_MILLIS, 20000) // Connection timeout 20 seconds
            .doOnConnected(conn -> conn
                .addHandlerLast(new ReadTimeoutHandler(20)) // Read timeout 20 seconds
                .addHandlerLast(new WriteTimeoutHandler(20))); // Write timeout 20 seconds

        this.webClient = webClientBuilder
            .baseUrl(GOOGLE_BOOKS_API_BASE_URL)
            .clientConnector(new ReactorClientHttpConnector(httpClient)) // Use the configured HttpClient
            .build();
    }

    public void fetchAndSaveBooks(String query, int maxResults) {
        if (maxResults > 40) {
            maxResults = 40;
            logger.warn("Google Books API maxResults limit is 40. Adjusted to 40.");
        }

        logger.info("Attempting to fetch and save books for query: '{}', maxResults: {}", query, maxResults);

        try {
            // The block timeout here should ideally be greater than or equal to the WebClient's internal timeouts
            List<Book> fetchedBooks = searchBooks(query, maxResults)
                                                .block(Duration.ofSeconds(25)); // Increased block timeout to 25s

            if (fetchedBooks != null && !fetchedBooks.isEmpty()) {
                logger.info("Fetched {} books from Google Books API.", fetchedBooks.size());
                bookRepository.saveAll(fetchedBooks);
                logger.info("Successfully saved {} books to the database.", fetchedBooks.size());
            } else {
                logger.warn("No books fetched or parsed from Google Books API for query: {}", query);
            }
        } catch (Exception e) {
            logger.error("Error during fetching and saving books from Google Books API for query '{}': {}", query, e.getMessage(), e);
        }
    }

    public Mono<List<Book>> searchBooks(String query, int maxResults) {
        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("volumes")
                        .queryParam("q", query)
                        .queryParam("maxResults", maxResults)
                        .build())
                .retrieve()
                .bodyToMono(JsonNode.class)
                .map(this::parseBooksFromJson)
                .doOnError(e -> logger.error("Error during Google Books API search for query '{}': {}", query, e.getMessage(), e));
    }

    private List<Book> parseBooksFromJson(JsonNode rootNode) {
        List<Book> books = new ArrayList<>();
        if (rootNode.has("items")) {
            for (JsonNode itemNode : rootNode.get("items")) {
                JsonNode volumeInfo = itemNode.get("volumeInfo");
                JsonNode saleInfo = itemNode.get("saleInfo");

                if (volumeInfo != null) {
                    String title = Optional.ofNullable(volumeInfo.get("title")).map(JsonNode::asText).orElse("Unknown Title");
                    String author = "Unknown Author";
                    if (volumeInfo.has("authors") && volumeInfo.get("authors").isArray() && volumeInfo.get("authors").size() > 0) {
                        author = volumeInfo.get("authors").get(0).asText();
                    }
                    String description = Optional.ofNullable(volumeInfo.get("description")).map(JsonNode::asText).orElse("No description available.");
                    String imageUrl = Optional.ofNullable(volumeInfo.get("imageLinks"))
                                             .map(links -> links.get("thumbnail"))
                                             .map(JsonNode::asText)
                                             .orElse(null);

                    BigDecimal price = new BigDecimal("19.99");

                    if (saleInfo != null && saleInfo.has("saleability") && "FOR_SALE".equals(saleInfo.get("saleability").asText())) {
                        JsonNode listPrice = saleInfo.get("listPrice");
                        if (listPrice != null && listPrice.has("amount")) {
                            price = BigDecimal.valueOf(listPrice.get("amount").asDouble());
                        } else {
                            JsonNode retailPrice = saleInfo.get("retailPrice");
                            if (retailPrice != null && retailPrice.has("amount")) {
                                price = BigDecimal.valueOf(retailPrice.get("amount").asDouble());
                            }
                        }
                    }

                    int quantity = 10;

                    Book book = new Book();
                    book.setTitle(title);
                    book.setAuthor(author);
                    book.setDescription(description.length() > 2000 ? description.substring(0, 1997) + "..." : description);
                    book.setPrice(price);
                    book.setQuantity(quantity);
                    book.setImageUrl(imageUrl);

                    books.add(book);
                }
            }
        }
        return books;
    }
}