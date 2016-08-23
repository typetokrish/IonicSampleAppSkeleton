
var webapp = angular.module('krishiApp', ['ionic','ui.router']);

/*
Define the state and URLS to be used 
*/
webapp.config(function($stateProvider, $urlRouterProvider) {
    
    $urlRouterProvider.otherwise('/home');
    
    $stateProvider
        
        // HOME STATES AND NESTED VIEWS ========================================
        .state('home', {
            url: '/home',
            
			views: {

            // the main template will be placed here (relatively named)
            '': { templateUrl: 'templates/home.html' },

            // the child views will be defined here (absolutely named)
            'columnOne@home': { template: 'Look I am a column!' },

            // for column two, we'll define a separate controller 
            'columnTwo@home': { 
                template: 'Look I am a column 2!'
            }
       	 }
        })
        
        // ABOUT PAGE AND MULTIPLE NAMED VIEWS =================================
        .state('about', {
            // we'll get to this in a bit   
			url: '/about',
            templateUrl: 'templates/about.html'    
        })
		.state('about.paragraph', {
       	 url: '/paragraph',
        	template: 'I could sure use a drink right now.'
    	})
		.state('about.list', {
       	 url: '/list',
        	template: 'List Comest now.'
    	})
        
});