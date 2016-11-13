---
layout: page
category: schedule
---

Textures and Cubemaps  
[Slides from class]({{ site.baseurl}}/scratch/slides_04.html)

Reading: [Textures](http://learnopengl.com/#!Getting-started/Textures)  
Reading: [Cubemaps and Skyboxes](http://learnopengl.com/#!Advanced-OpenGL/Cubemaps)  
Reading: [Cubemaps and Skyboxes II](https://capnramses.github.io/opengl/cubemaps.html)

Textures are 2D or 3D buffers of 1D,2D,3D or 4D data.

<figure>
<iframe src="{{site.baseurl}}/scratch/webgl_gfx_cubemap_skybox.html" 
    width="800" height="600" frameborder="0"
    scrolling="no" marginheight="0"
    marginwidth="0" ></iframe>
</figure>

### Billboards 

Billboards are rectangles with textures attached to them, which always face the camera

Graphics:[webgl_gfx_frame_billboards.html]({{ site.baseurl}}/scratch/webgl_gfx_frame_billboards.html)   
Code: [https://github.com/wolftype/200c/blob/gh-pages/scratch/webgl_gfx_frame_billboards.html](https://github.com/wolftype/200c/blob/gh-pages/scratch/webgl_gfx_frame_billboards.html)

### 2 Textures 

Multiple textures can be applied by sending ids to with `glUniform1i` and activating textures with `glActiveTexture`.  

Graphics:[webgl_gfx_textures.html]({{ site.baseurl}}/scratch/webgl_gfx_textures.html)  
Code: [https://github.com/wolftype/200c/blob/gh-pages/scratch/webgl_gfx_textures.html](https://github.com/wolftype/200c/blob/gh-pages/scratch/webgl_gfx_textures.html)

### Cubemap

Cubemaps are a set of six textures that can be used to create an environment "skybox" that
we sit inside of.  As we are in a right-handed coordinate system, the positive Z direction is behind you and the negative Z direction is in front of you.

Graphics:[webgl_gfx_cubemap_skybox.html]({{ site.baseurl}}/scratch/webgl_gfx_cubemap_skybox.html)   
Code: [https://github.com/wolftype/200c/blob/gh-pages/scratch/webgl_gfx_cubemap_skybox.html](https://github.com/wolftype/200c/blob/gh-pages/scratch/webgl_gfx_cubemap_skybox.html)