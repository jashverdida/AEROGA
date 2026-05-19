package com.verpto.aeroga;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

@SpringBootTest
@TestPropertySource(properties = {
        "spring.data.mongodb.uri=mongodb://localhost:27017/aeroga-test",
        "aeroga.jwt.secret=test-secret-key-that-is-at-least-256-bits-long-for-HS256-algorithm-test",
        "aeroga.jwt.expiration=3600000"
})
class AerogaApplicationTests {

    @Test
    void contextLoads() {
    }
}
