---
layout: page
category: tutorials
tag: webgl
---

Here we look at compiling shader programs and sending buffers of data to the GPU.

### Shaders

In our [previous post]({{site.baseurl}}{% post_url 2016-09-18-webGL-1-context-and-loop %}) we initialized a **context** and started an animation **loop**.  Next, we'll generate some programs (called "shaders") that can be run on your device's GPU.  Shader programs process input information such as 3D vertex coordinates and output pixels on your screen.

In a new `initShader` function let's call some `GL` methods to **create**, **load**, **compile**, **attach** and **link** a shader program.

#### Create

A shader program is comprised of at least two different types of shaders, a vertex shader, which handles coordinate data, and fragment shader, which handles pixel data.

First, we need to create a program, and these two types of shaders.  Methods like `createProgram` and `createShader` return a number that we can use to identify these objects later.

	{% highlight javascript%}
    //Create Program and Shaders
    shaderId = GL.createProgram();
    var vertId = GL.createShader(GL.VERTEX_SHADER);
    var fragId = GL.createShader(GL.FRAGMENT_SHADER);
    {% endhighlight %}

#### Load

With our shaders created, we need to load source code written in a language called **glsl**.  Below, we grab this source code from elsewhere in our document.  

	{% highlight javascript%}
    //Load Shader
    var vertCode = document.getElementById("vertScript").text;
    var fragCode = document.getElementById("fragScript").text;

    GL.shaderSource(vertId, vertCode);
    GL.shaderSource(fragId, fragCode);
    {% endhighlight %}

#### Compile, Attach, and Link

Now we need to compile our shaders, attach them to the shader program, and link it.

	{% highlight javascript%}
    //Compile Shaders
    GL.compileShader(vertId);
    GL.compileShader(fragId);
    //Attach to Shader Program
    GL.attachShader(shaderId, vertId);
    GL.attachShader(shaderId, fragId);
    //Link Shader Program
    GL.linkProgram(shaderId);
    {% endhighlight %}

In the full code sample below, note that we all check for any errors after compiling our shaders,
and after linking our program.


### GLSL Shader Code

We will spend more time investigating shader coding language **glsl** later on in this course.  A great online introduction to the logic of shaders can be found at [https://thebookofshaders.com/]().  That resource deals almostly exclusively with fragment shaders, but covers a lot of useful information about the language specification itself.  As before, the [WebGL 1.0 reference card](https://www.khronos.org/files/webgl/webgl-reference-card-1_0.pdf) may also be useful.

For now, let's simply consider the vertex shader.  This is a program whose only real responsibility is to process vector coordinate information. It can take on more tasks, such as receiving other kinds of input or sending output to the fragment shader, but let's focus on this bare bones requirement first.  Here's our vertex shader code:

	{% highlight javascript linenos%}
	#ifdef GL_ES
	precision lowp float;
	#endif

	attribute vec3 position; 

	void main(void) {
		gl_Position = vec4(position,1.0);
	}
    {% endhighlight %}

The first three lines tell us to set a precision for floating point values if the code is being run by an embedded device (like a smartphone or a Raspberry Pi).

Line 5 names an `attribute` of type `vec3` -- that is, a 3D coordinate position.  `attribute` is a reserved word that signifies an input to the shader (in fact, in later specifications of the glsl language we use the `in` keyword, which is short for "input").  This is data that will be coming in from a buffer on the GPU.  Soon, we'll learn how to tie the buffer of data to this input variable.

Finally, lines 7-9 specify a `main` function, whose sole task is to set a variable called `gl_position` to the incoming position vector.  

### Buffers

Before we can do anything with this shader code, we need to create some vertex data on the GPU.  To do this, we **create** a buffer with `createBuffer`, we **bind** the buffer with `bindBuffer`, we **allocate** space on the GPU with `bufferData`, and we copy data over from the CPU with `bufferSubData`.

	{% highlight javascript %}
    //Some Vertex Data
    var vertices = new Float32Array( [
      -1.0, -1.0, 0.0,
      -1.0,  1.0, 0.0,
       1.0,  1.0, 0.0,
       1.0, -1.0, 0.0
    ]);
    //Create A Buffer
    var vertexBufferId = GL.createBuffer();
    //Bind it to Array Buffer
    GL.bindBuffer(GL.ARRAY_BUFFER, vertexBufferId);
    //Allocate Space on GPU
    GL.bufferData(GL.ARRAY_BUFFER, vertices.byteLength, GL.STATIC_DRAW);
    //Copy Data Over, passing in offset
    GL.bufferSubData(GL.ARRAY_BUFFER, 0, vertices );
    {% endhighlight %}

We have just sent 4 vertices in the form of 12 floating point values over to the GPU.  Next, we will create another buffer for referencing this data.  This time, we use the `ELEMENT_ARRAY_BUFFER`

	{% highlight javascript %}
    //Some Indexing Data
    var indices = new Uint16Array([ 0,1,3,2 ]);
    //Create A Buffer
    indexBuffer = GL.createBuffer();
    //Bind it to Element Array Buffer
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, indexBuffer);
    //Allocate Space on GPU
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, indices.byteLength, GL.STATIC_DRAW);
    //Copy Data Over, passing in offset
    GL.bufferSubData(GL.ELEMENT_ARRAY_BUFFER, 0, indices );
    {% endhighlight %}

