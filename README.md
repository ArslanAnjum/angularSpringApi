# Angular Spring REST API

Its an AngularJS library to be used with Spring REST API. This repository also contains an example project and is deployed at https://angular-spring-api.herokuapp.com. Use username: "admin" and password: "123" to access it.

## Getting Started

### For running sample project, follow these steps:

1- Clone this repository

2- Edit data source properties in /src/main/resources/application.properties

3- Create empty database/schema.

4- Run the scripts present in /sqlScripts/

5- Open browser and type localhost:5000 with default username : admin and password : 123

### To Use library

#### Prerequisites

1- Spring Rest API base path set to /api/. See [application.properties](src/main/resources/application.properties)

2- For Searching we are using QueryDSL therefore all entities must have their respective so called Q Entity generated and must be therefore annotated with @QueryEntity.

3- All Entities must have a repo that extends [PaginatedQueryDslRepository](src/main/java/com/arslan/angularSpringApi/module/base/PaginatedQueryDslRepository.java)

4- All Entities which have referenced objects must have a projection named 'detail'. This would enable the framework to fetch referenced objects along with main objects. For Example see [PersonDetailProjection](src/main/java/com/arslan/angularSpringApi/module/person/model/projection/PersonDetailProjection.java)

5- Expose Id for all entities. See [CustomRestConfiguration](src/main/java/com/arslan/angularSpringApi/configuration/CustomRestConfiguration.java)

6- Angular Dependency [angular-bind-html-compile](src/main/resources/static/app/directives/bind-html-compile.js)

7- A jsp file which would build the CRUD html page. See [skeleton.jsp](/src/main/webapp/WEB-INF/views/skeleton.jsp)


Following steps can be taken to generalize CRUDS based on the convention that all cruds would be served at /crud/[entity]; where entity is spring data rest exposed entity name. e.g., for table book spring data rest exposes books.

1- A Spring Controller with generic structure as [CrudController](/src/main/java/com/arslan/angularSpringApi/module/base/CrudController.java)

2- AngularJS generic router. See [route.js](/src/main/resources/static/app/routes.js)

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

    entity specified by fetch property is fetched with max size equal to 100 on text change of search box.
    We assume that we would perform this search on [entity]Name. e.g., if entity is cities we would search for cityName

## Author

[Arslan Anjum](https://github.com/ArslanAnjum)

## Acknowledgments

* For providing angular-bind-html-compile (https://github.com/incuna)
