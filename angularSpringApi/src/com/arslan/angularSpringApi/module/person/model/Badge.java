package com.arslan.angularSpringApi.module.person.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="badge",schema="public")
public class Badge {

	Integer badgeId;
	String badgeName;
	public Badge() {
		super();
	}
	public Badge(Integer badgeId, String badgeName) {
		super();
		this.badgeId = badgeId;
		this.badgeName = badgeName;
	}
	
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	@Column(name="badge_id")
	public Integer getBadgeId() {
		return badgeId;
	}
	public void setBadgeId(Integer badgeId) {
		this.badgeId = badgeId;
	}
	
	@Column(name="badge_name")
	public String getBadgeName() {
		return badgeName;
	}
	public void setBadgeName(String badgeName) {
		this.badgeName = badgeName;
	}
	
	
}
