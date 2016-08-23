/*-----------------------------------------------------------------------------------------
Register Controller : Create new user account //
-------------------------------------------------------------------------------------------*/

webapp.controller('RegisterController', function($scope,$state,$stateParams,masterService,dataService,$ionicLoading,$localStorage){
	
	/*
	 Declare Scope data to be avaible in controller and views 
	*/
	$scope.page_title = 'Create Account';								//titile for the screen//
	$scope.product_data					=	[];							//object holds the variables an values for view/template // 
	$scope.product_data.image_link		=	imageUrl+'classifieds/';	//image link to external website//
	
	
	$scope.product_data.items_district	=	[];							//Object to hold district list
	$scope.product_data.items_places	=	[];							//Object to hold places list//	
	$scope.product_data.finished		=	0;							//True if all data loaded from web service//	
							
	$scope.product_data.show_auto		=	0;
	$scope.product_data.name			=	'';
	$scope.product_data.email			=	'';
	$scope.product_data.password		=	'';
	$scope.product_data.mobile			=	'';
	$scope.product_data.show_register	=	1;
	$scope.product_data.show_login		=	0;
	
	$scope.form_data					=	[];
	$scope.form_data.name				=	'';
	$scope.form_data.email				=	'';
	$scope.form_data.password			=	'';
	$scope.form_data.mobile				=	'';
	$scope.form_data.category			=	'';
	$scope.form_data.district			=	'';
	$scope.form_data.location			=	'';
	$scope.form_data.location_string	=	'';	
	$scope.form_data.message			=	'';
	$scope.form_data.error				=	'';
	
	/*
	 * Get districts from the masterService and store to scope variables
	*/
	masterService.get_districts_list().then(function(promise){		
		$scope.product_data.items_district=promise.data.items;		
	});
	/*
	 * get location function on controller
	 * invokes MasterService's get_places_list method
	 * Use this as an typeahead method 
	*/
	$scope.get_locations=function(){	
		if($scope.form_data.location_string.length >= 3){	// if min 3 characters were typed
			masterService.get_places_list($scope.form_data.location_string,$scope.form_data.district).then(function(promise){		
				$scope.product_data.items_places=promise.data.items;
				if(promise.data.total>0){
					$scope.product_data.show_auto=1;
					console.log($scope.product_data.show_auto);
					console.log($scope.product_data.items_places);
				}
			});
		}
	}
	/*
	* Choose a location from auto complete results
	*/
	$scope.choose_location=function(id,loc){
		$scope.form_data.location_string=loc;
		$scope.form_data.location=id;
		$scope.product_data.show_auto=0; // hide auto complete//
		console.log(id);
		console.log(loc);
		console.log($scope.form_data.location_string);
		console.log($scope.form_data.location);
	}
	/*
	 * Create the user account function : uses the dataService's crate_user metthod and pass form_date model binding//
	 * Validate and show error on failure
	 * Show button to login screeen on success//
	*/
	$scope.save_user=function(){	
		//Show a loader indicating the progress//
		$ionicLoading.show({
			  template: 'Creating your account .....'
		}).then(function(){
			   console.log("The loading indicator is now displayed");
		});
		
		var data_post	=	{	name:$scope.form_data.name,email:$scope.form_data.email,password:$scope.form_data.password,
								mobile:$scope.form_data.mobile,district:$scope.form_data.district,location:$scope.form_data.location,
								location_string:$scope.form_data.location_string}
		dataService.create_user(data_post).then(function(promise){	
		
			if(promise.data.error==0){ // success created account
				
				$scope.form_data.message=promise.data.message;
				$scope.form_data.error=0;
				console.log('Account Created');
				if(promise.data.token.token && promise.data.token.token!=''){
					$localStorage.token = promise.data.token.token;
					$localStorage.$save();
					console.log('Token received and Stored');
					$scope.product_data.show_login=0;
					$state.go('app/home');
				}else{
					$scope.product_data.show_login=1;
				}
			}else{
				$scope.product_data.show_login=0;
				$scope.form_data.message=promise.data.message;
				$scope.form_data.error=1;
			}
			console.log(promise.data);
			//Hide Loading of the LoadingIcon//
			$ionicLoading.hide().then(function(){
			   console.log("The loading indicator is now hidden");
			});
			
		});
		
	}
	
	/*
	* Take me to Login screen from a button click
	*/
	$scope.goto_login=function(){
		$state.go('app.login');
	}
});

/*--------------------------------------------------------------------------------------
Login Controller : Handle the user login to the application
----------------------------------------------------------------------------------------*/

