import * as THREE from "three";

export const createLighting = (scene: THREE.Scene) => {
  const directionalLight = new THREE.DirectionalLight();
  directionalLight.name = "directionalLight";
  directionalLight.position.set(50, 100, 3);
  directionalLight.intensity = 0.5;
  scene.add(directionalLight);

  const ambientLight = new THREE.AmbientLight();
  ambientLight.name = "ambientLight";
  ambientLight.intensity = 0.5;
  scene.add(ambientLight);

  const hemisphereLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
  hemisphereLight.name = "hemisphereLight"
  scene.add(hemisphereLight);
};
