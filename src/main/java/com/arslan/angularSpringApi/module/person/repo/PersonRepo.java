package com.arslan.angularSpringApi.module.person.repo;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RestResource;
import org.springframework.transaction.annotation.Transactional;

import com.arslan.angularSpringApi.module.person.model.Person;

@Transactional
public interface PersonRepo extends PagingAndSortingRepository<Person, Integer>{


	@Query(
			"select distinct p from Person p join p.badges badges "
			+ "where"
			+ "("
			+ "	(:val is not null) and "
			+ "	("
			+ "		(p.personName like :#{@convertor.toString(#val)}% and :prop = 'personName') or "
			+ "		(p.address like :#{@convertor.toString(#val)}% and :prop = 'address') or "
			+ "		(p.emailId like :#{@convertor.toString(#val)}% and :prop = 'emailId') or "
			+ "		(p.phoneNumber like :#{@convertor.toString(#val)}% and :prop = 'phoneNumber') or "
			+ "		(p.city.cityId = :#{@convertor.toInteger(#val)} and :prop = 'city') or "
			+ "		(p.industry.industryId = :#{@convertor.toInteger(#val)} and :prop = 'industry') or "
			+ "		(badges.badgeId = :#{@convertor.toInteger(#val)} and :prop = 'badges')"
			+ "	)"
			+ ")"
			)
	@RestResource(path="partial")
	Page getSearched(
			@Param("prop")String prop,
			@Param("val")String val,
			Pageable pageable);
}
