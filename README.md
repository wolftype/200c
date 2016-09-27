### The website for UCSB MAT 200C 2016: Geometric Computing for Virtual Environments

To view this site, go to [wolftype.github.io/200c](http://wolftype.github.io/200c)

This uses github's built-in support for jekyll, a static blog generator.  To make one of your own such blogs you can follow the instructions [here](https://help.github.com/articles/setting-up-your-github-pages-site-locally-with-jekyll/).  Short hand is to:

1. Make a new repo on github.com and clone it.
		
		git clone https://my-user-name/myrepo.git
		cd myrepo

2. Make a branch called `gh-pages`

		git checkout -b gh-pages

3. Install ruby and bundler
	
		sudo gem install bundler

3. Make a Gemfile and add some stuff to it, namely:

		source 'https://rubygems.org'
		gem 'github-pages', group: :jekyll_plugins

4. Install the github jekyll plugins

		bundle install 

5. Add line to `_config.yml' that reads
		
		baseurl: "/myrepo"

6. Write posts to `_posts` folder, prepend href links with `{{site.baseurl}}/`

7. To preview your blog locally on your computer at `localhost:4000/myrepo`:

		bundle exec jekyll serve

8. Add, Commit, and Push changes

You can now view your static blog at `my-user-name.github.io/myrepo`.  To [add posts](https://jekyllrb.com/docs/posts/), add markdown (or html or optionally other with the right plug-in) files to the 
`_posts` folder with the name `YEAR-MONTH-DAY-postname.md`

Note you can also specify a folder in your master branch which github will use to publish to `yourname.github.io/yourrepo`.  See [this link](https://github.com/blog/2228-simpler-github-pages-publishing) for details.

For more info, see also [jekyll's github documentation](https://jekyllrb.com/docs/github-pages/)






