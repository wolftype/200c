---
layout: page
category: Tidbits
---

Creating a context and rendering a mesh in THREE.js

<script type="text/javascript" src = "{{site.baseurl}}/js/ext/three.js"></script>

What follows is slightly modified from the [introduction to creating scenes](http://threejs.org/docs/index.html#Manual/Introduction/Creating_a_scene) on the [Three.js](http://threejs.org/) website itself. 

[Three.js](http://threejs.org/) is a popular framework for making 3D graphics for the Web.  We include it in our `html` document with a `<script>` tag:

		{%highlight javascript%}
		<script type="text/javascript" src="js/three.js"></script>
		{% endhighlight %}

We initialize a WebGL context by creating a new [WebGLRenderer](http://threejs.org/docs/index.html#Reference/Renderers/WebGLRenderer), setting its width and height, and adding it to the html document.

		{%highlight javascript%}
		var renderer = new THREE.WebGLRenderer()
		renderer.setSize( 320, 240 );
		document.body.appendChild( renderer.domElement );
		{% endhighlight %}


We now have an empty context.  We'll also need a scene and a camera.

		{%highlight javascript%}
		var scene = new THREE.Scene();
		var camera = new THREE.PerspectiveCamera(75, 320 / 240, .1, 100)
		camera.position.z = 5;
		{% endhighlight %}

Let's create an object and add it to the scene.

		{%highlight javascript%}
		var geometry = new THREE.BoxGeometry( 1, 1, 1 );
		var material = new THREE.MeshBasicMaterial( { color: 0xff00ff } );
		var cube = new THREE.Mesh( geometry, material );
		scene.add( cube );
		{% endhighlight %}

We can define an `update()` function that will rotate our cube every time it is called:

		{%highlight javascript%}
		function update(){
			cube.rotation.x += 0.01;
			cube.rotation.y += 0.01;
		}
		{% endhighlight %}

And a `render()` function that calls `update()`, renders scene, and also calls itself again and again in an
endless loop (that recursion is controlled by the `requestAnimationFrame` part at the beginning).  Note also that the renderer needs to know about the `scene` and the `camera`.

		{%highlight javascript%}
		function render() {
			requestAnimationFrame( render );
			update();	
			renderer.render( scene, camera );
		}
		{% endhighlight %}

Finally, we call `render()`

		render();

<script> 

// //Context
var renderer = new THREE.WebGLRenderer();
renderer.setSize( 320, 240 );;
renderer.domElement.style.border = "thin solid #113355";//"textAlign = "center";
var rdiv = document.createElement("div"); //create a div
rdiv.style.textAlign = 'center';
rdiv.appendChild( renderer.domElement );
document.body.appendChild(rdiv);

//Scene
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, 320 / 240, .1, 100)
camera.position.z = 5;

// //Object
var geometry = new THREE.BoxGeometry( 1, 1, 1 );
var material = new THREE.MeshBasicMaterial( { color: 0xff00ff } );
var cube = new THREE.Mesh( geometry, material );
scene.add( cube );


//Update Loop
function update(){
	cube.rotation.x += 0.01;
	cube.rotation.y += 0.01;
}

//Recursive Render Loop
function render() {
	requestAnimationFrame( render );
	update();	
	renderer.render( scene, camera );
}
render();

</script>