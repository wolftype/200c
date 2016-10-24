/*  
author: wolftype 
license: MIT

   GFX.js (http://rawgit.com/wolftype/200c/gh-pages/js/gfx_v02.js)

   An ASAP (As-Simple-As-Possible) WebGL Framework For Graphics Experiments

   With Context, Vectors, Matrices, Quaternions, Frames, Scenes and Shaders

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


/// Create Graphics Context By Passing in ID of canvas in body -- @todo or adding one to DOM if doesn't exist
GFX.InitContext = function( canvas ){

	console.log("initializing gl context");

		// Get Context
	GL = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

	    // Check for Successful Context Creation
	  	if (!GL) {
		alert("Unable to initialize WebGL. Your browser may not support it. Go to webglreport.com");
	    	return
	}
	
	// Enable depth testing
    GL.enable(GL.DEPTH_TEST);
    // Near things obscure far things
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

/** @constructor */
GFX.Vector4 = function(x,y,z,w){
	this.set(x,y,z,w)
}

GFX.Vector4.prototype = {
	
	constructor: GFX.Vector4,

	copy: function(){
		return new GFX.Vector4(this.x, this.y, this.z, this.w);
	},

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
 			  -m[0]*m[5]*m[7] - m[1]*m[3]*m[8] - m[2]*m[4]*m[6]	 	
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
		if (cos < -.999 ){  //if opposites
			axis = v1.cross( new GFX.Vector(0,0,1));
			if (axis.norm() < .001 ){ //v1 is z axis
				axis.set(1,0,0);
				console.log(axis);
			}
		} else {
			axis = v1.cross(v2);
		}

		return this.setAxisAngle( axis, Math.acos(cos) * amt );
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
		this.orientation.setAxisAngle( this.x(), rad );
	},

	//Rotate around Local Y Axis
	rotateY: function(rad){
		this.orientation.setAxisAngle( this.y(), rad );
	},

	//Rotate around Local Z axis
	rotateZ: function(rad){
		this.orientation.setAxisAngle( this.z(), rad );
	},

	//rotate Z axis towards t
	setTargetX: function(t){
		this.orientation.setRelative( new GFX.Vector(1,0,0), t.sub(this.position).unit(), 1.0);
	},

	//rotate Z axis towards t
	setTargetY: function(t){
		this.orientation.setRelative( new GFX.Vector(0,1,0), t.sub(this.position).unit(), 1.0);
	},

	//rotate Z axis towards t
	setTargetZ: function(t){
		this.orientation.setRelative( new GFX.Vector(0,0,1), t.sub(this.position).unit(), 1.0);
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

/// Camera has focallength, eye separation, and frame of reference
GFX.Camera = function(){
	this.fovy = 45;								//field of view
	this.focalLength = 100;						//parallax merge point
	this.eyesep = .3;							//eye separation
	this.frame = new GFX.Frame(0,0,5);		    //position and orientation
};

GFX.Camera.prototype = {
	constructor: GFX.Camera,

	setTarget: function(t){
		this.frame.orientation.setRelative( new GFX.Vector(0,0,1), this.frame.position.sub(t).unit(), 1.0);
	}
}


GFX.Shader = function(vert,frag){
	if (vert && frag){
		this.load(vert,frag);
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

	/// Set Uniform float variable on this shader (shader must have been bound with bind())
    setUniformFloat: function(name, value) {
  		var uID = GL.getUniformLocation(this.id, name);
  		if (uID != -1){
  			GL.uniform1f(uID, value);
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
		this.mode = mesh.mode;
		this.vertexBuffer = mesh.vertexBuffer;
		this.colorBuffer =  mesh.colorBuffer;
		this.texBuffer = mesh.texBuffer;
		this.indexBuffer = mesh.indexBuffer;
	} else { 
		this.useElements = false;
		this.useColor = false;
		this.useUV = false;
		this.mode = GL.TRIANGLES;
		this.vertexBuffer = new GFX.Buffer( GL.ARRAY_BUFFER );
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
		this.texBuffer.load(uv, hint);
	},

	loadColor: function(colors, hint){
		this.useColor = true;
		this.colorBuffer.load(new Float32Array(colors), hint);
	},

};

/// Useful Mesh Buffers
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


GFX.Mesh.Make = function(){
	GFX.Mesh.MakeFrame();
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
	this.color = [1.,1.,1.,1.]; 			    	///< Background Color
	this.time = 0.0;							    ///< Time: will increment every onRender()
	this.frame = new GFX.Frame();					///< Scene's base model transform
	this.matrix = new GFX.MatrixStack();			///< Push / Pop Matrix Stack
};

GFX.Scene.prototype = {

	constructor: GFX.Scene,

	/// Clear Screen with color
	clear: function( ){
    	GL.clearColor( this.color[0], this.color[1], this.color[2], this.color[3] );
	    GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);
    },
	
	/// Start Rendering Scene: 
	/// 1 - bind shader
	/// 2 - load identity model, set up shader's projection and view matrices
	/// 3 - clear screen, and set viewport
	begin: function(){
		 
		this.time += .02;

		//Start a new matrix stack
		this.matrix = new GFX.MatrixStack();

	    var model = GFX.Matrix.identity();

	    var view =  GFX.Matrix.lookAt( this.camera.frame.position, 								//eye 
	                                   this.camera.frame.position.sub(this.camera.frame.z()),	//target
	                                   this.camera.frame.y() );									//up

	    var projection = GFX.Matrix.perspective(this.camera.fovy, this.width/this.height, 0.1, 100.0);
  

	    //Send Matrices over to GPU (transposed because GLSL matrices are column major)
	    this.shader.bind();
	    this.shader.setUniformMatrix("model", model.transpose().val );		
	    this.shader.setUniformMatrix("view", view.transpose().val );
	    this.shader.setUniformMatrix("projection", projection.transpose().val );

    	//resize to canvas width and height
    	this.clear();
    	GL.viewport(0,0, this.width, this.height);	
	},

	/// Draw a Mesh
	draw: function(mesh){

		var m = this.frame.matrix().mult( this.matrix.last() ).mult( mesh.frame.matrix() );
		this.shader.setUniformMatrix("model", m.transpose().val );

    	if (mesh.useColor){
    		this.shader.enableAttribute("color");
			mesh.colorBuffer.bind();
			this.shader.pointAttribute("color",3);		
    	} else {
    	    this.shader.disableAttribute("color");	
    	}

    	if (mesh.useUV){
    		this.shader.enableAttribute("uv");
			mesh.texBuffer.bind();
			this.shader.pointAttribute("uv",2);		
    	} else {
    		this.shader.disableAttribute("uv");
    	}

		this.shader.enableAttribute("position");
		mesh.vertexBuffer.bind();
		this.shader.pointAttribute("position",3);		

    	if (mesh.useElements){
			mesh.indexBuffer.bind();
			mesh.indexBuffer.drawElements(mesh.mode);
    	} else {
			mesh.vertexBuffer.drawArrays(mesh.mode);
		}

	},

	/// Stop Rendering Scene
	end: function(){
		this.shader.unbind();
	},

	/// Calculate screen pixel coordinates of a world coordinate v
	project: function(v){
		var model = this.frame.matrix();
		var view = GFX.Matrix.lookAt( this.camera.frame.position, 								//eye 
	                                   this.camera.frame.position.sub(this.camera.frame.z()),	//target
	                                   this.camera.frame.y() );									//up
		var proj = GFX.Matrix.perspective(this.camera.fovy, this.width/this.height, 0.1, 100.0);
		var mvp = proj.mult(view).mult(model);

		var tv = mvp.multVec(v.hom());
		tv = tv.divide(tv.w);

		return new GFX.Vector( this.width * (1+tv.x)/2, this.height * (1+tv.y)/2, (1+tv.z)/2);
	},

	/// Calculate world coordinates of a screen pixel coordinate v
	unproject: function(v){
		var model = this.frame.matrix();
		var view = GFX.Matrix.lookAt( this.camera.frame.position, 								//eye 
	                                   this.camera.frame.position.sub(this.camera.frame.z()),	//target
	                                   this.camera.frame.y() );									//up
		var proj = GFX.Matrix.perspective(this.camera.fovy, this.width/this.height, 0.1, 100.0);
		var pmv = proj.mult(view).mult(model);

		var vp = new GFX.Vector4( 2*(v.x/this.width)-1, 2*(v.y/this.height)-1, 2*(v.z)-1,1 );
		var tv = pmv.inverse().multVec(vp);
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

 					var z = new GFX.Vector(0,0,1);
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
 		}
 	}
}
	



