<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>


<!DOCTYPE html>
<html>

<!--================================================================================

	Author: Arslan Anjum
	Author 
================================================================================ -->

<head>
<title>Login Page</title>
<!-- Favicons-->
<meta charset="utf-8" />
<meta http-equiv="X-UA-Compatible" content="IE=Edge" />
<!-- CORE CSS-->

<link href="<c:url value='/webResources/css/materialize.min.css ' />"
	rel="stylesheet" media="screen,projection">

<!-- Custome CSS-->
<link
	href="<c:url value='/webResources/css/login_css/custom-style.css' />"
	rel="stylesheet" media="screen,projection">
<link
	href="<c:url value='/webResources/css/login_css/page-center.css' />"
	rel="stylesheet" media="screen,projection">

<!-- INCLUDED PLUGIN CSS ON THIS PAGE -->
<link href="<c:url value='/webResources/js/plugins/prism/prism.css' />"
	rel="stylesheet" media="screen,projection">
<link
	href="<c:url value='/webResources/js/plugins/perfect-scrollbar/perfect-scrollbar.min.css' />"
	type="text/css" rel="stylesheet" media="screen,projection">

</head>

<body>
	<!-- Start Page Loading -->
	<div id="loader-wrapper">
		<div id="loader"></div>
		<div class="loader-section section-left"></div>
		<div class="loader-section section-right"></div>
	</div>
	<!-- End Page Loading -->

	<div id="login-page" class="row">

		<form class="login-form" name='f' action="<c:url value='/login' />"
			method='POST'>
			<div class="row">
				<div class="input-field col s12 center">
					<h1 class="center login-form-text">Angular Spring REST API Demo</h1>
				</div>
			</div>
			<div class="row margin">
				<div class="input-field col s12 white-text text-darken-5">
					<input id="username" name="username" type="text" color="white">
					<label for="username" class="left-align">Username</label>
				</div>
			</div>
			<div class="row margin">
				<div class="input-field col s12 white-text text-darken-5">
					<input id="password" name="password" type="text"
						autocomplete="false" readonly
						onfocus="this.removeAttribute('readonly');"> <label
						for="password">Password</label>
				</div>
			</div>
			<div class="row margin">
				<div class="input-field col s12 m12 l12">
					<input class="btn z-depth-2 col waves-effect waves-light  s12"
						style="background-color: transparent; border: white; border-style: solid; border-width: 1.5px; border-radius: 25px"
						name="submit" type="submit" value="Login" /> <input
						name="${_csrf.parameterName}" type="hidden" value="${_csrf.token}" />
				</div>
			</div>
		</form>

	</div>

	<!-- ================================================
    Scripts
    ================================================ -->
	<!-- jQuery Library -->

	<script src="https://code.jquery.com/jquery-2.1.1.min.js"></script>

	<script>
		$(document).ready(function() {

			$('#password').attr('type', 'password')
			$('input[type="password"]').val("");
			$('input[type="text"]').val("");
			$('#password').attr("autocomplete", "off");
		});
	</script>
	<!--materialize js-->
	<script src="<c:url value='/webResources/js/materialize.min.js'/>"></script>
	<!--prism-->
	<script src="<c:url value='/webResources/js/plugins/prism/prism.js'/>"></script>
	<!--scrollbar-->
	<script
		src="<c:url value='/webResources/js/plugins/perfect-scrollbar/perfect-scrollbar.min.js'/>"></script>
	<!--plugins.js - Some Specific JS codes for Plugin Settings-->
	<script src="<c:url value='/webResources/js/plugins/plugins.js'/>"></script>


</body>

</html>