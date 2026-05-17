package transactionservice.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "goals")
public class Goal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;

    private String title;

    private Double targetAmount;

    private Double currentAmount = 0.0;

    private LocalDate deadline;

    public Goal() {}

    // getters & setters
}