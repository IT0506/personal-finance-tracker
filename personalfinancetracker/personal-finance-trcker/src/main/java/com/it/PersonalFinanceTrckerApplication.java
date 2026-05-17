package com.it;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.boot.autoconfigure.domain.EntityScan;

@SpringBootApplication(
    scanBasePackages = {
        "com.it",
        "authservice",
        "transactionservice",
        "common",
        "apigateway"
    }
)
@EnableJpaRepositories(basePackages = {
    "authservice.repository",
    "transactionservice.repository"
})
@EntityScan(basePackages = {
    "authservice.entity",
    "transactionservice.entity"
})
public class PersonalFinanceTrckerApplication {

    public static void main(String[] args) {
        SpringApplication.run(PersonalFinanceTrckerApplication.class, args);
    }
}