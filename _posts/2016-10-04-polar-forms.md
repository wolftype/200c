---
layout: page
category: Tidbits
tag: polar
---

Defining shapes in terms of theta.

<script type="text/x-mathjax-config">
MathJax.Hub.Config({
  tex2jax: {inlineMath: [['$','$'], ['\\(','\\)']]},
  TeX: { extensions: ["AMSmath.js"] }
});
</script>
<script type="text/javascript" async
  src="https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS_HTML"></script>
<script type="text/javascript" src="https://rawgit.com/patriciogonzalezvivo/glslCanvas/master/build/GlslCanvas.js"></script>

**Polar Coordinates**, composed of a magnitude (length) and phase (angle), can be constructed from Cartesian $(x,y)$ coordinates:

$$ \theta = \mbox{tan}^{-1} \frac{y}{x} $$

$$ \phi = \sqrt{x^2 + y^2} $$

		{% highlight glsl %}
		float r = length(st);
		float theta = atan(st.y, st.x);
		{% endhighlight %}

We can defining a shape using polar coordinates, by specifying a value for $r$ in terms of $\theta$.

$$r^2=(\mbox{cos}\theta)^{2} + (\mbox{sin}\theta)^{2}$$

	{% highlight glsl %}
	float f = pow(pow(cos(theta),2) + pow(sin(theta),2),1./2.);
	float v = step(f, r);
	vec3 color = vec3(v);
	{% endhighlight %}

The above code defines a threshold value $f$ in terms of $\theta$, and sets all pixels whose length are below this threshold
to black, and all that are above to white.  We could try to use a more complicated **polar form**:

$$ r^{10} = (cos(3\theta))^4 + (sin(8\theta))^3 $$

which we could code in this way:

	float f = pow(pow(cos(theta*3.),4.0) + pow(sin(theta*8.),3.),1./10.)
	float v = step(f,r);

(the `1./10.` says we want the tenth rooth!).  

<center>
<canvas class="glslCanvas" data-fragment="

#ifdef GL_ES
precision mediump float;
#endif


uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

//magnitude and phase
vec2 polar(vec2 v){
	return vec2( dot(v,v), atan(v.y, v.x) );
}

float func(vec2 st){

	vec2 p = polar(st);
	float f = pow(pow(cos(p.t*3.*sin(u_time)),4.0) + pow(sin(p.t*8.),3.),1./10.);
    return smoothstep(f, f+.05, p.s);
}


void main(){
	vec2 st = gl_FragCoord.xy/u_resolution.xy;
	st = st*2.-1.;
	vec3 color = vec3(func(st));
	gl_FragColor = vec4( color, 1.);
}

"
width="400" height="400"> </canvas>
</center>

This makes what starts to look like an "organic" shape.  In fact, there is a generalization of these kinds of polar equations called the **superformula**.  You can read about it [here](http://paulbourke.net/geometry/supershape/).  The equation is as follows:

$$ \frac{1}{r}=(\lvert \frac{1}{a}\mbox{cos}(\frac{m}{4} \theta) \rvert^{n_2} + \lvert \frac{1}{b}\mbox{sin}(\frac{m}{4} \theta) \rvert^{n_3})^{\frac{1}{n_1}} $$

And an example of it in action in the fragment shader can be found [here](http://thebookofshaders.com/edit.php?log=161007022755).