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