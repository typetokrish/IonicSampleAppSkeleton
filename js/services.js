
//Category Services //

webapp.service('masterService', function($rootScope, $http,$localStorage) {
	
	//Get the category list//
	this.get_category_list=function(){
		var promise=	 $http({
				  cache		: true,
				  method  : 'GET',
				  url     : serviceBaseUrl+'category',          
				  //headers : {'Content-Type': 'application/x-www-form-urlencoded'} 
				 })
				  .success(function(data, status, headers, config) {            
					return data;
				  })
				  .error(function(data, status, headers, config){
					  return data;
				});
		return promise;
	}
	//Get the district list//
	this.get_districts_list=function(){
		var promise=	 $http({
					cache		: true,
				  method  : 'GET',
				  url     : serviceBaseUrl+'districts',          
				  //headers : {'Content-Type': 'application/x-www-form-urlencoded'} 
				 })
				  .success(function(data, status, headers, config) {            
					return data;
				  })
				  .error(function(data, status, headers, config){
					  return data;
				});
		return promise;
	}
	//gte locations matching a keyword
	this.get_places_list=function(keyword,district){
		var promise=	 $http({
					cache		: true,
				  method  : 'GET',
				  url     : serviceBaseUrl+'locations?keyword='+keyword+'&district='+district,          
				  //headers : {'Content-Type': 'application/x-www-form-urlencoded'} 
				 })
				  .success(function(data, status, headers, config) {            
					return data;
				  })
				  .error(function(data, status, headers, config){
					  return data;
				});
		return promise;
	}
	
	
    
});

