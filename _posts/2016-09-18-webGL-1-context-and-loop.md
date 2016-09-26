---
layout: page
category: tutorials
tag: webgl
---

This is an introduction to creating WebGL contexts with `getContext` and animating with `requestAnimationFrame`.

## WebGL
WebGL is supported on most modern browsers, including mobile devices, and is an easy way to get started with OpenGL-style programming.

For this tutorial, we will be using javascript. If you are new to javascript or need a refresher, [Mozilla's developer site](https://developer.mozilla.org/en-US/docs/Web/JavaScript) is a great resource.  Their [WebGL API Information](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API) is very handy as well.  

I suggest using Chrome for developing WebGL apps.  In Chrome, You can navigate to `View > Developer > Developer Tools` to see output from your code.

## Contexts

In the land of OpenGL (The "GL" stands for "**G**raphics **L**ibrary" ... or maybe **L**anguage) and all its flavors (OpenGL ES, WebGL), a rendering **context** is a channel on which drawing states are transmitted to the device's window. A single application can have many contexts, but only one is **current** at any given time on any given thread of execution.

A [WebGLRenderingContext](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext) is created by calling `getContext("webgl")` on `canvas` element `canvas.getContext("webgl")` (note, for version 2.0, one will eventually pass in "webgl2").  The following four lines of code grab a canvas element, initialize a web context on it, set the clear color to red, and then clears the screen (with red):

		{%highlight javascript linenos%}
		var canvas = document.getElementById("canvas");
		var gl = canvas.getContext("webgl");
		gl.clearColor(1.0, 0.0, 0.0, 1.0);
		gl.clear(gl.COLOR_BUFFER_BIT| gl.DEPTH_BUFFER_BIT);
		{% endhighlight %}

Below is a WebGL context, though you wouldn't know it just by looking at it (since it's just a red rectangle)

<canvas id = "canvas" style = "width:160px; height:120px; margin:auto; display:block"> </canvas>
<script type="text/javascript">

var canvas = document.getElementById("canvas");
var gl = canvas.getContext("webgl");
if (!gl) {
   alert("Unable to initialize WebGL. Your browser may not support it.");
}
console.log(gl)	
// Set clear color to red, fully opaque
gl.clearColor(1.0, 0.0, 0.0, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT| gl.DEPTH_BUFFER_BIT);
</script>

Here is the full code to generate the above context.  Note we also check to make sure the context was created successfully.  A global variable `GL` holds our context so we can use it in other functions later on.

<script src="https://gist.github.com/wolftype/2d5c62cb1e310f8a744c752676d829ba.js"></script>

## Animation Frames

So far we have just initialized a WebGL context and cleared the view to red once.  In order for anything to happen over time, we must add an function that is called repeatedly.  In javascript, the current protocol for this is handled by a function that calls itself.  

<canvas id = "canvas_anim" style = "width:160px; height:120px; margin:auto; display:block"> </canvas>
<script type="text/javascript">

var GL;
var timer = 0;

function initWebGL(){
   // Get Canvas Element
   var canvas = document.getElementById("canvas_anim");
   // Get A WebGL Context
   GL = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
   // Test for Success
   if (!GL) {
      alert("Unable to initialize WebGL. Your browser may not support it.");
   }
   // Set clear color to red, fully opaque
   GL.clearColor(1.0, 0.0, 0.0, 1.0);
   // Clear Screen
   GL.clear(GL.COLOR_BUFFER_BIT| GL.DEPTH_BUFFER_BIT);
}

//ANIMATION FUNCTION (to be passed a callback)  see also http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
window.requestAnimFrame = ( function() {
   
    return  window.requestAnimationFrame || 
            window.webkitRequestAnimationFrame ||  
            window.mozRequestAnimationFrame || 
            window.oRequestAnimationFrame || 
            window.msRequestAnimationFrame ||
    
    // if none of the above, use non-native timeout method
    function(callback) {
      window.setTimeout(callback, 1000 / 60);
    };
  
  } ) (); 

function animationLoop(){
  // we request a new frame
  requestAnimFrame( animationLoop );
  // and call render function (defined below)
  render(); 
}

function render(){
   timer++;
   GL.clearColor( .5*(1+ Math.sin( timer/30.0 )), 
   				  0.0, 
   				  .5*(1+Math.cos( timer/30.0 )), 1.0);
   GL.clear(GL.COLOR_BUFFER_BIT| GL.DEPTH_BUFFER_BIT);
}

function start(){
   initWebGL();
   animationLoop();
}

start();

</script>

We will add four functions: 

* Request: a `requestAnimFrame` function that is called by the `window` itself. 
* Loop: an `animationLoop` function that calls `requestAnimationFrame`, passing itself as the argument, and then calls the `render` function.
* Render: a `render` function that actually does the drawing.
* Start: a `start` function that initializes the WebGL rendering context and then begins the `animationLoop`

#### Request

The `requestAnimFrame` function provides cross-platform support and finds the suitable frames-per-second at which your device should operate. For some more details on this see [Paul Irish's post](http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/).  We will just copy this code, which finds the best option given the browser in use:


		{%highlight javascript%}
		window.requestAnimFrame = ( function() {
		   
		    return  window.requestAnimationFrame || 
		            window.webkitRequestAnimationFrame ||  
		            window.mozRequestAnimationFrame || 
		            window.oRequestAnimationFrame || 
		            window.msRequestAnimationFrame ||
		    
		    // if none of the above exist, use non-native timeout method
		    function(callback) {
		      window.setTimeout(callback, 1000 / 60);
		    };
		  
		  } ) (); 
		{% endhighlight %}

#### Loop
The `animationLoop` calls the `requestAnimFrame` function:

		{%highlight javascript%}
		function animationLoop(){
		  // we request a new frame
		  requestAnimFrame( animationLoop );
		  // and call render function (defined below)
		  render(); 
		}
		{%endhighlight%}

#### Render
Draw things onto the context:

		{%highlight javascript%}
   		function render(){
   			timer++;
   			GL.clearColor( .5*(1+ Math.sin( timer/30.0 )), 0.0, .5*(1+Math.cos( timer/30.0 )), 1.0);
   			GL.clear(GL.COLOR_BUFFER_BIT| GL.DEPTH_BUFFER_BIT);
		}
		{%endhighlight%}

#### Start
Initialize the Context and Begin the Animation Loop

		{%highlight javascript%}
		function start(){
		   initWebGL();
		   animationLoop();
		}
		{%endhighlight%}

Here is the full code for initializing a context and starting an animation loop in WebGL:

<script src="https://gist.github.com/wolftype/4dde7b79d8e661f423bc9e6542534350.js"></script>



