#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;

uniform sampler2D flagSampler;

void main() {
	gl_FragColor = texture2D(flagSampler, vTextureCoord);
}