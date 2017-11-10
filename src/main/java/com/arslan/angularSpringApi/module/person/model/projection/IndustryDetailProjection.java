package com.arslan.angularSpringApi.module.person.model.projection;

import org.springframework.data.rest.core.config.Projection;

import com.arslan.angularSpringApi.module.person.model.Industry;

@Projection(name="detail",types={Industry.class})
public interface IndustryDetailProjection {

	Integer getIndustryId();
	String getIndustryName();
}
