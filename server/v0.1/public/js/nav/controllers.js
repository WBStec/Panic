controllerModule.controller('MenuCtrl', [
    'NavService', '$mdSidenav', '$mdBottomSheet', '$log', '$q', '$cookies','$rootScope',
    function(NavService, $mdSidenav, $mdBottomSheet, $log, $q, $cookies,$rootScope) {
        var self = this;


        self.toggleLeft = buildToggler('left');
        self.toggleRight = buildToggler('right');


        // *********************************
        // Internal methods
        // *********************************

        /**
         * Hide or Show the 'left' sideNav area
         */
        function toggleSideNav() {
            $mdSidenav('left').toggle();
        }

        //Load all menu items

        $rootScope.$on('SUCCESSFUL_LOGIN',function(){
           console.log('on login');

            NavService
                .loadUserItems()
                .then(function(items) {
                    self.navs = [].concat(items);
                    self.selected = items[0];
                });

        });


        NavService
            .loadUserItems()
            .then(function(items) {
                self.navs = [].concat(items);
                self.selected = items[0];
            });

        self.selectState = function(selected) {
            self.selected = selected;
            $mdSidenav('left')
                .close()
        };
        /**
         * Supplies a function that will continue to operate until the
         * time is up.
         */

        function buildToggler(navID) {
            console.log("toggling nav");
            return function() {
                $mdSidenav(navID)
                    .toggle()
                    .then(function() {
                        $log.debug("toggle " + navID + " is done");
                    });
            }
        }

    }
]);
