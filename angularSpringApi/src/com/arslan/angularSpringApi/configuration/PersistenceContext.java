package com.arslan.angularSpringApi.configuration;

import java.util.Properties;

import javax.persistence.EntityManagerFactory;
import javax.sql.DataSource;

import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.jdbc.datasource.DriverManagerDataSource;
import org.springframework.orm.hibernate4.HibernateTransactionManager;
import org.springframework.orm.hibernate4.LocalSessionFactoryBean;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.transaction.annotation.EnableTransactionManagement;



@Configuration
@EnableTransactionManagement
@ComponentScan({"com.arslan.angularSpringApi"})
@PropertySource(value = {"classpath:db.properties"})
@EnableJpaRepositories("com.arslan.angularSpringApi")
@EnableAsync
public class PersistenceContext {

	@Autowired
	private Environment environment;
	
	@Bean
	@Autowired
	public LocalSessionFactoryBean sessionFactory(){
		
		LocalSessionFactoryBean sessionFactory = new LocalSessionFactoryBean();
		sessionFactory.setDataSource(dataSource());
		sessionFactory.setPackagesToScan(new String [] {"com.arslan.angularSpringApi.module"});
		sessionFactory.setHibernateProperties(hibernateProperties());
		return sessionFactory;
	}
	
	@Bean
	@Autowired
	LocalContainerEntityManagerFactoryBean entityManagerFactory(
			DataSource dataSource,
			Environment env){
		
		LocalContainerEntityManagerFactoryBean entityManagerFactoryBean = 
				new LocalContainerEntityManagerFactoryBean();
		
		entityManagerFactoryBean.setDataSource(dataSource);
		entityManagerFactoryBean.setJpaVendorAdapter(new HibernateJpaVendorAdapter());
		entityManagerFactoryBean.setPackagesToScan(new String [] {"com.arslan.angularSpringApi"});
		
		entityManagerFactoryBean.setJpaProperties(hibernateProperties());
		
		return entityManagerFactoryBean;
		
	}
	
	@Bean
	public DataSource dataSource(){
		
		DriverManagerDataSource dataSource = new DriverManagerDataSource();
		dataSource.setDriverClassName(	environment.getRequiredProperty("jdbc.driverClassName"));
		dataSource.setUrl(				environment.getRequiredProperty("jdbc.url"));
		dataSource.setUsername(         environment.getRequiredProperty("jdbc.username"));
		dataSource.setPassword(         environment.getRequiredProperty("jdbc.password"));
		return dataSource;
	}
	
	private Properties hibernateProperties(){
		
		Properties properties = new Properties();
		properties.put("hibernate.dialect",		environment.getRequiredProperty("hibernate.dialect"));
		properties.put("hibernate.show_sql", 	environment.getRequiredProperty("hibernate.show_sql"));
		properties.put("hibernate.format_sql", 	environment.getRequiredProperty("hibernate.format_sql"));
		properties.put("hibernate.hbm2ddl.auto", environment.getRequiredProperty("hibernate.hbm2ddl.auto"));
		return properties;
	}
	
	@Bean
	@Autowired
	public HibernateTransactionManager hibernateTXManager(SessionFactory sessionFactory){
	
		HibernateTransactionManager txManager = new HibernateTransactionManager();
		txManager.setSessionFactory(sessionFactory);	
		return txManager;
	}
	
	@Bean
	@Autowired
	JpaTransactionManager jpaTXManager(EntityManagerFactory entityManagerFactory){
		
		JpaTransactionManager txManager = new JpaTransactionManager();
		txManager.setEntityManagerFactory(entityManagerFactory);
		return txManager;
	}
	
	
	@Bean
	@Autowired
	JpaTransactionManager transactionManager(EntityManagerFactory entityManagerFactory){
		
		JpaTransactionManager txManager = new JpaTransactionManager();
		txManager.setEntityManagerFactory(entityManagerFactory);
		return txManager;
	}	
}
