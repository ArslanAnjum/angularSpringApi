package com.arslan.angularSpringApi.configuration;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewResolverRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;
import org.springframework.web.servlet.view.InternalResourceViewResolver;
import org.springframework.web.servlet.view.JstlView;

@Configuration
@EnableWebMvc
@ComponentScan(basePackages="com.arslan.angularSpringApi")
public class AppConfig extends WebMvcConfigurerAdapter {

	@Override
	public void configureViewResolvers(ViewResolverRegistry registry){
		InternalResourceViewResolver viewResolver = new InternalResourceViewResolver();
		viewResolver.setViewClass(JstlView.class);
		viewResolver.setPrefix("/views/");
		viewResolver.setSuffix(".jsp");
		registry.viewResolver(viewResolver);
	}
	
	@Override
	public void addResourceHandlers(ResourceHandlerRegistry registry){
		registry.addResourceHandler("/webResources/**").addResourceLocations("/webResources/");
		registry.addResourceHandler("/app/**").addResourceLocations("/app/");
	}	
}
