#ifdef GL_ES
precision highp float;
#endif

attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;
uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

uniform float timeFactor;
uniform float normScale;
varying vec4 coords;
varying vec4 normal;

void main() {
    // vertex pushed outwards according to the normal and scale
    vec4 vertex = vec4(aVertexPosition + aVertexNormal*normScale*timeFactor*0.1, 1.0);
    // projected vertex
    gl_Position = uPMatrix * uMVMatrix * vertex;
    // normal variable
    normal = vec4(aVertexNormal, 1.0);
    coords = vertex / 10.0;
}