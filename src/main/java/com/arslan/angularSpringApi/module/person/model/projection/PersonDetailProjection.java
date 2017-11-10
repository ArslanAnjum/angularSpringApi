package com.arslan.angularSpringApi.module.person.model.projection;

import java.util.Set;

import org.springframework.data.rest.core.config.Projection;

import com.arslan.angularSpringApi.module.person.model.Person;

@Projection(name="detail",types={Person.class})
public interface PersonDetailProjection {

	Integer getPersonId();
	String getName();
	String getAddress();
	String getEmailId();
	String getPhoneNumber();
	CityDetailProjection getCity();
	IndustryDetailProjection getIndustry();
	Set<BadgeDetailProjection> getBadges();
}
