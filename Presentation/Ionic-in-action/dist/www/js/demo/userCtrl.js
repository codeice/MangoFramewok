!function(){"use strict";var e=angular.module("user.ctrl",[]);e.controller("userCtrl",["$scope","demoService","$ionicModal",function(e,o,r){e.persons=o.getList(),r.fromTemplateUrl("modal.html",{scope:e}).then(function(o){e.modal=o}),e.openModal=function(o){e.user=angular.copy(o),e.modal.show()},e.remove=function(e){o.remove(e)}}]),e.controller("userDetailCtrl",["$scope","$stateParams","demoService",function(e,o,r){var t=o.userId;e.user=r.getDetail(t)}])}();