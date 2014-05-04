
// Sample StateProvider test
// http://stackoverflow.com/questions/20433485/angular-ui-router-unit-testing-states-to-urls#answer-21078955

// Load the app
// Definition included in test for completeness

var app = angular.module('StateApp', ['ui.router']);
app.config(function($stateProvider) {
  $stateProvider.state('myState', {
    url: '/state/:id',
    templateUrl: 'template.html',
    controller: 'MyCtrl',
    resolve: {
      data: ['myService', function(service) {
        return service.findAll();
      }]
    }
  });
  $stateProvider.state('myState.dolphins', {
    url: '/dolphins',
    template: '<h1>Dolphins!</h1>'
  });
});
app.controller('MyCtrl', function() {});

describe('StateApp/myState', function() {

  var $rootScope, $state, $injector, myServiceMock, state = 'myState';

  beforeEach(function() {

    module('StateApp', function($provide) {
      $provide.value('myService', myServiceMock = {});
    });

    inject(function(_$rootScope_, _$state_, _$injector_, $templateCache) {
      $rootScope = _$rootScope_;
      $state = _$state_;
      $injector = _$injector_;

      // We need add the template entry into the templateCache if we ever
      // specify a templateUrl
      $templateCache.put('template.html', '');
    });
  });

  it('should respond to URL', function() {
    expect($state.href(state, { id: 1 })).toEqual('#/state/1');
  });

  it('should resolve data', function() {
    myServiceMock.findAll = jasmine.createSpy('findAll').andReturn('findAll');

    $state.go(state, { id: 1 });
    $rootScope.$digest();
    expect($state.current.name).toBe(state);

    // Call invoke to inject dependencies and run function
    expect($injector.invoke($state.current.resolve.data)).toBe('findAll');
  });

  it('should resolve nested data', function() {
    myServiceMock.findAll = jasmine.createSpy('findAll').andReturn('findAll');

    $state.go(state+'.dolphins', { id: 1 });
    $rootScope.$digest();
    expect($state.current.name).toBe(state+'.dolphins');

    // $state.$current.locals.globals is the resolved values with inherited values
    expect($state.$current.locals.globals.data).toBe('findAll');
  });
});
