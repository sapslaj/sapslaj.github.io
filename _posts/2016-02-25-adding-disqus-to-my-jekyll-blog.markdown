---
layout: post
title: Adding Disqus to My Jekyll Blog
date: 2016-02-25T12:04:06-05:00
category: how-to
tags:
- code
- blog
- javascript
- comments
---

This is probably already on the internet, but I'll just go over how to add Disqus comments to a Jekyll blog.

First step... Sign up for [Disqus](https://disqus.com)! You can sign in with Facebook, Twitter, or Google if you so desire, so that's pretty cool.

Next thing to do is to Register your site with Disqus, so click on the settings cog, "Add Disqus To Site." Start using Engage or whatever, go through the registration steps, and select *Universal Code* whenever you get to that step.

![Settings Cog dropdown](http://i.imgur.com/HGh7eOO.png)

![Universal Code](http://i.imgur.com/MlhsnGl.png)

Now for the fun part! Grab the code Disqus gives you and throw that in `_includes/disqus-comments.html`. Then just use a [Liquid include tag](http://jekyllrb.com/docs/templates/#includes).

{% raw %}
```html
[sapslaj@sapslaj-desktop sapslaj.github.io (master)]$ touch _includes/disqus-comments.html
[sapslaj@sapslaj-desktop sapslaj.github.io (master)]$ out _includes/disqus-comments.html
<div id="disqus_thread"></div>
<script>
(function() { // DON'T EDIT BELOW THIS LINE
var d = document, s = d.createElement('script');

s.src = '//sapslaj.disqus.com/embed.js';

s.setAttribute('data-timestamp', +new Date());
(d.head || d.body).appendChild(s);
})();
</script>
<noscript>Please enable JavaScript to view the <a href="https://disqus.com/?ref_noscript" rel="nofollow">comments powered by Disqus.</a></noscript>
```


```html
[sapslaj@sapslaj-desktop sapslaj.github.io (master)]$ tail _layouts/post.html
    <div class="meta">
      {% include post-meta.html post=page %}
    </div>
  </header>
  <section>
    {{ content }}
  </section>
</artcle>

{% include disqus-comments.html %}

```
{% endraw %}

That's pretty much it. Disqus makes it really easy to integrate their platform with your site, even without any sort of backend CMS. You can leave off the Disqus configuration code. It's dead simple.