webapp.controller('LoginController', function($rootScope,$scope,$state,$stateParams,masterService,dataService,$ionicLoading,$localStorage){
	
	/*
	 Declare Scope data to be avaible in controller and views 
	*/
	console.log("Login controller loaded");
	$scope.page_title = 'Login to Account';								//titile for the screen//
	$scope.product_data					=	[];							//object holds the variables an values for view/template // 
	$scope.product_data.image_link		=	imageUrl+'classifieds/';	//image link to external website//	
	
	$scope.product_data.show_login		=	1;
	$scope.product_data.show_home		=	0;
	$scope.form_data					=	[];	
	$scope.form_data.email				=	'';
	$scope.form_data.password			=	'';	
	$scope.form_data.message			=	'';
	$scope.form_data.error				=	'';	
	
	/*
	 * Login attempt
	 * Validate and show error on failure
	 * 
	*/
	$scope.login_user=function(){	
		//Show a loader indicating the progress//
		$ionicLoading.show({
			  template: 'Processing Login ....'
		}).then(function(){
			   console.log("The loading indicator is now displayed");
		});		
		
		var data_post	=	{	email:$scope.form_data.email,password:$scope.form_data.password}
		dataService.login_user(data_post).then(function(promise){
			//Hide Loading of the LoadingIcon//
			$ionicLoading.hide().then(function(){
			   console.log("The loading indicator is now hidden");
			});		
			if(promise.data.error==0){
				console.log('Login Success');
				console.log('Token '+promise.data.token.token);
				$localStorage.token = promise.data.token.token;
				$localStorage.$save();
				$scope.product_data.show_login	=	0;
				$scope.product_data.show_home	=	1;
				$scope.form_data.error			=	0;
				$scope.form_data.message		=	promise.data.message;
				$rootScope.$broadcast('loginChanged', {
				  loginSuccess: 1 // send whatever you want
				});
				$state.go('app.homescreen');								
			}else{
				console.log('Login Error');
				$scope.product_data.show_login	=	1;
				$scope.product_data.show_home	=	0;
				$scope.form_data.error			=	1;
				$scope.form_data.message		=	promise.data.message;
			}
					
		});		
	}
	
	/*
	* Take me to Login screen from a button click
	*/
	$scope.goto_myhome=function(){
		$state.go('app.myhome');
	}
	$scope.check_init=function(){
		if($localStorage.token && $localStorage.token!=''){
			$state.go('app.homescreen');
		}
	}
	
	$scope.check_init();
	
	
	
	
});

/*---------------------------------------------------------------------------------------------
LOGOUT Controller
-----------------------------------------------------------------------------------------------*/

webapp.controller('LogoutController', function($rootScope,$scope,$state,masterService,$localStorage,dataService,$ionicLoading) {
	
	$scope.page_title = 'Exit your Account';		
	$scope.form_data	=	[];
	$scope.form_data.show_logout	=	1;
	if ($localStorage.token) {				   
					   
	}else{
		$scope.form_data.show_logout	=	1;
	}
	//Logout from the system//
	$scope.logout=function(){
		$ionicLoading.show({
			  template: 'Logging out from app....'
		}).then(function(){
			   console.log("The loading indicator is now displayed");
		});		
		dataService.logout_user().then(function(promise){
			$ionicLoading.hide().then(function(){
			   console.log("The loading indicator is now hidden");
			});
			if(promise.data.error==0){	
				$localStorage.token='';	
				$localStorage.$save();					
				$scope.form_data.show_logout	=	0;
				$state.go('app.login');
				$rootScope.$broadcast('logoutChanged', {
				  loginSuccess: 0 // send whatever you want
				});
			}
			
				
		});
	}
	
	$scope.go_home=function(){
		$state.go('app.login');
		
	}
	
	
});



webapp.controller('CommonController', function($scope,$state,masterService,$localStorage) {
	$scope.parent=[];
	$scope.parent.loggedStatus	=	0;
	
	$scope.$on('logoutChanged', function (event, data) {
	  console.log(data); // 'Data to send'
	  $scope.parent.loggedStatus=0;
	});
	$scope.$on('loginChanged', function (event, data) {
	  console.log(data); // 'Data to send'
	  $scope.parent.loggedStatus=1;
	});
	if ($localStorage.token) {				   
		console.log("Token Exists");
		$scope.parent.loggedStatus = 1;
				   
	}else{
		console.log("Token Expired / None");
		$scope.parent.loggedStatus =0;
	}
	
	
});

/*---------------------------------------------------------------
* Home Controller :: App welcome screen controller
-----------------------------------------------------------------*/

