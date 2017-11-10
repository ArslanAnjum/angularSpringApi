package com.arslan.angularSpringApi.module.person.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.Data;

@Entity
@Table(name="industry",schema="public")
public @Data class Industry {
		
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	@Column(name="industry_id")
	Integer industryId;
	
	@Column(name="industry_name")
	String industryName;

}
