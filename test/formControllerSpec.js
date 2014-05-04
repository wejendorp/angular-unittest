
// Sample formController test
// Inspired by the angular form directive tests at
// https://github.com/angular/angular.js/blob/v1.2.x/test/ng/directive/formSpec.js

// Load the app
// Definition included in test for completeness

var app = angular.module('FormApp', []);

app.run(function($templateCache) {
  var form = [];
  form.push('<form name="myForm">');
  form.push('<input name="input" ng-model="model" required ng-class="{invalid: myForm.input.$invalid}" />');
  form.push('<input type="submit" ng-disabled="myForm.$invalid" />');
  form.push('</form>');
  var myForm = form.join('');
  // This is equivalent to defining the template in html
  $templateCache.put('myForm.html', myForm);
});

app.controller('formController', function() {
  // Empty controller body, we just need the definition
});



describe('FormApp/formController', function() {
  var $compile, $rootScope, $templateCache;

  beforeEach(module('FormApp'));

  beforeEach(inject(function(_$compile_, _$rootScope_, _$templateCache_){
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    $templateCache = _$templateCache_;
  }));

  beforeEach(function() {
    this.scope = $rootScope.$new();
    // Any html will do. For convenience we'll use the cache:
    var template = $templateCache.get('myForm.html');
    // Save the angular.element to validate template behavior:
    this.element = $compile(template)(this.scope);

    // scope.myForm should now be a $formController
    expect(this.scope.myForm).toBeDefined();
    // Run a digest to update formController state
    this.scope.$digest();
  });

  it('should invalidate form unless model value is set', function() {
    // Form is invalid without scope.model
    expect(this.scope.myForm.$valid).toBe(false);
    expect(this.scope.myForm.input.$valid).toBe(false);

    // with jqLite you can only select by tagname
    // var input = element.find('input').next();

    // With jQuery you can use attribute selectors etc.
    var input = this.element.find('input[type="submit"]');
    expect(input.attr('disabled')).toBeTruthy();

    // Update model. Remember to run the digest for all changes
    this.scope.model = 'angular';
    this.scope.$digest();

    expect(this.scope.myForm.$valid).toBe(true);
    expect(this.scope.myForm.input.$valid).toBe(true);
    // And the DOM
    expect(input.attr('disabled')).toBeFalsy();
  });
});
