/* The Simplest GL basics: Context, Vectors, Matrices, Quaternions, Frames, Scenes, Shaders

   How to use: 

  		<html>
  		<script src = "http://github.com/wolftype/gfx.js/gfx.js"></script>
  		
  		var app = new GFX.App();

  		app.onInit() = function(){
			//initialize GL objects and buffers
  		}

  		app.onRender() = function(){
			//drawing routines
  		}

  		<script id = "gfxvert" type="text/glsl">
			//VERTEX SHADER CODE
  		</script>
        <script id = "gfxfrag" type="text/glsl">
			//FRAGMENT SHADER CODE
        </script>
  		
  		<body onload = "app.start()">
   		<canvas id = "gfxcanvas" width = "640" height = "480"</canvas>
  		</body>
  		</html>
*/


/// Main Object
var GFX = GFX || { Version: 0.1 }
/// GL variable to call GL.enable etc 
var GL = GL || {}

/// Global Animation Function (to be passed a callback in GFX.App)  see also http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
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


/// 3D Vector Operations
GFX.Vector = function(x,y,z){
	this.set(x,y,z)
}

GFX.Vector.prototype = {
	
	constructor: GFX.Vector,
	
	set: function(x,y,z){
		this.x = x || 0;
		this.y = y || 0;
		this.z = z || 0;	
	},
	
	add: function(v){
		return new GFX.Vector(this.x+v.x, this.y+v.y, this.z+v.z);
	},

	sub: function(v){
		return new GFX.Vector(this.x-v.x, this.y-v.y, this.z-v.z);
	},
	
	mult: function(s){
		return new GFX.Vector(this.x*s, this.y*s, this.z*s);
	},
	
	divide: function(s){
		return new GFX.Vector(this.x/s, this.y/s, this.z/s);
	},	
	
	dot: function(v){
		return this.x*v.x + this.y*v.y + this.z*v.z;
	},
	
	cross: function(v){
		return new GFX.Vector(this.y*v.z - this.z*v.y, this.z*v.x - this.x*v.z, this.x*v.y-this.y*v.x)
	},
	
	mag: function(){
		return Math.sqrt( this.dot(this) );
	},
	
	unit: function(){
		return this.divide( this.mag() );
	},
	
	neg: function(){
		return this.mult(-1);
	},

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

/// Static Matrix Methods

GFX.Matrix.identity = function(){
	return new GFX.Matrix([
		1, 0, 0, 0,
		0, 1, 0, 0,
		0, 0, 1, 0,
		0, 0, 0, 1 
	]);
};

GFX.Matrix.translation = function(tx,ty,tz){
	return new GFX.Matrix([
		1, 0, 0, tx,
		0, 1, 0, ty,
		0, 0, 1, tz,
		0, 0, 0, 1 
	]);
};

GFX.Matrix.scale = function(sx,sy,sz){
	return new GFX.Matrix([
		sx, 0, 0, 0,
		0, sy, 0, 0,
		0, 0, sz, 0,
		0, 0, 0, 1 
	]);
};

	//symmetrical frustum -- feed in fovy in degrees
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

	//general frustum (can be assymetric -- needed for stereoscopic rendering)
GFX.Matrix.frustum = function(l,r,t,b,near,far){
		return new GFX.Matrix([
			2*near/(r-l), 	0, 			  -(r+l)/(r-l), 				  0,
			0, 				2*near/(t-b),  -(t+b)/(t-b), 				  0,
			0,  			0,	  		  -(far+near)/(far-near), 		 -2*far*near/(far-near),
			0,				0,			  -1, 							  0 
		]);
	};

	//stereoscopic frustums are asymmetric -- see Paul Bourke's site
	//right camera shifts frustum left, left camera shifts frustum right
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

	//lookat (right-handed coordinates)
GFX.Matrix.lookAt = function(eye,target,up){
		var z = (eye.sub(target)).unit(); // direction vector
		var x = (up.cross(z)).unit();  // right vector
		var y = z.cross(x);			   // modded up vector
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
	
	set: function(w,x,y,z){
		this.w = w || 1;
		this.x = x || 0;
		this.y = y || 0;
		this.z = z || 0;
		return this;		
	},

	setAxisAngle: function(axis, angle){
		var theta = angle/2.0;
		var s = Math.sin(theta);
		var v = axis.unit().mult(s);	
		this.set( Math.cos(theta), v.x, v.y, v.z);
		return this;
	},

	setRelative: function(v1, v2){
		// axis is unit normal to the plane spanned by v1 and v2
		// angle is the inverse cosine of the dot product between them
		return setAxisAngle( v1.cross(v2), Math.acos( v1.dot(v2) ))
	},

	setDirection: function(v){
		return setRelative( new GFX.Vector(0,0,1), v);
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
	
	/// Multiply two quaternions together
	mult: function(q){
		return new GFX.Quaternion(	this.w * q.w - this.x * q.x - this.y * q.y - this.z * q.z,
        			    			this.w * q.x + this.x * q.w + this.y * q.z - this.z * q.y,
        							this.w * q.y + this.y * q.w + this.z * q.x - this.x * q.z,
        							this.w * q.z + this.z * q.w + this.x * q.y - this.y * q.x );
	},
	
	/// Apply Quaternion to Vector v
	apply: function(v){
		var q = this.unit();
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

/// A Frame has a 3D position, a 3D orientation, and a 3D Scale
GFX.Frame = function(x,y,z){
	this.position = new GFX.Vector(x,y,z);			///< A 3D Position
	this.orientation =  new GFX.Quaternion(); 	    ///< A 3D Orientation
	this.scale = new GFX.Vector(1,1,1); 			///< A 3D Vector
};

GFX.Frame.prototype = {
	constructor: GFX.Frame,

	/// equivalent to this.orientation.apply( new GFX.Vector(1,0,0) 
	x: function(){
		var q = this.orientation;
		return new GFX.Vector( 1-(2*(q.y*q.y + q.z*q.z)), 2*(q.x*q.y + q.w*q.z), 2*(q.x*q.z - q.w*q.y) );
	},

	/// equivalent to this.orientation.apply( new GFX.Vector(0,1,0) 
	y: function(){
		var q = this.orientation;		
		return new GFX.Vector( 2*(q.x*q.y - q.w*q.z), 1-(2*(q.x*q.x + q.z*q.z)), 2*(q.y*q.z+q.w*q.x) );
	},

	/// equivalent to this.orientation.apply( new GFX.Vector(0,0,1) )
	z: function(){
		var q = this.orientation;		
		return new GFX.Vector( 2*(q.x*q.z + q.w*q.y), 2*(q.y*q.z-q.w*q.x), 1-(2*(q.x*q.x + q.y*q.y)) );
	},

	//pitch
	rotateX: function(rad){
		this.orientation.setAxisAngle( this.x(), rad );
	},

	//yaw
	rotateY: function(rad){
		this.orientation.setAxisAngle( this.y(), rad );
	},

	//roll
	rotateZ: function(rad){
		this.orientation.setAxisAngle( this.z(), rad );
	},

	//matrix representation
	matrix: function(){
		var rmat = this.orientation.matrix();
		var r = rmat.val;
		var s = this.scale;
		var t = this.position;
		var m =  GFX.Matrix.translation(t.x,t.y,t.z).mult( rmat ).mult( GFX.Matrix.scale(s.x,s.y,s.z) );
		var m2 = new GFX.Matrix([
			s.x*r[0], s.y*r[1], s.z*r[2],  t.x,
			s.x*r[4], s.y*r[5], s.z*r[6],  t.y,
			s.x*r[8], s.y*r[9], s.z*r[10], t.z,
			0, 		  0,	    0, 		   1
		]);

		//console.log("a", m.val);
		//console.log("b", m2.val);
		//console.log("r", r)
		return m2;

	}	

};

/// Camera has focallength, eye separation, and frame of reference
GFX.Camera = function(){
	this.focalLength = 100;						//parallax merge point
	this.eyesep = .3;							//eye separation
	this.frame = new GFX.Frame(0,0,5);		    //position and orientation
};


GFX.Shader = function(){};

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
  		GL.uniformMatrix4fv(uID, false, new Float32Array(value));
	},

	/// Set Uniform float variable on this shader (shader must have been bound with bind())
    setUniformFloat: function(name, value) {
  		var uID = GL.getUniformLocation(this.id, name);
  		GL.uniform1f(uID, value);
	},

	/// Call after a GFX.Shader is bound
	enableAttribute: function(name){
		GL.enableVertexAttribArray( this.getAttribute(name) );
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
		var offset = offset || 0;
		GL.bufferSubData(this.type, offset, data);
	},

	/// Draw Elements (indices into buffered data)
	/// mode: GL.TRIANGLE_STRIP, GL.LINES, etc
	/// num: number of elements to draw
	drawElements: function(mode, num){
		GL.drawElements( mode, num, GL.UNSIGNED_SHORT, 0);
	},

	/// Draw Arrays
	drawArrays: function(mode, num){
		GL.drawArrays( mode, 0, num)
	},

};

/// Mesh has a frame and a bunch of buffers on the GPU
GFX.Mesh = function(){
	this.frame = new GFX.Frame();
	this.vertexBuffer = new GFX.Buffer( GL.ARRAY_BUFFER );
	this.colorBuffer = new GFX.Buffer( GL.ARRAY_BUFFER );
	this.texBuffer = new GFX.Buffer( GL.ARRAY_BUFFER );
	this.indexBuffer = new GFX.Buffer( GL.ELEMENT_ARRAY_BUFFER );
};

GFX.Mesh.prototype = {
	constructor: GFX.Mesh,

	/// Bind current objects model matrix to shader uniform
	updateModel: function(shader){
		var tmp = this.frame.matrix().transpose();
		shader.setUniformMatrix("model", tmp.val);//this.frame.matrix().transpose().val );
	}
};

/// Scene: has width, height, background color, camera, shader, and time
/// To be created after GFX.Context() has already defined a global GL context
GFX.Scene = function(width, height){
	
	this.width = width || GL.canvas.width;			///< Width of Context in Pixels
	this.height = height || GL.canvas.height;		///< Height of Context in Pixels
	this.camera = new GFX.Camera();					///< View and Projection matrices
	this.shader = new GFX.Shader();					///< Vertex and Fragment Shader
	this.color = [1.0,0.0,0.0,1.0]; 				///< Background Color
	this.time = 0;									///< Time: will increment every onRender()

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
		 
		this.time += 2;

	    //Model Matrix
	    var model = GFX.Matrix.identity();

  		//View Matrix
	    var view =  GFX.Matrix.lookAt( this.camera.frame.position, 								//eye 
	                                   this.camera.frame.position.sub(this.camera.frame.z()),	//target
	                                   this.camera.frame.y() );									//up

		//Projection Matrix
	    var projection = GFX.Matrix.perspective(45, this.width/this.height, 0.1, 100.0);
  

	    //Send Matrices over to GPU (transposed because GLSL matrices are column major)
	    this.shader.bind();
	    this.shader.setUniformMatrix("model", model.transpose().val );		
	    this.shader.setUniformMatrix("view", view.transpose().val );
	    this.shader.setUniformMatrix("projection", projection.transpose().val );

    	//resize to canvas width and height
    	this.clear();
    	GL.viewport(0,0, this.width, this.height);	
	},

	/// Stop Rendering Scene
	end: function(){
		//this.shader.unbind();
	}
}

GFX.App = function(){

}

GFX.App.prototype = {

	constructor: GFX.App,

	/// Defaults to finding element called "gfxcanvas" "gfxvert" and "gfxfrag"
	_init: function(){
		GFX.InitContext( document.getElementById("gfxcanvas") );
 		var vertScript = document.getElementById("gfxvert").text;
  		var fragScript = document.getElementById("gfxfrag").text;
		this.scene = new GFX.Scene();
  		this.scene.shader.program( vertScript, fragScript );
		this.onInit();
	},

	/// User initialization of GL objects and buffers
	onInit: function(){},

	/// Called Repeatedly by Animate function
	onRender: function(){},

	/// Initialize and Begin 
	start: function() {
  		this._init();
  		this.mainloop();
 	},

 	mainloop: function(){
 		RequestAnimFrame( this.mainloop.bind(this) ); //must bind function to this instance so it doesn't look in window's methods
 		this.onRender();
 	}
}
	



