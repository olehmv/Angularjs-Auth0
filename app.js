    'use strict';


     angular
    .module('authApp',['auth0', 'angular-storage', 'angular-jwt', 'ngMaterial', 'ui.router'])
    .config(function($provide, authProvider, $urlRouterProvider, $stateProvider, $httpProvider, jwtInterceptorProvider){
                  
     authProvider.init({
         domain: '',             
         clientID:''
     });  
         
    jwtInterceptorProvider.tokenGetter=function(store) {
        return store.get('id_token');
    }
    
    $urlRouterProvider.otherwise('/home');
         
    $stateProvider
       .state('home',{
         url:'/home',
         templateUrl: 'components/home/home.tpl.html'
      })
       .state('profile',{
         url:'/profile',
         templateUrl: 'components/profile/profile.tpl.html',
         controllerAs:'profileController as user'
      });
         
    $httpProvider.interceptors.push('jwtInterceptor');
         
     })
         .run(function($rootScope, auth, store, jwtHelper, $location) {
         
         $rootScope.$on('$locationChangeStart', function() {
             var token=store.get('id_token');
             if(token){
                 if(!jwtHelper.isTokenExpired(token)){
                     if(!auth.isAuthenticated){
                         auth.authenticate(store.get('profile',token))
                     }
                 }
             }else {
                 $location.path('/home');
             }
         })
  });