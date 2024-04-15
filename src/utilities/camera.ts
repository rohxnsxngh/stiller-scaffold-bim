// Camera Top View
export function cameraTopView(gsap: any, camera: any) {
  gsap.to(camera.activeCamera.position, {
    duration: 0.75,
    ease: "power1.inOut",
    onUpdate: () => {
      camera.controls.setLookAt(0, 50, 0, 0, 0, 0);
    },
    onComplete: () => {
      camera.controls.enabled = true;
      camera.controls.enablePan = false;
      camera.controls.enableZoom = true;
      camera.controls.screenSpacePanning = false;
    },
  });
}

// Camera Perspective View
export function cameraPerspectiveView(gsap: any, camera: any) {
  gsap.to(camera.activeCamera.position, {
    duration: 0.75,
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

export function cameraDisableOrbitalFunctionality(gsap: any, camera: any) {
  gsap.to(camera.activeCamera.position, {
    duration: 0.1,
    ease: "power1.inOut",
    onComplete: () => {
      camera.controls.enabled = true;
      camera.controls.dollyToCursor = false;
      camera.controls.enablePan = false;
      camera.controls.enableZoom = false;
      camera.controls.screenSpacePanning = false;
      camera.controls.azimuthRotateSpeed = 0;
      camera.controls.maxPolarAngle = 0;
    },
  });
}

export function cameraEnableOrbitalFunctionality(gsap: any, camera: any) {
  gsap.to(camera.activeCamera.position, {
    duration: 0.1,
    ease: "power1.inOut",
    onComplete: () => {
      camera.controls.enabled = true;
      camera.controls.dollyToCursor = true;
      camera.controls.enablePan = true;
      camera.controls.enableZoom = true;
      camera.controls.screenSpacePanning = true;
      camera.controls.azimuthRotateSpeed = 1;
      camera.controls.maxPolarAngle = Math.PI;
    },
  });
}
