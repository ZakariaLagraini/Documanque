package com.documanque.documanqueserver;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@SpringBootApplication
@EnableTransactionManagement
public class DocumanqueServerApplication {
	public static void main(String[] args) {
		SpringApplication.run(DocumanqueServerApplication.class, args);
	}
}
