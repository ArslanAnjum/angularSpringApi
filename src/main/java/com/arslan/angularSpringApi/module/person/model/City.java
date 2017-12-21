package com.arslan.angularSpringApi.module.person.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import com.querydsl.core.annotations.QueryEntity;
import lombok.Data;

@QueryEntity
@Entity
@Table(name="city",schema="public")
public @Data class City {

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	@Column(name="city_id")
	Integer cityId;
	
	@Column(name="city_name")
	String cityName;
}
