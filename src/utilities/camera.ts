import * as OBC from "openbim-components";

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
      camera.controls.mouseButtons.right = 0;
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

export function cameraDisableOrbitalFunctionalities(gsap: any, camera: any) {
  gsap.to(camera.activeCamera.position, {
    duration: 0.1,
    ease: "power1.inOut",
    onUpdated: () => {
      // camera.controls.updateProjectionMatrix()
    },
    onComplete: () => {
      camera.controls.enabled = false;
      camera.controls.dollyToCursor = false;
      camera.controls.enablePan = false;
      camera.controls.enableZoom = false;
      camera.controls.screenSpacePanning = false;
      camera.controls.azimuthRotateSpeed = 0;
      camera.controls.maxPolarAngle = 180;
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

export function cameraEnablePanningFunctionality(gsap: any, camera: any) {
  gsap.to(camera.activeCamera.position, {
    duration: 0.1,
    ease: "power1.inOut",
    onUpdated: () => {
      console.error(camera.controls);
    },
    onComplete: () => {
      camera.controls.enabled = true;
      camera.controls.dollyToCursor = true;
      camera.controls.enablePan = true;
      camera.controls.enableZoom = true;
      camera.controls.screenSpacePanning = true;
      camera.controls.azimuthRotateSpeed = 0;
      // camera.controls.maxAzimuthAngle = 0
      camera.controls.polarRotateSpeed = 0;
      camera.controls.maxPolarAngle = Math.PI;
      camera.controls.dragToOffset = true;
    },
  });
}

export function toggleCameraPerspective(components: OBC.Components) {
  //@ts-ignore
  components.camera.setProjection("Perspective");
  //@ts-ignore
  components.camera.controls.mouseButtons.left = 1; // 1
  //@ts-ignore
  components.camera.controls.mouseButtons.middle = 16; // 8
  //@ts-ignore
  components.camera.controls.mouseButtons.right = 0; // 2
  //@ts-ignore
  components.camera.controls.mouseButtons.wheel = 16; // 8
  //@ts-ignore
  components.camera.controls.enableZoom = true;
}

export function toggleCameraOrthographic(components: OBC.Components) {
  //@ts-ignore
  components.camera.setProjection("Orthographic");
  //@ts-ignore
  components.camera.controls.mouseButtons.left = 1; // 1
  //@ts-ignore
  components.camera.controls.mouseButtons.middle = 8; // 8
  //@ts-ignore
  components.camera.controls.mouseButtons.right = 2; // 2
  //@ts-ignore
  components.camera.controls.mouseButtons.wheel = 0; // 8
  //@ts-ignore
  components.camera.controls.enableZoom = false;
}
