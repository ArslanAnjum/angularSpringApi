package com.arslan.angularSpringApi.module.person.repo;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import com.arslan.angularSpringApi.module.person.model.City;

@Transactional
public interface CityRepo extends PagingAndSortingRepository<City, Integer>{

	@Query("select c from City c where LOWER(c.cityName) like LOWER(concat(:cityName,'%'))")
	Page findByCityName(
			@Param("cityName")String cityName,
			Pageable pageable);
}
