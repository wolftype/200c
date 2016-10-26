
1) GLSL (shader) matrices are stored in _______ order.

a) row-major
b) column-major

2) To switch a Matrix from row-major to column-major we must _______.

a) Transfer
b) Translate
c) Transpose

3) A Quaternion is really just

a) The sum of two vectors
b) The cross product of two vectors
c) The geometric product of two vectors
d) The dot product of two vectors

4) A Quaternion can be created from:

a) an axis and an angle
b) two quaternions
c) two vectors
d) euler angles
e) all of the above
d) a and c but not b or d

5) A 3D vector (x,y,z) that has been given an additional value w equal to 1 is a:

a) vector in homogeneous coordinates
b) quaternion
d) impossible

6) An index buffer can be used when rendering a mesh to:

a) determine which mesh to draw
b) determine the order of vertices to draw
c) determine the order of shaders to bind
d) determine the uv coordinates

7) UV coordinates specify

a) the position of vectors in 3D space
b) a coordinate system to use on the fragment shader
c) how to transform the model matrix

8) A typical OpenGL (or WebGL) resource is typically

c) copied, bound, allocated, then created
a) created, bound, allocated, then filled
b) allocated, bound, filled, then created

9) Quaternions in 3D graphics are primarily used for:

a) scaling
b) translating
c) rotations
d) all of the above


10) The typical order of matrix multiplication when creating a local reference frame 
based on position, orientation, and size is:

a) rotation * translation * scaling
b) translation * scaling * rotation
c) scaling * rotation * translation
d) translation * rotation * scaling
e) scaling * translation * rotation
f) rotation * scaling * translation
g) doesn't matter

11) To add and additional arbitrary transformations we could use a

a) Matrix Stack
b) Quaternion
c) We can't, it's impossible


12) We are sitting in an OpenGL scene with the x axis pointing to our right and the y axis pointing upwards.  If we want to move in the positive z direction we should:

a) walk forward
b) walk backward
c) jump


13) The "channel" we create first in order to communicate to the device window is the OpenGL ________.

a) context
b) shader
c) pipeline