Okay!  That array of numbers `[ 0,1,3,2 ]` specifies the order in which we will draw our 4 `vertices`. They are laid out as follows:

1--------2
|		 |
|		 |
|		 |
0--------3

We will find out why we draw them in a zig-zag pattern when we look at `GL_TRIANGLE_STRIP`.

### Rendering

Just one more thing to do: render our content!  To do that, we need to **bind** our shader with `useProgram`, **enable** our shader's position attribute with `enableVertexAttribArray`, **bind** our vertex buffer with `bindBuffer`, **point** the attribute to this buffer with `vertexAttribPointer`, **bind** our index buffer, and finally **draw** these indexed elements with `drawElements`.

	{% highlight javascript %}
    //Bind Shader
    GL.useProgram(shaderId);   
    //Enable Position Attribute
    var attId = GL.getAttribLocation(shaderId, "position");
    GL.enableVertexAttribArray(attId);
    //Bind Vertex Buffer
    GL.bindBuffer(GL.ARRAY_BUFFER, vertexBuffer);
    ///Point to Attribute (loc, size, datatype, normalize, stride, offset)
    GL.vertexAttribPointer( attId, 3, GL.FLOAT, false, 0, 0);
    //Bind Index Buffer
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, indexBuffer);
    //Draw!      --( mode, number_of_elements, data type, offset )
    GL.drawElements(GL.TRIANGLE_STRIP, 4, GL.UNSIGNED_SHORT, 0);
    {% endhighlight %}

In the code above, perhaps the most complicated line is `GL.vertexAttribPointer`, which specifies the attribute "position" (`attId`), the number of values for each (`3`), the type of each (`FLOAT`), whether or not we want to normalize these values (`false`), the stride between each attribute (`0`, which means closely packed -- more on this later), and any offset into memory.

### The Code

The whole enchilada is below, where we separate our tasks into `initShaderProgram`, `initBuffers` and `render` functions.  You'll notice we added a fragment shader source code and a method in our `render` function to change a parameter in it.  Such a parameter is called a `uniform` and on line's 133 and 134 we change it:

	{% highlight javascript %}
	//Update uniform variable on shader
	var uID = GL.getUniformLocation(shaderId, "uTime");
	GL.uniform1f(uID, timer);
    {% endhighlight %}

For a much better reference on fragment shaders, see the excellent [book of shaders](https://thebookofshaders.com/).


<script src="https://gist.github.com/wolftype/cc8c0856db26dffa51b01000e9f20a28.js"></script>