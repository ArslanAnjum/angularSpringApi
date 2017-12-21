package com.arslan.angularSpringApi.module.person.model;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.persistence.*;

import com.querydsl.core.annotations.QueryEntity;
import lombok.Data;

@QueryEntity
@Entity
@Table(name="person",schema="public")
public @Data class Person {
	
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	@Column(name="person_id")
	Integer personId;
	
	@Column(name="name")
	String personName;
	
	@Column(name="address")
	String address;
	
	@Column(name="email_id")
	String emailId;
	
	@Column(name="phone_number")
	String phoneNumber;
	
	@ManyToOne
	@JoinColumn(name="city_id")
	City city;
	
	@ManyToOne
	@JoinColumn(name="industry_id")
	Industry industry;

	@OneToMany(mappedBy = "person")
	List<Book> books;

	@ManyToMany
	@JoinTable(
			name="person_badge",
			joinColumns={@JoinColumn(name="person_id",nullable=false,updatable=false)},
			inverseJoinColumns={@JoinColumn(name="badge_id",nullable=false,updatable=false)}
			)
	Set<Badge> badges = new HashSet<>(0);
		
}
