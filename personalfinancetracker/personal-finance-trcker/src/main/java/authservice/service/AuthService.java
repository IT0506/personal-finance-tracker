package authservice.service;

import java.sql.Timestamp;
import java.util.Optional;

import org.springframework.stereotype.Service;

import authservice.dto.AuthRequest;
import authservice.dto.AuthResponse;
import authservice.dto.RegisterRequest;
import authservice.entity.User;
import authservice.repository.UserRepository;
import common.jwt.JwtUtil;

@Service
public class AuthService {

    private final UserRepository repo;
    private final JwtUtil jwtUtil;

    public AuthService(UserRepository repo, JwtUtil jwtUtil) {
        this.repo = repo;
        this.jwtUtil = jwtUtil;
    }

    /**
     * Register a new user
     */
    public User register(RegisterRequest request) {

        // Check if email already exists
        Optional<User> existing = repo.findByEmail(request.getEmail());

        if (existing.isPresent()) {
            throw new RuntimeException("Email already registered");
        }

        // Create new User object
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword()); // In production, hash the password
        user.setRole("USER");
        user.setCreatedAt(new Timestamp(System.currentTimeMillis()));

        // Save and return user
        return repo.save(user);
    }

    /**
     * Login existing user
     */
    public AuthResponse login(AuthRequest request) {

    // Validate request
    if (request == null ||
        request.getEmail() == null ||
        request.getPassword() == null) {
        throw new RuntimeException("Email and password are required");
    }

    // Find user
    User user = repo.findByEmail(request.getEmail().trim())
            .orElseThrow(() -> new RuntimeException("User not found"));

    // Validate password
    if (!user.getPassword().equals(request.getPassword())) {
        throw new RuntimeException("Invalid password");
    }

    // Generate JWT token
    String token = jwtUtil.generateToken(user.getEmail());

    // Return response
    return new AuthResponse(token, user.getUserId());
}
}
