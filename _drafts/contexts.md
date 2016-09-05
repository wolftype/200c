
###Context
In the land of OpenGL (The "GL" stands for "**G**raphics **L**ibrary") and all its flavors (OpenGL ES, WebGL), a rendering **context** is a channel on which drawing states are transmitted to the device's window. A single application can have many contexts, but only one is **current** at any given time on any given thread of execution.

No matter the device we are rendering to, we need to create a context before we can do anything else. Since you are viewing this tutorial on the web, let us start with WebGL contexts.

###WebGL



