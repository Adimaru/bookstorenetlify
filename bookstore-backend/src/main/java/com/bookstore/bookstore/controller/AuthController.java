package com.bookstore.bookstore.controller;

import com.bookstore.bookstore.config.JwtUtil;
import com.bookstore.bookstore.model.User;
import com.bookstore.bookstore.service.CustomUserDetailsService;
import com.bookstore.bookstore.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserService userService;

    @PostMapping("/login")
    public ResponseEntity<?> createAuthenticationToken(@RequestBody User authenticationRequest) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(authenticationRequest.getUsername(), authenticationRequest.getPassword())
            );
        } catch (BadCredentialsException e) {
            return new ResponseEntity<>(Collections.singletonMap("message", "Incorrect username or password."), HttpStatus.UNAUTHORIZED);
        } catch (Exception e) {
            return new ResponseEntity<>(Collections.singletonMap("message", "Authentication failed: " + e.getMessage()), HttpStatus.UNAUTHORIZED);
        }

        final UserDetails userDetails = userDetailsService.loadUserByUsername(authenticationRequest.getUsername());
        final String jwt = jwtUtil.generateToken(userDetails);

        Map<String, Object> response = new HashMap<>();
        response.put("jwt", jwt);
        response.put("username", userDetails.getUsername());

        List<String> userRoles;
        if (userDetails instanceof User) {
            userRoles = Collections.singletonList(((User) userDetails).getRole());
        } else {
            userRoles = userDetails.getAuthorities().stream()
                                     .map(grantedAuthority -> grantedAuthority.getAuthority())
                                     .collect(Collectors.toList());
        }
        response.put("roles", userRoles);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

 
    @PostMapping("/register") 
    public ResponseEntity<String> registerUser(@RequestBody User user) {
        try {
            userService.registerUser(user); 
            return new ResponseEntity<>("User registered successfully!", HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.CONFLICT);
        } catch (Exception e) {
            return new ResponseEntity<>("Registration failed: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}