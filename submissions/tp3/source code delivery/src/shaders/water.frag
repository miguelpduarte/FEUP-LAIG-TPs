#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;

uniform sampler2D waterSampler;
uniform float texscale;

uniform float timefactor1;
uniform float timefactor2;

uniform bool is_water_tex_moving;

void main() {
	if (is_water_tex_moving) {
		vec2 tex_coords_shift = vec2(timefactor1, timefactor2);
    	vec2 calc_tex_coords = vTextureCoord + tex_coords_shift;

    	gl_FragColor = texture2D(waterSampler, calc_tex_coords * texscale);
	} else {
		gl_FragColor = texture2D(waterSampler, vTextureCoord * texscale);
	}
}