package transactionservice.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import transactionservice.entity.Transaction;
import transactionservice.repository.TransactionRepository;

@Service
public class TransactionService {

    private final TransactionRepository repo;

    // Constructor Injection
    public TransactionService(TransactionRepository repo) {
        this.repo = repo;
    }

    /**
     * Add a new transaction
     */
    public Transaction add(Transaction transaction) {
        return repo.save(transaction);
    }

    /**
     * Get all transactions for a specific user
     */
    public List<Transaction> getByUser(Long userId) {
        return repo.findByUserId(userId);
    }

    /**
     * Get transaction by ID
     */
    public Transaction getById(Long id) {
        Optional<Transaction> transaction = repo.findById(id);
        return transaction.orElse(null);
    }

    /**
     * Update an existing transaction
     */
    public Transaction update(Long id, Transaction updatedTransaction) {
        Optional<Transaction> optional = repo.findById(id);

        if (optional.isPresent()) {
            Transaction existing = optional.get();

            existing.setUserId(updatedTransaction.getUserId());
            existing.setType(updatedTransaction.getType());
            existing.setAmount(updatedTransaction.getAmount());
            existing.setCategory(updatedTransaction.getCategory());
            existing.setDescription(updatedTransaction.getDescription());
            existing.setTxnDate(updatedTransaction.getTxnDate());

            return repo.save(existing);
        }

        return null;
    }

    /**
     * Delete transaction by ID
     */
    public void delete(Long id) {
        repo.deleteById(id);
    }

    /**
     * Calculate balance:
     * INCOME  -> add
     * EXPENSE -> subtract
     */
    public Double getBalance(Long userId) {
        List<Transaction> transactions = repo.findByUserId(userId);

        double balance = 0.0;

        for (Transaction transaction : transactions) {
            if ("INCOME".equalsIgnoreCase(transaction.getType())) {
                balance += transaction.getAmount();
            } else if ("EXPENSE".equalsIgnoreCase(transaction.getType())) {
                balance -= transaction.getAmount();
            }
        }

        return balance;
    }
}