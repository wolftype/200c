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
		    float a = random(i);				  //bottom left
		    float b = random(i + vec2(1.0, 0.0)); //bottom right
		    float c = random(i + vec2(0.0, 1.0)); //top left
		    float d = random(i + vec2(1.0, 1.0)); //top right

		    //  c ------ d
		    //  | 		 |
		    //  | 		 |
		    //  | 		 |
		    //  a--------b

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
	float linearMix = mix(a,b,amt);
	{% endhighlight %}

The `amt` is a typically a value from $[0,1]$ though it can be less than or greater.  Mix is calculated as `(1-amt)*a + amt*b`.  Note that in glsl code the variables `a` and `b` can be floating point numbers or vectors.

In the `noise` function, we use `u.x`, which is the smoothstepped fractional component in the $x$ direction.  Lets mix the bottom left an bottom corners of the grid, and then do the same with the top left and top right corners of the tile:

	{% highlight glsl %}
	float bottomMix = mix(a,b,u.x);
	float topMix = mix(c,d,u.x);
	{% endhighlight %}

Finally, we can use **bilinear** interpolation the find a value anywhere inside that rectangle by mixing these two linear mixes, using `u.y`, which is the smoothstepped fractional component in the $y$ direction.

	{% highlight glsl %}
	float bilinearMix = mix(bottomMix, topMix, u.y);
	{% endhighlight %}

In summary, the `noise` function uses smoothstep to mix random values along the bottom (a-b) and top (c-d) edges of a rectangle, and then mixes those two mixed values.
