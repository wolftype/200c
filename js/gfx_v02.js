/*  
author: wolftype 
license: MIT

   GFX.js (http://rawgit.com/wolftype/200c/gh-pages/js/gfx_v02.js)
   		An ASAP (As-Simple-As-Possible) WebGL Framework For Graphics Experiments

   With: Context, Vectors, Matrices, Quaternions, Frames, Meshes, Buffers, Textures,
   Scenes and Shaders

   How to use: 

      <html>
      <script src = "https://rawgit.com/wolftype/200c/gh-pages/js/gfx_v02.js"></script>
      <script type="text/javascript">
      var app = new GFX.App();

      app.onInit() = function(){
      //initialize GL objects and buffers
      }

      app.onRender() = function(){
      //drawing routines
      }
	  </script>
      <script id = "gfxvert" type="text/glsl">
      //vertex shader code
      </script>

      <script id = "gfxfrag" type="text/glsl">
      //fragment shader code
      </script>
      
      <body onload = "app.start()">
      <canvas id = "gfxcanvas" width = "640" height = "480"></canvas>
      </body>
      </html>
*/


/** The GFX object */
var GFX = GFX || { Version: 0.1 }
/** GL variable to call GL.enable etc */
var GL = GL || {}

/** Global Animation Function (to be passed a callback in GFX.App)  see also http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/ */
var RequestAnimFrame = ( function() {

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


/** Create Graphics Context By Passing in ID of canvas in body -- @todo or adding one to DOM if doesn't exist */
GFX.InitContext = function( canvas ){

	console.log("initializing gl context");
	GL = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
	if (!GL) {
		alert("Unable to initialize WebGL. Your browser may not support it. Go to webglreport.com");
	    return
	}
	
	console.log( "Available Extensions", GL.getSupportedExtensions() );

    GL.enable(GL.DEPTH_TEST);
    GL.depthFunc(GL.LEQUAL);

    console.log(GL)
}


/** A 3D Vector
	
	@class GFX.Vector
	@constructor
*/
GFX.Vector = function(x,y,z){
	this.set(x,y,z)
}

GFX.Vector.prototype = {
	
	constructor: GFX.Vector,

	/** Return a new copy */
	copy: function(){
		return new GFX.Vector(this.x, this.y, this.z);
	},
	
	/** Set Coordinates */
	set: function(x,y,z){
		this.x = x || 0;
		this.y = y || 0;
		this.z = z || 0;	
	},
	
	/** Add a Vector */
	add: function(v){
		return new GFX.Vector(this.x+v.x, this.y+v.y, this.z+v.z);
	},

	/** Subtract a Vector */
	sub: function(v){
		return new GFX.Vector(this.x-v.x, this.y-v.y, this.z-v.z);
	},

	/** Multiply by a scalar value */	
	mult: function(s){
		return new GFX.Vector(this.x*s, this.y*s, this.z*s);
	},
	
	/** Divide by a scalar value */
	divide: function(s){
		return new GFX.Vector(this.x/s, this.y/s, this.z/s);
	},	
	
	/** Dot Product */
	dot: function(v){
		return this.x*v.x + this.y*v.y + this.z*v.z;
	},

	/** Cross Product */	
	cross: function(v){
		return new GFX.Vector(this.y*v.z - this.z*v.y, this.z*v.x - this.x*v.z, this.x*v.y-this.y*v.x)
	},

	/** Length of Vector */		
	norm: function(){
		return Math.sqrt( this.dot(this) );
	},

	/** Vector of unit length */		
	unit: function(){
		return this.divide( this.norm() );
	},
	
	/** Negative Vector */		
	neg: function(){
		return this.mult(-1);
	},

	/** Homogeneous Vector */	
	hom: function(){
		return new GFX.Vector4(this.x,this.y,this.z,1);
	}
		
}

/** Linear Interpolation of `va` to `vb` by `amt1` */	
GFX.Vector.Lerp = function( va, vb, amt){
	return va.mult(1-amt).add(vb.mult(amt));
}

/* Origin */
GFX.Vector.Origin = new GFX.Vector(0,0,0);
/* Global X Axis */
GFX.Vector.X = new GFX.Vector(1,0,0);
/* Global Y Axis */
GFX.Vector.Y = new GFX.Vector(0,1,0);
/* Global Z Axis */
GFX.Vector.Z = new GFX.Vector(0,0,1);

/** @constructor */
GFX.Vector4 = function(x,y,z,w){
	this.set(x,y,z,w)
}

GFX.Vector4.prototype = {
	
	constructor: GFX.Vector4,
	
	/** Return a new copy */
	copy: function(){
		return new GFX.Vector4(this.x, this.y, this.z, this.w);
	},

	/** Set Coordinates */
	set: function(x,y,z,w){

		this.x = x || 0;
		this.y = y || 0;
		this.z = z || 0;	
		this.w = w || 0;
	},
	
	add: function(v){
		return new GFX.Vector4(this.x+v.x, this.y+v.y, this.z+v.z,this.w+v.w);
	},

	sub: function(v){
		return new GFX.Vector4(this.x-v.x, this.y-v.y, this.z-v.z,this.w-v.w);
	},
	
	mult: function(s){
		return new GFX.Vector4(this.x*s, this.y*s, this.z*s,this.w*s);
	},
	
	divide: function(s){
		return new GFX.Vector4(this.x/s, this.y/s, this.z/s,this.w/s);
	},	
	
	dot: function(v){
		return this.x*v.x + this.y*v.y + this.z*v.z + this.w*v.w;
	},
	
	norm: function(){
		return Math.sqrt( this.dot(this) );
	},
	
	unit: function(){
		return this.divide( this.norm() );
	},
	
	neg: function(){
		return this.mult(-1);
	}
		
}

GFX.Matrix3 = function(a){
	this.val = a || new Float32Array([
		1,0,0,
		0,1,0,
		0,0,1
	]);
}

GFX.Matrix3.prototype = {
	constructor: GFX.Matrix3,
	
	copy: function(){
		return new GFX.Matrix3( this.val );
	},

	set: function( a ){
		this.val = a;
		return this;
	},

	/// determinant
	det: function(){
		var m = this.val;

 		return m[0]*m[4]*m[8] + m[1]*m[5]*m[6] + m[2]*m[3]*m[7]
 			  -m[0]*m[5]*m[7] - m[1]*m[3]*m[8] - m[2]*m[4]*m[6];
	},

	inverse: function(){
		var m = this.val;
	 	var d = this.det();	
	 	//cofactors
	 	var c11 = this.minor([m[4],m[5],m[7],m[8]]);
	 	var c12 = this.minor([m[3],m[5],m[6],m[8]]);
	 	var c13 = this.minor([m[3],m[4],m[6],m[7]]);
	 	var c21 = this.minor([m[1],m[2],m[7],m[8]]);
	 	var c22 = this.minor([m[0],m[2],m[6],m[8]]);
	 	var c23 = this.minor([m[0],m[1],m[6],m[7]]);
	 	var c31 = this.minor([m[1],m[2],m[4],m[5]]);
	 	var c32 = this.minor([m[0],m[2],m[3],m[5]]);
	 	var c33 = this.minor([m[0],m[1],m[3],m[4]]); 

	 	return new GFX.Matrix3([
	 		c11/d, c12/d, c13/d,
	 		c21/d, c22/d, c23/d,
	 		c31/d, c32/d, c33/d
	 	]);	
	},

	minor: function(m){
		return m[0]*m[3]-m[1]*m[2];
	}

}


GFX.Matrix = function(a){

	this.val = a || new Float32Array([

		1,0,0,0,
		0,1,0,0,
		0,0,1,0,
		0,0,0,1

	]);

}

GFX.Matrix.prototype = {

	constructor: GFX.Matrix,

	copy: function(){
		return new GFX.Matrix( this.val );
	},

	set: function( a ){
		this.val = a;
		return this;
	},

	/// multiply by matrix A
	mult: function( A ){
		var m = this.val;
		var n = A.val;
		return new GFX.Matrix([
			m[0]*n[0]+m[1]*n[4]+m[2]*n[8]+m[3]*n[12],
			m[0]*n[1]+m[1]*n[5]+m[2]*n[9]+m[3]*n[13],
			m[0]*n[2]+m[1]*n[6]+m[2]*n[10]+m[3]*n[14],	
			m[0]*n[3]+m[1]*n[7]+m[2]*n[11]+m[3]*n[15],

			m[4]*n[0]+m[5]*n[4]+m[6]*n[8]+m[7]*n[12],
			m[4]*n[1]+m[5]*n[5]+m[6]*n[9]+m[7]*n[13],
			m[4]*n[2]+m[5]*n[6]+m[6]*n[10]+m[7]*n[14],	
			m[4]*n[3]+m[5]*n[7]+m[6]*n[11]+m[7]*n[15],

			m[8]*n[0]+m[9]*n[4]+m[10]*n[8]+m[11]*n[12],
			m[8]*n[1]+m[9]*n[5]+m[10]*n[9]+m[11]*n[13],
			m[8]*n[2]+m[9]*n[6]+m[10]*n[10]+m[11]*n[14],	
			m[8]*n[3]+m[9]*n[7]+m[10]*n[11]+m[11]*n[15],

			m[12]*n[0]+m[13]*n[4]+m[14]*n[8]+m[15]*n[12],
			m[12]*n[1]+m[13]*n[5]+m[14]*n[9]+m[15]*n[13],
			m[12]*n[2]+m[13]*n[6]+m[14]*n[10]+m[15]*n[14],	
			m[12]*n[3]+m[13]*n[7]+m[14]*n[11]+m[15]*n[15]
									
		]);
	},

	/// v is a vec4, ith result is a dot product of vector with ith row of matrix
	multVec: function( v ){
		var m = this.val;
		return new GFX.Vector4(
			m[0]*v.x+m[1]*v.y+m[2]*v.z+m[3]*v.w,
			m[4]*v.x+m[5]*v.y+m[6]*v.z+m[7]*v.w,
			m[8]*v.x+m[9]*v.y+m[10]*v.z+m[11]*v.w,
			m[12]*v.x+m[13]*v.y+m[14]*v.z+m[15]*v.w						
		);
	},

	 /// row-major to column-major
	 transpose: function(){
	 	var m = this.val;
	 	return new GFX.Matrix([
	 		m[0],m[4],m[8],m[12],
	 		m[1],m[5],m[9],m[13],
	 		m[2],m[6],m[10],m[14],
	 		m[3],m[7],m[11],m[15]
	 	]);
	 },

	 /// determinant
	 det: function(){
	 	var m = this.val;

	 	var minorA = m[10]*m[15] - m[11]*m[14];
	 	var minorB = m[9]*m[15]  - m[11]*m[13];
	 	var minorC = m[9]*m[14]  - m[10]*m[13];
	 	var minorD = m[8]*m[15]  - m[11]*m[12];
	 	var minorE = m[8]*m[14]  - m[10]*m[12];
	 	var minorF = m[8]*m[13]  - m[9]*m[12];

	 	return m[0] *  ( 
	 					m[5] * ( minorA  ) -
	 					m[6] * ( minorB  ) +
	 					m[7] * ( minorC  )
	 				   ) -
	 		   m[1] * (
	 		   			m[4] * ( minorA ) -
	 		   			m[6] * ( minorD ) +
	 		   			m[7] * ( minorE )
	 		   		  )  +
	 		   m[2] * (
	 		   			m[4] * ( minorB ) -
	 		   			m[5] * ( minorD ) +
	 		   			m[7] * ( minorF )
	 		   		  )  -
	 		   m[3] * (
	 		   			m[4] * ( minorC )  -
	 		   			m[5] * ( minorE )  +
	 		   			m[6] * ( minorF )
	 		   	)
	 },

	 /// inverse
	 inverse: function(){
	 	var m = this.val;
	 	var d = this.det();
	 	//cofactors (c_{column, row} )
	 	var c11 = this.minor([m[5],m[6],m[7], m[9],m[10],m[11],  m[13],m[14],m[15]]);
	 	var c12 = -this.minor([m[1],m[2],m[3], m[9],m[10],m[11], m[13],m[14],m[15]]);
	 	var c13 = this.minor([m[1],m[2],m[3], m[5],m[6],m[7],    m[13],m[14],m[15]]);
	 	var c14 = -this.minor([m[1],m[2],m[3], m[5],m[6],m[7],   m[9],m[10],m[11]]);

	 	var c21 = -this.minor([m[4],m[6],m[7], m[8],m[10],m[11], m[12],m[14],m[15]]);
	 	var c22 = this.minor([m[0],m[2],m[3], m[8],m[10],m[11],  m[12],m[14],m[15]]);
	 	var c23 = -this.minor([m[0],m[2],m[3], m[4],m[6], m[7],  m[12],m[14],m[15]]);
	 	var c24 = this.minor([m[0],m[2],m[3], m[4],m[6], m[7],   m[8],m[10],m[11]]);

	 	var c31 = this.minor([m[4],m[5],m[7], m[8],m[9],m[11],  m[12],m[13],m[15]]);
	 	var c32 = -this.minor([m[0],m[1],m[3], m[8],m[9],m[11], m[12],m[13],m[15]]);
	 	var c33 = this.minor([m[0],m[1],m[3], m[4],m[5],m[7],   m[12],m[13],m[15]]);
	 	var c34 = -this.minor([m[0],m[1],m[3], m[4],m[5],m[7],  m[8],m[9],m[11]]);;

	 	var c41 = -this.minor([m[4],m[5],m[6], m[8],m[9],m[10], m[12],m[13],m[14]]);
	 	var c42 = this.minor([m[0],m[1],m[2], m[8],m[9],m[10],  m[12],m[13],m[14]]);
	 	var c43 = -this.minor([m[0],m[1],m[2], m[4],m[5],m[6],  m[12],m[13],m[14]]);
	 	var c44 = this.minor([m[0],m[1],m[2], m[4],m[5],m[6],   m[8],m[9],m[10]]);

	 	return new GFX.Matrix([
	 		c11/d, c12/d, c13/d, c14/d,
	 		c21/d, c22/d, c23/d, c24/d,
	 		c31/d, c32/d, c33/d, c34/d,
	 		c41/d, c42/d, c43/d, c44/d
	 	])
	 },

	 //pass in 3x3 submatrix
	 minor: function(m){
 		return m[0]*m[4]*m[8] + m[1]*m[5]*m[6] + m[2]*m[3]*m[7]
 			  -m[0]*m[5]*m[7] - m[1]*m[3]*m[8] - m[2]*m[4]*m[6];	 	
	 },

	 mat3: function(){
	 	var m = this.val;
	 	return new GFX.Matrix3([
	 		m[0], m[1], m[2],
	 		m[4], m[5], m[6],
	 		m[8], m[9], m[10]
	 	]);
	 }
}

/// Static Matrix Methods

/// Identity Matrix
GFX.Matrix.identity = function(){
	return new GFX.Matrix([
		1, 0, 0, 0,
		0, 1, 0, 0,
		0, 0, 1, 0,
		0, 0, 0, 1 
	]);
};

/// Translation Matrix
GFX.Matrix.translation = function(tx,ty,tz){
	return new GFX.Matrix([
		1, 0, 0, tx,
		0, 1, 0, ty,
		0, 0, 1, tz,
		0, 0, 0, 1 
	]);
};

/// Rotation Matrix
GFX.Matrix.rotation = function(angle,x,y,z){
	var axis = new GFX.Vector(x,y,z);
	var q = GFX.Quaternion.AxisAngle(axis.unit(),angle)
	return q.matrix();
};

/// Scale Matrix
GFX.Matrix.scale = function(sx,sy,sz){
	return new GFX.Matrix([
		sx, 0, 0, 0,
		0, sy, 0, 0,
		0, 0, sz, 0,
		0, 0, 0, 1 
	]);
};

/// Symmetrical Frustum -- feed in field-of-view in degrees
GFX.Matrix.perspective = function(fovy, ratio, near, far){
		var f = 1.0/ Math.tan(fovy*Math.PI/360.0);  // n/t
		var a = f/ratio;				 				  // (n/t)/(r/t)=n/r	
		var tb = far - near;
		var c = -(far+near)/tb;
		var d = -2*far*near/tb;

		return new GFX.Matrix([
			a, 0, 0,  0,
			0, f, 0,  0,
			0, 0, c,  d,
			0, 0, -1, 0
		]);
	};

/// General frustum (can be assymetric)
GFX.Matrix.frustum = function(l,r,t,b,near,far){
		return new GFX.Matrix([
			2*near/(r-l), 	0, 			  -(r+l)/(r-l), 				  0,
			0, 				2*near/(t-b),  -(t+b)/(t-b), 				  0,
			0,  			0,	  		  -(far+near)/(far-near), 		 -2*far*near/(far-near),
			0,				0,			  -1, 							  0 
		]);
	};

/// stereoscopic frustums are asymmetric -- see Paul Bourke's site
/// right camera shifts frustum left, left camera shifts frustum right
GFX.Matrix.stereoPerspective = function(fovy, ratio, near, far, offset, focal){

		var tn = Math.tan(fovy*Math.PI/360.0);   //top/near
		var top = near * tn;                     //top
		var f = 1.0 / tn; 					     //near/top

		var zratio = near / focal;			     //ratio of near clip to screen plane
		var shift = offset * zratio;

		var l = -ratio*top - shift; 		     //offset is directly proportional to zratio
		var r = ratio*top - shift; 

		return new GFX.Matrix([
			2*near/(r-l), 	0, 			  -(r+l)/(r-l), 				  0,
			0, 				f,  		   0, 				  			  0,
			0,  			0,	  		  -(far+near)/(far-near), 		 -2*far*near/(far-near),
			0,				0,			  -1, 							  0 
		]);

	};

/// lookat (right-handed coordinates)
GFX.Matrix.lookAt = function(eye,target,up){
		var z = (eye.sub(target)).unit(); // negative direction vector
		var x = (up.cross(z)).unit();     // right vector
		var y = z.cross(x);			      // modded up vector
		return new GFX.Matrix([
			x.x, x.y, x.z, -(x.dot(eye)),
			y.x, y.y, y.z, -(y.dot(eye)),
			z.x, z.y, z.z, -(z.dot(eye)),
			0,   0,   0,   1
		]);
	};


/// Quaternion
GFX.Quaternion = function(w,x,y,z){
	this.set( w,x,y,z );
}

GFX.Quaternion.prototype = {

	constructor: GFX.Quaternion,

	/** Create a new copy of these components */
	copy: function(){
		return new GFX.Quaternion(this.w, this.x, this.y, this.z);
	},
	
	/** Set directly */
	set: function(w,x,y,z){
		this.w = w || 0;
		this.x = x || 0;
		this.y = y || 0;
		this.z = z || 0;
		return this;		
	},

	/** Set from GFX.Vector axis and angle in radians */
	setAxisAngle: function(axis, angle){
		var theta = angle/2.0;
		var s = Math.sin(theta);
		var v = axis.unit().mult(s);	
		this.set( Math.cos(theta), v.x, v.y, v.z);
		return this;
	},

	/** Set from angle and axis coordinates x,y,z */
	setRotation: function(angle,x,y,z){
		return this.setAxisAngle( new GFX.Vector(x,y,z), angle);
	},

	/** Set from Euler angles */
	setEuler: function(yaw,pitch,roll){

		/* Below is shorthand for::

		var qyaw = new GFX.Quaternion();
		var qpitch = new GFX.Quaternion();
		var qroll = new GFX.Quaternion();

		qyaw.setAxisAngle( new GFX.Vector(0,1,0), yaw);
		qpitch.setAxisAngle( new GFX.Vector(1,0,0), pitch);
		qroll.setAxisAngle( new GFX.Vector(0,0,1), roll);

		this.copy( qyaw.mult(qpitch).mult(qroll) );

		*/

		var cy = Math.cos(yaw/2.0);
		var sy = Math.sin(yaw/2.0);
		var cp = Math.cos(pitch/2.0);
		var sp = Math.sin(pitch/2.0);
		var cr = Math.cos(roll/2.0);
		var sr = Math.sin(roll/2.0);

		this.set( cr*cp*cy +sr*sp*sy,  cr*sp*cy + sr*cp*sy, cr*cp*sy - sr*sp*cy, sr*cp*cy - cr*sp*sy  );
		return this;
	},


	/// feed in unit vectors and amt, returns quaternion that takes v1 to v2
	setRelative: function(v1, v2, amt){

		// theta is the inverse cosine of the dot product between them
		var cos = v1.dot(v2);
		// axis is unit normal to the plane spanned by v1 and v2
		var axis;
		if (cos < -.999 ){  //if opposites use X to find axis
			axis = v1.cross( GFX.Vector.X );
			if (axis.norm() < .001 ){ //if v1 == X, just use Z
				axis.set(0,0,1);
			}
		} else {
			axis = v1.cross(v2);
		}

		return this.setAxisAngle( axis, Math.acos(cos) * amt );
	},

	/// set forward and closest up 
	setForwardUp: function(forward, up){
		var tup = up || GFX.Vector.Y; 	 								//default up vector is global up;
		var q = GFX.Quaternion.Relative( GFX.Vector.Z, forward, 1.0); 	//Initial rotation
		var ty = q.apply( GFX.Vector.Y ); 								//current Y
		var nx = forward.cross( tup );		 							//orthogonal X
		var ny = nx.cross( forward ).unit();							//New Y
		var q2 = GFX.Quaternion.Relative(ty,ny,1.0);					//Rotate current to new
		var fq = q2.mult( q );											//Compose Rotation
		this.set(fq.w, fq.x, fq.y, fq.z);
	},

	setSlerp(q,amt){
		return GFX.Quaternion.Slerp(this, q, amt);
	},

	sqnorm: function(){
		return this.w*this.w+this.x*this.x+this.y*this.y+this.z*this.z;
	},
	
	norm: function(){
		return Math.sqrt( this.sqnorm() );
	},
	
	unit: function(){
		var n = this.norm();
		if (n===0) n = 1.0;
		return new GFX.Quaternion(this.w/n, this.x/n, this.y/n, this.z/n);
	},
	
	/// Inverse for Unit Quaternions
	inverse: function(){
		return new GFX.Quaternion(this.w, -this.x, -this.y, -this.z);
	},

	add: function(q){
		return new GFX.Quaternion(this.w+q.w, this.x+q.x, this.y+q.y, this.z+q.z);
	},
	
	/// Multiply two quaternions together
	mult: function(q){
		return new GFX.Quaternion(	this.w * q.w - this.x * q.x - this.y * q.y - this.z * q.z,
        			    			this.w * q.x + this.x * q.w + this.y * q.z - this.z * q.y,
        							this.w * q.y + this.y * q.w + this.z * q.x - this.x * q.z,
        							this.w * q.z + this.z * q.w + this.x * q.y - this.y * q.x );
	},

	scalarMult: function(s){
		return new GFX.Quaternion( this.w*s, this.x*s, this.y*s, this.z*s);
	},
	
	/// Apply Quaternion to Vector v
	apply: function(v){
		var q = this;
		var qv = new GFX.Quaternion(0,v.x,v.y,v.z);
		var nq = q.mult(qv).mult( q.inverse() );
		return new GFX.Vector( nq.x, nq.y, nq.z);
	},
	

	/// Convert to 4x4 Matrix
	matrix: function(){
		
		var x = this.x, y = this.y, z = this.z, w = this.w;
		var x2 = x + x, y2 = y + y, z2 = z + z;
		var xx = x * x2, xy = x * y2, xz = x * z2;
		var yy = y * y2, yz = y * z2, zz = z * z2;
		var wx = w * x2, wy = w * y2, wz = w * z2;

		return new GFX.Matrix([

			  1-(yy+zz), xy-wz    , xz+wy    , 0,
			  xy+wz	   , 1-(xx+zz), yz-wx    , 0,
			  xz-wy    , yz+wx    , 1-(xx+yy), 0,
			  0		   , 0		  , 0        , 1

			]);		
	},
	
}


GFX.Quaternion.Slerp = function(qa, qb, amt){
	var q = new GFX.Quaternion();
	//rotation which takes this to q:
	var rel = qb.mult(qa.inverse());
	rel = rel.unit();
	//the axis
	var axis = new GFX.Vector(rel.x, rel.y, rel.z);	
	//the angle
	var theta = 2.0*Math.acos(rel.w);

	//normalized:
	axis = axis.unit();

	q.setAxisAngle(axis,theta*amt);
	//multiply by starting qa
	return q.mult(qa);
	
	///Above is SAME AS THIS FASTER METHOD:
	//var st = Math.sin(amt*theta/2.0);
	//return qa.scalarMult( Math.sin( (1-amt) * theta/2.0 ) ).add( qb.scalarMult(st) ).scalarMult(1/Math.sin(theta/2.0));
}

GFX.Quaternion.AxisAngle = function(axis,angle){
	var q = new GFX.Quaternion();
	return q.setAxisAngle(axis,angle);
}

GFX.Quaternion.Rotation = function(angle,x,y,z){
	var q = new GFX.Quaternion();
	var vec = new GFX.Vector(x,y,z);
	return q.setAxisAngle( vec,angle);
}

GFX.Quaternion.Euler = function(yaw,pitch,roll){
	var q = new GFX.Quaternion();
	return q.setEuler(yaw,pitch,roll);
}

GFX.Quaternion.Relative = function(va,vb,t){
	var q = new GFX.Quaternion();
	return q.setRelative(va,vb,t);
}

GFX.Quaternion.ForwardUp = function(forward,up){
	var q = new GFX.Quaternion();
	return q.setForwardUp(forward,up);
}

/// A Frame has a 3D position, a 3D orientation, and a 3D Scale
GFX.Frame = function(x,y,z){
	this.position = new GFX.Vector(x,y,z);			///< A 3D Position
	this.orientation =  new GFX.Quaternion(1,0,0,0); 	///< A 3D Orientation
	this.size = new GFX.Vector(1,1,1); 			///< A 3D Vector
};

GFX.Frame.prototype = {
	constructor: GFX.Frame,

	copy: function(){
		var f = new GFX.Frame();
		f.position = this.position.copy();
		f.orientation = this.orientation.copy();
		f.size = this.size.copy();
		return f;
	},

	translate: function(x,y,z){
		this.position = this.position.add( new GFX.Vector(x,y,z));
	},

	/// Rotate by theta around Global X,Y,Z
	rotate(theta, x, y, z){
		var axis = new GFX.Vector(x,y,z);
		this.orientation = this.orientation.mult(GFX.Quaternion.AxisAngle(axis.unit(), theta));
	},

	scale: function(x,y,z){
		this.size.set(this.size.x*x,this.size.y*y,this.size.z*z);
	},

	/// equivalent to this.orientation.apply( new GFX.Vector(1,0,0) )
	x: function(){
		var q = this.orientation;
		return new GFX.Vector( 1-(2*(q.y*q.y + q.z*q.z)), 2*(q.x*q.y + q.w*q.z), 2*(q.x*q.z - q.w*q.y) );
	},

	/// equivalent to this.orientation.apply( new GFX.Vector(0,1,0) )
	y: function(){
		var q = this.orientation;		
		return new GFX.Vector( 2*(q.x*q.y - q.w*q.z), 1-(2*(q.x*q.x + q.z*q.z)), 2*(q.y*q.z+q.w*q.x) );
	},

	/// equivalent to this..apply( new GFX.Vector(0,0,1) )
	z: function(){
		var q = this.orientation;		
		return new GFX.Vector( 2*(q.x*q.z + q.w*q.y), 2*(q.y*q.z-q.w*q.x), 1-(2*(q.x*q.x + q.y*q.y)) );
	},


	/// Rotate around Local X Axis
	rotateX: function(rad){
		this.orientation = this.orientation.mult(GFX.Quaternion.Rotation(rad,1,0,0));
	},

	//Rotate around World X Axis
	rotateWorldX: function(rad){
		this.orientation = GFX.Quaternion.Rotation(rad,1,0,0).mult(this.orientation);
	},	

	//Rotate around Local Y Axis
	rotateY: function(rad){
		this.orientation = this.orientation.mult(GFX.Quaternion.Rotation(rad,0,1,0));
	},

	//Rotate around World Y Axis
	rotateWorldY: function(rad){
		this.orientation = GFX.Quaternion.Rotation(rad,0,1,0).mult(this.orientation);
	},	

	//Rotate around Local Z axis
	rotateZ: function(rad){
		this.orientation = this.orientation.mult(GFX.Quaternion.Rotation(rad,0,0,1));
	},

	//Rotate around World Z Axis
	rotateWorldZ: function(rad){
		this.orientation = GFX.Quaternion.Rotation(rad,0,0,1).mult(this.orientation);
	},

	//rotate Z axis towards t
	setTargetX: function(t){
		this.orientation.setRelative( GFX.Vector.X, t.sub(this.position).unit(), 1.0);
	},

	//rotate Z axis towards t
	setTargetY: function(t){
		this.orientation.setRelative( GFX.Vector.Y, t.sub(this.position).unit(), 1.0);
	},

	//rotate Z axis towards t
	setTargetZ: function(t){
		this.orientation.setRelative( GFX.Vector.Z, t.sub(this.position).unit(), 1.0);
	},

	//rotate Z axis to new forward dir, keeping Y as close to up dir as possible
	// setForwardUp: function(forward, up){
	// 	var tup = up || GFX.Vector.Y; 	 								//default up vector is global up;
	// 	var q = GFX.Quaternion.Relative( GFX.Vector.Z, forward, 1.0); 	//Initial rotation
	// 	var ty = q.apply( GFX.Vector.Y ); 								//current Y
	// 	var nx = forward.cross( tup );		 							//orthogonal X
	// 	var ny = nx.cross( forward ).unit();							//New Y
	// 	var q2 = GFX.Quaternion.Relative(ty,ny,1.0);		//Rotate current to new
	// 	this.orientation = q2.mult( q );								//Compose Rotation
	// },

	//set target uses z direction
	setTarget: function(t){
		this.orientation.setForwardUp( t.sub(this.position).unit() );
	},

	//"multiply" by another frame, to get this frame + relative transformation
	mult: function(relFrame){
		var frame = new GFX.Frame();
		frame.position = this.position.add( this.orientation.apply(relFrame.position) );
		frame.orientation = this.orientation.mult(relFrame.orientation);
		frame.size.set( this.size.x * relFrame.size.x, this.size.y * relFrame.size.y, this.size.z * relFrame.size.z);
		return frame;
	},

	//matrix representation
	matrix: function(){
		var rmat = this.orientation.matrix();
		var r = rmat.val;
		var s = this.size;
		var t = this.position;
		//var m =  GFX.Matrix.translation(t.x,t.y,t.z).mult( rmat ).mult( GFX.Matrix.scale(s.x,s.y,s.z) );
		var m2 = new GFX.Matrix([
			s.x*r[0], s.y*r[1], s.z*r[2],  t.x,
			s.x*r[4], s.y*r[5], s.z*r[6],  t.y,
			s.x*r[8], s.y*r[9], s.z*r[10], t.z,
			0, 		  0,	    0, 		   1
		]);

		return m2;

	},

	reset: function(){
		this.position.set(0,0,0);
		this.orientation.set(1,0,0,0);
		this.size.set(1,1,1);
	}

};

/// Interpolate Frame fa to Frame fb by amt
GFX.Frame.FromTo = function(fa,fb,amt){
	var f = new GFX.Frame();
	f.position = GFX.Vector.Lerp( fa.position, fb.position, amt);
	f.orientation = GFX.Quaternion.Slerp( fa.orientation, fb.orientation, amt);
	f.size = GFX.Vector.Lerp( fa.size, fb.size, amt);
	return f;
}



/// Camera has focallength, eye separation, and frame of reference, and near and far clipping planes
GFX.Camera = function(){
	this.fovy = 45;								//field of view
	this.focalLength = 100;						//parallax merge point
	this.eyesep = .3;							//eye separation
	this.frame = new GFX.Frame(0,0,5);		    //position and orientation
	this.near = .1;								//near clipping plane
	this.far = 100.;							//far clipping plane
};

GFX.Camera.prototype = {
	constructor: GFX.Camera,

	//orient towards target t, keeping Y axis as vertical as possible
	setTarget: function(t){
		this.frame.orientation.setForwardUp(this.frame.position.sub(t).unit());
	},

	reset: function(){
		this.frame.position.set(0,0,5);
		this.frame.orientation.set(1,0,0,0);
		this.frame.size.set(1,1,1);
	}
}


GFX.Shader = function(vert,frag){
	if (vert && frag){
		this.program(vert,frag);
	}
};

GFX.Shader.prototype = {
	constructor: GFX.Shader,

	/// Create a new Shader Program, along with a vertex and fragment shader
	create: function(){
		console.log("shader creating ... ")
		this.id = GL.createProgram();
		this.vertId = GL.createShader(GL.VERTEX_SHADER);
		this.fragId = GL.createShader(GL.FRAGMENT_SHADER);

	},

	/// Load vertex and fragment shader source code
	load: function( vert, frag ){
		console.log("shader loading ...");
		GL.shaderSource(this.vertId, vert);
		GL.shaderSource(this.fragId, frag);
	},

	/// Compile the vertex and fragment shaders, and check for errors
	compile: function(){
		console.log("shader compiling ...")
		GL.compileShader( this.vertId );
		this.checkCompilation( this.vertId);

		GL.compileShader( this.fragId );
		this.checkCompilation( this.fragId);
	},

	/// Check for compiler errors
	checkCompilation: function(id){
		console.log("shader checking compilation ...")
		if (!GL.getShaderParameter(id, GL.COMPILE_STATUS)) {  
      		alert("Shader Compiler Error: " + GL.getShaderInfoLog(id));  
      		GL.deleteShader(id);
      		return null;  
  		}
	},

	/// Attach and link the two compiled vertex and fragment shaders
	/// to the shader program, and check for errors
	link: function(){
		console.log("shader linking ... ")
		GL.attachShader( this.id, this.vertId);
		GL.attachShader( this.id, this.fragId);
		GL.linkProgram( this.id );

		this.checkLinking();
	}, 

	/// Check for linking errors
	checkLinking: function(){
		console.log("shader checking linking ...")
  		if (!GL.getProgramParameter(this.id, GL.LINK_STATUS)) {
    		alert("Shader Linking Error: " + GL.getProgramInfoLog(shader));
  		}
	},

	/// Bind the shader (all vertex data will now pass through it)
	bind: function(){
		GL.useProgram(this.id);
	},	

	/// Bind the shader (all vertex data will now pass through it)
	unbind: function(){
		GL.useProgram(null);
	},	

	/// Pass in vertex and fragment shader source code, compile, link, and bind the shader
	program: function(vert, frag){
		this.create();
		this.load(vert,frag);
		this.compile();
		this.link();
		this.bind();
		this.printActiveAttributes();
	},

	/// Print all attributes
	printActiveAttributes: function(){
		for (i = 0; i < GL.getProgramParameter(this.id, GL.ACTIVE_ATTRIBUTES); i++){
			var name = GL.getActiveAttrib( this.id, i).name;
			console.log("attribute:", name, i);
		}
	},

	/// Set Uniform matrix4 variable on this shader (shader must have been bound with bind())
	setUniformMatrix: function (name, value) {
  		var uID = GL.getUniformLocation(this.id, name);
  		if (uID != -1){
  			GL.uniformMatrix4fv(uID, false, new Float32Array(value));
  		}
	},

	/// Set Uniform matrix4 variable on this shader (shader must have been bound with bind())
	setUniformMatrix3: function (name, value) {
  		var uID = GL.getUniformLocation(this.id, name);
  		if (uID != -1){
  			GL.uniformMatrix3fv(uID, false, new Float32Array(value));
  		}
	},

	/// Set Uniform float variable on this shader (shader must have been bound with bind())
    setUniformVec: function(name, x,y,z) {
  		var uID = GL.getUniformLocation(this.id, name);
  		if (uID != -1){
  			GL.uniform3f(uID, x,y,z);
  		}
	},

	/// Set Uniform float variable on this shader (shader must have been bound with bind())
    setUniformFloat: function(name, value) {
  		var uID = GL.getUniformLocation(this.id, name);
  		if (uID != -1){
  			GL.uniform1f(uID, value);
  		}
	},

	setUniformInt: function(name,value){
  		var uID = GL.getUniformLocation(this.id, name);
  		if (uID != -1){
  			GL.uniform1i(uID, value);
  		}		
	},

	/// Call after a GFX.Shader is bound
	enableAttribute: function(name){
		var id = this.getAttribute(name);
		if (id != -1 ){
			GL.enableVertexAttribArray( id );
		}
	},

	/// Call after a GFX.Shader is bound
	disableAttribute: function(name){
		var id = this.getAttribute(name);
		if (id != -1 ){
			GL.disableVertexAttribArray( id );
		}
	},

	/// Get Location of Attribute in Shader
	getAttribute: function(name){
		return GL.getAttribLocation(this.id, name);
	},

	/// Point Bound Buffer data to Attribute 
	/// Call after binding a GFX.Buffer 
	/// note: some assumptions are made here for simplicity -- e.g. must be floats with no offset in data
	pointAttribute: function(name, size){
		GL.vertexAttribPointer( this.getAttribute(name), size, GL.FLOAT, false, 0, 0);
	}	
};

GFX.Shader.Text = function(){}
GFX.Shader.Text.precision = "#ifdef GL_ES \n precision lowp float; \n #endif\n";
GFX.Shader.Text.vert = GFX.Shader.Text.precision + "\nattribute vec3 position;\nattribute vec2 uv;\nvarying vec2 vuv;\nvoid main(){ vuv=uv;\ngl_Position=vec4(position,1.0);}\n";
GFX.Shader.Text.frag = GFX.Shader.Text.precision + "\nuniform sampler2D texture;\nuniform float u_amt;\nvarying vec2 vuv;\nvoid main() { gl_FragColor=texture2D(texture, vuv) * u_amt; }\n"


GFX.Texture = function(){
	this.id;
	this.width;
	this.height;
	this.format = GL.RGBA;
	this.type = GL.UNSIGNED_BYTE;
}

GFX.Texture.prototype = {
	constructor: GFX.Texture,

	init: function(w,h){
		this.create();
		this.bind();
		this.alloc(w,h);
		this.unbind();
	},

	create: function(){
		this.id = GL.createTexture();
	},

	bind: function(){
		GL.bindTexture(GL.TEXTURE_2D, this.id);
	},

	unbind: function(){
		GL.bindTexture(GL.TEXTURE_2D, null);
	},

	alloc: function(w,h){
		this.width = w;
		this.height = h;
		//target, level, iformat,width,height,border,format,type, data
		GL.texImage2D(GL.TEXTURE_2D, 0, this.format, w, h, 0, this.format, this.type, null);
		this.setParameters();
	}, 

	//load from Image
	loadImage: function(img){
		this.create();
		this.bind();
		GL.pixelStorei(GL.UNPACK_FLIP_Y_WEBGL, true);
		GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGBA, GL.RGBA, GL.UNSIGNED_BYTE, img);
		this.setParameters();
	},

	setParameters: function(){
		this.bind();	
			GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.NEAREST);
    		GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.NEAREST);
    		GL.generateMipmap(GL.TEXTURE_2D);
		this.unbind();
	},

	data: function(d, format){
		GL.texSubImage2D(GL.TEXTURE_2D, 0,0,0,this.width,this.height, format || GL.RGBA, GL.UNSIGNED_BYTE, d);
	},
}

