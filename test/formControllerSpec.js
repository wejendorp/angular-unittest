
// Sample formController test
// Inspired by the angular form directive tests at
// https://github.com/angular/angular.js/blob/v1.2.x/test/ng/directive/formSpec.js


describe('Form controller', function() {
  var $compile, $rootScope, $templateCache;

  beforeEach(angular.mock.module('MyApp'));

  beforeEach(inject(function(_$compile_, _$rootScope_, _$templateCache_){
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    $templateCache = _$templateCache_;
  }));

  it('should invalidate form unless model value is set', function() {
    var scope = $rootScope.$new();
    // Any html will do. For convenience we'll use the cache:
    var template = $templateCache.get('myForm.html');
    // Save the angular.element to validate template behavior:
    var element = $compile(template)(scope);

    // scope.myForm should now be a $formController
    expect(scope.myForm).toBeDefined();
    // Run a digest to update formController state
    scope.$digest();
    // Form is invalid without scope.model
    expect(scope.myForm.$valid).toBe(false);
    expect(scope.myForm.input.$valid).toBe(false);

    // Does the DOM do as expected?
    // with jqLite you can only select by tagname:
    // var input = element.find('input').next();
    //
    // With jQuery you can use attribute selectors etc.
    var input = element.find('input[type="submit"]');
    expect(input.attr('disabled')).toBeTruthy();

    // Update model. Remember to run the digest for all changes
    scope.model = 'angular';
    scope.$digest();

    expect(scope.myForm.$valid).toBe(true);
    expect(scope.myForm.input.$valid).toBe(true);
    // And DOM?
    expect(input.attr('disabled')).toBeFalsy();
  });
});
