#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;

uniform sampler2D terrainSampler;

void main() {
    // if (vTextureCoord.s > 0.5) {
    //     gl_FragColor = vec4(0.0, 0.0, 1.0, 1.0);
    // } else {
    //     gl_FragColor = vec4(0.0, 1.0, 1.0, 1.0);
    // }

	gl_FragColor = texture2D(terrainSampler, vTextureCoord);
}