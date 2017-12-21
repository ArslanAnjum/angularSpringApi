package com.arslan.angularSpringApi.module.person.repo;

import com.arslan.angularSpringApi.module.base.PaginatedQueryDslRepository;
import com.arslan.angularSpringApi.module.person.model.QBadge;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.transaction.annotation.Transactional;

import com.arslan.angularSpringApi.module.person.model.Badge;

@Transactional
public interface BadgeRepo
        extends
        PaginatedQueryDslRepository<Badge, Integer,QBadge> {

}
