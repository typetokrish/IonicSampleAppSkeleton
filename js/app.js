
var webapp = angular.module('krishiApp', ['ionic','ui.router','ngStorage','ngCordova']);
webapp.run(function($ionicPlatform, $ionicPopup) {
  $ionicPlatform.ready(function() {
    // Check for network connection
	
    if(window.Connection) {
      if(navigator.connection.type == Connection.NONE) {
        $ionicPopup.confirm({
          title: 'No Internet Connection',
          content: 'Sorry, no Internet connectivity detected. Please reconnect and try again.'
        })
        .then(function(result) {
          if(!result) {
            ionic.Platform.exitApp();
          }
        });
      }
    }

  });
})


/*
Define the state and URLS to be used 
*/
webapp.config(function($stateProvider, $urlRouterProvider) {
    
    $urlRouterProvider.otherwise('/app/login');
    
    $stateProvider
        
        // Parent view of the app//
        .state('app', {
            url: '/app',  
			abstract: true,      		
			templateUrl:'templates/nav/menu.html',
			controller : "CommonController"
        })
		.state('app.login', {
			  url: "/login",
			  views: {
				'menuContent' :{
				  	templateUrl:'templates/views/login.html',
					controller : "LoginController"		  
				}
			  }
   	 	})
		.state('app.myhome', {
			  url: "/myhome",
			  views: {
				'menuContent' :{
				  	templateUrl:'templates/views/myhome.html',
							  
				}
			  }
   	 	})
		.state('app.logout', {
			  url: "/logout",
			  views: {
				'menuContent' :{
				  	templateUrl:'templates/views/logout.html',
					controller : "LogoutController"	
							  
				}
			  }
   	 	})
		.state('app.newproduct', {
			  url: "/newproduct",
			  views: {
				'menuContent' :{
				  	templateUrl:'templates/views/newproduct.html',
					controller : "AddproductController"	
							  
				}
			  }
   	 	})
		.state('app.addphoto', {
			  url: "/addphoto",
			  views: {
				'menuContent' :{
				  	templateUrl:'templates/views/addphoto.html',
					controller : "AddphotoController"	
							  
				}
			  }
   	 	})
		//Home Screen Child View
		.state('app.homescreen', {
			  url: "/homescreen",
			  views: {
				'menuContent' :{
				  	templateUrl:'templates/views/home.html'	,
					controller : "HomeController"	  
				}
			  }
			  
   	 	})
		.state('app.products', {
			  url: "/products",
			  views: {
				'menuContent' :{
				  	templateUrl:'templates/views/products.html',
					controller : "ProductsController"		  
				}
			  },
			  params: {
				  category:'',
				  category_name:''
			 }
   	 	})		
		.state('app.myproducts', {
			  url: "/myproducts",
			  views: {
				'menuContent' :{
				  	templateUrl:'templates/views/myproducts.html',
					controller : "MyproductsController"		  
				}
			  },
			  params: {
				  category:'',
				  category_name:''
			 }
   	 	})		
		.state('app.changeprofile', {
			  url: "/changeprofile",
			  views: {
				'menuContent' :{
				  	templateUrl:'templates/views/changeprofile.html',
					controller : "ProfileController"		  
				}
			  },
			  params: {
				  category:'',
				  category_name:''
			 }
   	 	})		
		.state('app.changepassword', {
			  url: "/changepassword",
			  views: {
				'menuContent' :{
				  	templateUrl:'templates/views/changepassword.html',
					controller : "PasswordController"		  
				}
			  },
			  params: {
				  category:'',
				  category_name:''
			 }
   	 	})		
		.state('app.products_details', {
			  url: "/products_details",
			  views: {
				'menuContent' :{
				  	templateUrl:'templates/views/products_details.html',
					controller : "ProductsdetailsController"		  
				}
			  },
			  params: {
				  id:'',				 
			 }
   	 	})		
		.state('app.notification', {
			  url: "/notification",
			  views: {
				'menuContent' :{
				  	templateUrl:'templates/views/notification.html'		  
				}
			  }
   	 	})
		.state('app.register', {
			  url: "/register",
			  views: {
				'menuContent' :{
				  	templateUrl:'templates/views/register.html',
					controller : "RegisterController"		  
				}
			  }
   	 	})
		
		
        
        
        
});

/*Create InterCeptor*/

webapp.config(["$httpProvider", function ($httpProvider,$localStorage,$q,$injector) {
     $httpProvider.interceptors.push(['$q', '$localStorage','$injector', function ($q,  $localStorage,$injector) {
	   return {
		   'request': function (config) {
			   console.log(config.headers);
			   config.headers = config.headers || {};
			   if ($localStorage.token) {				   
				   config.headers.Authorization = 'Bearer ' + $localStorage.token;				   
			   }else{
				 // alert("No token"); 	
			   }
			   return config;
		   },		   
		   'responseError': function (response,dataService) {
			   
			   if (response.status === 401 ) {
				  //need to gain new token//
					console.log("Token Expired ");
					var dataService = $injector.get('dataService');
					 dataService.refresh_token().then(function(promise){
						 console.log(promise.data);
						 if(promise.data.token && promise.data.token!=''){
							console.log('New token refrsh');
							$localStorage.token = promise.data.token;
							$localStorage.$save();
							window.location.href='index.html#/app/homescreen';
						 }else{
							 window.location.href='index.html#/app/login';
						 }
					 });
				 
			   }
			   if(response.status === 402) {
				  console.log("Token Missing in Header : Need to login to get the token ");
				  window.location.href='index.html#/app/login';
			   }
			   if (response.status === 404) {
				  console.log("Error on service ");
			   }
			   if (response.status === 500) {				   
				   console.log("An Internal Server error occured ");				   
			   }			   
			   return $q.reject(response);
		   }
	   };
	}]);
}]); 
  

