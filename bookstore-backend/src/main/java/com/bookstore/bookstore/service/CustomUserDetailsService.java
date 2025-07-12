package com.bookstore.bookstore.service; // It's common to place this in service or a dedicated security package

import com.bookstore.bookstore.model.User; // Your User entity
import com.bookstore.bookstore.repository.UserRepository; // Your UserRepository
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.security.core.authority.SimpleGrantedAuthority; // For roles/authorities
import java.util.Collections; // For Collections.singletonList


@Service // Marks this as a Spring Service component
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User loadUserEntityByUsername(String username) {
    return userRepository.findByUsername(username)
                         .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // Find the user by username in your database
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));

        // Convert your User entity to Spring Security's UserDetails object
        // NOW, instead of a default "ROLE_USER", we use the actual role stored in your User model.
        // This 'role' field was added to the User.java entity in a previous step.
        return new org.springframework.security.core.userdetails.User(
                user.getUsername(),                  // Username
                user.getPassword(),                  // Hashed password
                Collections.singletonList(new SimpleGrantedAuthority(user.getRole())) // <--- CHANGED: Use the role from the user object
        );
    }
}