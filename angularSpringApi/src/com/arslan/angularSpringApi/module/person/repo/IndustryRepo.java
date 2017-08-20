package com.arslan.angularSpringApi.module.person.repo;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import com.arslan.angularSpringApi.module.person.model.Industry;

@Transactional("jpaTXManager")
public interface IndustryRepo extends PagingAndSortingRepository<Industry, Integer> {
	
	@Query("select i from Industry i where LOWER(i.industryName) like LOWER(concat(:industryName,'%'))")
	Page findByIndustryName(
			@Param("industryName")String cityName,
			Pageable pageable);
	

}
