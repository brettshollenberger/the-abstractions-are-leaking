describe("ARPaginatable", function() {
  describe("Starting in the middle of a list", function() {
    var posts;
    beforeEach(function() {
      backend.whenGET("https://api.edmodo.com/posts.json?author_id=1&page=1&per_page=5")
      .respond(200, [{id: 1}, {id: 2}, {id: 3}, {id: 4}, {id: 5}],
        {'Link': 
          '<https://api.edmodo.com/posts.json?author_id=1&page=2&per_page=5>; rel="next"'});

          backend.whenGET("https://api.edmodo.com/posts.json?author_id=1&page=2&per_page=5")
      .respond(200, [{id: 6}, {id: 7}, {id: 8}, {id: 9}, {id: 10}],
        {'Link': 
          '<https://api.edmodo.com/posts.json?author_id=1&page=1&per_page=5>; rel="previous", <https://api.edmodo.com/posts.json?author_id=1&page=3&per_page=5; rel="next"'});

          backend.whenGET("https://api.edmodo.com/posts.json?author_id=1&page=3&per_page=5")
      .respond(200, [{id: 11}, {id: 12}, {id: 13}, {id: 14}, {id: 15}],
        {'Link': 
          '<https://api.edmodo.com/posts.json?author_id=1&page=2&per_page=5>; rel="previous", <https://api.edmodo.com/posts.json?author_id=1&page=4&per_page=5; rel="next"'});

          backend.whenGET("https://api.edmodo.com/posts.json?author_id=1&page=4&per_page=5")
      .respond(200, [{id: 16}, {id: 17}, {id: 18}, {id: 19}, {id: 20}],
        {'Link': 
          '<https://api.edmodo.com/posts.json?author_id=1&page=3&per_page=5>; rel="previous", <https://api.edmodo.com/posts.json?author_id=1&page=5&per_page=5; rel="next"'});

          backend.whenGET("https://api.edmodo.com/posts.json?author_id=1&page=5&per_page=5")
            .respond(200, [{id: 21}, {id: 22}, {id: 23}, {id: 24}, {id: 25}],
                {'Link': 
                  '<https://api.edmodo.com/posts.json?author_id=1&page=4&per_page=5>; rel="previous"'});

      posts = Post.where({author_id: 1, page: 3, per_page: 5});

      spyOn($http, "get").andCallThrough();
      backend.flush();

      posts.paginate();
    });

    it("starts off on the requested page", function() {
      expect(posts.first().id).toEqual(11);
      expect(posts.last().id).toEqual(15);
    });

    it("moves to the next page", function() {
      backend.flush();
      posts.next_page();

      expect(posts.first().id).toEqual(16);
      expect(posts.last().id).toEqual(20);
    });

    it("stores hypermedia", function() {
      expect(posts.paginationHypermedia().next.params).toEqual({
        author_id: 1,
        page: 4,
        per_page: 5
      });

      expect(posts.paginationHypermedia().previous.params).toEqual({
        author_id: 1,
        page: 2,
        per_page: 5
      });
    });

    it("preloads hypermedia when it moves to the next page", function() {
      backend.flush();
      posts.next_page();
      backend.flush();

      expect(posts.first().id).toEqual(16);
      expect(posts.last().id).toEqual(20);

      expect(posts.paginationHypermedia().next.params).toEqual({
        author_id: 1,
        page: 5,
        per_page: 5
      });

      posts.next_page();

      expect(posts.first().id).toEqual(21);
      expect(posts.last().id).toEqual(25);
    });

    it("preloads hypermedia when it moves to the previous page", function() {
    });
  });
});

// xdescribe("ARPaginatable", function() {

//   describe("Starting at the beginning of a list", function() {
//     var posts;
//     beforeEach(function() {
//       backend.whenGET("https://api.edmodo.com/posts.json?author_id=1&per_page=5")
//       .respond(200, [{id: 1}, {id: 2}, {id: 3}, {id: 4}, {id: 5}],
//         {'Link': 
//           '<https://api.edmodo.com/posts.json?author_id=1&page=2&per_page=5>; rel="next"'});

