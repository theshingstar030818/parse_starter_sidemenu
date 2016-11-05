/**
 * beginnings of a controller to login to system
 * here for the purpose of showing how a service might
 * be used in an application
 */
angular.module('user.controllers', [])
    .controller('LoginController', [
        '$state', '$scope', 'UserService',   // <-- controller dependencies
        function ($state, $scope, UserService) {

            //debugger;

            // ng-model holding values from view/html
            $scope.creds = {
                username: "22",
                password: "22"
            };

            /**
             *
             */
            $scope.doLogoutAction = function () {
                UserService.logout()
                    .then(function (_response) {
                        // transition to next state
                        $state.go('app-login');
                    }, function (_error) {
                        alert("error logging in " + _error.debug);
                    })
            };

            /**
             *
             */
            $scope.doLoginAction = function () {
                UserService.login($scope.creds.username, $scope.creds.password)
                    .then(function (_response) {

                        alert("login success " + _response.attributes.username);
                        if(window.cordova && window.cordova.plugins){
                            FCMPlugin.getToken(
                              function(token){
                                //alert(token);
                                
                                // transition to next state
                                $state.go('app.components');
                              },
                              function(err){
                                alert('error retrieving token: ' + err);
                                // transition to next state
                                $state.go('app.components');
                              }
                            )
                        }else{
                            $state.go('app.components');
                        }

                    }, function (_error) {
                        alert("error logging in " + _error.message);
                    })
            };
        }])
    .controller('SignUpController', [
        '$state', '$scope', 'UserService',   // <-- controller dependencies
        function ($state, $scope, UserService) {

            $scope.creds = {};

            /**
             *
             */
            $scope.signUpUser = function () {

                //UserService.init();

                UserService.createUser($scope.creds).then(function (_data) {
                    $scope.user = _data;

                    alert("Success Creating User Account ");

                    $state.go('app.components', {});

                }, function (_error) {
                    alert("Error Creating User Account " + _error.debug)
                });
            }
        }]);
