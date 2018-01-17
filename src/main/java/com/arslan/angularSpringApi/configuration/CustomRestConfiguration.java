package com.arslan.angularSpringApi.configuration;

import com.arslan.angularSpringApi.module.person.model.*;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurerAdapter;


/**
 * Created by user on 9/10/2017.
 */

@Configuration
public class CustomRestConfiguration extends RepositoryRestConfigurerAdapter {

    @Override
    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config) {
        
        config.exposeIdsFor(
                Person.class,
                Industry.class,
                City.class,
                Badge.class,
                Book.class
        );
    }
}
