#ifdef GL_ES
precision highp float;
#endif

attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

varying vec2 vTextureCoord;

uniform sampler2D waveSampler;

uniform float heightscale;
uniform float texscale;

uniform float timefactor1;
uniform float timefactor2;

void main() {
    vec2 tex_coords_shift = vec2(timefactor1, timefactor2);

    vec2 calc_tex_coords = aTextureCoord + tex_coords_shift;

    vec4 color = texture2D(waveSampler, calc_tex_coords * texscale);

    // Assuming the height map is greyscale
    // Any single color channel could be used
    float calc_height = color.b * heightscale;

	gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition.x, calc_height, aVertexPosition.z, 1.0);

	vTextureCoord = aTextureCoord;
}