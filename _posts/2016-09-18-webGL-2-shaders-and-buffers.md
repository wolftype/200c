---
layout: page
category: tutorials
tag: webgl
---

Here we look at compiling shader programs and sending buffers of data to the GPU.

### Shaders

In our [previous post]({% post_url 2016-09-18-webGL-1-context-and-loop %}) we initialized a **context** and started an animation **loop**.  Next, we'll generate some programs (called "shaders") that can be run on your device's GPU.

In our `initWebGL` function let's add some `GL` methods to **create**, **load**, **compile**, **link**, and **bind** a shader program.



### Buffers


{{ post.date | date: "%b %-d, %Y" }}

The whole enchilada is below and viewable here:


<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width="640" height="480" src="https://bl.ocks.org/wolftype/raw/cc8c0856db26dffa51b01000e9f20a28"></iframe>


<script src="https://gist.github.com/wolftype/cc8c0856db26dffa51b01000e9f20a28.js"></script>