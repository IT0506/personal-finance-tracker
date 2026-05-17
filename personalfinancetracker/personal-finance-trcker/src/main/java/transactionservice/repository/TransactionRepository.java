package transactionservice.repository;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import transactionservice.entity.Transaction;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    List<Transaction> findByUserId(Long userId);
}
