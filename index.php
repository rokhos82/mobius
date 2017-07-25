<!DOCTYPE html>
<html ng-app="mobiusEngine">
	<head>
		<title>Mobius</title>
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<meta charset="utf-8">
		<link href="https://fonts.googleapis.com/css?family=Iceberg|Revalia|Stalinist+One|VT323" rel="stylesheet">
		<link rel="stylesheet" type="text/css" href="css\slate\bootstrap.min.css" />
		<link rel="stylesheet" type="text/css" href="css\angular-editable-text.css" />
		<link rel="stylesheet" type="text/css" href="css\mobius.css" />
	</head>
	<body ng-controller="mobiusCtl as $ctrl">
		<nav class="navbar navbar-inverse navbar-fixed-top">
			<div class="container">
				<div class="navbar-header">
					<button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
						<span class="sr-only">Toggle navigation</span>
						<span class="icon-bar"></span>
						<span class="icon-bar"></span>
						<span class="icon-bar"></span>
					</button>
					<a class="navbar-brand mobius-title" ui-sref="main">Mobius</a>
				</div>
				<div id="navbar" class="collapse navbar-collapse">
					<ul class="nav navbar-nav">
						<li ui-sref-active="active"><a ui-sref="unit"><span class="glyphicon glyphicon-send"></span> Units</a></li>
						<li ui-sref-active="active"><a ui-sref="fleet"><span class="glyphicon glyphicon-tower"></span> Fleets</a></li>
						<li ui-sref-active="active"><a ui-sref="combat"><span class="glyphicon glyphicon-fire"></span> Combat</a></li>
						<li ui-sref-active="active"><a ui-sref="reports"><span class="glyphicon glyphicon-briefcase"></span> Reports</a></li>
						<li ui-serf-active="active"><a ui-sref="simulator"><span class="glyphicon glyphicon-expand"></span> Simulator</a></li>
						<li ui-sref-active="active"><a ui-sref="science"><span class="glyphicon glyphicon-education"></span> Science</a></li>
					</ul>
					<ul class="nav navbar-nav navbar-right">
						<li><a href><span class="glyphicon glyphicon-log-in"></span></a></li>
						<li class="dropdown" uib-dropdown>
							<a id="gear-dropdown" href="#" uib-dropdown-toggle>
								<span class="glyphicon glyphicon-cog" aria-hidden="true" ></span> <span class="caret"></span>
							</a>
							<ul class="dropdown-menu" uib-dropdown-menu role="menu" aria-labelledby="gear-dropdown">
								<li><a href="#">Save Data</a></li>
								<li><a href="#">Load Data</a></li>
								<li><a href="#">Purge Data</a></li>
								<li class="divider"></li>
								<li><a href="#">Export Data</a></li>
								<li><a href="#">Import Data</a></li>
								<li class="divider"></li>
								<li><a href="#">Load Example</a></li>
								<li><a href="#">Data Dump</a></li>
								<li class="divider"></li>
								<li><a role="button" href ng-click="$ctrl.rest()">REST Test</a></li>
							</ul>
						</li>
					</ul>
				</div>
			</div>
		</nav>
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
		<script type="text/javascript" src="app/app.module.js"></script>
		<script type="text/javascript" src="app/app.control.js"></script>
		<script type="text/javascript" src="app/app.data.js"></script>
		<script type="text/javascript" src="app/component/ui/mobius.ui.js"></script>
		<script type="text/javascript" src="app/component/shared/rest/app.rest.js"></script>
		<script type="text/javascript" src="app/component/shared/pagetitle/pagetitle.js"></script>
		<script type="text/javascript" src="app/component/shared/pagealerts/pagealerts.js"></script>
		<script type="text/javascript" src="app/component/main/main.welcome.js"></script>
		<script type="text/javascript" src="app/component/combat/combat.main.js"></script>
		<script type="text/javascript" src="app/component/fleet/fleet.main.js"></script>
		<script type="text/javascript" src="app/component/fleet/fleet.detail.js"></script>
		<script type="text/javascript" src="app/component/unit/unit.main.js"></script>
		<script type="text/javascript" src="app/component/unit/unit.import.js"></script>
		<script type="text/javascript" src="app/component/unit/unit.detail.js"></script>
		<script type="text/javascript" src="app/component/unit/unit.wizard.js"></script>
		<script type="text/javascript" src="app/component/reports/reports.main.js"></script>
		<script type="text/javascript" src="app/component/reports/reports.detail.js"></script>
		<script type="text/javascript" src="app/component/simulator/simulator.main.js"></script>
		<script type="text/javascript" src="app/component/science/science.mobius.js"></script>
		<script type="text/javascript" src="app/component/science/science.data.js"></script>
		<script type="text/javascript" src="app/component/science/science.ui.js"></script>
		<script type="text/javascript" src="app/component/science/science.main.js"></script>
		<script type="text/javascript" src="app/component/facilities/facilities.mobius.js"></script>
		<script type="text/javascript" src="app/component/facilities/facilities.main.js"></script>
		<script type="text/javascript" src="app/component/card.components.js"></script>
		<script type="text/javascript" src="app/component/modal.components.js"></script>
	</body>
</html>
