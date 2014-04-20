var app = angular.module('MyApp', []);
app.run(function($templateCache) {
  var myForm = '<form name="myForm"><input name="input" ng-model="model" required /></form>';
  $templateCache.put('myForm.html', myForm);
});

app.controller('formController', function() {
  // Empty controller body, we just need the definition
});
