package com.example.Petit.URL.service;

import com.example.Petit.URL.entity.PlanType;
import com.example.Petit.URL.entity.User;
import com.example.Petit.URL.repository.UserRepository;
import com.example.Petit.URL.security.CustomUserDetails;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;
import org.apache.commons.codec.digest.HmacUtils;
import org.apache.commons.codec.binary.Hex;

@Service
public class RazorpayService {

    private final RazorpayClient razorpayClient;
    private final UserRepository userRepository;
    private final SubscriptionService subscriptionService;

    @Value("${razorpay.key.secret}")
    private String razorpaySecret;

    public RazorpayService(RazorpayClient razorpayClient,
                           UserRepository userRepository,
                           SubscriptionService subscriptionService) {
        this.razorpayClient = razorpayClient;
        this.userRepository = userRepository;
        this.subscriptionService = subscriptionService;
    }

    private User getCurrentUser() {

        CustomUserDetails userDetails =
                (CustomUserDetails) SecurityContextHolder
                        .getContext()
                        .getAuthentication()
                        .getPrincipal();

        return userRepository.findByEmail(userDetails.getEmail())
                .orElseThrow();
    }

    public Map<String, Object> createOrder() throws Exception {

        JSONObject options = new JSONObject();
        options.put("amount", 9900);
        options.put("currency", "INR");
        options.put("receipt", "txn_" + System.currentTimeMillis());

        Order order = razorpayClient.orders.create(options);

        Map<String, Object> response = new HashMap<>();

        response.put("orderId", order.get("id"));
        response.put("amount", order.get("amount"));
        response.put("currency", order.get("currency"));

        return response;
    }

    public boolean verifyPayment(String orderId,
                                 String paymentId,
                                 String signature) {

        try {

            String payload = orderId + "|" + paymentId;

            Mac sha256Hmac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKey =
                    new SecretKeySpec(razorpaySecret.getBytes(), "HmacSHA256");

            sha256Hmac.init(secretKey);

            byte[] hash = sha256Hmac.doFinal(payload.getBytes());

            // Convert to HEX (not Base64)
            String generatedSignature = Hex.encodeHexString(hash);

            System.out.println("Generated signature: " + generatedSignature);
            System.out.println("Razorpay signature: " + signature);

            if (generatedSignature.equals(signature)) {

                System.out.println("PAYMENT VERIFIED SUCCESSFULLY");

                User user = getCurrentUser();

                subscriptionService.activatePremium(user);

                return true;
            }

        } catch (Exception e) {
            e.printStackTrace();
        }

        return false;
    }
}