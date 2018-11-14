#ifdef GL_ES
precision highp float;
#endif

varying vec4 coords;
varying vec4 normal;
uniform float timeFactor;
uniform vec4 selColor;

void main() {
    gl_FragColor =  normal;
    gl_FragColor.rgb = mix(gl_FragColor.rgb, selColor.rgb, timeFactor);
}