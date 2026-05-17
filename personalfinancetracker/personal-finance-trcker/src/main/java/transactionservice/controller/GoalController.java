package transactionservice.controller;

import org.springframework.web.bind.annotation.*;
import transactionservice.entity.Goal;
import transactionservice.service.GoalService;

import java.util.List;

@RestController
@RequestMapping("/goals")
@CrossOrigin("*")
public class GoalController {

    private final GoalService service;

    public GoalController(GoalService service) {
        this.service = service;
    }

    @PostMapping
    public Goal add(@RequestBody Goal goal) {
        return service.addGoal(goal);
    }

    @GetMapping("/user/{userId}")
    public List<Goal> get(@PathVariable Long userId) {
        return service.getGoals(userId);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.deleteGoal(id);
    }
}