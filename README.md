# Angular unittest

These tests are meant as a how to do the most basic unit tests of different angular
components. Either where the angular documentation falls short, or for commonly used
non-standard libraries.

If you have not read the official unit testing guide, start
[here](https://docs.angularjs.org/guide/unit-testing).

**Disclaimer**: This is a work in progress, and is used as my personal playground
for figuring out how to do different kinds of testing. I hope you'll find some
of it useful, and would appreciate any and all feedback.

## Instructions
This project uses the karma test runner and the Jasmine testing framework.
All samples should be equally applicable to your chosen testing setup.

Dependencies are fetched via [npm(1)](https://github.com/npm/npm) and
[bower](https://github.com/bower/bower).

    $ npm install
    $ npm test

The `npm test` command is configured in `package.json` and is an alias for
`bower install` followed by `karma start karma.conf`.


## Controllers with forms
There is little documentation available on unit testing controllers
that depend on a [$formController](https://docs.angularjs.org/api/ng/type/form.FormController).
You depend on FormControllers whenever you access a form on the scope.

The only real clue on how to test forms, is found in the angular
[form directive test](https://github.com/angular/angular.js/blob/accd35b7471bbf58cd5b569a004824fa60fa640a/test/ng/directive/formSpec.js),
e.g. [L41-L44](https://github.com/angular/angular.js/blob/accd35b7471bbf58cd5b569a004824fa60fa640a/test/ng/directive/formSpec.js#L41-L44).

_Solution_: `$compile` your template, passing in the controller scope to
initialize the `scope.formName` references before handing it to your controller.
Remember to run `scope.$digest()` to intialize the state.

This has the added benefit of letting you access the
[element](https://docs.angularjs.org/api/ng/function/angular.element)
that is returned when compiling the template, and getting template behavior into
your tests.

```js
beforeEach(function() {
  this.scope    = $rootScope.$new();
  var template = $templateCache.get('myTemplate');
  this.element  = $compile(template)(this.scope);  
  this.scope.$digest();
});

// your scope is now tied to your template
it('is tied to form', function() {
  expect(this.scope.myForm.$valid).toBe(true);
  // Change some stuff here
  this.scope.model = 'angular';

  this.scope.$digest();
  /// Validate changes here

  expect(this.scope.myForm.$valid).toBe(true);
});

```

For a simple example as a full jasmine test, see the sample [formControllerSpec](test/formControllerSpec.js).

### See also
* [Form directive docs](https://docs.angularjs.org/api/ng/directive/form)
* [Form directive test](https://github.com/angular/angular.js/blob/accd35b7471bbf58cd5b569a004824fa60fa640a/test/ng/directive/formSpec.js)
* [formController docs](https://docs.angularjs.org/api/ng/type/form.FormController)
* [angular.element docs](https://docs.angularjs.org/api/ng/function/angular.element)

## Application States (ui-router)
### Urls
`$state.href` will return the url of any state for easy verification.
```js
it('should respond to URL', function() {
  expect($state.href('myState', { id: 1 })).toEqual('#/state/1');
});
```

### Resolves
A state is only as good as its data. How do we check if it resolves the
expected data?
We mock out the services that are expected to be called, and check that

```js
module('StateApp', function($provide) {
  $provide.value('myService', myServiceMock = {});
});
```
_Gotcha_: if you need to set up a modules `.config` step, you can do so in the
`module` functions' callback. Here we use the step to mock out a service.

```js
it('should resolve data', function() {
  myServiceMock.findAll = jasmine.createSpy('findAll').andReturn('findAll');

  $state.go(state, { id: 1 });
  $rootScope.$digest();
  expect($state.current.name).toBe(state);

  // Call invoke to inject dependencies and run function
  expect($injector.invoke($state.current.resolve.data)).toBe('findAll');
});
```

For a simple example as a full jasmine test, see the sample [appStateSpec](test/appStateSpec.js).

### Nested states

```js
expect($state.$current.locals.globals.data).toBe('findAll');
```
Note the difference. The method used above for `invoke($state.current.resolve.data)`
will only check resolutions defined on the chosen state.
For **nested states**, the resolved data is available as `$state.$current.locals.globals`,
which includes resolutions from parent states.

* Use `invoke` to get the isolated resolutions for the chosen state.
* Use `$state.$current.locals.globals` to get all resolutions of this state and
its parents.



### See also
* [ui-router wiki](https://github.com/angular-ui/ui-router/wiki)
* [$provide docs](https://docs.angularjs.org/api/auto/object/$provide)

Thanks to Philip Chen for [the answer](http://stackoverflow.com/questions/20433485/angular-ui-router-unit-testing-states-to-urls#answer-21078955)
to state mocking on StackOverflow.
