---
layout: post
title: How I Implemented lunr.js In My Blog
date: 2015-11-06T00:09:27-05:00
category: code
tags:
- code
- blog
- tutorial
---

As you probably are aware, this blog is hosted on GitHub pages and is powered by Jekyll. It provides an interesting challenge when dealing with dynamic content, such as search. Luckily, there is [lunr.js](http://lunrjs.com/), a client-side full text search engine. Sadly there isn't much _good_ documentation on how to implement it, so I'll just go over it quickly.

First go grab the JS or Minified JS from the [GitHub project](https://github.com/olivernn/lunr.js) or use a CDN and include it in your HTML page. While you're at it, go ahead and make a `search.js` file

{% highlight html %}
<script src="//cdnjs.cloudflare.com/ajax/libs/lunr.js/0.6.0/lunr.min.js" charset="utf-8"></script>
<script src="/js/search.js" charset="utf-8"></script>
{% endhighlight %}

Now we need to create the lunr.js index.

{% highlight javascript %}
var index = lunr(function () {
  this.field('title', { boost: 10 });
  this.field('category', { boost: 5 });
  this.field('tags', { boost: 5 });
  this.field('body');
  this.ref('id');
});
{% endhighlight %}

Of course your setup will be different. As you can see, you can apply boosts to certain fields. Pay attention to the `this.ref('id')` bit.

Now since I'm deploying to GitHub Pages, I can't just add in plugins. Therefore I have to do indexing client side, which is fine as long as your blog isn't [Coding Horror](http://blog.codinghorror.com/). Jekyll has a nifty Liquid filter called `jsonify` to turn anything into valid JSON. So let's create a `posts.json` and utilize that as well as some looping.


```
{% raw %}
---
layout: null
---

[
  {% for post in site.posts %}
    {
      "id": {{ post.id | jsonify }},
      "title": {{ post.title | jsonify }},
      "category": {{ post.category | jsonify}},
      "tags": {{ post.tags | jsonify }},
      "url": {{ post.url | jsonify }},
      "date": {{ post.date | jsonify }},
      "path": {{ post.path | jsonify }},
      "excerpt": {{ post.excerpt | strip_html | strip_newlines | jsonify }},
      "body": {{ post.content | strip_html | jsonify }},
      "content": {{ post.content | jsonify }}
    }
  {% endfor %}
]
{% endraw %}
```

Now we can simply get them with a `jQuery.get` call.
{% highlight javascript %}
var posts = [];

$.get('/posts.json', function (data) {
  data.forEach(function (post, id) {
    posts.push(post);
    index.add(post);
  });
});
{% endhighlight %}

Remember how I said to pay attention to the `this.ref('id')` bit? Well, Jekyll's idea of an id is something like `/2008/12/14/my-post`, and since posts are being stored in an array, it makes finding them a little tricky. Simple fix: use a post factory.

{% highlight javascript %}
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
{% endhighlight %}

Now you have the basics for client-side search! Still need to work on the view part. For my site, I used Handlebars, but you can use whatever floats your boat.

{% highlight html %}
{% raw %}
<div class="search">
  <span class="fa fa-search icon"></span>
  <input type="search" class="search-query" data-bind="value: query" placeholder="Search" autocomplete="off">
</div>

<div class="search-results">
  <h1>Search Results</h1>
  <div class="search-results-list">

  </div>
</div>

<script id="search-result-template" type="text/x-handlebars-template">
  <article>
    <header>
  		<h2>
        <a href="{{url}}">
          {{{title}}}
        </a>
      </h2>
    </header>
    <section>
      {{{excerpt}}}
    </section>
  </artcle>
</script>
{% endraw %}
{% endhighlight %}

If you chose to embed the template inside the search page, *be sure* to wrap it in a [{% raw %}{% raw %}{% endraw %}](https://github.com/Shopify/liquid/wiki/Liquid-for-Designers#raw) block so Jekyll doesn't evaluate the brackets.

From here, it's just wiring up the template to an event handler and you are good to go!

{% highlight javascript %}
var template = Handlebars.compile($('#search-result-template').html());

$('.search-query').on('keyup', function (event) {
  $('.search-results-list').html('');

  index.search(query).forEach(function (result, index) {
    $('.search-results-list').append(template(post(result.ref)));
  });
});
{% endhighlight %}

Congrats, you now have client side search on your Jekyll blog!
