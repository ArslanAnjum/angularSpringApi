package com.arslan.angularSpringApi.module.person.model.projection;

import org.springframework.data.rest.core.config.Projection;

import com.arslan.angularSpringApi.module.person.model.City;

@Projection(name="detail",types={City.class})
public interface CityDetailProjection {

	Integer getCityId();
	String getCityName();
}