webapp.controller('HomeController', function($scope,$state,masterService,dataService) {
	console.log("Home controller loaded");
	$scope.page_title = 'Home';	
	$scope.total	=0;
	$scope.count	=0;	
	$scope.items	={};	
	$scope.image_link	=	imageUrl+'category/';
	
	dataService.get_user().then(function(promise){
		console.log(promise.data.user);
		if(promise.data.error==0){	
		//user logged in//
		masterService.get_category_list().then(function(promise){
			$scope.total=promise.data.total;
			$scope.count=promise.data.count;
			$scope.items=promise.data.items;	
			
		});
		//
		}
	});
	
	
	$scope.goto_products=function(id,name){
		$state.go('app.products',{category:id,category_name:name});
	}
	
	
});

/*---------------------------------------------------------------------------
* Products Controller :: Products Listing, Search Etc
----------------------------------------------------------------------------*/

webapp.controller('ProductsController', function($scope,$state,$stateParams,masterService,dataService) {
	console.log($stateParams);
	/*
	 Declare Scope data to be avaible in controller and views 
	*/
	$scope.page_title = 'Products List';								//titile for the screen//
	$scope.product_data					=	[];							//object holds the variables an values for view/template // 
	$scope.product_data.image_link		=	imageUrl+'classifieds/';	//image link to external website//
	$scope.product_data.total			=	0;							//Total records of master recrods / products//
	$scope.product_data.count			=	0;							//Count of products from service to show in the list//
	$scope.product_data.items			=	[];							//products items in array//
	$scope.product_data.items_category	=	[];							//Object to hold, category list//
	$scope.product_data.items_district	=	[];							//Object to hold district list
	$scope.product_data.items_places	=	[];							//Object to hold places list//
	$scope.product_data.start			=	0;							//the start record count for product web service, useful in limited listing
	$scope.product_data.limit			=	5;							//number of items per screen
	$scope.product_data.finished		=	0;							//True if all data loaded from web service//
	$scope.product_data.category		=	$stateParams.category;		//Load category initially from prev state & ngModal for category//
	$scope.product_data.district		=	'';							//ngModal for district field
	$scope.product_data.location		=	'';							//ngModal for location field
	$scope.product_data.keyword			=	'';							//ngModal for keyword field
	$scope.product_data.location_string	=	'';							//ngModal for location string field
	$scope.product_data.show_advanced	=	0;							//show advanced search off//
	$scope.product_data.show_auto		=	0;							//true for show auto complete results
	
	/*
	 * Get categry from the masterService and store to scope variables
	*/
	masterService.get_category_list().then(function(promise){	 	
		$scope.product_data.items_category=promise.data.items;		
	});
	
	
	/*
	 * Get districts from the masterService and store to scope variables
	*/
	masterService.get_districts_list().then(function(promise){		
		$scope.product_data.items_district=promise.data.items;		
	});
	/*
	 * get location function on controller
	 * invokes MasterService's get_places_list method
	 * Use this as an typeahead method 
	*/
	$scope.get_locations=function(){	
		if($scope.product_data.location_string.length >= 3){	// if min 3 characters were typed
			masterService.get_places_list($scope.product_data.location_string,$scope.product_data.district).then(function(promise){		
				$scope.product_data.items_places=promise.data.items;
				if(promise.data.total>0){
					$scope.product_data.show_auto=1;
					console.log($scope.product_data.show_auto);
					console.log($scope.product_data.items_places);
				}
			});
		}
	}
	/*
	* Choose a location from auto complete results
	*/
	$scope.choose_location=function(id,loc){
		$scope.product_data.location_string=loc;
		$scope.product_data.location=id;
		$scope.product_data.show_auto=0; // hide auto complete//
		console.log(id);
		console.log(loc);
		console.log($scope.product_data.location_string);
		console.log($scope.product_data.location);
	}
	/*
	 * Show advanced search box 
	*/
	$scope.show_advanced_search=function(){
		$scope.product_data.show_advanced=1;  // set the show_advanced model value to 1 to work with ng-show//		
	}
	
	/*
	 * Go to Products from poduct list on selecting one item
	*/
	$scope.goto_product=function(product_id){
		$state.go('app.products_details',{id:product_id});
	}
	
	/*
	 * Products List ( entry function when view loaded)
	 * use ProducsService's get_products method
	 * @ args : pass the search filters
	 * Return producst list with limited number of items to show in one view//
	*/
	dataService.get_user().then(function(promise){
		console.log(promise.data.user);
		if(promise.data.error==0){	
			//checking Token //
		}
	});
	dataService.get_products($scope.product_data.start,$scope.product_data.keyword,$scope.product_data.category,$scope.product_data.district,$scope.product_data.location).then(function(promise){
		$scope.product_data.total=promise.data.total;
		$scope.product_data.count=promise.data.count;
		$scope.product_data.items=promise.data.items;	
		console.log("Current start "+$scope.product_data.start);
		console.log("Current total "+$scope.product_data.total);
		$scope.$broadcast('scroll.infiniteScrollComplete');	//broad cast content loaded message
		console.log("Fetch Completed ");
		if($scope.product_data.count > 0){
			$scope.product_data.start=Number($scope.product_data.start)+Number($scope.product_data.limit);
			console.log("Inc start to "+$scope.product_data.start);
		}
		if($scope.product_data.start>=$scope.product_data.total){ // all items were loaded
			$scope.product_data.finished=1;//marked as finished
			console.log("Finished all data ");
		}
		
	});
	/*
	 * Function load more data on bottom scroll / infinite scroll
	 * Uses scrollview load more 
	*/
	$scope.loadMore=function(){
		console.log("Load More Invoked");
		if($scope.product_data.finished==0){ //there is data for loading//
			console.log("Fetching further data from "+$scope.product_data.start);
			dataService.get_products($scope.product_data.start,$scope.product_data.keyword,$scope.product_data.category,$scope.product_data.district,$scope.product_data.location).then(function(promise){
				$scope.product_data.total=promise.data.total;
				$scope.product_data.count=promise.data.count;
				$scope.product_data.items=$scope.product_data.items.concat(promise.data.items);;	
				console.log("Current start "+$scope.product_data.start);
				console.log("Current total "+$scope.product_data.total);
				if($scope.product_data.count > 0){
					$scope.product_data.start=Number($scope.product_data.start)+Number($scope.product_data.limit);
					console.log("Inc start to "+$scope.product_data.start);
				}
				if($scope.product_data.start>=$scope.product_data.total){ // all items were loaded
					$scope.product_data.finished=1;//marked as finished
					console.log("Finished all data ");
				}
				
			});
			//finished//
		}else{
			console.log("No more data to load");
		}
	}
	
	/*
	 * Function to handle the advanced search features 
	 * Use the dataService's get_products 
	*/
	$scope.search_products=function(){	
		$scope.product_data.start	=	0;//fresh search, set start to zeror//
		dataService.get_products($scope.product_data.start,$scope.product_data.keyword,$scope.product_data.category,$scope.product_data.district,$scope.product_data.location).then(function(promise){
			$scope.product_data.total=promise.data.total;
			$scope.product_data.count=promise.data.count;
			$scope.product_data.items=promise.data.items;	
			console.log("Current start "+$scope.product_data.start);
			console.log("Current total "+$scope.product_data.total);
			$scope.$broadcast('scroll.infiniteScrollComplete');	//broad cast content loaded message
			console.log("Fetch Completed ");
			if($scope.product_data.count > 0){
				$scope.product_data.start=$scope.product_data.start+$scope.product_data.limit;
				console.log("Inc start to "+$scope.product_data.start);
			}
			if($scope.product_data.start>=$scope.product_data.total){ // all items were loaded
				$scope.product_data.finished=1;//marked as finished
				console.log("Finished all data ");
			}
			
		});
	}	
});
/*---------------------------------------------------------------------------------
* Product details Controller
-----------------------------------------------------------------------------------*/
webapp.controller('ProductsdetailsController', function($scope,$state,$stateParams,masterService,dataService) {
	console.log($stateParams);
	$scope.page_title = 'Product Details';	
	
	$scope.product_data				=	[];
	$scope.product_data.total		=	0;
	$scope.product_data.count		=	0;	
	$scope.product_data.items		=	[];	
	$scope.product_data.id			=	$stateParams.id;
	$scope.product_data.image_link	=	imageUrl+'classifieds/';	//image link to external website//
	
	if($scope.product_data.id==0 || $scope.product_data.id==''){
		$state.go('app.products');
	}
	
	//checking for logged in user//
	dataService.get_user().then(function(promise){
		console.log(promise.data.user);
		if(promise.data.error==0){			
			//checking Token //
			dataService.get_product_details($scope.product_data.id).then(function(promise){
				$scope.product_data.total=promise.data.total;
				$scope.product_data.count=promise.data.count;
				$scope.product_data.items=promise.data.items;	
				console.log(promise.data.items);
				
			});
			//
		}
	});
	
	
	
	
});

