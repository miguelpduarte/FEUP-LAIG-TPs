attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

varying vec2 vTextureCoord;
uniform sampler2D heightSampler;
uniform float height;

void main() {
    vec4 color = texture2D(heightSampler, aTextureCoord);

    // Assuming the height map is greyscale
    // Any single color channel could be used
    float calc_height = color.r * height;

	gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition.x, calc_height, aVertexPosition.z, 1.0);

	vTextureCoord = aTextureCoord;
    // gl_Position.y = gl_Position.y + 0.3;
}