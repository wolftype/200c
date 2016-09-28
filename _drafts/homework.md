---

permalink: /homework/
---

<script type="text/javascript" src="https://rawgit.com/patriciogonzalezvivo/glslCanvas/master/build/GlslCanvas.js"></script>

<canvas data-fragment="

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st.x *= u_resolution.x/u_resolution.y;

    st += vec2(.0);
    vec3 color = vec3(1.);
    color = vec3(st.x,st.y,abs(sin(u_time)));

    gl_FragColor = vec4(color,1.0);
}

"

width="800" height="600"> </canvas>



Midterm: Create a 2D Algorithmic Print and present the process with 5-10 slides.

*Assignment:* Into the Shade

1. Using the interactive editor at [http://editor.thebookofshaders.com/]() develop a program that changes based on the float `u_time`.

Create an account on [github](https://github.com/), publish your work as a [gist](https://help.github.com/articles/about-gists/).

Reading: [The Book of Shaders](https://thebookofshaders.com/)
Reading: [WebGL Tutorial Part One]({{ site.baseurl}}{% post_url 2016-09-18-webGL-1-context-and-loop%}) and [WebGL Tutorial Part Two]({{ site.baseurl}}{% post_url 2016-09-18-webGL-2-shaders-and-buffers%})
Reading: (optional) [LearnOpenGL](http://learnopengl.com/)


*Assignment:* Binding Agreement

Pick a framework (OF, Cinder, Three.js, A-Frame) and detail the graphics pipeline -- where and when
do matrices get passed to the shader?

Reading: [Triangle Strips](http://www.learnopengles.com/tag/triangle-strips/)
Reading: [Paul Bourke's](http://paulbourke.net/stereographics/stereorender/)


*Assignment:* Catching some Rays

*Assignment:* Build a Bug

Using what we have learned about forward and inverse kinematics, design an animated creature that responds to mouse input.

*Assignment:* World-Building

Procedural terrain generation