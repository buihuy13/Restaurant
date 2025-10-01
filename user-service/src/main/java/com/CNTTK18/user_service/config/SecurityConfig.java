package com.CNTTK18.user_service.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

import com.CNTTK18.user_service.service.CustomOauth2UserService;
import com.CNTTK18.user_service.service.MyUserDetailsService;
import com.CNTTK18.user_service.service.Oauth2LoginSuccessHandler;


@Configuration
@EnableWebSecurity
public class SecurityConfig {
    private final MyUserDetailsService userDetailsService;
    private final CustomOauth2UserService CustomOauth2UserService;
    private final Oauth2LoginSuccessHandler oauth2LoginSuccessHandler;
    public SecurityConfig(MyUserDetailsService userDetailsService, CustomOauth2UserService CustomOauth2UserService, 
                            Oauth2LoginSuccessHandler oauth2LoginSuccessHandler) {
        this.userDetailsService = userDetailsService;
        this.CustomOauth2UserService = CustomOauth2UserService;
        this.oauth2LoginSuccessHandler = oauth2LoginSuccessHandler;
    }
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http.csrf(customizer -> customizer.disable())
                   .authorizeHttpRequests(request -> request.requestMatchers(HttpMethod.OPTIONS, "/**").permitAll().anyRequest().permitAll())
                   .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                   .oauth2Login(oauth2 -> oauth2.userInfoEndpoint(userInfo -> userInfo.userService(CustomOauth2UserService))
                                                .successHandler(oauth2LoginSuccessHandler))
                   .build();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider(userDetailsService);
        authProvider.setPasswordEncoder(new BCryptPasswordEncoder(12));
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }
}
