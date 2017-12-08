package com.arslan.angularSpringApi.module.base;

import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.security.web.csrf.HttpSessionCsrfTokenRepository;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;

/**
 * Created by user on 12/6/2017.
 */
@Controller
@RequestMapping(value="/crud")
public class CrudController extends BaseController{

    @GetMapping(value="/{entity}")
    public String getPersonPage(
            @PathVariable("entity") String entity,
            Model model
    ){
        model.addAttribute(
                "heading",
                entity.substring(0,1).toUpperCase() +
                        entity.substring(1,entity.length())
        );


        model.addAttribute("entity",entity);

        return "skeleton";
    }
}