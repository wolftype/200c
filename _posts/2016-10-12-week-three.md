---
layout: page
category: schedule
---

3D Transformation Matrices  
[Slides from class]({{ site.baseurl}}/scratch/slides_01.html)

Reading: [gfx.js](http://rawgit.com/wolftype/200c/gh-pages/js/gfx.js)
Reading: [Matrix Tutorial]({{ site.baseurl}}{% post_url 2016-09-20-matrices%})  
Reading: [LearnOpenGL: Hello Triangle](http://learnopengl.com/#!Getting-started/Hello-Triangle)  
Reading: [LearnOpenGL: Transformations](http://learnopengl.com/#!Getting-started/Transformations)  
Reading: [LearnOpenGL: Coordinate Systems](http://learnopengl.com/#!Getting-started/Coordinate-Systems) 

<figure>
<iframe src="{{site.baseurl}}/scratch/webgl_gfx.html" 
    width="800" height="600" frameborder="0"
    scrolling="no" marginheight="0"
    marginwidth="0" ></iframe>
</figure>

**Coding Assignment**: One, Two, Three, Mesh!

Use the 200c course code `gfx.js` (you may also use a different framework if you prefer), create
a 3D object composed of 3D vector coordinates and 2D uv coordinates.

Here is what you will be filling out:

	{% highlight html %}
      <html>
      <script src = "http://rawgit.com/wolftype/200c/gh-pages/js/gfx.js"></script>
      
      var app = new GFX.App();

      app.onInit() = function(){
      //initialize GL objects and buffers
      }

      app.onRender() = function(){
      //drawing routines
      }

      <script id="gfxvert" type="text/glsl">
      //vertex shader code
      </script>

      <script id="gfxfrag" type="text/glsl">
      //fragment shader code
      </script>
      
      <body onload="app.start()">
      <canvas id="gfxcanvas" width="640" height="480"></canvas>
      </body>
      </html>
      {% endhighlight %}

You can use [this example](https://bl.ocks.org/wolftype/a4488f0c20112f5b2db7eb36d58d4d8f) as a starting point.

Your vertex shader will look something like this:

		{% highlight glsl %}
		attribute vec3 position;
		attribute vec2 uv;

		uniform mat4 model;
		uniform mat4 view;
		uniform mat4 projection;

		varying vec2 vuv;

		void main(){
			vuv = uv;
			gl_Position = projection * view * model * vec4(position,1.);
		}
		{% endhighlight %}

And your fragment shader will use the `varying vec2 vuv` instead of gl_FragCoord.
