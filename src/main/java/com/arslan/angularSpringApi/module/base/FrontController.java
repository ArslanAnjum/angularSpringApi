package com.arslan.angularSpringApi.module.base;

import java.util.ArrayList;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class FrontController extends BaseController{

	@GetMapping("/")
	public String getMainPage(){
		return "main/mainPage";
	}
	
	@GetMapping("/accessDenied")
	public String getAccessDeniedPage(){
		return "accessDenied";
	}
	
	@GetMapping("/logout")
	public String getLogoutPage(HttpServletRequest request, HttpServletResponse response){
		
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		if (authentication != null)
			new SecurityContextLogoutHandler().logout(request, response, authentication);
		
		return "redirect:/login?logout";
	}
	
	
	@GetMapping("/login")
	public String getLoginPage(){
		return "login";
	}
}
