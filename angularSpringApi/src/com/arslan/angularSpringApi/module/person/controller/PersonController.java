package com.arslan.angularSpringApi.module.person.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

import com.arslan.angularSpringApi.module.base.BaseController;

@Controller
public class PersonController extends BaseController{

	@GetMapping(value="/persons")
	public String getPersonPage(){
		return "persons";
	}
}
