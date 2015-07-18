angular.module('bookApp', [])
  .controller('SearchBookController', function($http) {
    var bookSearch = this;

    bookSearch.search = function() {
      bookSearch.state = "loading...";
      $http.get("/api/isbn/" + bookSearch.isbn)
        .success(function(response){
          bookSearch.result = response;
          bookSearch.state = "";
          console.log(bookSearch.result);
        });
      //bookSearch.isbn = '';
    };
  });
