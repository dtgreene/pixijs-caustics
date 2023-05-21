precision mediump float;

varying vec2 vTextureCoord;
uniform vec4 filterArea;
uniform sampler2D uSampler;
uniform float uScale1;
uniform float uScale2;
uniform float uTime;
uniform float uRatio;

const vec4 colorShift = vec4(0.0, 0.2, 0.2, 1.0);
const float speed = 0.001;
const float boost = 2.0;
const float scale = 1.5;

void main() {
  vec2 offset = vec2(speed * uTime, speed * uTime);
  vec2 coord = vec2(vTextureCoord.x, vTextureCoord.y / uRatio);

  vec2 position1 = (coord + offset) * uScale1 * scale;
  vec2 position2 = (-coord + offset) * uScale2 * scale;

  vec4 color1 = texture2D(uSampler, fract(position1));
  vec4 color2 = texture2D(uSampler, fract(position2));

  gl_FragColor = min(color1, color2) * boost + colorShift;
}