//           backend.whenGET("https://api.edmodo.com/posts.json?author_id=1&page=2&per_page=5")
//       .respond(200, [{id: 6}, {id: 7}, {id: 8}, {id: 9}, {id: 10}],
//         {'Link': 
//           '<https://api.edmodo.com/posts.json?author_id=1&page=1&per_page=5>; rel="previous"'});

//           posts = Post.where({author_id: 1, per_page: 5});

//           spyOn($http, "get").andCallThrough();
//           backend.flush();

//           posts.paginate({per_page: 2});
//     });

//     it("implements a list of pages", function() {
//       expect(posts.__pages()[1].first().id).toEqual(1);
//       expect(posts.__pages()[1].last().id).toEqual(2);
//     });

//     it("rehashes the list of pages", function() {
//       posts.__per_page = 4;
//       expect(posts.__pages()[1].first().id).toEqual(1);
//       expect(posts.__pages()[1].last().id).toEqual(4);
//     });

//     it("has a default pagination attribute", function() {
//       expect(posts.__paginationAttribute()).toEqual("page");
//     });

//     it("maintains a list of params it has searched by", function() {
//       expect(posts.__acquiredQueries()).toEqual([
//         {
//           author_id: 1,
//           per_page: 5,
//           page: 1
//         }
//         ]);

//       posts.next_page();
//       backend.flush();
//       posts.next_page();

//       expect(posts.__acquiredQueries()).toContain(
//         {
//           author_id: 1,
//           per_page: 5,
//           page: 2
//         }
//         );
//     });

//     it("returns the current page", function() {
//       expect(posts.current_page().first().id).toEqual(1);
//       expect(posts.current_page().last().id).toEqual(2);
//     });

//     it("moves to the next page on the client", function() {
//       posts.next_page();

//       expect(posts.current_page().first().id).toEqual(3);
//       expect(posts.current_page().last().id).toEqual(4);
//     });

//     it("moves to the previous page on the client", function() {
//       posts.next_page();
//       posts.previous_page();

//       expect(posts.current_page().first().id).toEqual(1);
//       expect(posts.current_page().last().id).toEqual(2);
//     });

//     it("knows when a next page exists", function() {
//       expect(posts.next_page_exists()).toBe(true);
//       posts.next_page();
//       expect(posts.next_page_exists()).toBe(true);
//       backend.flush();
//       posts.next_page();
//       expect(posts.next_page_exists()).toBe(true);
//       posts.next_page();
//       expect(posts.next_page_exists()).toBe(true);
//       posts.next_page();
//       expect(posts.next_page_exists()).toBe(false);
//     });

//     it("knows when a previous page exists", function() {
//       expect(posts.previous_page_exists()).toBe(false);
//       posts.next_page();
//       expect(posts.previous_page_exists()).toBe(true);
//       posts.next_page();
//       backend.flush();
//       expect(posts.previous_page_exists()).toBe(true);
//       posts.next_page();
//       expect(posts.previous_page_exists()).toBe(true);
//       posts.next_page();
//       expect(posts.previous_page_exists()).toBe(true);
//     });

//     it("does not move forward a page when no additional pages exist", function() {
//       posts.next_page();
//       backend.flush();
//       posts.next_page();
//       posts.next_page();
//       posts.next_page();
//       expect(posts.next_page_exists()).toBe(false);

//       var last_page = posts.current_page();

//       posts.next_page();
//       expect(posts.current_page()).toEqual(last_page);
//     });

//     it("does not move back a page when no previous pages exist", function() {
//       expect(posts.previous_page_exists()).toBe(false);

//       var first_page = posts.current_page();

//       posts.previous_page();
//       expect(posts.current_page()).toEqual(first_page);
//     });

//     it("knows whether or not hypermedia exists", function() {
//       expect(posts.__hypermedia_exists()).toBe(true);
//       posts.next_page();
//       backend.flush();
//       expect(posts.__hypermedia_exists()).toBe(false);
//     });

//     it("by default preloads the next page when it doesn't have enough entries", function() {
//       _.each(_.range(2), function() { posts.next_page(); });
//       backend.flush();

//       expect($http.get.mostRecentCall.args[0])
//       .toEqual("https://api.edmodo.com/posts.json");

