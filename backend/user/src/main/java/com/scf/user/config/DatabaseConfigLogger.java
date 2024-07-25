package com.scf.user.config;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.logging.Logger;

@Component
public class DatabaseConfigLogger {

    private static final Logger logger = Logger.getLogger(DatabaseConfigLogger.class.getName());

    @Value("${spring.datasource.url}")
    private String datasourceUrl;

    @Value("${spring.datasource.username}")
    private String datasourceUsername;

    @Value("${spring.datasource.password}")
    private String datasourcePassword;


    @PostConstruct
    public void logDatabaseConfig() {
        // 비밀번호를 로깅하지 않도록 주의합니다. 보안 위험이 있을 수 있습니다.
        logger.info("Datasource URL: " + datasourceUrl);
        logger.info("Datasource Username: " + datasourceUsername);
        logger.info("Datasource Password: [PROTECTED]");
    }
}
