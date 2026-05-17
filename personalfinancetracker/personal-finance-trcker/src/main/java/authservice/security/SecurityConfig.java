package authservice.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
	    http
	        .csrf(csrf -> csrf.disable())
	        .authorizeHttpRequests(auth -> auth
	            .requestMatchers(
	                "/",
	                "/index.html",
	                "/register.html",
	                "/dashboard.html",
	                "/css/**",
	                "/js/**",
	                "/auth/**"
	            ).permitAll()
	            .requestMatchers("/api/**").authenticated()
	            .anyRequest().permitAll()
	        )
	        .formLogin(form -> form.disable());

	    return http.build();
	}
}