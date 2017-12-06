package com.arslan.angularSpringApi.module.base;

import javax.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;

@Controller
public class BaseController {
	
	@ModelAttribute("server")
	public String getContextPath(HttpServletRequest request){
		return request.getSession().getServletContext().getContextPath();
	}
}
