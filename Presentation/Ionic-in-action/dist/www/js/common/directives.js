/*dirModule.directive(
          "preLoading",
          function ($animate) {
              return ({
                  link: link,
                  restrict: "C"
              });
              function link(scope, element, attributes) {
                  $animate.leave(element.children().eq(1)).then(
                      function cleanupAfterAnimation() {
                          element.remove();
                          scope = element = attributes = null;
                      }
                  );
              }
          }
      );*/

var dirModule = angular.module('app.directives', []);