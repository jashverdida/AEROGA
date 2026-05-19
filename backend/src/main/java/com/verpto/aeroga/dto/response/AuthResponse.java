package com.verpto.aeroga.dto.response;

import com.verpto.aeroga.model.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String id;
    private String username;
    private String email;
    private User.Role role;
}
