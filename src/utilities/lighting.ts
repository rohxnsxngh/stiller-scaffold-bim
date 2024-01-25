import * as THREE from "three";

export const createLighting = (scene: THREE.Scene) => {
    const directionalLight = new THREE.DirectionalLight();
    directionalLight.position.set(5, 10, 3);
    directionalLight.intensity = 0.5;
    scene.add(directionalLight);
  
    const ambientLight = new THREE.AmbientLight();
    ambientLight.intensity = 0.5;
    scene.add(ambientLight);
}