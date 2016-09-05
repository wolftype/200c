/// The Simplest GL basics: Context, Vectors, Matrices, Quaternions, Frames, Scenes

/// The NameSpace
var GFX = GFX || { Version: 0.1 }

/// Create Graphics Context By Passing in ID of canvas in body -- @todo or adding one to DOM if doesn't exist
GFX.Context = function( canvasId ){
	this.gl = null;
	this.canvas = document.getElementById(canvasId);
	this._init();
}

GFX.Context.prototype = {
	
	constructor: GFX.Context, 
	
	_init: function() {
		
 	  	// Try to grab the standard context. If it fails, fallback to experimental.
		this.gl = this.canvas.getContext("webgl") || this.canvas.getContext("experimental-webgl");
  
  	    // If we don't have a GL context, give up now
  	  	if (!this.gl) {
    		alert("Unable to initialize WebGL. Your browser may not support it.");
  	    	return
		}
		
		// Enable depth testing
	    this.gl.enable(gl.DEPTH_TEST);
	    // Near things obscure far things
	    this.gl.depthFunc(gl.LEQUAL);
	}
}

/// 3D Vector Operations
GFX.Vector = function(x,y,z){
	set(x,y,z)
}

GFX.Vector.prototype = {
	
	constructor: GFX.Vector,
	
	set: function(x,y,z){
		this.x = x || 0;
		this.y = y || 0;
		this.z = z || 0;	
	},
	
	add: function(v){
		return new Vector(this.x+v.x, this.y+v.y, this.z+v.z);
	},

	sub: function(v){
		return new Vector(this.x-v.x, this.y-v.y, this.z-v.z);
	},
	
	mult: function(s){
		return new Vector(this.x*s, this.y*s, this.z*s);
	},
	
	divide: function(s){
		return new Vector(this.x/s, this.y/s, this.z/s);
	},	
	
	dot: function(v){
		return this.x*v.x + this.y*v.y + this.z*v.z;
	},
	
	cross: function(v){
		return new Vector(this.y*vz - this.z*v.y, this.z*v.x - this.x*v.z, this.x*v.y-this.y*v.x)
	},
	
	mag: function(){
		return Math.sqrt( this.dot(this) );
	},
	
	unit: function(){
		return this.divide( this.mag() );
	},
	
	neg: function(){
		return this.mult(-1);
	}

	hom: function(){
		return new GFX.Vector4(x,y,z,1);
	}
		
}


/// 4D Vector Operations
GFX.Vector4 = function(x,y,z,w){
	set(x,y,z,w)
}

GFX.Vector4.prototype = {
	
	constructor: GFX.Vector4,
	
	set: function(x,y,z,w){

		this.x = x || 0;
		this.y = y || 0;
		this.z = z || 0;	
		this.w = w || 0;
	},
	
	add: function(v){
		return new Vector(this.x+v.x, this.y+v.y, this.z+v.z,this.w+v.w);
	},

	sub: function(v){
		return new Vector(this.x-v.x, this.y-v.y, this.z-v.z,this.w-v.w);
	},
	
	mult: function(s){
		return new Vector(this.x*s, this.y*s, this.z*s,this.w*s);
	},
	
	divide: function(s){
		return new Vector(this.x/s, this.y/s, this.z/s,this.w/s);
	},	
	
	dot: function(v){
		return this.x*v.x + this.y*v.y + this.z*v.z + this.w*v.w;
	},
	
	mag: function(){
		return Math.sqrt( this.dot(this) );
	},
	
	unit: function(){
		return this.divide( this.mag() );
	},
	
	neg: function(){
		return this.mult(-1);
	}
		
}

// GFX.Matrix3 = function(a){
// 	this.val = a || new Float32Array([
// 		1,0,0,
// 		0,1,0,
// 		0,0,1
// 	])
// }

// GFX.Matrix3.prototype = {
// 	constructor = GFX.Matrix3,

// 	det: function(){
// 		var m = this.val;
//  		return m[0]*m[4]*m[8] + m[1]*m[5]*m[6] + m[2]*m[3]*m[7]
//  			  -m[0]*m[5]*m[7] - m[1]*m[3]*m[8] - m[2]*m[4]*m[6]
// 	}
// }

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
		var v = v.val;
		return new GFX.Vector4([
			m[0]*v[0]+m[1]*v[1]+m[2]*v[2]+m[3]*v[3],
			m[4]*v[0]+m[5]*v[1]+m[6]*v[2]+m[7]*v[3],
			m[8]*v[0]+m[9]*v[1]+m[10]*v[2]+m[11]*v[3],
			m[12]*v[0]+m[13]*v[1]+m[14]*v[2]+m[15]*v[3],						
		]);
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

