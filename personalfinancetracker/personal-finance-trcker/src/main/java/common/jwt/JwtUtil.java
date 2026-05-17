// common/jwt/JwtUtil.java
package common.jwt;

import java.nio.charset.StandardCharsets;
import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.stereotype.Component;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtil {

    // Secret key must be at least 32 characters long for HS256
    private static final String SECRET_KEY =
            "mySuperSecretKeyForJwtGeneration1234567890";

    // Token validity: 24 hours
    private static final long EXPIRATION_TIME = 1000 * 60 * 60 * 24;

    private final SecretKey key = Keys.hmacShaKeyFor(
            SECRET_KEY.getBytes(StandardCharsets.UTF_8)
    );

    /**
     * Generates JWT token using the given subject (email/username).
     *
     * Example:
     * String token = jwtUtil.generateToken("user@gmail.com");
     */
    public String generateToken(String subject) {
        return Jwts.builder()
                .setSubject(subject)
                .setIssuedAt(new Date())
                .setExpiration(
                        new Date(System.currentTimeMillis() + EXPIRATION_TIME)
                )
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    /**
     * Extracts username/email from JWT token.
     */
    public String extractUsername(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    /**
     * Validates token signature and expiration.
     */
    public boolean validateToken(String token) {
        try {
            extractUsername(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}