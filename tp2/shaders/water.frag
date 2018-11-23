#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;

uniform sampler2D waterSampler;
uniform float texscale;
uniform float timefactor;

void main() {
	gl_FragColor = texture2D(waterSampler, vTextureCoord * texscale);
}