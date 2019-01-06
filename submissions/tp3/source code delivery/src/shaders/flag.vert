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

#define M_PI 3.1415926535897932384626433832795

uniform float windstrength;
uniform float timefactor;
uniform bool is_back;

void main() {
    float mapped_tex_coord_s = aTextureCoord.s;
    float phase_shift = 0.0;

    if (is_back) {
        // Switching up the s scale, [0,1] becomes [1,0] in order for the mapping to be consistent in the back part
        mapped_tex_coord_s = (mapped_tex_coord_s - 1.0) * -1.0;
        // Necessary to make sure that the sin phase aligns on both sides of the flag
        phase_shift = M_PI;
    }
    
    float calc_norm_shift = sin(mapped_tex_coord_s * 2.0 * M_PI + timefactor + phase_shift) * windstrength;

    vec3 normal_shift = aVertexNormal * calc_norm_shift * mapped_tex_coord_s;

	gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition + normal_shift, 1.0);

	vTextureCoord = aTextureCoord;
}