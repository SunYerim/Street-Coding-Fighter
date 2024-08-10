package com.scf.rank;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class RankApplication {

	public static void main(String[] args) {
		SpringApplication.run(RankApplication.class, args);
	}

}
