# Angular unittest

These tests are meant as a how to do the most basic unit tests of different angular
components. Either where the angular documentation falls short, or for commonly used
non-standard libraries.

If you have not read the official [unit testing guide](https://docs.angularjs.org/guide/unit-testing),
start there.

## Instructions

    $ bower install
    $ npm install
    $ npm test


## [Controllers with forms](test/formControllerSpec.js)
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
var scope    = $rootScope.$new();
var template = $templateCache.get('myTemplate');
var element  = $compile(template)(scope);
// your scope is now tied to your template

// Change some stuff here

scope.$digest();

/// Validate changes here

```

For a simple example as a full jasmine test, see the sample [formControllerSpec](test/formControllerSpec.js).

### See also
* [Form directive docs](https://docs.angularjs.org/api/ng/directive/form)
* [Form directive test](https://github.com/angular/angular.js/blob/accd35b7471bbf58cd5b569a004824fa60fa640a/test/ng/directive/formSpec.js)
* [formController docs](https://docs.angularjs.org/api/ng/type/form.FormController)
* [angular.element docs](https://docs.angularjs.org/api/ng/function/angular.element)
