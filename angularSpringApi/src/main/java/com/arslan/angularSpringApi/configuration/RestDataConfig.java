package com.arslan.angularSpringApi.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.data.rest.webmvc.BaseUri;
import org.springframework.data.rest.webmvc.config.RepositoryRestMvcConfiguration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.module.SimpleModule;

@Configuration
public class RestDataConfig  extends RepositoryRestMvcConfiguration {

	@Override
	@Bean
	public BaseUri baseUri() {
		config().setBasePath("/api");
		return new BaseUri(config().getBaseUri());
	}
}