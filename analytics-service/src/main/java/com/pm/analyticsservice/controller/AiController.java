package com.pm.analyticsservice.controller;

import com.pm.analyticsservice.service.GeminiService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
public class AiController {

    private final GeminiService geminiService;

    public AiController(GeminiService geminiService) {
        this.geminiService = geminiService;
    }

    @PostMapping("/generate")
    public ResponseEntity<Map<String, String>> generateContent(@RequestBody Map<String, String> payload) {
        String prompt = payload.getOrDefault("prompt", "Hello, summarize what Gemini AI is in one short sentence.");
        String result = geminiService.generateText(prompt);
        return ResponseEntity.ok(Map.of("prompt", prompt, "response", result));
    }

    @GetMapping("/test")
    public ResponseEntity<Map<String, String>> testAi() {
        String prompt = "Give a 1-sentence health tip for a hospital management system analytics dashboard.";
        String result = geminiService.generateText(prompt);
        return ResponseEntity.ok(Map.of("prompt", prompt, "response", result));
    }
}
