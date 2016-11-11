app.controller('AppCtrl', function ($scope, $ionicModal, $ionicPopover, $timeout, UserService, $state, DataStoreService) {
    
    //Form data for the login modal
    $scope.loginData = {};
    $scope.currentUser = null;

    if(UserService.getCurrentUser() == null){
        //if the web user presses refresh button need to fetch this again
        UserService.getUser(Parse.User.current().toJSON())
            .then(function (_response) {
                UserService.setCurrentUser(_response[0]);
                $scope.currentUser = _response[0];
                //console.log("user refetched : " + JSON.stringify(_response[0]));
            }, function (_error) {
                alert("error getting user in " + _error.message);
            })
    }else{
        $scope.currentUser = UserService.getCurrentUser();
    }
    
    DataStoreService.init();

    // .fromTemplate() method
    var template = '<ion-popover-view>' +
                    '   <ion-header-bar>' +
                    '       <h1 class="title">My Popover Title</h1>' +
                    '   </ion-header-bar>' +
                    '   <ion-content class="padding">' +
                    '       My Popover Contents' +
                    '   </ion-content>' +
                    '</ion-popover-view>';
    $scope.popover = $ionicPopover.fromTemplate(template, {
        scope: $scope
    });
    $scope.closePopover = function () {
        $scope.popover.hide();
    };
    //Cleanup the popover when we're done with it!
    $scope.$on('$destroy', function () {
        $scope.popover.remove();
    });
    $scope.doLogoutAction = function () {
        UserService.logout().then(function () {

            // transition to next state
            $state.go('app-login');

        }, function (_error) {
            alert("error logging in " + _error.debug);
        })
    };

    //databinding for modal
    $scope.uploadProfilePicture = {};

    $ionicModal.fromTemplateUrl('templates/modals/profilepic-modal.html', {
        scope: $scope
        }).then(function(modal) {
            $scope.modal = modal;
            $scope.uploadme = {};
            $scope.uploadme.src = "";
        });
      
    $scope.createContact = function(u) {        
        $scope.contacts.push({ name: u.firstName + ' ' + u.lastName });
        $scope.modal.hide();
    };
    $scope.openModal = function() {
        $scope.modal.show();
    };
    $scope.closeModal = function(a) {
        $scope.modal.hide();
    };
    // Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
        $scope.modal.remove();
    });
    // Execute action on hide modal
    $scope.$on('modal.hidden', function() {
        // Execute action
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function() {
        // Execute action
    });
    $scope.uploadProfilePic = function(){
        if($scope.uploadProfilePicture.src){
            var pictureObject = $scope.uploadProfilePicture;
            var encodedData = window.btoa(pictureObject.src);
            pictureObject.encodedData = encodedData;
            pictureObject.user = $scope.currentUser.toJSON();
            pictureObject.ext = /[^/]*$/.exec(pictureObject.src.match(/[^;]*/)[0])[0];
            UserService.uploadProfilePicture(pictureObject)
                .then(function (_response) {
                    console.log(_response);
                }, function (_error) {
                    alert("error getting user in " + _error.message);
                })
        }
        
    }
});