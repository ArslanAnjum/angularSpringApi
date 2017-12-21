package com.arslan.angularSpringApi.module.person.repo;

import com.arslan.angularSpringApi.module.base.PaginatedQueryDslRepository;
import com.arslan.angularSpringApi.module.person.model.QCity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import com.arslan.angularSpringApi.module.person.model.City;

@Transactional
public interface CityRepo
		extends
		PaginatedQueryDslRepository<City, Integer,QCity> {

	@Query("select c from City c where LOWER(c.cityName) like LOWER(concat(:cityName,'%'))")
	Page findByCityName(
			@Param("cityName")String cityName,
			Pageable pageable);
}
