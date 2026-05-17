package transactionservice.controller;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lowagie.text.Document;
import com.lowagie.text.Paragraph;
import com.lowagie.text.pdf.PdfWriter;

import jakarta.servlet.http.HttpServletResponse;
import transactionservice.entity.Transaction;
import transactionservice.service.TransactionService;

@RestController
@RequestMapping("/transactions")
@CrossOrigin("*")
public class TransactionController {

    private final TransactionService service;

    public TransactionController(TransactionService service) {
        this.service = service;
    }

    // =========================
    // Add Transaction
    // POST /transactions
    // =========================
    @PostMapping
    public ResponseEntity<Transaction> add(
            @RequestBody Transaction transaction) {

        Transaction savedTransaction = service.add(transaction);
        return ResponseEntity.ok(savedTransaction);
    }

    // =========================
    // Get Transactions by User
    // GET /transactions/user/{userId}
    // =========================
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Transaction>> getByUser(
            @PathVariable Long userId) {

        List<Transaction> transactions = service.getByUser(userId);
        return ResponseEntity.ok(transactions);
    }

    // =========================
    // Get Balance
    // GET /transactions/balance/{userId}
    // =========================
    @GetMapping("/balance/{userId}")
    public ResponseEntity<Double> balance(
            @PathVariable Long userId) {

        Double balance = service.getBalance(userId);
        return ResponseEntity.ok(balance);
    }

    // =========================
    // Delete Transaction
    // DELETE /transactions/{id}
    // =========================
    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(
            @PathVariable Long id) {

        service.delete(id);
        return ResponseEntity.ok("Transaction deleted successfully");
    }

    // =========================
    // Export Transactions to CSV
    // GET /transactions/export/csv/{userId}
    // =========================
    @GetMapping("/export/csv/{userId}")
    public void exportCsv(
            @PathVariable Long userId,
            HttpServletResponse response) throws IOException {

        response.setContentType("text/csv");
        response.setHeader(
                "Content-Disposition",
                "attachment; filename=transactions.csv"
        );

        List<Transaction> transactions = service.getByUser(userId);

        PrintWriter writer = response.getWriter();

        // CSV Header
        writer.println("Date,Type,Amount,Category,Description");

        // CSV Data
        for (Transaction t : transactions) {
            writer.printf(
                    "%s,%s,%s,%s,%s%n",
                    t.getTxnDate(),
                    t.getType(),
                    t.getAmount(),
                    t.getCategory(),
                    t.getDescription() == null ? "" : t.getDescription()
            );
        }

        writer.flush();
        writer.close();
    }

    // =========================
    // Export Transactions to PDF
    // GET /transactions/export/pdf/{userId}
    // =========================
    @GetMapping("/export/pdf/{userId}")
    public void exportPdf(
            @PathVariable Long userId,
            HttpServletResponse response) throws Exception {

        response.setContentType("application/pdf");
        response.setHeader(
                "Content-Disposition",
                "attachment; filename=transactions.pdf"
        );

        List<Transaction> transactions = service.getByUser(userId);

        // Create PDF document
        Document document = new Document();
        PdfWriter.getInstance(document, response.getOutputStream());

        document.open();

        // Title
        document.add(new Paragraph("Personal Finance Tracker Report"));
        document.add(new Paragraph(" "));

        // Transactions
        for (Transaction t : transactions) {
            String line =
                    t.getTxnDate() + " | " +
                    t.getType() + " | " +
                    t.getAmount() + " | " +
                    t.getCategory() + " | " +
                    (t.getDescription() == null ? "" : t.getDescription());

            document.add(new Paragraph(line));
        }

        document.close();
    }
}