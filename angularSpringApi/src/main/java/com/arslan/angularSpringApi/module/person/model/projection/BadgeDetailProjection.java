package com.arslan.angularSpringApi.module.person.model.projection;

import org.springframework.data.rest.core.config.Projection;

import com.arslan.angularSpringApi.module.person.model.Badge;

@Projection(name="detail",types={Badge.class})
public interface BadgeDetailProjection {
	
	Integer getBadgeId();
	String getBadgeName();
}