/*-----------------------------------------------------------------------------------------
Register Controller : Create new user account //
-------------------------------------------------------------------------------------------*/

webapp.controller('AddproductController', function($scope,$state,$stateParams,masterService,dataService,dataService,$ionicLoading,$localStorage){
	
	/*
	 Declare Scope data to be avaible in controller and views 
	*/
	$scope.page_title = 'Add your product';								//titile for the screen//
	$scope.product_data					=	[];							//object holds the variables an values for view/template // 
	$scope.product_data.image_link		=	imageUrl+'classifieds/';	//image link to external website//
	
	$scope.product_data.items_category	=	[];	
	$scope.product_data.items_district	=	[];							//Object to hold district list
	$scope.product_data.items_places	=	[];							//Object to hold places list//	
	$scope.product_data.finished		=	0;							//True if all data loaded from web service//				
	$scope.product_data.show_auto		=	0;	
	$scope.product_data.show_form		=	1;
	
	
	$scope.form_data					=	[];
	$scope.form_data.user_id			=	'';
	$scope.form_data.name				=	'';
	$scope.form_data.email				=	'';	
	$scope.form_data.mobile				=	'';
	$scope.form_data.phone				=	'';
	$scope.form_data.category			=	'';
	$scope.form_data.district			=	'';
	$scope.form_data.location			=	'';
	$scope.form_data.postname			=	'';
	$scope.form_data.price				=	'';
	$scope.form_data.qty				=	'';
	$scope.form_data.desc				=	'';
	$scope.form_data.location_string	=	'';	
	$scope.form_data.message			=	'';
	$scope.form_data.error				=	'';
	$scope.form_data.id					=	0;
	
	//Check whether user data is available and authenticated //
	
	dataService.get_user().then(function(promise){
		console.log(promise.data.user);
		if(promise.data.error==0){	
			console.log("User Data is received");
			console.log(promise.data.user);
			$scope.form_data.user_id			=	promise.data.user.user_id;
			$scope.form_data.name				=	promise.data.user.first_name;
			$scope.form_data.email				=	promise.data.user.email;
			$scope.form_data.mobile				=	Number(promise.data.user.mobile) ;
			$scope.form_data.phone				=	promise.data.user.phone;
			$scope.form_data.district			=	promise.data.user.district_id;
			$scope.form_data.location			=	promise.data.user.location_id;	
			
			masterService.get_category_list().then(function(promise){	 	
				$scope.product_data.items_category=promise.data.items;		
			});
			
			/*
			 * Get districts from the masterService and store to scope variables
			*/
			masterService.get_districts_list().then(function(promise){		
				$scope.product_data.items_district=promise.data.items;		
			});
			
				
		}else{
			console.log("Didnt get user data");
			$localStorage.token='';	
			$localStorage.$save();					
			$state.go('app.homescreen');
		}
			
	});
	
	
	/*
	 * get location function on controller
	 * invokes MasterService's get_places_list method
	 * Use this as an typeahead method 
	*/
	$scope.get_locations=function(){	
		if($scope.form_data.location_string.length >= 3){	// if min 3 characters were typed
			masterService.get_places_list($scope.form_data.location_string,$scope.form_data.district).then(function(promise){		
				$scope.product_data.items_places=promise.data.items;
				if(promise.data.total>0){
					$scope.product_data.show_auto=1;
					console.log($scope.product_data.show_auto);
					console.log($scope.product_data.items_places);
				}
			});
		}
	}
	/*
	* Choose a location from auto complete results
	*/
	$scope.choose_location=function(id,loc){
		$scope.form_data.location_string=loc;
		$scope.form_data.location=id;
		$scope.product_data.show_auto=0; // hide auto complete//
		console.log(id);
		console.log(loc);
		console.log($scope.form_data.location_string);
		console.log($scope.form_data.location);
	}
	/*
	* Save Product
	*/
	$scope.save_product=function(){
		$ionicLoading.show({
			  template: 'Saving product data .....'
		}).then(function(){
			   console.log("The loading indicator is now displayed");
		});
		
		var data_post	=	{user_id:$scope.form_data.user_id,name:$scope.form_data.name,email:$scope.form_data.email,
								mobile:$scope.form_data.mobile,phone:$scope.form_data.phone,
								district:$scope.form_data.district,location:$scope.form_data.location,
								location_string:$scope.form_data.location_string,
								category:$scope.form_data.category,postname:$scope.form_data.postname,
								price:$scope.form_data.price,qty:$scope.form_data.qty,
								desc:$scope.form_data.desc}
		console.log(data_post);						
		//Now attempt to sav using Service
		dataService.save_product(data_post).then(function(promise){			
			console.log(promise.data);
			//Hide Loading of the LoadingIcon//						
			$scope.form_data.error	=	promise.data.error;
			if(promise.data.error==0){
				$scope.form_data.message		=	promise.data.message;
				$scope.product_data.show_form	=	0;
				$scope.form_data.id	=	promise.data.id;
			}else{
				$scope.form_data.message	=	promise.data.message;
				$scope.product_data.show_form	=	1;
			}
			$ionicLoading.hide().then(function(){
			   console.log("The loading indicator is now hidden");
			});
			
		});
		//Save finshed
		
	}
	$scope.goto_myproducts=function(){
		$state.go('app.myproducts');
	}
	$scope.goto_photo=function(id){
		$localStorage.photo_id = id;
		$localStorage.$save();
		$state.go('app.addphoto');
		console.log(id);
	}
	
	
});
/*-------------------------------------------------------------------------------
Add photo / upload photo : Create new user account //
-------------------------------------------------------------------------------------------*/