GFX.Texture.Active = function(i){
	GL.activeTexture(GL.TEXTURE0+i);
}

GFX.CubeMap = function(){
	this.id;
	this.width;
	this.height;
}

GFX.CubeMap.prototype = {
	constructor: GFX.CubeMap,

	create: function(){
		this.id = GL.createTexture();
	},

	bind: function(){
		GL.bindTexture(GL.TEXTURE_CUBE_MAP, this.id);
	},

	unbind: function(){
		GL.bindTexture(GL.TEXTURE_CUBE_MAP, null);
	},

	alloc: function(w,h){
		this.width = w;
		this.height = h;
		for (var i =0;i<6;++i){
			GL.texImage2D(GL.TEXTURE_CUBE_MAP_POSITIVE_X+i, 0, GL.RGBA, w, h, 0, GL.RGBA, GL.UNSIGNED_BYTE, null);
    	}
    	GL.texParameteri(GL.TEXTURE_CUBE_MAP, GL.TEXTURE_MAG_FILTER, GL.LINEAR);
    	GL.texParameteri(GL.TEXTURE_CUBE_MAP, GL.TEXTURE_MIN_FILTER, GL.LINEAR_MIPMAP_NEAREST);
    	GL.generateMipmap(GL.TEXTURE_CUBE_MAP);    	
	}, 

	//load from Image
	loadImage: function(img, i, bFlip){
		this.bind();
			GL.pixelStorei(GL.UNPACK_FLIP_Y_WEBGL, bFlip);
			GL.texImage2D(GL.TEXTURE_CUBE_MAP_POSITIVE_X+i, 0, GL.RGBA, GL.RGBA, GL.UNSIGNED_BYTE, img);
		this.unbind();
	},

	setParameters: function(){
		this.bind();
			GL.texParameteri(GL.TEXTURE_CUBE_MAP, GL.TEXTURE_MAG_FILTER, GL.LINEAR);
    		GL.texParameteri(GL.TEXTURE_CUBE_MAP, GL.TEXTURE_MIN_FILTER, GL.LINEAR);
    		GL.texParameteri(GL.TEXTURE_CUBE_MAP, GL.TEXTURE_WRAP_S, GL.CLAMP_TO_EDGE);
            GL.texParameteri(GL.TEXTURE_CUBE_MAP, GL.TEXTURE_WRAP_T, GL.CLAMP_TO_EDGE); 
           // GL.texParameteri(GL.TEXTURE_CUBE_MAP, GL.TEXTURE_WRAP_R, GL.CLAMP_TO_EDGE);          
    		GL.generateMipmap(GL.TEXTURE_CUBE_MAP);
		this.unbind();
	},

	data: function(d, format){
		for (var i =0;i<6;++i){
			GL.texSubImage2D(GL.TEXTURE_CUBE_MAP_POSITIVE_X+i, 0,0,0,this.width,this.height, format || GL.RGBA, GL.UNSIGNED_BYTE, d[i]);
		}
	},
}

