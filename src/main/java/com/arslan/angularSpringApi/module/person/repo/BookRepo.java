package com.arslan.angularSpringApi.module.person.repo;

import com.arslan.angularSpringApi.module.person.model.Book;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.criteria.CriteriaBuilder;

/**
 * Created by user on 12/8/2017.
 */

@Transactional
public interface BookRepo extends PagingAndSortingRepository<Book, Integer> {
}