webapp.controller('AddphotoController', function($scope,$state,$stateParams,masterService,dataService,dataService,$ionicLoading,$localStorage,$cordovaFileTransfer){
	
	/*
	 Declare Scope data to be avaible in controller and views 
	*/
	$scope.page_title = 'Upload Photo';									//titile for the screen//
	$scope.product_data					=	[];							//object holds the variables an values for view/template // 
	$scope.product_data.image_link		=	imageUrl+'classifieds/';	//image link to external website//
	
		
	$scope.product_data.show_auto		=	0;	
	$scope.product_data.show_form		=	1;
	
	$scope.form_data					=	[];	
	$scope.form_data.message			=	'';
	$scope.form_data.error				=	'';
	$scope.form_data.id					=	$localStorage.photo_id;
	
	
		
	
	$scope.goto_myproducts=function(){
		$state.go('app.myproducts');
	}
	
	$scope.upload = function() {
        var options = {
            fileKey: "avatar",
            fileName: "image.png",
            chunkedMode: false,
            mimeType: "image/png"
        };
        $cordovaFileTransfer.upload(serviceBaseUrl+"products/upload", "/img/ionic.png", options).then(function(result) {
            console.log("SUCCESS: " + JSON.stringify(result));
        }, function(err) {
            console.log("ERROR: " + JSON.stringify(err));
        }, function (progress) {
            // constant progress updates
        });
    }
	
	
	
});


