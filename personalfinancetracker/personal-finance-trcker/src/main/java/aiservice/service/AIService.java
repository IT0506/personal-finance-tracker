package aiservice.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class AIService {

    @Value("${openai.api.key}")
    private String apiKey;

    public String analyzeTransactions(String transactionSummary) {
        String prompt = """
            Analyze the following financial data and provide concise advice:
            """ + transactionSummary;

        // Call OpenAI API here and return response text
        return "AI Insight: Reduce discretionary spending and increase monthly savings.";
    }
}