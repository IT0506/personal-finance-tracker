package transactionservice.dto;


import java.time.LocalDate;

public class TransactionDTO {

 private Long id;
 private Long userId;
 private String type; // INCOME / EXPENSE
 private Double amount;
 private String category;
 private String description;
 private LocalDate txnDate;

 public TransactionDTO() {
 }

 public TransactionDTO(Long id, Long userId, String type, Double amount,
                       String category, String description, LocalDate txnDate) {
     this.id = id;
     this.userId = userId;
     this.type = type;
     this.amount = amount;
     this.category = category;
     this.description = description;
     this.txnDate = txnDate;
 }

 public Long getId() {
     return id;
 }

 public void setId(Long id) {
     this.id = id;
 }

 public Long getUserId() {
     return userId;
 }

 public void setUserId(Long userId) {
     this.userId = userId;
 }

 public String getType() {
     return type;
 }

 public void setType(String type) {
     this.type = type;
 }

 public Double getAmount() {
     return amount;
 }

 public void setAmount(Double amount) {
     this.amount = amount;
 }

 public String getCategory() {
     return category;
 }

 public void setCategory(String category) {
     this.category = category;
 }

 public String getDescription() {
     return description;
 }

 public void setDescription(String description) {
     this.description = description;
 }

 public LocalDate getTxnDate() {
     return txnDate;
 }

 public void setTxnDate(LocalDate txnDate) {
     this.txnDate = txnDate;
 }
}
