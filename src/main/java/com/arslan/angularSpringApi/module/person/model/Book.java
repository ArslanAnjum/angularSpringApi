package com.arslan.angularSpringApi.module.person.model;

import com.querydsl.core.annotations.QueryEntity;
import lombok.Data;

import javax.persistence.*;

/**
 * Created by user on 12/8/2017.
 */

@QueryEntity
@Entity
@Table(name="book",schema="public")
@Data
public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="book_id")
    Integer bookId;

    @Column(name="book_name")
    String bookName;

    @Column(name="description")
    String description;

    @Column(name="available")
    Boolean available;

    @ManyToOne
    @JoinColumn(name="person_id")
    Person person;
}
