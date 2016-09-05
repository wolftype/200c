---
category: math 
tag: geometric algebra, versor, javascript
---

[Versor.js](https://github.com/wolftype/versor.js) is a javascript port of the C++ Versor Geometric Algebra Library.

Let's include it:

		{% highlight javascript %}
		<script type = "text/javascript" src = "js/versor.js"></script>
		{% endhighlight %}

<script type = "text/javascript" src = "../../versor.js/versor.js"></script>
<script type = "text/javascript" src = "../../versor.js/space/C2.js"></script>
<script type = "text/javascript" src = "../../versor.js/space/C3.js"></script>
<script type = "text/javascript" src = "../../versor.js/render/C2Canvas.js"></script>
<script type="text/javascript" async
  src="https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-MML-AM_CHTML"></script>

<canvas id = "2dcanvas" width="300" height="300">Canvas</canvas>

<script>

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


function animate(){
  // feedback loop requests new frame
  requestAnimFrame( animate );
  render(); //defined below
}


var vec = C2.Vec2(1,-1);

var canvas = document.getElementById("2dcanvas");
var draw = C2Canvas( canvas );
draw.bounds({x:[-5,5],y:[-5,5]});

function render(){
//	context.fillStyle = 'red';
//	context.fillRect(2,20,200,100);
	draw(vec);
}

animate()

</script>


