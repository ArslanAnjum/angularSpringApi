package com.arslan.angularSpringApi.module.base;

import com.arslan.angularSpringApi.module.person.model.Person;
import com.querydsl.core.types.dsl.EntityPathBase;
import com.querydsl.core.types.dsl.StringPath;
import org.springframework.data.querydsl.QueryDslPredicateExecutor;
import org.springframework.data.querydsl.binding.QuerydslBinderCustomizer;
import org.springframework.data.querydsl.binding.QuerydslBindings;
import org.springframework.data.repository.NoRepositoryBean;
import org.springframework.data.repository.PagingAndSortingRepository;

import java.io.Serializable;
import java.util.Set;

/**
 * Created by user on 12/20/2017.
 */

@NoRepositoryBean
public interface PaginatedQueryDslRepository<T,ID extends Serializable,Q extends EntityPathBase<T>>
    extends
        PagingAndSortingRepository<T,ID>,
        QueryDslPredicateExecutor<T>,
        QuerydslBinderCustomizer<Q>{

    @Override
    default public void customize(QuerydslBindings bindings,Q qType){

        bindings
                .bind(String.class)
                .first(
                        (StringPath path,String value) -> {
                            return path.containsIgnoreCase(value);
                        }
                );

    }

}
