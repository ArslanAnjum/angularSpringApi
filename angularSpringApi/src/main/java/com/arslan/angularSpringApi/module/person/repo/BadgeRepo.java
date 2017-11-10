package com.arslan.angularSpringApi.module.person.repo;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.transaction.annotation.Transactional;

import com.arslan.angularSpringApi.module.person.model.Badge;

@Transactional
public interface BadgeRepo extends PagingAndSortingRepository<Badge, Integer>{

}