/// type: Options are GL.ARRAY_BUFFER and GL.ELEMENT_ARRAY_BUFFER
GFX.Buffer = function(type){
	this.num = 0;
	this.type = type || GL.ARRAY_BUFFER;
	this.create();
	this.bind();
};

GFX.Buffer.prototype = {
	constructor: GFX.Buffer,

	/// Create Buffer ID
	create: function(){
		this.id = GL.createBuffer();
	},

	/// Bind The Buffer
	bind: function(){
  		GL.bindBuffer(this.type, this.id );
	},

	/// Allocate Memory in Buffer
	/// size: byteLength()
	/// hint: GL.STATIC_DRAW, GL.DYNAMIC_DRAW or GL.STREAM_DRAW
	alloc: function(size, hint){ 							
  		GL.bufferData(this.type, size, hint || GL.STATIC_DRAW);
	},

	/// Send Data into Buffer
	data: function(data, offset){
		this.num = data.length;
		var offset = offset || 0;
		GL.bufferSubData(this.type, offset, data);
	},

	///bind, alloc, load
	load: function(data, hint){
		this.bind();
		this.alloc(data.byteLength, hint);
		this.data(data);
	},

	/// Draw Elements (indices into buffered data)
	/// mode: GL.TRIANGLE_STRIP, GL.LINES, etc
	/// num: number of elements to draw
	drawElements: function(mode, num){
		GL.drawElements( mode, num || this.num, GL.UNSIGNED_SHORT, 0);
	},

	/// Draw Arrays
	drawArrays: function(mode, num){
		GL.drawArrays( mode, 0, num || (this.num / 3) )
	},

};