/*---------------------------------------------------------------------------
* Products Controller :: Products Listing, Search Etc
----------------------------------------------------------------------------*/

webapp.controller('MyproductsController', function($scope,$state,$stateParams,masterService,dataService) {
	
	/*
	 Declare Scope data to be avaible in controller and views 
	*/
	$scope.page_title = 'My Products';								//titile for the screen//
	$scope.product_data					=	[];							//object holds the variables an values for view/template // 
	$scope.product_data.image_link		=	imageUrl+'classifieds/';	//image link to external website//
	$scope.product_data.total			=	0;							//Total records of master recrods / products//
	$scope.product_data.count			=	0;							//Count of products from service to show in the list//
	$scope.product_data.items			=	[];							//products items in array//
	
	$scope.product_data.start			=	0;							//the start record count for product web service, useful in limited listing
	$scope.product_data.limit			=	5;							//number of items per screen
	$scope.product_data.finished		=	0;							//True if all data loaded from web service//
	$scope.product_data.category		=	'';							//Load category initially from prev state & ngModal for category//
	$scope.product_data.district		=	'';							//ngModal for district field
	$scope.product_data.location		=	'';							//ngModal for location field
	$scope.product_data.keyword			=	'';							//ngModal for keyword field
	$scope.product_data.location_string	=	'';							//ngModal for location string field
	$scope.product_data.show_advanced	=	0;							//show advanced search off//
	$scope.product_data.show_auto		=	0;							//true for show auto complete results
	
	
	dataService.get_user().then(function(promise){
		console.log(promise.data.user);
		if(promise.data.error==0){	
		}
	});
	
	/*
	 * Go to Products from poduct list on selecting one item
	*/
	$scope.goto_product=function(product_id){
		$state.go('app.products_details',{id:product_id});
	}
	
	/*
	 * Products List ( entry function when view loaded)
	 * use ProducsService's get_products method
	 * @ args : pass the search filters
	 * Return producst list with limited number of items to show in one view//
	*/
	dataService.get_myproducts($scope.product_data.start,$scope.product_data.keyword,$scope.product_data.category,$scope.product_data.district,$scope.product_data.location).then(function(promise){
		$scope.product_data.total=promise.data.total;
		$scope.product_data.count=promise.data.count;
		$scope.product_data.items=promise.data.items;	
		console.log("Current start "+$scope.product_data.start);
		console.log("Current total "+$scope.product_data.total);
		$scope.$broadcast('scroll.infiniteScrollComplete');	//broad cast content loaded message
		console.log("Fetch Completed ");
		if($scope.product_data.count > 0){
			$scope.product_data.start=Number($scope.product_data.start)+Number($scope.product_data.limit);
			console.log("Inc start to "+$scope.product_data.start);
		}
		if($scope.product_data.start>=$scope.product_data.total){ // all items were loaded
			$scope.product_data.finished=1;//marked as finished
			console.log("Finished all data ");
		}
		
	});
	/*
	 * Function load more data on bottom scroll / infinite scroll
	 * Uses scrollview load more 
	*/
	$scope.loadMore=function(){
		console.log("Load More Invoked");
		if($scope.product_data.finished==0){ //there is data for loading//
			console.log("Fetching further data from "+$scope.product_data.start);
			dataService.get_myproducts($scope.product_data.start,$scope.product_data.keyword,$scope.product_data.category,$scope.product_data.district,$scope.product_data.location).then(function(promise){
				$scope.product_data.total=promise.data.total;
				$scope.product_data.count=promise.data.count;
				$scope.product_data.items=$scope.product_data.items.concat(promise.data.items);;	
				console.log("Current start "+$scope.product_data.start);
				console.log("Current total "+$scope.product_data.total);
				if($scope.product_data.count > 0){
					$scope.product_data.start=Number($scope.product_data.start)+Number($scope.product_data.limit);
					console.log("Inc start to "+$scope.product_data.start);
				}
				if($scope.product_data.start>=$scope.product_data.total){ // all items were loaded
					$scope.product_data.finished=1;//marked as finished
					console.log("Finished all data ");
				}
				
			});
			//finished//
		}else{
			console.log("No more data to load");
		}
	}
	
	/*
	 * Function to handle the advanced search features 
	 * Use the dataService's get_products 
	*/
	$scope.search_products=function(){	
		$scope.product_data.start	=	0;//fresh search, set start to zeror//
		dataService.get_myproducts($scope.product_data.start,$scope.product_data.keyword,$scope.product_data.category,$scope.product_data.district,$scope.product_data.location).then(function(promise){
			$scope.product_data.total=promise.data.total;
			$scope.product_data.count=promise.data.count;
			$scope.product_data.items=promise.data.items;	
			console.log("Current start "+$scope.product_data.start);
			console.log("Current total "+$scope.product_data.total);
			$scope.$broadcast('scroll.infiniteScrollComplete');	//broad cast content loaded message
			console.log("Fetch Completed ");
			if($scope.product_data.count > 0){
				$scope.product_data.start=$scope.product_data.start+$scope.product_data.limit;
				console.log("Inc start to "+$scope.product_data.start);
			}
			if($scope.product_data.start>=$scope.product_data.total){ // all items were loaded
				$scope.product_data.finished=1;//marked as finished
				console.log("Finished all data ");
			}
			
		});
	}	
});
/*-------------------------------------------------------------------
 Change Profile//
---------------------------------------------------------------------*/
webapp.controller('ProfileController', function($scope,$state,$stateParams,masterService,dataService,$ionicLoading,$localStorage){
	
	/*
	 Declare Scope data to be avaible in controller and views 
	*/
	$scope.page_title = 'Change Profile';								//titile for the screen//
	$scope.product_data					=	[];							//object holds the variables an values for view/template // 
	$scope.product_data.image_link		=	imageUrl+'classifieds/';	//image link to external website//
	
	
	$scope.product_data.items_district	=	[];							//Object to hold district list
	$scope.product_data.items_places	=	[];							//Object to hold places list//	
	$scope.product_data.finished		=	0;							//True if all data loaded from web service//	
							
	$scope.product_data.show_auto		=	0;
	$scope.product_data.name			=	'';
	$scope.product_data.email			=	'';	
	$scope.product_data.mobile			=	'';
	$scope.product_data.show_register	=	1;
	$scope.product_data.show_login		=	0;
	
	$scope.form_data					=	[];
	$scope.form_data.id					=	'';
	$scope.form_data.name				=	'';
	$scope.form_data.email				=	'';
	$scope.form_data.password			=	'';
	$scope.form_data.mobile				=	'';
	$scope.form_data.category			=	'';
	$scope.form_data.district			=	'';
	$scope.form_data.location			=	'';
	$scope.form_data.location_string	=	'';	
	$scope.form_data.message			=	'';
	$scope.form_data.error				=	'';
	
	/*
	 * Get districts from the masterService and store to scope variables
	*/
	masterService.get_districts_list().then(function(promise){		
		$scope.product_data.items_district=promise.data.items;		
	});
	/*
	 * get location function on controller
	 * invokes MasterService's get_places_list method
	 * Use this as an typeahead method 
	*/
	$scope.get_locations=function(){	
		if($scope.form_data.location_string.length >= 3){	// if min 3 characters were typed
			masterService.get_places_list($scope.form_data.location_string,$scope.form_data.district).then(function(promise){		
				$scope.product_data.items_places=promise.data.items;
				if(promise.data.total>0){
					$scope.product_data.show_auto=1;
					console.log($scope.product_data.show_auto);
					console.log($scope.product_data.items_places);
				}
			});
		}
	}
	/*
	* Choose a location from auto complete results
	*/
	$scope.choose_location=function(id,loc){
		$scope.form_data.location_string=loc;
		$scope.form_data.location=id;
		$scope.product_data.show_auto=0; // hide auto complete//
		console.log(id);
		console.log(loc);
		console.log($scope.form_data.location_string);
		console.log($scope.form_data.location);
	}
	
	$scope.get_user=function(){
		$ionicLoading.show({
			  template: 'Gathering your data'
		}).then(function(){
			   console.log("The loading indicator is now displayed");
		});
		dataService.get_user().then(function(promise){
			console.log(promise.data);
			$scope.form_data.id=promise.data.user.user_id;
			$scope.form_data.name=promise.data.user.first_name;
			$scope.form_data.email=promise.data.user.email;
			$scope.form_data.mobile=Number(promise.data.user.mobile);
			$scope.form_data.district=promise.data.user.district_id;
			$scope.form_data.location=promise.data.user.location_id;
			$ionicLoading.hide().then(function(){
			   console.log("The loading indicator is now hidden");
			});
		});
	}
	/*
	 * Create the user account function : uses the dataService's crate_user metthod and pass form_date model binding//
	 * Validate and show error on failure
	 * Show button to login screeen on success//
	*/
	$scope.save_user=function(){	
		//Show a loader indicating the progress//
		$ionicLoading.show({
			  template: 'Updating your details .....'
		}).then(function(){
			   console.log("The loading indicator is now displayed");
		});
		
		var data_post	=	{	name:$scope.form_data.name,email:$scope.form_data.email,id:$scope.form_data.id,
								mobile:$scope.form_data.mobile,district:$scope.form_data.district,location:$scope.form_data.location,
								location_string:$scope.form_data.location_string}
		dataService.update_user(data_post).then(function(promise){	
		
			if(promise.data.error==0){ // success created account
				
				$scope.form_data.message=promise.data.message;
				$scope.form_data.error=0;
				console.log('Account Changed');
				$scope.product_data.show_login=1;
				$scope.product_data.show_register=0;
				$scope.form_data.message=promise.data.message;
			}else{
				$scope.product_data.show_login=0;
				$scope.form_data.message=promise.data.message;
				$scope.form_data.error=1;
			}
			console.log(promise.data);
			//Hide Loading of the LoadingIcon//
			$ionicLoading.hide().then(function(){
			   console.log("The loading indicator is now hidden");
			});
			
		});
		
	}
	
	/*
	* Take me to Login screen from a button click
	*/
	$scope.goto_home=function(){
		$state.go('app.homescreen');
	}
	$scope.get_user();
});



