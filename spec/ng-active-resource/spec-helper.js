var Mocks, ngActiveResource, Post, Comment, Person, Hat, Collection, TShirt, API, backend, $http;
beforeEach(module('ngActiveResource'));
beforeEach(module('Mocks'));
beforeEach(inject(function(_ngActiveResource_, _Mocks_, _ARMime_, _ARAPI_, $httpBackend, _$http_) {
  ngActiveResource = _ngActiveResource_;
  Mocks            = _Mocks_;
  Post             = Mocks.Post;
  Comment          = Mocks.Comment;
  Person           = Mocks.Person;
  Hat              = Mocks.Hat;
  Collection       = Mocks.Collection;
  TShirt           = Mocks.TShirt;
  Mime             = _ARMime_;
  API              = _ARAPI_;
  backend          = $httpBackend;
  $http            = _$http_;
}));
