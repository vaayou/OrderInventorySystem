// Explanation: Add a global CORS configuration for the Spring Boot backend. This registers CORS for /** and allows localhost origins on any port.
package com.vaayu.OrderInvertory.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // Allow CORS for all endpoints so frontend can call /api/** or /v1/** directly
        registry.addMapping("/**")
                // allow localhost on any port (vite/react dev servers) and 127.0.0.1
                .allowedOriginPatterns("http://localhost:*", "http://127.0.0.1:*", "https://localhost:*")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }
}
