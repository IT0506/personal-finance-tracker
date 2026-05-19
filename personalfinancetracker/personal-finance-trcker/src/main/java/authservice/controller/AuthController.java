package authservice.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import authservice.dto.AuthRequest;
import authservice.dto.AuthResponse;
import authservice.dto.RegisterRequest;
import authservice.service.AuthService;

@RestController
@RequestMapping("/auth")
@CrossOrigin("*")
public class AuthController {

    private final AuthService service;

    public AuthController(AuthService service) {
        this.service = service;
    }

    // Register new user
    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterRequest request) {
        service.register(request);
        return ResponseEntity.ok("Registration successful");
    }

    // Login existing user
    @PostMapping("/login")
public ResponseEntity<?> login(@RequestBody AuthRequest request) {
    try {
        AuthResponse response = service.login(request);
        return ResponseEntity.ok(response);
    } catch (Exception e) {
        e.printStackTrace(); // Shows exact issue in Render logs
        return ResponseEntity
                .status(401)
                .body(e.getMessage());
    }
}
}
