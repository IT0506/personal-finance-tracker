package transactionservice.service;

import org.springframework.stereotype.Service;
import transactionservice.entity.Goal;
import transactionservice.repository.GoalRepository;

import java.util.List;

@Service
public class GoalService {

    private final GoalRepository repo;

    public GoalService(GoalRepository repo) {
        this.repo = repo;
    }

    public Goal addGoal(Goal goal) {
        return repo.save(goal);
    }

    public List<Goal> getGoals(Long userId) {
        return repo.findByUserId(userId);
    }

    public void deleteGoal(Long id) {
        repo.deleteById(id);
    }
}