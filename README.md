# Angular Spring REST API

Its an AngularJS library to be used with Spring REST API. This repository also contains an example project and is deployed at https://angular-spring-api.herokuapp.com. Use username: "admin" and password: "123" to access it.

## Getting Started

### For running sample project, follow these steps:

1- Clone this repository

2- Edit data source properties in /src/main/resources/application.properties

3- Create empty database/schema.

4- Run the scripts present in /sqlScripts/

5- Open browser and type localhost:8080/angularSpringApi/ with default username : admin and password : 123

### To Use library

#### Prerequisites

1- Spring Rest API configured at server-root/api/

2- All Entities must have PagindAndSortingRepositories

3- All Entities which have referenced objects must have a projection named 'detail'

4- Angular Dependencies:

    a) angular-bind-html-compile (https://github.com/incuna/angular-bind-html-compile)

With above mentioned prerequisites you can start building CRUD for any entity.

WebContent/views/skeleton.jsp is included in sample project which is used to build CRUD page.

skeleton.jsp is use to build cruds

    <%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>
    <%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
    
    
     
    <div ng-controller="${entity}Controller"
	 ng-init="init('${_csrf.parameterName}','${_csrf.token}','${_csrf.headerName}','${server}','${entity}')">
	<div class="wrapper">
		<div class="container">
			<div class="section">
				<div class="row">
					<div class="col s12 m12 l12 center-align">
						<h5 class = "viewHeading">${heading}</h5>
					</div>
				</div>
			</div>

			<div class="divider"></div>

			<div class="section">
				<div bind-html-compile="${entity}CreateDiv"></div>
				<div bind-html-compile="${entity}DataTableDiv"></div>
				<div bind-html-compile="${entity}DataTableEditDiv"></div>
				<div bind-html-compile="${entity}DeleteConfirmationDiv"></div>
				<div bind-html-compile="${entity}DataTablePaginator"></div>
			</div>
		</div>
	</div>
    </div>
 
CrudController present in base package listens for all requests at /crud/{entity} and returns skeleton.jsp with heading and entity model params.
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
	
routes.js for angular application would be as follows:

	'use strict';
	
	app.config(function ($routeProvider) {
		$routeProvider
		.when('/',{
			templateUrl : 'crud/persons'
		})
		.when('/crud/:entity',{
		    templateUrl : function(param){
			return 'crud/' + param.entity;
		    }
		});
	});

Each entity collection must have an angular controller with naming convention as [entity name as produced by spring data rest]Controller
For Example controller for persons would be name personsController.js and would have following structure:

	app.controller('personsController',
        ['$scope','apiControllerTemplate,
          function($scope,apiForm,apiControllerTemplate){

          $scope.init = function(csrfParamName, csrfToken, csrfHeaderName,server,entity){
            var dataTableMetadata = 
		{
			name 		:{iType:'input',required:true,editable:true,searchable:true,inGridVisible:true},
			address		:{iType:'input',required:true,editable:true,searchable:true,inGridVisible:true},
			emailId 	:{iType:'input',required:true,editable:true,searchable:true,inGridVisible:true},
			phoneNumber :{iType:'input',required:true,editable:true,searchable:true,inGridVisible:true},
			city		:{iType:'searchable-dropdown',fetch:'cities',required:true,editable:true,searchable:true,inGridVisible:true},
			industry	:{iType:'searchable-dropdown',fetch:'industries',required:true,editable:true,searchable:true,inGridVisible:true},
			badges		:{iType:'multiselect-dropdown',fetch:'badges',editable:true,searchable:true,inGridVisible:true}
		};
			
		var createFormMetadata = 
			{
				name 		:{iType:'input',required:true},
				address		:{iType:'input',required:true},
				emailId 	:{iType:'input',type:'email',required:true},
				phoneNumber :{iType:'input',required:true},
				city		:{iType:'searchable-dropdown',fetch:'cities',required:true},
				industry	:{iType:'searchable-dropdown',fetch:'industries',required:true},
				badges		:{iType:'multiselect-dropdown',fetch:'badges'}
			};

		apiControllerTemplate
		.buildControllerTemplate(
				csrfParamName,
				csrfToken,
				csrfHeaderName,
				server,
				entity,
				$scope,
				dataTableMetadata,
				createFormMetadata
		);
          }
        }]);

When the controller loads, it would come in init function. We have to do the following steps and our controller would be ready for deployment

	1- Formulate data table meta data
	2- Formulat creation form meta data
	3- Call apiControllerTemplate.buildControllerTemplate with respective variables

dataTableMetadata and createFormMetadata variables are used to configure how the front end would look like.
Only those variable names need to be included in these metadatas which we want to render on front end.
Generic Structure and options are as follows:

##### dataTableMetadata

    {
      [variable name in json] : {
          iType           : ['input',dropdown','searchable-dropdown','multiselect-dropdown'],
          type            : [applicable to <input>. default value is 'text'],
          required        : [true,false],
          editable        : [true,false],
          searchable      : [true,false],
          inGridVisible   : [true,false],
          fetch           : [entity name in spring api e.g., libraries. Mandatory for dropdown,searchable-dropdown and multiselect-dropdown],
	  collectionType  : [list]
      }
    }

##### createFormMetadata

    {
      [variable name in json] : {
          iType           : ['input',dropdown','searchable-dropdown','multiselect-dropdown'],
          type            : [applicable to <input>. default value is 'text'],
          required        : [true,false],
          fetch           : [entity name in spring api e.g., libraries. Mandatory for dropdown,searchable-dropdown and multiselect-dropdown],
	  collectionType  : [list]
      }
    }


when iType is dropdown or multiselect-dropdown

    entity specified by fetch property is cached on application startup with max size equal to 200
    
when iType is searchable-dropdown

    entity specified by fetch property is fetched with max size equal to 100 on text change of search box
    A method named findBy[Entity]Name must be defined in the respective repo
    
    Example:
        public interface CityRepo extends PagingAndSortingRepository<City, Integer>{

          @Query("select c from City c where LOWER(c.cityName) like LOWER(concat(:cityName,'%'))")
          Page findByCityName(
              @Param("cityName")String cityName,
              Pageable pageable);
        }

Using Convertor present in src/com/arslan/angularSpringApi/module/utils following partially generic search method needs to be defined
in Entity repo which in this case is PersonsRepo.java

    @Query(
          "select distinct p from Person p join p.badges badges "
          + "where"
          + "("
          + "	(:val is not null) and "
          + "	("
          + "		(p.name                 like  :#{@convertor.toString(#val)}% and :prop = 'name')        or "
          + "		(p.address              like  :#{@convertor.toString(#val)}% and :prop = 'address')     or "
          + "		(p.emailId              like  :#{@convertor.toString(#val)}% and :prop = 'emailId')     or "
          + "		(p.phoneNumber          like  :#{@convertor.toString(#val)}% and :prop = 'phoneNumber') or "
          + "		(p.city.cityId          =     :#{@convertor.toInteger(#val)} and :prop = 'city')        or "
          + "		(p.industry.industryId  =     :#{@convertor.toInteger(#val)} and :prop = 'industry')    or "
          + "		(badges.badgeId         =     :#{@convertor.toInteger(#val)} and :prop = 'badges')"
          + "	)"
          + ")"
          )
      @RestResource(path="partial")
      Page getSearched(
          @Param("prop")String prop,
          @Param("val")String val,
          Pageable pageable);
          
For Strings you need to define like #{@convertor.toString(#val)}

For Integers you need to defined = #{@convertor.toInteger(#val)}

For ManyToMany relationships you need to define a join with that collection and select distinct. Use #{@convertor.toInteger(#val)}

## Author

[Arslan Anjum](https://github.com/ArslanAnjum)

## Acknowledgments

* For providing angular-bind-html-compile (https://github.com/incuna)