/** A Mesh has some buffers of data and some boolean values 
	specifying how to draw them.
*/
GFX.Mesh = function( mesh ){
	this.frame = new GFX.Frame();	
	if (mesh){
		this.useElements = mesh.useElements;
		this.useColor = mesh.useColor;
		this.useUV = mesh.useUV;
		this.useNormal = mesh.useNormal;
		this.mode = mesh.mode;
		this.vertexBuffer = mesh.vertexBuffer;
		this.normalBuffer = mesh.normalBuffer;
		this.colorBuffer =  mesh.colorBuffer;
		this.texBuffer = mesh.texBuffer;
		this.indexBuffer = mesh.indexBuffer;
	} else { 
		this.useElements = false;
		this.useColor = false;
		this.useUV = false;
		this.useNormal = false;
		this.mode = GL.TRIANGLES;
		this.vertexBuffer = new GFX.Buffer( GL.ARRAY_BUFFER );
		this.normalBuffer = new GFX.Buffer( GL.ARRAY_BUFFER );
		this.colorBuffer = new GFX.Buffer( GL.ARRAY_BUFFER );
		this.texBuffer = new GFX.Buffer( GL.ARRAY_BUFFER );
		this.indexBuffer = new GFX.Buffer( GL.ELEMENT_ARRAY_BUFFER );	
	}
};

