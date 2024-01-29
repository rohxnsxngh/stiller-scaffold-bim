export function cameraTopView(gsap: any, camera: any) {
  gsap.to(camera.activeCamera.position, {
    duration: 0.1,
    ease: "power1.inOut",
    onUpdate: () => {
      camera.controls.setLookAt(0, 50, 0, 0, 0, 0);
    },
    onComplete: () => {
      camera.controls.enabled = true;
      camera.controls.enablePan = true;
      camera.controls.enableZoom = true;
      camera.controls.screenSpacePanning = true;
    },
  });
}

export function cameraPerspectiveView(gsap: any, camera: any) {
  gsap.to(camera.activeCamera.position, {
    duration: 0.1,
    ease: "power1.inOut",
    onUpdate: () => {
      camera.controls.setLookAt(10, 10, 10, 0, 0, 0);
    },
    onComplete: () => {
      camera.controls.enabled = true;
      camera.controls.enablePan = true;
      camera.controls.enableZoom = true;
      camera.controls.screenSpacePanning = true;
    },
  });
}