/*-------------------------------------------------------------------
Password //
---------------------------------------------------------------------*/
webapp.controller('PasswordController', function($scope,$state,$stateParams,masterService,dataService,$ionicLoading,$localStorage){
	
	/*
	 Declare Scope data to be avaible in controller and views 
	*/
	$scope.page_title = 'Change Profile';								//titile for the screen//
	$scope.product_data					=	[];							//object holds the variables an values for view/template // 
	$scope.product_data.image_link		=	imageUrl+'classifieds/';	//image link to external website//
	
	
	
							
	$scope.product_data.show_auto		=	0;	
	$scope.product_data.show_login		=	0;
	$scope.product_data.show_register	=1;
	$scope.form_data					=	[];
	$scope.form_data.oldpassword		=	'';
	$scope.form_data.password			=	'';	
	$scope.form_data.message			=	'';
	$scope.form_data.error				=	'';
	
	dataService.get_user().then(function(promise){
		console.log(promise.data.user);
		if(promise.data.error==0){	
		}
	});
	
	/*
	 * Create the user account function : uses the dataService's crate_user metthod and pass form_date model binding//
	 * Validate and show error on failure
	 * Show button to login screeen on success//
	*/
	$scope.change_pass=function(){	
		//Show a loader indicating the progress//
		$ionicLoading.show({
			  template: 'Updating password .....'
		}).then(function(){
			   console.log("The loading indicator is now displayed");
		});
		
		var data_post	=	{	oldpassword:$scope.form_data.oldpassword,password:$scope.form_data.password}
		dataService.change_pass(data_post).then(function(promise){	
		
			if(promise.data.error==0){ // success created account				
				$scope.form_data.message=promise.data.message;
				$scope.form_data.error=0;
				console.log('Password Changed');
				$scope.product_data.show_login=1;
				$scope.product_data.show_register=0;
				$scope.form_data.message=promise.data.message;
			}else{
				$scope.product_data.show_login=0;
				$scope.form_data.message=promise.data.message;
				$scope.form_data.error=1;
			}
			console.log(promise.data);
			//Hide Loading of the LoadingIcon//
			$ionicLoading.hide().then(function(){
			   console.log("The loading indicator is now hidden");
			});
			
		});
		
	}
	
	/*
	* Take me to Login screen from a button click
	*/
	$scope.goto_home=function(){
		$state.go('app.homescreen');
	}
	
});