GFX.Mesh.prototype = {
	constructor: GFX.Mesh,

	copy: function(){
		return new GFX.Mesh(this);
	},

	uploadModel: function(shader){
		var tmp = this.frame.matrix().transpose();
		shader.setUniformMatrix("model", tmp.val);
	},

	load: function(vertices, indices){
		this.loadVertex(vertices);
		if (indices) {
			this.loadIndex(indices);
		}
	},

	loadVertex: function(vertices,hint){
		this.vertexBuffer.load( new Float32Array(vertices), hint )
	},

	loadIndex: function(indices,hint){
		this.useElements = true;
		this.indexBuffer.load( new Uint16Array(indices), hint )
	},	

	loadUV: function(uv, hint){
		this.useUV = true;
		this.texBuffer.load( new Float32Array(uv), hint);
	},

	loadColor: function(colors, hint){
		this.useColor = true;
		this.colorBuffer.load(new Float32Array(colors), hint);
	},

	loadNormal: function(normals, hint){
		this.useNormal = true;
		this.normalBuffer.load(new Float32Array(normals), hint);
	},

	enableUV: function(shader){
		shader.enableAttribute("uv");
		this.texBuffer.bind();
		shader.pointAttribute("uv",2);
	},

	draw: function(shader){

    	if (this.useColor){
    		shader.enableAttribute("color");
			this.colorBuffer.bind();
			shader.pointAttribute("color",3);		
    	} else {
    	    shader.disableAttribute("color");	
			//shader.setUniformVec("drawColor", this.drawColor.x, this.drawColor.y, this.drawColor.z);
    	}
    	
    	if (this.useNormal){
    		shader.enableAttribute("normal");
			this.normalBuffer.bind();
			shader.pointAttribute("normal",3);		
    	} else {
    		shader.disableAttribute("normal");
    	}

    	if (this.useUV){
    		shader.enableAttribute("uv");
			this.texBuffer.bind();
			shader.pointAttribute("uv",2);		
    	} else {
    		shader.disableAttribute("uv");
    	}

		shader.enableAttribute("position");
		this.vertexBuffer.bind();
		shader.pointAttribute("position",3);		
    	if (this.useElements){
			this.indexBuffer.bind();
			this.indexBuffer.drawElements(this.mode);
    	} else {
			this.vertexBuffer.drawArrays(this.mode);
		}		
	}
};

