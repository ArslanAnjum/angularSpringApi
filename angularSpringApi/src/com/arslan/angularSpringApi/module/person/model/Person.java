package com.arslan.angularSpringApi.module.person.model;

import java.util.HashSet;
import java.util.Set;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name="person",schema="public")
public class Person {
	
	Integer personId;
	String name;
	String address;
	String emailId;
	String phoneNumber;
	City city;
	Industry industry;
	Set<Badge> badges = new HashSet<>(0);
	public Person() {
		super();
	}
	
	
	public Person(Integer personId, String name, String address, String emailId, String phoneNumber, City city,
			Industry industry, Set<Badge> badges) {
		super();
		this.personId = personId;
		this.name = name;
		this.address = address;
		this.emailId = emailId;
		this.phoneNumber = phoneNumber;
		this.city = city;
		this.industry = industry;
		this.badges = badges;
	}


	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	@Column(name="person_id")
	public Integer getPersonId() {
		return personId;
	}
	public void setPersonId(Integer personId) {
		this.personId = personId;
	}
	
	@Column(name="name")
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}

	@Column(name="address")
	public String getAddress() {
		return address;
	}
	public void setAddress(String address) {
		this.address = address;
	}

	@Column(name="email_id")
	public String getEmailId() {
		return emailId;
	}
	public void setEmailId(String emailId) {
		this.emailId = emailId;
	}

	@Column(name="phone_number")
	public String getPhoneNumber() {
		return phoneNumber;
	}
	public void setPhoneNumber(String phoneNumber) {
		this.phoneNumber = phoneNumber;
	}


	@ManyToOne
	@JoinColumn(name="city_id")
	public City getCity() {
		return city;
	}
	public void setCity(City city) {
		this.city = city;
	}
	
	@ManyToOne
	@JoinColumn(name="industry_id")
	public Industry getIndustry() {
		return industry;
	}
	public void setIndustry(Industry industry) {
		this.industry = industry;
	}
	
	@ManyToMany
	@JoinTable(
			name="person_badge",
			joinColumns={@JoinColumn(name="person_id",nullable=false,updatable=false)},
			inverseJoinColumns={@JoinColumn(name="badge_id",nullable=false,updatable=false)}
			)
	public Set<Badge> getBadges() {
		return badges;
	}
	public void setBadges(Set<Badge> badges) {
		this.badges = badges;
	}
	
	
	
	
	
}
