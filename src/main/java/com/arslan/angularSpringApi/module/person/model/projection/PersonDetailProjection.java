package com.arslan.angularSpringApi.module.person.model.projection;

import java.util.List;
import java.util.Set;

import com.arslan.angularSpringApi.module.person.model.*;
import org.springframework.data.rest.core.config.Projection;

@Projection(name="detail",types={Person.class})
public interface PersonDetailProjection {

	Integer getPersonId();
	String getPersonName();
	String getAddress();
	String getEmailId();
	String getPhoneNumber();
	/*CityDetailProjection getCity();
	IndustryDetailProjection getIndustry();
	Set<BadgeDetailProjection> getBadges();*/
	City getCity();
	Industry getIndustry();
	Set<Badge> getBadges();
	List<Book> getBooks();
}
