package com.arslan.angularSpringApi.module.person.model.projection;

import java.util.List;
import java.util.Set;

import com.arslan.angularSpringApi.module.person.model.*;
import org.springframework.data.rest.core.config.Projection;

@Projection(name="detail",types={Person.class})
public interface PersonDetailProjection {

	Integer getPersonId();
	String getPersoncName();
	String getAddress();
	String getEmailId();
	String getPhoneNumber();
	City getCity();
	Industry getIndustry();
	Set<Badge> getBadges();
	List<Book> getBooks();
}
