angular.module('bookApp', [])
  .controller('SearchBookController', function($http, $filter, $scope) {
    var bookSearch = this;

    function SetFields(options, inputName) {
      $("#" + inputName).closest("div").addClass("is-dirty");
      return options.constructor.toString().indexOf('Array') >= 0 ? options[0] : options;
    }

    bookSearch.search = function() {
      bookSearch.state = "loading...";
      $http.get("/api/isbn/" + bookSearch.isbn)
        .success(function(response){
          bookSearch.result = response;
          bookSearch.state = "";

          bookSearch.Title = SetFields(bookSearch.result.searchData.Title, "title");
          bookSearch.SubTitle = SetFields(bookSearch.result.searchData.SubTitle, "subtitle");
          bookSearch.Author = SetFields(bookSearch.result.searchData.Author, "author");
          bookSearch.ImageUrl = SetFields(bookSearch.result.searchData.ImageUrl, "imageUrl");
          bookSearch.Language = SetFields(bookSearch.result.searchData.Language, "language");
          bookSearch.Publisher = SetFields(bookSearch.result.searchData.Publisher, "publisher");
          bookSearch.Pages = SetFields(bookSearch.result.searchData.Pages, "pages");
          bookSearch.PublishDate = $filter('date')(SetFields(bookSearch.result.searchData.PublishDate, "publishDate"), "yyyy-MM-dd");
          bookSearch.Series = SetFields(bookSearch.result.searchData.Series, "series");
          bookSearch.Spec = SetFields(bookSearch.result.searchData.Spec, "spec");

          console.log(bookSearch.result);
        });
      //bookSearch.isbn = '';
    };

    bookSearch.setOption = function (field, data) {
      bookSearch[field] = data;
    };
  });
