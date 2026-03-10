package com.example.Petit.URL.controller;

import com.example.Petit.URL.service.RazorpayService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payment")
public class RazorpayController {

    private final RazorpayService razorpayService;

    public RazorpayController(RazorpayService razorpayService) {
        this.razorpayService = razorpayService;
    }

    @PostMapping("/create-order")
    public Map<String, Object> createOrder() throws Exception {
        return razorpayService.createOrder();
    }

    @PostMapping("/verify")
    public String verifyPayment(@RequestBody Map<String, String> payload) {

        boolean success = razorpayService.verifyPayment(
                payload.get("razorpay_order_id"),
                payload.get("razorpay_payment_id"),
                payload.get("razorpay_signature")
        );

        if(success){
            return "Payment successful. Subscription activated.";
        }

        return "Payment verification failed.";
    }
}
