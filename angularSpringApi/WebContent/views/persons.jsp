<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>


<div ng-controller="personsController"
	ng-init="init('${_csrf.parameterName}','${_csrf.token}','${_csrf.headerName}','${server}','person')">
	<jsp:include page="./skeleton.jsp">
		<jsp:param name="heading" value="Persons"/>
		<jsp:param name="entity" value="person"/>
	</jsp:include>
</div>