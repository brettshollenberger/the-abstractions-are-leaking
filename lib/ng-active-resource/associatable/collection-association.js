angular
  .module('ngActiveResource')
  .factory('ARAssociatable.CollectionAssociation', ['ARMixin', 
  'ARFunctional.Collection', 'ARDelegatable',
  function(mixin, FunctionalCollection, Delegatable) {

    function CollectionAssociation(owner, reflection) {
      var collection = mixin([], FunctionalCollection);
      privateVariable(collection, 'constructor', CollectionAssociation);

      collection.extend(Delegatable);

      collection.delegate(
        ["name", "klass", "options", "associationPrimaryKey",
         "inverse", "inverseKlass"]
      ).to(reflection);

      collection.new = function(attributes) {
        attributes = attributes || {};
        mixin(attributes, NewAttributes);

        return collection.klass()
                         .new(attributes.standardize())
                         .tap(function(instance) { collection.nodupush(instance); });
      }

      function NewAttributes() {
        privateVariable(this, 'standardize', function() {
          var defaults = {};
          defaults[collection.inverse().name] = owner;
          return _.defaults({}, this, defaults);
        });
      }

      return collection;
    }

    return CollectionAssociation;
  }]);