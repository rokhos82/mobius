<!DOCTYPE html>
<html ng-app="app">
	<head>
		<title>Mobius</title>
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<meta charset="utf-8">
		<link href="https://fonts.googleapis.com/css?family=Iceberg|Revalia|Stalinist+One|VT323" rel="stylesheet">
		<link rel="stylesheet" type="text/css" href="css\slate\bootstrap.min.css" />
		<link rel="stylesheet" type="text/css" href="css\mobius.css" />
		<base href="/www/">
	</head>
	<body>
		<div ng-include="'app/layout/navbar.html'">
		</div>
		<div class="container" ui-view>
		</div>
		<script type="text/javascript" src="js/uuid.js"></script>
		<script type="text/javascript" src="js/underscore.js"></script>
		<script type="text/javascript" src="js/angular.js"></script>
		<script type="text/javascript" src="js/angular-animate.js"></script>
		<script type="text/javascript" src="js/angular-touch.js"></script>
		<script type="text/javascript" src="js/angular-resource.js"></script>
		<script type="text/javascript" src="js/angular-ui-router.js"></script>
		<script type="text/javascript" src="js/ui-bootstrap-2.5.0.js"></script>
		<script type="text/javascript" src="js/angular-editable-text.js"></script>
		<script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/angularjs/1.5.8/angular-sanitize.js"></script>
		<script type="text/javascript" src="app/mobius.js"></script>
		<script type="text/javascript" src="app/core/core.module.js"></script>
		<script type="text/javascript" src="app/core/core.routes.js"></script>
		<script type="text/javascript" src="app/dashboard/dashboard.module.js"></script>
		<script type="text/javascript" src="app/dashboard/dashboard.controller.js"></script>
		<script type="text/javascript" src="app/dashboard/dashboard.routes.js"></script>
		<script type="text/javascript" src="app/layout/layout.module.js"></script>
		<script type="text/javascript" src="app/units/units.module.js"></script>
		<script type="text/javascript" src="app/units/units.controller.js"></script>
		<script type="text/javascript" src="app/units/units.routes.js"></script>
		<script type="text/javascript" src="app/app.module.js"></script>
	</body>
</html>
