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
@Table(name="badge",schema="public")
public @Data class Badge {

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	@Column(name="badge_id")
	Integer badgeId;
	
	@Column(name="badge_name")
	String badgeName;	
}
