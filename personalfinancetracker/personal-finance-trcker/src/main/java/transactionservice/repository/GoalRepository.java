package transactionservice.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import transactionservice.entity.Goal;

public interface GoalRepository extends JpaRepository<Goal, Long> {
    List<Goal> findByUserId(Long userId);
}