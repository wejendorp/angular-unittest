var app = angular.module('MyApp', []);
app.run(function($templateCache) {
  var form = [];
  form.push('<form name="myForm">');
  form.push('<input name="input" ng-model="model" required ng-class="{invalid: myForm.input.$invalid}" />');
  form.push('<input type="submit" ng-disabled="myForm.$invalid" />');
  form.push('</form>');
  var myForm = form.join('');

  $templateCache.put('myForm.html', myForm);
});

app.controller('formController', function() {
  // Empty controller body, we just need the definition
});
