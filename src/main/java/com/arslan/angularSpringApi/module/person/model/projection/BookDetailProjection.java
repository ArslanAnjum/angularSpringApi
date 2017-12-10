package com.arslan.angularSpringApi.module.person.model.projection;

import com.arslan.angularSpringApi.module.person.model.Book;
import com.arslan.angularSpringApi.module.person.model.Person;
import org.springframework.data.rest.core.config.Projection;

/**
 * Created by user on 12/8/2017.
 */

@Projection(name="detail",types={Book.class})
public interface BookDetailProjection {

    Integer getBookId();
    String getBookName();
    String getDescription();
    Boolean getAvailable();
    Person getPerson();
}
