$(function () {
  // Search page functionality
  if (location.pathname.indexOf('search') != -1) {
    (function () {
      var $search_query = $('.search-query');
      var $search_results = $('.search-results-list');
      var posts = [];
      var template = Handlebars.compile($('#search-result-template').html());
      var index = lunr(function () {
        this.field('title', { boost: 10 });
        this.field('category', { boost: 5 });
        this.field('tags', { boost: 5 });
        this.field('body');
        this.ref('id');
      });

      function search(query) {
        $search_results.html('');

        index.search(query).forEach(function (result, index) {
          $search_results.append(template(post(result.ref)));
        });
      };

      function post(id) {
        var return_post;
        posts.forEach(function (post, index) {
          if (post.id == id) {
            return_post = post;
            return;
          };
        });
        return return_post;
      };

      $.get('/posts.json', function (data) {
        data.forEach(function (post, id) {
          posts.push(post);
          index.add(post);
        });
      });

      $search_query.on('keyup', function (event) {
        search($search_query.val());
      });
    })();
  };
});