/// Quaternion
GFX.Quaternion = function(w,x,y,z){
	set(w,x,y,z);
}

GFX.Quaternion.prototype = {

	constructor: GFX.Quaternion,
	
	set: function(w,x,y,z){
		this.w = w || 1;
		this.x = x || 0;
		this.y = y || 0;
		this.z = z || 0;
		return this;		
	},
	
	sqnorm: function(){
		return this.w*this.w+this.x*this.x+this.y*this.y+this.z*this.z;
	},
	
	norm: function(){
		return Math.sqrt( this.sqnorm() );
	},
	
	unit: function(){
		var n = this.norm();
		return new GFX.Quaternion(this.w/n, this.x/n, this.y/n, this.z/n);
	},
	
	/// Inverse for Unit Quaternions
	inverse: function(){
		return new GFX.Quaternion(this.w, -this.x, -this.y, -this.z);
	},
	
	setAxisAngle: function(axis, angle){
		var half_angle = angle/2.0;
		var s = Math.sin(half_angle);
		var v = axis.unit().mult(-s);		
		this.set( Math.cos(half_angle), v.x, v,y, v.z);
		return this;
	},
	
	mult: function(q){
		return new GFX.Quaternion(	this.w * q.w - this.x * q.x + this.y * q.y + this.z * q.z,
        			    			this.w * q.x + this.x * q.w + this.y * q.z - this.z * q.y,
        							this.w * q.y + this.y * q.w + this.z * q.x - this.x * q.z,
        							this.w * q.z + this.z * q.w + this.x * q.y - this.y * q.x );
	},
	
	/// Apply Quaternion to Vector v
	apply: function(v){
		var q = this.unit();
		var qv = new Quaternion(0,v.x,v.y,v.z);
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

			  1-(yy+zz), xy+wz    , xz-wy    , 0,
			  xy-wz	   , 1-(xx+zz), yz+wx    , 0,
			  xz+wy    , yz-wx    , 1-(xx+yy), 0,
			  0		   , 0		  , 0        , 1

			]);		
	}	
	
}

GFX.Frame = function(){
	this.position = new GFX.Vector();			//$V(0,0,0); //$V creates a Vector in sylvester.js
	this.orientation =  new GFX.Quaternion(); 	//A Quaternion
}

GFX.Camera = function(){
	this.focalLength = 100;						//parallax merge point
	this.eyesep = .3;							//eye separation
}

GFX.Camera.prototype = {
	constructor: GFX.Camera,

	//symmetrical frustum -- feed in fovy in degrees
	perspective: function(fovy, ratio, near, far){
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
	},

	//general frustum (can be assymetric -- needed for stereoscopic rendering)
	frustum: function(l,r,t,b,near,far){
		return new GFX.Matrix([
			2*near/(r-l), 	0, 			  -(r+l)/(r-l), 				  0,
			0, 				2*near/(t-b),  -(t+b)/(t-b), 				  0,
			0,  			0,	  		  -(far+near)/(far-near), 		 -2*far*near/(far-near),
			0,				0,			  -1, 							  0 
		]);
	},

	//stereoscopic frustums are asymmetric -- see Paul Bourke's site
	//right camera shifts frustum left, left camera shifts frustum right
	stereoPerspective: function(fovy, ratio, near, far, offset, focal){

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

	},

	//lookat (right-handed coordinates)
	lookAt: function(eye,target,up){
		var z = (eye - target).unit(); // direction vector
		var x = (up.cross(z)).unit();  // right vector
		var y = z.cross(x);			   // modded up vector
		return new GFX.Matrix([
			x.x, x.y, x.z, -(x.dot(eye)),
			y.x, y.y, y.z, -(y.dot(eye)),
			z.x, z.y, z.z, -(z.dot(eye)),
			0,   0,   0,   1
		]);
	},

	
}

var Scene = function(){
	
	this.color = [1.0,0.0,0.0,1.0];
	
	this.clear = function( gl ){
    	gl.clearColor( this.color[0], this.color[1], this.color[2], this.color[3] );
	    // Clear the color as well as the depth buffer.
	    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }
	
	this.render = function( context ){
		 
	    var projection = cam.perspective(45, context.canvas.width/context.canvas.height, 0.1, 100.0);
  
	    var modelViewMatrix =  cam.lookAt( 0, 0, -6, 
	                                       Math.sin(3.14*timer/720.0), 0, 0,
	                                       0, 1, 0 );
	    //Send Matrices over to GPU 
	    setMatrixUniform("uPMatrix", perspectiveMatrix.flatten() );
	    setMatrixUniform("uMVMatrix", modelViewMatrix.flatten() );
		
    	//resize to canvas width and height
    	context.gl.viewport(0,0, context.canvas.width, context.canvas.height);	
	}
	
}

