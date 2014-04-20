These tests are meant as a how to do the most basic unit tests of different angular
components.

## Instructions

    $ bower install
    $ npm install
    $ npm test

## TODO

  * [States](https://github.com/angular-ui/ui-router) with resolutions


## [formControllerSpec](test/formControllerSpec.js)
There is little documentation available on unit testing controllers
that depend on a `$formController`. That is, how to test controllers that depend
forms on their scope.

_In short_: `$compile` your template, passing in the controller scope to
initialize the `scope.formName` references before handing it to your controller.
Remember to run `scope.$digest()` to intialize the state.
