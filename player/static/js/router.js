playerApp.config(function($routeProvider) {
	$routeProvider.when('/player', {
		templateUrl: 'index.html',
		controller: 'playerCtrls'
	}).otherwise({
		redirectTo: '/player'
	});
});