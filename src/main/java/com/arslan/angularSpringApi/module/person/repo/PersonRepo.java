package com.arslan.angularSpringApi.module.person.repo;

import com.arslan.angularSpringApi.module.base.PaginatedQueryDslRepository;
import com.arslan.angularSpringApi.module.person.model.QPerson;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RestResource;
import org.springframework.transaction.annotation.Transactional;

import com.arslan.angularSpringApi.module.person.model.Person;

@Transactional
public interface PersonRepo
		extends
		PaginatedQueryDslRepository<Person, Integer,QPerson> {
}