/// Useful Mesh Buffers
GFX.Mesh.MakeRect = function(){

	if (!GFX.Mesh.Rect){
		console.log("making frame mesh")
		var buffer = new GFX.Mesh();

		var vertices = [
			-1.0,-1.0,0.0,
			-1.0,1.0,0.0,
			1.0,1.0,0.0, 	
			1.0,-1.0,0.0
		]; 

		var idx = [ 0,1,3,2 ];

		var uv = [ 
			0.0,0.0,
			0.0,1.0,
			1.0,1.0,
			1.0,0.0
		];

		buffer.load(vertices, idx); 
		buffer.loadUV(uv);

		buffer.mode = GL.TRIANGLE_STRIP;
		buffer.useElements = true;

		GFX.Mesh.Rect = buffer;
	}
	return GFX.Mesh.Rect.copy();

};

GFX.Mesh.MakeFrame = function(){

	if (!GFX.Mesh.Frame){
		console.log("making frame mesh")
		var buffer = new GFX.Mesh();

		var vertices = [
			0.0,0.0,0.0,
			1.0,0.0,0.0,
			0.0,0.0,0.0, 	
			0.0,1.0,0.0,
			0.0,0.0,0.0, 	
			0.0,0.0,1.0
		]; 

		var colors = [
			1.0,0.0,0.0,
			1.0,0.0,0.0,
			0.0,1.0,0.0,
			0.0,1.0,0.0,
			0.0,0.0,1.0,
			0.0,0.0,1.0
		];

		buffer.load(vertices); 
		buffer.loadColor(colors);
		buffer.mode = GL.LINES;
		buffer.useElements = false;

		GFX.Mesh.Frame = buffer;
	}
	return GFX.Mesh.Frame.copy();

};

GFX.Mesh.MakeCube = function(){

	if (!GFX.Mesh.Cube){
		console.log("making frame mesh")
		var buffer = new GFX.Mesh();

		// A CUBE! 
		// We include each vertex on the back side TWICE so that we can attach
		// TWO separate uv coordinates to each
		var vertices = new Float32Array( [
			-1.0, -1.0, 1.0,  //bottom left front
			-1.0, 1.0,  1.0,  //top left front
			1.0,  1.0,  1.0,  //top right front
			1.0,  -1.0, 1.0,  //bottom right front

			-1.0, -1.0, -1.0, //bottom left back
			-1.0, 1.0,  -1.0, //top left back
			1.0,  1.0,  -1.0, //top right back
			1.0,  -1.0, -1.0, //bottom right back

			//second copy of front side:
			-1.0, -1.0, 1.0,  //bottom left front II
			-1.0, 1.0,  1.0,  //top left front II
			1.0,  1.0,  1.0,  //top right front II
			1.0,  -1.0, 1.0,  //bottom right front II

			//second copy of back side:
			-1.0, -1.0, -1.0, //bottom left back II
			-1.0, 1.0,  -1.0, //top left back II
			1.0,  1.0,  -1.0, //top right back II
			1.0,  -1.0, -1.0, //bottom right back II

		]); 

		var texCoord = new Float32Array([
			0.0, 0.0,   
			0.0, 1.0,  
			1.0, 1.0,
			1.0, 0.0, 
			1.0, 0.0,
			1.0, 1.0,
			0.0, 1.0,
			0.0, 0.0, 
			//uvs to attach to second copy
			//for texturing top and bottom of cube:
			0.0, 0.0,
			0.0, 0.0,
			1.0, 0.0,
			1.0, 0.0,

			1.0, 0.0,
			1.0, 0.0,
			1.0, 1.0,
			1.0, 1.0,

		]);  

		//Break Object Vertices Triangles
		var indices = new Uint16Array([
			1,0,3,2,1,3, //front
			2,3,7,6,2,7, //right
			6,7,4,5,6,4, //back
			5,4,1,1,4,0, //left
			//use alternative uvs for top and bottom:
			// 9,10,13,10,14,13, //top
			// 8,11,12,12,11,15 //bottom
			10,9,13,14,10,13, //top
			11,8,12,11,12,15 //bottom			
		]);

		buffer.load(vertices, indices); 
		buffer.loadUV(texCoord);
		buffer.mode = GL.TRIANGLES;
		buffer.useElements = true;

		GFX.Mesh.Cube = buffer;
	}
	return GFX.Mesh.Cube.copy();

};

GFX.Mesh.MakeCone = function(){
	if (!GFX.Mesh.Cone){
		console.log("making cone mesh")
		var buffer = new GFX.Mesh();
		var num = 30;
		var vertices = []; 
		var normals = []
		vertices.push(0,1,0);
		normals.push(0,1,0);
		for (var i=0;i<=num;++i){
			var t = i/num;
			var v = new GFX.Vector(Math.cos(Math.PI*2*t),  0, Math.sin(Math.PI*2*t));
			var n = v.unit();
			vertices.push( v.x, v.y, v.z);
			normals.push( n.x, n.y, n.z);
		}

		var idx = [];
        for (var j = 1; j <= num; j+=1){
           var next = j < num ? j+1 : 1;
           idx.push(0,j,next,0); 
        }

		buffer.load(vertices, idx); 
		buffer.loadNormal( normals );

		buffer.mode = GL.TRIANGLE_STRIP;
		buffer.useElements = true;

		GFX.Mesh.Cone = buffer;
	}
	return GFX.Mesh.Cone.copy();
};

GFX.Mesh.MakeCylinder = function(){
	if (!GFX.Mesh.Cylinder){
		console.log("making cone mesh")
		var buffer = new GFX.Mesh();
		var slices = 30;
		var stacks = 1;
		var height = 1;
		var vertices = []; 
		var normals = []

		for (var j=0;j<=stacks;++j){
			var h = -height/2.0 + height*j/stacks;
			for (var i=0;i<slices;++i){
				var t = i/slices;
				var v = new GFX.Vector(Math.cos(Math.PI*2*t), h, Math.sin(Math.PI*2*t));
				var n = new GFX.Vector(v.x, 0, v.z);
				vertices.push( v.x, v.y, v.z);
				normals.push( n.x, n.y, n.z);
			}
		}

		var idx = [];
        for (var i=0; i<stacks; ++i){
        	for (var j = 0; j<=slices;++j){
        		var a = j < slices ? i * slices + j : i * slices;
        		var b = a + slices;
        		idx.push(a,b);
        	}
        }

		buffer.load(vertices, idx); 
		buffer.loadNormal( normals );

		buffer.mode = GL.TRIANGLE_STRIP;
		buffer.useElements = true;

		GFX.Mesh.Cylinder = buffer;
	}
	return GFX.Mesh.Cylinder.copy();

};

