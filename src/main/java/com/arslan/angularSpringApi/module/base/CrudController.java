package com.arslan.angularSpringApi.module.base;

import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.security.web.csrf.HttpSessionCsrfTokenRepository;
import org.springframework.stereotype.Controller;
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
    @ResponseBody
    public String getPersonPage(
            @PathVariable("entity") String entity,
            HttpServletRequest request
    ){
        /*model.addAttribute(
                "heading",
                entity.substring(0,1).toUpperCase() +
                        entity.substring(1,entity.length())
        );


        model.addAttribute("entity",entity);*/
        CsrfToken csrfToken =
                new HttpSessionCsrfTokenRepository().generateToken(request);

        String heading = entity.substring(0,1).toUpperCase() +
                entity.substring(1,entity.length());

        StringBuilder sb = new StringBuilder();

        sb
                .append("<div ng-controller=\"").append(entity).append("Controller\"").append("\n")
                .append("ng-init=\"init('")
                    .append(csrfToken.getParameterName())
                    .append("','")
                    .append(csrfToken.getToken())
                    .append("','")
                    .append(csrfToken.getHeaderName())
                    .append("','")
                    .append(getContextPath(request))
                    .append("','")
                    .append(entity)
                    .append("')\">")
                    .append("\n")
                .append("<div class=\"wrapper\">").append("\n")
                    .append("<div class=\"container\">").append("\n")
                        .append("<div class=\"section\">").append("\n")
                            .append("<div class=\"row\">").append("\n")
                                .append("<div class=\"col s12 m12 l12 center-align\">").append("\n")
                                    .append("<h5 class = \"viewHeading\">").append(heading).append("</h5>").append("\n")
                                .append("</div>").append("\n")
                            .append("</div>").append("\n")
                        .append("</div>").append("\n")

                        .append("<div class=\"divider\"></div>").append("\n")

                        .append("<div class=\"section\">").append("\n")
                            .append("<div bind-html-compile=\"").append(entity).append("CreateDiv\"></div>").append("\n")
                            .append("<div bind-html-compile=\"").append(entity).append("DataTableDiv\"></div>").append("\n")
                            .append("<div bind-html-compile=\"").append(entity).append("DataTableEditDiv\"></div>").append("\n")
                            .append("<div bind-html-compile=\"").append(entity).append("DeleteConfirmationDiv\"></div>").append("\n")
                            .append("<div bind-html-compile=\"").append(entity).append("DataTablePaginatorDiv\"></div>").append("\n")
                        .append("</div>").append("\n")
                    .append("</div>").append("\n")
                .append("</div>").append("\n")
            .append("</div>").append("\n");

        return sb.toString();
    }
}