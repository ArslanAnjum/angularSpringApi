<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>


<!-- Use -->
<c:set var="heading" value="Persons"/>
<c:set var="entity" value="persons"/>


<div ng-controller="personsController"
	ng-init="init('${_csrf.parameterName}','${_csrf.token}','${_csrf.headerName}','${server}','${entity}')">
	<jsp:include page="./skeleton.jsp">
		<jsp:param name="heading" value="${heading}"/>
		<jsp:param name="entity" value="${entity}"/>
	</jsp:include>
</div>