GFX.Mesh.MakeCircle = function(){
	if (!GFX.Mesh.Circle){
		console.log("making circle mesh")
		var buffer = new GFX.Mesh();

		var vertices = []; 
		for (var i=0;i<=30;++i){
			var t = i/30.0;
			vertices.push( Math.cos(Math.PI*2*t), Math.sin(Math.PI*2*t), 0 );
		}

		buffer.load(vertices); 
		buffer.mode = GL.LINE_STRIP;
		buffer.useElements = false;

		GFX.Mesh.Circle = buffer;
	}
	return GFX.Mesh.Circle.copy();
};

GFX.Mesh.MakeSphere = function(){
	if (!GFX.Mesh.Sphere){
		console.log("making sphere mesh")
		var buffer = new GFX.Mesh();

	  	var v = [];
	  	var idx = [];

	  	var x = new GFX.Vector(1.0,0.0,0.0); //x axis
	  	var y = new GFX.Vector(0.0,1.0,0.0); //y axis
	  	var z = new GFX.Vector(0.0,0.0,1.0); //z axis

	  	var quatA = new GFX.Quaternion();
	  	var quatB = new GFX.Quaternion();

	  	var num = 12;
	  	var slices = num;
	  	var stacks = num;

	  	for (var i=0;i<=num;++i){
	    	for (var j=0; j<num; ++j){
	    		quatA.setAxisAngle( y, 2.*Math.PI * j/num );
	    		var axis = quatA.apply(z);
	      		quatB.setAxisAngle( axis, Math.PI * ((i/num) - .5)  ) ;
	      		var q = quatB.mult(quatA);
	      		var vec = q.apply(x);
	      		v.push(vec.x, vec.y, vec.z);  
	      		if (i===0 || i===stacks) { break; }
	    	}
	  	}

	  	//bottom
        for (var j = 1; j <= slices; j+=1){
           var next = j < slices ? j+1 : 1;
           idx.push(0,j,next,0); 
        }

		for (var i = 0; i < stacks -1; ++i){
		 	var a, b;
		  	for (var j = 0; j < slices; ++j){               
		     	a = 1 + i * slices + j;
		      	b =  ( i < stacks - 2) ? a + slices : (v.length/3) - 1;  // Next Higher Latitude or North Pole
		      	idx.push(a,b); 
		  	}
		  	a = 1 + i * slices ;
		  	b =  ( i < stacks - 2) ? a + slices : (v.length/3) - 1;
		  	idx.push(a,b); 
		}

		buffer.load(v,idx); 
		buffer.loadColor(v);
		buffer.loadNormal(v);
		buffer.mode = GL.TRIANGLE_STRIP;//GL.LINE_STRIP;
		buffer.useElements = true;

		GFX.Mesh.Sphere = buffer;
	}
	return GFX.Mesh.Sphere.copy();	
};

GFX.Mesh.Make = function(){
	GFX.Mesh.MakeFrame();
	GFX.Mesh.MakeCircle();
	GFX.Mesh.MakeSphere();
	GFX.Mesh.MakeCone();
}

GFX.MatrixStack = function(){
	this.stack = [ GFX.Matrix.identity() ];
};

GFX.MatrixStack.prototype = {
	constructor: GFX.MatrixStack,

	set: function(m){
		this.last().set(m.val);
	},

	last: function(){
		return this.stack[ this.stack.length-1];
	},

	push: function(){
		this.stack.push( this.stack[ this.stack.length-1].copy() );
	},

	translate: function(x,y,z){
		this.last().set(this.last().mult( GFX.Matrix.translation(x,y,z) ).val);
	},

	rotate: function(angle,x,y,z){
		this.last().set(this.last().mult( GFX.Matrix.rotation(angle,x,y,z)).val);
	},

	scale: function(sx,sy,sz){
		this.last().set(this.last().mult( GFX.Matrix.scale(sx,sy,sz)).val);
	},

	pop: function(){
		this.stack.pop();
	}
};

/// Scene: has width, height, background color, camera, shader, and time
/// To be created after GFX.Context() has already defined a global GL context
GFX.Scene = function(width, height){
	this.width = width || GL.canvas.width;			///< Width of Context in Pixels
	this.height = height || GL.canvas.height;		///< Height of Context in Pixels
	this.camera = new GFX.Camera();					///< View and Projection matrices
	this.shader = new GFX.Shader();					///< Vertex and Fragment Shader
	this.color = [1.,.8,1.,1.]; 			    	///< Background Color
	this.time = 0.0;							    ///< Time: will increment every onRender()
	this.frame = new GFX.Frame();					///< Scene's base model transform
	this.matrix = new GFX.MatrixStack();			///< Push / Pop Matrix Stack
	this.model = new GFX.Matrix();					///< Current Model (from this.frame.matrix())
	this.view = new GFX.Matrix();					///< Current View Matrix 
	this.projection = new GFX.Matrix();				///< Current Projection Matrix
	this.modelView = new GFX.Matrix();				///< Current View * Model
	this.modelViewProjection = new GFX.Matrix();	///< Current Projection * View * Model;
	this.lightPos = new GFX.Vector(0,1,1);			///< Light Position Vector
	this.drawColor = new GFX.Vector(0,1,0);			///< Current Draw Color (used for meshes without color attributes)
};

GFX.Scene.prototype = {

	constructor: GFX.Scene,

	update: function(){
		//increment time
		this.time += .02;
		//reset the matrix stack
		this.matrix = new GFX.MatrixStack();
		//calculate matrices
		this.calculateMatrices();
		//upload matrices to shader
		this.uploadMatrices(this.shader);
	},

	/// Start Rendering Scene
	begin: function(){
		this.update();
		this.clear();
		this.viewport();
	},

	calculateMatrices(){
	    this.model = this.frame.matrix();

	    this.view =  GFX.Matrix.lookAt( this.camera.frame.position, 							//eye 
	                                    this.camera.frame.position.sub(this.camera.frame.z()),	//target
	                                    this.camera.frame.y() );								//up

	    this.projection = GFX.Matrix.perspective(this.camera.fovy, this.width/this.height, this.camera.near, this.camera.far);  

	    this.modelView = this.view.mult(this.model);
	    this.modelViewProjection = this.projection.mult(this.view).mult(this.model);		
	},

	//Send Matrices over to GPU (transposed because GLSL matrices are column major)
	uploadMatrices(shader){
	    shader.bind();
	    shader.setUniformMatrix("model", this.model.transpose().val );		
	    shader.setUniformMatrix("view", this.view.transpose().val );	
	    shader.setUniformMatrix("modelView",this.modelView.transpose().val );
	    shader.setUniformMatrix("projection", this.projection.transpose().val );
	
		//normal matrix is transposed inverse of upperleft 3x3 submatrix of modelview
	    shader.setUniformMatrix3("normalMatrix", this.modelView.mat3().inverse().val );

	    //Light Position in Eye Space
	    var v = this.modelView.multVec( this.lightPos.hom() );
	    shader.setUniformVec("mvLightPos", v.x, v.y, v.z);
	},

	clear: function( ){
    	GL.clearColor( this.color[0], this.color[1], this.color[2], this.color[3] );
	    GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);
    },

    viewport: function(){
    	GL.viewport(0,0, this.width, this.height);	
    },

	draw: function(mesh){

		var objModel = this.matrix.last().mult( mesh.frame.matrix() );
		var m = this.model.mult( objModel );
	    var mv = this.view.mult( m );

	    this.shader.setUniformMatrix("model", m.transpose().val);
	    this.shader.setUniformMatrix("modelView", mv.transpose().val);	    
	    this.shader.setUniformMatrix3("normalMatrix", mv.mat3().inverse().val );
    	this.shader.setUniformVec("drawColor", this.drawColor.x, this.drawColor.y, this.drawColor.z);

		mesh.draw(this.shader);

	},

	end: function(){
		this.shader.unbind();
	},

	/** Calculate screen pixel coordinates of a world coordinate v */
	project: function(v){
		var tv = this.modelViewProjection.multVec(v.hom());
		tv = tv.divide(tv.w);
		return new GFX.Vector( this.width * (1+tv.x)/2, this.height * (1+tv.y)/2, (1+tv.z)/2);
	},

	/** Calculate world coordinates of a screen pixel coordinate v */
	unproject: function(v){
		var vp = new GFX.Vector4( 2*(v.x/this.width)-1, 2*(v.y/this.height)-1, 2*(v.z)-1,1 );
		var tv = this.modelViewProjection.inverse().multVec(vp);
		tv = tv.divide(tv.w);
		return new GFX.Vector( tv.x, tv.y, tv.z );
	}	
}


