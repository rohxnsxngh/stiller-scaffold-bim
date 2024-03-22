import * as THREE from "three";

// Vertex shader code
const vertexRectShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Fragment shader code
const fragmentRectShader = `
  varying vec2 vUv;
  uniform float lineWidth;
  uniform vec3 lineColor;
  void main() {
    float edge = min(1.0 - lineWidth, min(vUv.x, min(1.0 - vUv.x, min(vUv.y, 1.0 - vUv.y))));
    vec3 baseColor = vec3(1.0, 0.0, 0.0); // Blue background color
    vec3 lineColorAdjusted = mix(vec3(0.0), lineColor, 0.5); // Adjust line color intensity
    vec3 color = mix(baseColor, lineColorAdjusted, smoothstep(0.0, 0.02, edge));
    gl_FragColor = vec4(color, 0.5); // Adjust transparency as needed
  }
`;

// Create ShaderMaterial
export const rectMaterial = new THREE.ShaderMaterial({
  uniforms: {
    lineWidth: { value: 0.05 }, // Adjust line width as needed
    lineColor: { value: new THREE.Color(0x000000) }, // Adjust line color as needed
  },
  vertexShader: vertexRectShader,
  fragmentShader: fragmentRectShader,
  side: THREE.DoubleSide,
});

export const roofMaterial = new THREE.MeshPhongMaterial({
  color: 0x1a1a1c,
  side: THREE.DoubleSide,
});
