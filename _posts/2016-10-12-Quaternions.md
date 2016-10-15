---
layout: page
category: Tidbits
---

Really quick intro to transforming vertices with quaternions

<script type="text/x-mathjax-config">
MathJax.Hub.Config({
  tex2jax: {inlineMath: [['$','$'], ['\\(','\\)']]},
  TeX: { extensions: ["AMSmath.js"] }
});
</script>
<script type="text/javascript" async
  src="https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS_HTML"></script>

### Transforming Vertices with Quaternions

Quaternions are commonly used for rotating objects in 3D.  We will eventually be investigating their true nature
(as rotors in geometric algebra), but those of you itching to transform your vertices algorithmically you can use this quickstart tidbit.

The following code will take the $x$ axis vector and rotate it by $\frac{\pi}{2}$ radians about the $z$ axis:

		  {% highlight javascript %}
		  var theta = Math.PI/2.0;
		  var x = new GFX.Vector(1.0,0.0,0.0);
		  var z = new GFX.Vector(0.0,0.0,1.0);
		  var quat = new GFX.Quaternion();
		  quat.setAxisAngle(z, theta);
		  var rotatedVec = quat.apply(x);
		  {% endhighlight %}


Notice that we feed an axis of rotation and an angle to the `setAxisAngle` method of our Quaternion, and then call `apply` on
some input vector to get a new rotated vector.

Going further, below is some code for creating a sphere, using **spherical coordinates** $(\theta,\phi)$.  We'll go over this in depth in class on Wednesday.

	 {% highlight javascript %}
	  var v = [];

	  var x = new GFX.Vector(1.0,0.0,0.0); //x axis
	  var y = new GFX.Vector(0.0,1.0,0.0); //y axis
	  var z = new GFX.Vector(0.0,0.0,1.0); //z axis

	  var quatA = new GFX.Quaternion();
	  var quatB = new GFX.Quaternion();

	  var num = 12.;
	  for (var i=0;i<num;++i){
	    quatA.setAxisAngle( y, 2.*Math.PI * i/num );
	    //a rotation of the z axis around the y axis, by amount 0 - 2PI
	    var axis = quatA.apply(z);
	    for (var j=0; j<num; ++j){
	      //a rotation around the rotated the z axis:
	      quatB.setAxisAngle( axis, Math.PI * ((j/num) - .5)  ) ;
	      //the first rotation, followed by the second:
	      var q = quatB.mult(quatA);
	      //apply it to the x axis
	      var vec = q.apply(x);
	      //add to our list of vertices
	      v.push(vec.x, vec.y, vec.z);  
	    }
	  }
	  
	  var vertices = new Float32Array( v ); 

	  //Create and Bind two new array buffers and a new element array buffer
	  sphere = new GFX.Mesh();

	  //Allocate Some Data on the GPU and copy position data over
	  sphere.vertexBuffer.bind();
	  sphere.vertexBuffer.alloc( vertices.byteLength );
	  sphere.vertexBuffer.data(vertices);

	  {% endhighlight %}

  