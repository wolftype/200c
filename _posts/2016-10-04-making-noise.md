---
layout: page
category: Tidbits
tag: polar
---

The basics of interpolating randomness.

<script type="text/x-mathjax-config">
MathJax.Hub.Config({
  tex2jax: {inlineMath: [['$','$'], ['\\(','\\)']]},
  TeX: { extensions: ["AMSmath.js"] }
});
</script>
<script type="text/javascript" async
  src="https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS_HTML"></script>
<script type="text/javascript" src="https://rawgit.com/patriciogonzalezvivo/glslCanvas/master/build/GlslCanvas.js"></script>


### Making noise

[The Book of Shaders Chapter 10](https://thebookofshaders.com/10/) shows us how to generate a pseudo-random floating point value based on an input `vec2`:

	{% highlight glsl %}
	float random (in vec2 st) { 
	    return fract(sin(dot(st.xy,
	                         vec2(12.9898,78.233)))
	                 * 43758.5453123);
	}
	{% endhighlight %}

We take the dot product of the input vector with some crazy vec2 (`vec2(12.9898,78.233)` for instance), multiply the result by some crazy amount (`43758.` etc), take the `sin` of that, and then grab only the fractional component (the parts after the decimal), to get a random value in the range $[0,1)$ (in the notation of ranges, the $)$ sign means everything upto but excluding $1$).  We call it a **pseudo** random number because two identical inputs will generate identical outputs.

Now, with this function, let's take a look at a function in the book of shaders, which is based on work by Morgan McGuire: 


		{% highlight glsl %}
		// 2D Noise based on Morgan McGuire @morgan3d
		// https://www.shadertoy.com/view/4dS3Wd
		float noise (vec2 st) {

		    vec2 i = floor(st); //an integer (e.g. 0, 1, 2, 3 ... )
		    vec2 f = fract(st); //a floating point number in the range [0,1)

		    // Four corners in 2D of a tile
		    float a = random(i);
		    float b = random(i + vec2(1.0, 0.0));
		    float c = random(i + vec2(0.0, 1.0));
		    float d = random(i + vec2(1.0, 1.0));

		    // Smooth Interpolation
		    vec2 u = smoothstep(0.,1.,f);

		    // Mix 4 corners bilinearly
		    return mix(mix(a, b, u.x), mix(c,d,u.x), u.y);
		}
	   {% endhighlight %}

Let's say our input to this function is a `vec2` coordinate that has been multiplied by 5.  `vec2 i = floor(st)` will give us `vec2`s composed of integers between 0 and 5, while `vec2 i = fract(st)` will give us `vec2`s composed of floating point numbers between 0 and 1.  

We use `i` to calculate the pseudo random number at four fixed points on our grid, and `f` to calculate a smooth interpolation between 0 and 1.  Finally, we use the smooth interpolation to mix our four random numbers.  How does this work?

### The Mix

Given two values $a$ and $b$ we can use the `mix` function to **linearly** interpolate between them:

	{% highlight glsl %}
	float value = mix(a,b,amt);
	{% endhighlight %}

The `amt` is a typically a value from $[0,1]$ though it can be less than or greater.

If we have four values on the corners of a rectangle, we can use **bilinear** interpolation the find a value anywhere inside that rectangle:

	{% highlight glsl %}
	float bilinear( float a, float b, float c, float d, vec2 pos){
		float bottom = mix(a,b,pos.x);
		float top = mix(c,d,pos.x)
		return mix( bottom, top, pos.y);
	}
	{% endhighlight %}

We mix the values along the bottom (a-b) and top (c-d) edges of the rectangle, and then mix those two mixed values.