/*
 Data Service:; retrive information on products
*/
webapp.service('dataService', function($rootScope, $http,$localStorage,$httpParamSerializerJQLike) {
	
	this.get_products=function(start,keyword,category,district,location){
		var promise=	 $http({
				  method  : 'GET',
				  url     : serviceBaseUrl+'products/search?start='+start+'&keyword='+keyword+'&category='+category+'&district='+district+'&location='+location,          
				  //headers : {'Content-Type': 'application/x-www-form-urlencoded'} 
				 })
				  .success(function(data, status, headers, config) {            
					return data;
				  })
				  .error(function(data, status, headers, config){
					  return data;
				});
		return promise;
	}
	
	this.get_myproducts=function(start,keyword,category,district,location){
		var promise=	 $http({
				  method  : 'GET',
				  url     : serviceBaseUrl+'products/my?start='+start+'&keyword='+keyword+'&category='+category+'&district='+district+'&location='+location,          
				  //headers : {'Content-Type': 'application/x-www-form-urlencoded'} 
				 })
				  .success(function(data, status, headers, config) {            
					return data;
				  })
				  .error(function(data, status, headers, config){
					  return data;
				});
		return promise;
	}
	
	this.get_product_details=function(id){
		var promise=	 $http({
			  method  : 'GET',
			  url     : serviceBaseUrl+'products/get?id='+id,          
			  //headers : {'Content-Type': 'application/x-www-form-urlencoded'} 
			 })
			  .success(function(data, status, headers, config) {            
				return data;
			  })
			  .error(function(data, status, headers, config){
				  return data;
			});
		return promise;
	}
	
	this.save_product=function(formData){
		var promise=	 $http({
				  method  : 'POST',
				  url     : serviceBaseUrl+'products/add',          
				  data: $httpParamSerializerJQLike(formData),  // convert object to url encoded params
				  headers : {'Content-Type': 'application/x-www-form-urlencoded'}  // post data as form data instead of Json Input
				 })
				  .success(function(data, status, headers, config) { 				            
					return data;
				  })
				  .error(function(data, status, headers, config){
					  return data;
				});
		return promise;
	}    

	
	this.create_user=function(formData){
		
		var promise=	 $http({
				  method  : 'POST',
				  url     : serviceBaseUrl+'user/create',          
				  data: $httpParamSerializerJQLike(formData),  // convert object to url encoded params
				  headers : {'Content-Type': 'application/x-www-form-urlencoded'}  // post data as form data instead of Json Input
				 })
				  .success(function(data, status, headers, config) {            
					return data;
				  })
				  .error(function(data, status, headers, config){
					  return data;
				});
		return promise;
	}
	this.update_user=function(formData){
		
		var promise=	 $http({
				  method  : 'POST',
				  url     : serviceBaseUrl+'user/update',          
				  data: $httpParamSerializerJQLike(formData),  // convert object to url encoded params
				  headers : {'Content-Type': 'application/x-www-form-urlencoded'}  // post data as form data instead of Json Input
				 })
				  .success(function(data, status, headers, config) {            
					return data;
				  })
				  .error(function(data, status, headers, config){
					  return data;
				});
		return promise;
	}
	this.change_pass=function(formData){
		
		var promise=	 $http({
				  method  : 'POST',
				  url     : serviceBaseUrl+'user/changepass',          
				  data: $httpParamSerializerJQLike(formData),  // convert object to url encoded params
				  headers : {'Content-Type': 'application/x-www-form-urlencoded'}  // post data as form data instead of Json Input
				 })
				  .success(function(data, status, headers, config) {            
					return data;
				  })
				  .error(function(data, status, headers, config){
					  return data;
				});
		return promise;
	}
	
	this.login_user=function(formData){
		
		var promise=	 $http({
				  method  : 'POST',
				  url     : serviceBaseUrl+'user/login',          
				  data: $httpParamSerializerJQLike(formData),  // convert object to url encoded params
				  headers : {'Content-Type': 'application/x-www-form-urlencoded'}  // post data as form data instead of Json Input
				 })
				  .success(function(data, status, headers, config) {            
					return data;
				  })
				  .error(function(data, status, headers, config){
					  return data;
				});
		return promise;
	}
	
	this.logout_user=function(formData){
		
		var promise= $http({
				  method  : 'GET',
				  url     : serviceBaseUrl+'user/logout',          
				  data: $httpParamSerializerJQLike(formData),  // convert object to url encoded params
				  headers : {'Content-Type': 'application/x-www-form-urlencoded'}  // post data as form data instead of Json Input
				 })
				  .success(function(data, status, headers, config) {            
					return data;
				  })
				  .error(function(data, status, headers, config){
					  return data;
				});
		return promise;
	}
	
	this.get_user=function(formData){
		
		var promise= $http({
				  method  : 'GET',
				  url     : serviceBaseUrl+'user/get',          
				  data: $httpParamSerializerJQLike(formData),  // convert object to url encoded params
				  headers : {'Content-Type': 'application/x-www-form-urlencoded'}  // post data as form data instead of Json Input
				 })
				  .success(function(data, status, headers, config) {            
					return data;
				  })
				  .error(function(data, status, headers, config){
					  return data;
				});
		return promise;
	}
	
	this.refresh_token=function(){
		var promise=	 $http({
			  method  : 'GET',
			  url     : serviceBaseUrl+'user/refresh',          
			  //headers : {'Content-Type': 'application/x-www-form-urlencoded'} 
			 })
			  .success(function(data, status, headers, config) {            
				return data;
			  })
			  .error(function(data, status, headers, config){
				  return data;
			});
		return promise;
	}
	
	this.test=function(){
		console.log('Creating a promise on Service');   
		var promise=	 $http({
			  method  : 'GET',
			  url     : serviceBaseUrl+'user/test',          
			  //headers : {'Content-Type': 'application/x-www-form-urlencoded'} 
			 })
			  .success(function(data, status, headers, config) {   
			  	console.log('Success TEST');         
				//return status;
			  })
			  .error(function(data, status, headers, config){
				  console.log('Error TEST');				  
				  //return config;
			});
		console.log('Retuning a promise to controller'); 
		return promise;
	}
	
	
	
    
});