//     expect($http.get.mostRecentCall.args[1].params)
//       .toEqual({ author_id : 1, page : 2, per_page : 5 });
//     });

//     it("loads in the next page worth of data internally", function() {
//       posts.next_page();
//       backend.flush();
//       posts.next_page();

//       expect(posts.current_page().first().id).toEqual(5);
//       expect(posts.current_page().last().id).toEqual(6);

//       posts.next_page();

//       expect(posts.current_page().first().id).toEqual(7);
//       expect(posts.current_page().last().id).toEqual(8);
//     });
//   });

//   describe("Starting in the middle of a list", function() {
//     var posts;
//     beforeEach(function() {
//       backend.whenGET("https://api.edmodo.com/posts.json?author_id=1&page=1&per_page=5")
//              .respond(200, [{id: 1}, {id: 2}, {id: 3}, {id: 4}, {id: 5}],
//           {'Link': 
//             '<https://api.edmodo.com/posts.json?author_id=1&page=2&per_page=5>; rel="next"'});

//           backend.whenGET("https://api.edmodo.com/posts.json?author_id=1&page=2&per_page=5")
//                  .respond(200, [{id: 6}, {id: 7}, {id: 8}, {id: 9}, {id: 10}],
//           {'Link': 
//             '<https://api.edmodo.com/posts.json?author_id=1&page=1&per_page=5>; rel="previous", <https://api.edmodo.com/posts.json?author_id=1&page=3&per_page=5; rel="next"'});

//           backend.whenGET("https://api.edmodo.com/posts.json?author_id=1&page=3&per_page=5")
//                  .respond(200, [{id: 11}, {id: 12}, {id: 13}, {id: 14}, {id: 15}],
//           {'Link': 
//             '<https://api.edmodo.com/posts.json?author_id=1&page=2&per_page=5>; rel="previous", <https://api.edmodo.com/posts.json?author_id=1&page=4&per_page=5; rel="next"'});

//           backend.whenGET("https://api.edmodo.com/posts.json?author_id=1&page=4&per_page=5")
//                  .respond(200, [{id: 16}, {id: 17}, {id: 18}, {id: 19}, {id: 20}],
//           {'Link': 
//             '<https://api.edmodo.com/posts.json?author_id=1&page=3&per_page=5>; rel="previous", <https://api.edmodo.com/posts.json?author_id=1&page=5&per_page=5; rel="next"'});

//           backend.whenGET("https://api.edmodo.com/posts.json?author_id=1&page=5&per_page=5")
//                  .respond(200, [{id: 21}, {id: 22}, {id: 23}, {id: 24}, {id: 25}],
//           {'Link': 
//             '<https://api.edmodo.com/posts.json?author_id=1&page=4&per_page=5>; rel="previous"'});

//           posts = Post.where({author_id: 1, page: 3, per_page: 5});

//           spyOn($http, "get").andCallThrough();
//           backend.flush();

//           posts.paginate({per_page: 5});
//     });

//     it("starts off on the requested page", function() {
//       expect(posts.current_page().first().id).toEqual(11);
//       expect(posts.current_page().last().id).toEqual(15);
//     });

//     it("has previous page hypermedia", function() {
//       expect(posts.__previous_page_hypermedia().params.page).toEqual(2);
//     });

//     it("has next page hypermedia", function() {
//       expect(posts.__next_page_hypermedia().params.page).toEqual(4);
//     });

//     it("preloads the previous page", function() {
//       backend.flush();
//       posts.previous_page();
//       expect(posts.current_page().first().id).toEqual(6);
//       expect(posts.current_page().last().id).toEqual(10);
//     });

//     it("preloads the next page", function() {
//       backend.flush();
//       posts.next_page();
//       expect(posts.current_page().first().id).toEqual(16);
//       expect(posts.current_page().last().id).toEqual(20);
//     });

//     it("properly adds previous page hypermedia", function() {
//       backend.flush();
//       expect(posts.__next_page_hypermedia().params.page).toEqual(5);
//       expect(posts.__previous_page_hypermedia().params.page).toEqual(1);
//     });
//   });
// });
