---
layout: post
title: Testing Libraries Suck
date: 2015-11-16T08:29:37-05:00
category: rants
tags:
- ruby
- testing
- code
- opinion
---

Ooh man. Ruby testing. Most projects I see today are using [RSpec](http://rspec.info/), while [DHH is so offended by RSpec he uses Test::Unit](http://www.rubyinside.com/dhh-offended-by-rspec-debate-4610.html). Ever since [MiniTest](https://github.com/seattlerb/minitest) replaced [Test::Unit](https://github.com/test-unit/test-unit) as the default testing library for Ruby, I can agree with him now. What happened? MiniTest::Spec happened!

For those who are unaware, MiniTest::Spec is a spec framework that intends to compete somewhat with RSpec. It's main benefit is that it's [_very_ simply implemented](https://github.com/seattlerb/minitest/blob/master/lib/minitest/spec.rb) and doesn't require the same kinds of complexity to achieve a similar result. That still doesn't mean you should just carry on doing it the RSpec way.

## What's wrong with the RSpec way?

I'll admit I haven't read through [The RSpec Book](https://pragprog.com/book/achbd/the-rspec-book), but I have researched enough about testing to know that I believe the RSpec way is flawed.

> The issue is that RSpec is trying way too hard to be plain English

Correct use of `describe` and `context` blocks as well as meaningful spec descriptions are fantastic and I completely agree with using them. But RSpec tried too hard to be plain English that it ultimately makes tests less maintainable.

Let's take a look at some examples from [Better Specs](http://betterspecs.org/):

{% highlight ruby %}
context 'when not valid' do
  it { is_expected.to respond_with 422 }
end
{% endhighlight %}

This example pretty much sums up what I'm saying. I should note that this code is verbatim but the real-world implementation would actually require a `let` or `before` to set up the context. Here's how I would implement the same thing:

{% highlight ruby %}
it 'responds with 422 when not valid' do
  assert_response(422)
end
{% endhighlight %}

It probably seems similar to what Better Specs is saying _not_ to do, but their example is very biased:

{% highlight ruby %}
it 'has 422 status code if an unexpected params will be added' do
{% endhighlight %}

By combining the `context` and spec descriptions into one block, it saves one level and makes maintaining that test easier. Secondly, instead of trying to process the DSL and wondering if you need to use `is_expected`, `expect`, or `should`, simply use an `assert`. `assert`s are very simple. If whatever you pass to them evaluates to true, they pass. Else, they fail. You can even use MiniTest::Spec's matchers for a more DSL-ish without going too crazy:

{% highlight ruby %}
it 'responds with 422 when not valid' do
  must_respond_with 422
end
{% endhighlight %}

You might go crazy saying there's duplication or something there. But the thing is, you are providing a plain English description of what it should be doing, then testing that with plain, little magic, Ruby.

## But wait, Test::Unit, you aren't off the hook yet

The plain English thing goes both ways. Test::Unit doesn't try hard enough. Having everything as plain Ruby classes and methods is fine and dandy until you get shit like this:
{% highlight ruby %}
class DatabaseTasksCreateCurrentTest < Test::Unit::TestCase
  def test_creates_test_and_development_databases_when_env_was_not_specified
  ...
{% endhighlight %}

Yes, I pulled that from a _very_ popular library using Test::Unit.

Really the only pro to this approach is that I find it easier to translate a programming language to a thought when using simple constructs and not some complicated DSL with so much magic it belongs at Hogwarts.

{% highlight ruby %}
subject.should_receive(:post).with(subject::PATH, :body => hash_including(key => value)).and_return double(:parsed_response => {})
{% endhighlight %}

## Bottom line

> Using strings to define the test gives you freedom to use plain English, punctuation and all. It separates logic from metadata. It's a good thing.

> Using simple constructs like assertions and expectations make it easier to write as well as read tests.

In a future post, I'll go through how I test.
