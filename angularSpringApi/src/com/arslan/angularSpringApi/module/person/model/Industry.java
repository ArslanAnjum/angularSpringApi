package com.arslan.angularSpringApi.module.person.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="industry",schema="public")
public class Industry {
		
	Integer industryId;
	String industryName;
	public Industry() {
		super();
	}
	public Industry(Integer industryId, String industryName) {
		super();
		this.industryId = industryId;
		this.industryName = industryName;
	}
	
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	@Column(name="industry_id")
	public Integer getIndustryId() {
		return industryId;
	}
	public void setIndustryId(Integer industryId) {
		this.industryId = industryId;
	}
	
	@Column(name="industry_name")
	public String getIndustryName() {
		return industryName;
	}
	public void setIndustryName(String industryName) {
		this.industryName = industryName;
	}
	
	
}