GFX.Mouse = function(){
	this.x = 0;
	this.y = 0;
	this.lastX = 0;
	this.lastY = 0;
	this.dx = 0;
	this.dy = 0;
	this.frame = new GFX.Frame();
	this.down = false;
};

GFX.Mouse.prototype = {
	constructor: GFX.Mouse
};

GFX.App = function(){
	this.mouse = new GFX.Mouse();
	this.canvas;
}

GFX.App.KeyLeftArrow = 37;
GFX.App.KeyRightArrow = 39;
GFX.App.KeyUpArrow = 38;
GFX.App.KeyDownArrow = 40;


GFX.App.prototype = {

	constructor: GFX.App,

	/// Defaults to finding element called "gfxcanvas" "gfxvert" and "gfxfrag"
	_init: function(){
		this.canvas = document.getElementById("gfxcanvas");
		GFX.InitContext(this.canvas);
		this.canvas.addEventListener("mousedown",this);		
		this.canvas.addEventListener("mousemove",this);		
		this.canvas.addEventListener("mouseup",this);	
		this.canvas.addEventListener("mouseleave",this);
		window.addEventListener("keydown",this);

 		var vertScript = document.getElementById("gfxvert").text;
  		var fragScript = document.getElementById("gfxfrag").text;
		this.scene = new GFX.Scene();
  		this.scene.shader.program( vertScript, fragScript );
  		GFX.Mesh.Make(); // make predefined meshes (e.g. Mesh.Frame)
		this.onInit();
	},

	/// User initialization of GL objects and buffers
	onInit: function(){},

	/// User Code Called Repeatedly by Animate function
	onRender: function(){},

	/// Initialize and Begin 
	start: function() {
  		this._init();
  		this._mainloop();
 	},

 	/// The recursive call loop
 	_mainloop: function(){
 		RequestAnimFrame( this._mainloop.bind(this) ); //must bind function to "this" instance so it doesn't look in window's methods
 		this.onRender();
 	},

 	handleEvent: function(e){
		var rect = this.canvas.getBoundingClientRect(); 		
 		switch(e.type){
 			case "mousedown":
 				this.mouse.down = true;
 				this.mouse.lastX = e.x - rect.left;
 				this.mouse.lastY = rect.height - (e.y - rect.top);
 				this.mouse.frame.orientation = this.scene.frame.orientation;
 				break;
 			case "mousemove":
 			 	this.mouse.x = e.x - rect.left;
 				this.mouse.y = rect.height - (e.y - rect.top);
 				if (this.mouse.down){
 					this.mouse.dx = this.mouse.x - this.mouse.lastX;
 					this.mouse.dy = this.mouse.y - this.mouse.lastY;

 					var z = this.scene.camera.frame.z();//GFX.Vector.Z;
 					var move = new GFX.Vector(this.mouse.dx / rect.width, this.mouse.dy / rect.height, 0.0);
 					var axis = z.cross(move);
 					var norm = move.norm();
 					var q = GFX.Quaternion.AxisAngle( axis.unit(), norm );
 					this.scene.frame.orientation = q.mult( this.mouse.frame.orientation );
 				}
 				break;
 			case "mouseup":
 			case "mouseleave": 			
 				this.mouse.down = false;
 				break; 	
 			case "keydown":
 				switch(e.keyCode){
 					case GFX.App.KeyUpArrow:
 						var z = this.scene.camera.frame.z().mult(-.2);
 						this.scene.camera.frame.translate(z.x,z.y,z.z);
 						break;
 					case GFX.App.KeyDownArrow: 
 						var z = this.scene.camera.frame.z().mult(.2);; 					
 					 	this.scene.camera.frame.translate(z.x,z.y,z.z);
 					 	break;
 					case GFX.App.KeyRightArrow:
 						this.scene.camera.frame.rotateY(-.1);
 						break;
 					case GFX.App.KeyLeftArrow: 
 						this.scene.camera.frame.rotateY(.1);
 						break;
 					case 67:
 						console.log('c');
 						this.scene.frame.reset();
 						this.scene.camera.reset();
 						break;
 				}
 				break;		
 		}
 	}
}

/** Pass in format (e.g. DEPTH_COMPONENT16 or STENCIL_INDEX8 or DEPTH_STENCIL) */
GFX.RenderBuffer = function(format) {
	this.id;
	this.width;
	this.height;
	this.format = format || GL.DEPTH_COMPONENT16; 
};

GFX.RenderBuffer.prototype = {
	constructor: GFX.RenderBuffer,

	init: function(w,h){
		this.width = w;
		this.height = h;
		this.create();
		this.bind();
		this.alloc(w,h);	
		this.unbind();	
	},

	create: function(){ this.id = GL.createRenderbuffer(); },
	bind: function(){ GL.bindRenderbuffer(GL.RENDERBUFFER, this.id); },
	alloc: function(w,h){ GL.renderbufferStorage(GL.RENDERBUFFER, this.format, w,h); },
	unbind: function(){ GL.bindRenderbuffer(GL.RENDERBUFFER, null); },	
};

GFX.FrameBuffer = function(){
	this.color = [0,0,0,0];
	this.id = null;
};

GFX.FrameBuffer.prototype = {
	constructor: GFX.FrameBuffer,

	create: function(){
		this.id = GL.createFramebuffer();
	},

	bind: function(){
		GL.bindFramebuffer(GL.FRAMEBUFFER,this.id);
	},

	clear: function(){
    	GL.clearColor(this.color[0],this.color[1],this.color[2],this.color[3]);
	    GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);
	},

	unbind: function(){
		GL.bindFramebuffer(GL.FRAMEBUFFER,null);
	},

	attachTexture: function(texture, attachment){
		GL.framebufferTexture2D(GL.FRAMEBUFFER, attachment || GL.COLOR_ATTACHMENT0, GL.TEXTURE_2D, texture.id, 0);
	},

	attachDepthBuffer: function(renderbuffer){
		GL.framebufferRenderbuffer(GL.FRAMEBUFFER, GL.DEPTH_ATTACHMENT, GL.RENDERBUFFER, renderbuffer.id);
	},

	attachStencilBuffer: function(renderbuffer){
		GL.framebufferRenderbuffer(GL.FRAMEBUFFER, GL.STENCIL_ATTACHMENT, GL.RENDERBUFFER, renderbuffer.id);
	}

}

GFX.Slab = function(){
	this.width;
	this.height;
	this.amt = 1.0;
	this.shader = new GFX.Shader();
	this.mesh = new GFX.Mesh();
}

GFX.Slab.prototype = {
	constructor: GFX.Slab,

	init: function(){
		this.mesh = GFX.Mesh.MakeRect();
		this.shader.program(GFX.Shader.Text.vert, GFX.Shader.Text.frag);		
	},

	draw: function(tex){
		tex.bind();
			this.shader.bind();
				this.shader.setUniformFloat("u_amt", this.amt);	
				this.mesh.draw(this.shader);
			this.shader.unbind();
		tex.unbind();
	}
}

GFX.Render = function(){
	this.width;
	this.height;
	this.depthStencilAsTexture = false;
	this.fbo = new GFX.FrameBuffer();	// A Pipeline redirect
	this.color = new GFX.Texture();  	// A Read/Write RGBA texture
	this.depth = new GFX.Texture();		// A Read/Write Depth texture
	this.rbo = new GFX.RenderBuffer();  // A Write-only Renderbuffer
	this.slab = new GFX.Slab(); 		// A Rectangle and shader with sampler2D
}

GFX.Render.prototype = {
	constructor: GFX.Render,

	init: function(w,h){
		this.width = w;
		this.height = h;
		this.color.init(w,h); 
		this.rbo.init(w,h);		
		this.slab.init();		
		this.fbo.create();		
		this.fbo.bind();
			this.fbo.attachTexture(this.color, GL.COLOR_ATTACHMENT0);
			if (this.depthStencilAsTexture){
				var ext = GL.getExtension( "WEBGL_depth_texture" );
				if (!ext) {
					console.log("No webgl depth texture extension");
				}
				this.depth.type = ext.UNSIGNED_INT_24_8_WEBGL;//GL.UNSIGNED_INT;//GL.UNSIGNED_SHORT;
				this.depth.format = GL.DEPTH_STENCIL;//GL.DEPTH_COMPONENT;
				this.depth.init(w,h); 
				//this.fbo.attachTexture(this.depth, GL.DEPTH_ATTACHMENT);
				this.fbo.attachTexture(this.depth, GL.DEPTH_STENCIL_ATTACHMENT);				
			} else {
				this.fbo.attachDepthBuffer(this.rbo);
			}
		this.fbo.unbind();
	},

	begin: function(){
		this.fbo.bind();
		this.fbo.clear();
		GL.viewport(0,0,this.width,this.height);
	},

	end: function(){
		this.fbo.unbind();
	},

	draw: function(l,t,w,h){
		GL.viewport(l,t,w,h);		
		this.slab.draw(this.color);
	},

	drawDepth: function(l,t,w,h){
		GL.viewport(l,t,w,h);		
		this.slab.draw(this.depth);
	}

}
