import * as OBC from "openbim-components";
import { CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer.js";
import * as THREE from "three";

export const objectsEqual = (o1: any, o2: any): boolean =>
  typeof o1 === "object" && Object.keys(o1).length > 0
    ? Object.keys(o1).length === Object.keys(o2).length &&
      Object.keys(o1).every((p) => objectsEqual(o1[p], o2[p]))
    : o1 === o2;

export const deepEqual = (x: any, y: any): boolean => {
  return x && y && typeof x === "object" && typeof y === "object"
    ? Object.keys(x).length === Object.keys(y).length &&
        Object.keys(x).reduce(function (isEqual: any, key: any) {
          return isEqual && deepEqual(x[key], y[key]);
        }, true)
    : x === y;
};

export function getMousePosition(
  e: MouseEvent,
  mouse: THREE.Vector2,
  raycaster: THREE.Raycaster,
  scene: THREE.Scene,
  components: OBC.Components
) {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  // @ts-ignore
  raycaster.setFromCamera(mouse, components.camera.activeCamera);
  const intersection = raycaster.intersectObjects(scene.children);
  return intersection;
}

export function distanceFromPointToLine(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  x0: number,
  y0: number
) {
  const A = y2 - y1;
  const B = x1 - x2;
  const C = x2 * y1 - x1 * y2;

  return Math.abs(A * x0 + B * y0 + C) / Math.sqrt(A * A + B * B);
}

export function createBoundingBoxVisualization(mesh: THREE.Mesh) {
  mesh.geometry.computeBoundingBox();
  const boundingBox = mesh.geometry.boundingBox;

  if (!boundingBox) {
    throw new Error("Bounding Box does not exist");
  }

  const boxGeometry = new THREE.BoxGeometry(
    boundingBox.max.x - boundingBox.min.x,
    boundingBox.max.y - boundingBox.min.y,
    boundingBox.max.z - boundingBox.min.z
  );
  const boxMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff, // Red color
    wireframe: true,
  });
  const box = new THREE.Mesh(boxGeometry, boxMaterial);
  box.position.set(
    boundingBox.min.x + (boundingBox.max.x - boundingBox.min.x) / 2,
    boundingBox.min.y + (boundingBox.max.y - boundingBox.min.y) / 2,
    boundingBox.min.z + (boundingBox.max.z - boundingBox.min.z) / 2
  );

  return box;
}

export function calculateTransformedBoundingBox(mesh: THREE.Mesh): THREE.Box3 {
  const boundingBox = new THREE.Box3().setFromObject(mesh);

  return boundingBox;
}

export function createBoundingBoxVisualizationFromBox(box: THREE.Box3) {
  const boxGeometry = new THREE.BoxGeometry(
    box.max.x - box.min.x,
    box.max.y - box.min.y,
    box.max.z - box.min.z
  );
  const boxMaterial = new THREE.MeshBasicMaterial({
    color: 0xff0000, // Red color
    wireframe: true,
  });
  const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
  boxMesh.position.set(
    box.min.x + (box.max.x - box.min.x) / 2,
    box.min.y + (box.max.y - box.min.y) / 2,
    box.min.z + (box.max.z - box.min.z) / 2
  );

  return boxMesh;
}

export function createArrowHelper(
  scene: THREE.Scene,
  direction: THREE.Vector3,
  origin: THREE.Vector3,
  length: number,
  color: number
) {
  const arrowHelper = new THREE.ArrowHelper(direction, origin, length, color);
  scene.add(arrowHelper);
}

// Usage:
// const edgeDirection = new THREE.Vector3(1,  0,  0); // Example direction
// const midpointLine = new THREE.Vector3(0,  0,  0); // Example origin
// createArrowHelper(scene, edgeDirection, midpointLine,  10,  0x000000);

export function resetScene(
  scene: THREE.Scene,
  components: OBC.Components,
  shadows: OBC.ShadowDropper
) {
  const objectsToRemove: any = [];
  const objectsToRemoveUUID: any = [];
  scene.traverse((child) => {
    objectsToRemoveUUID.push(child.uuid);
    if (child instanceof CSS2DObject) {
      child.visible = false;
      child.element.style.pointerEvents = "none";
      objectsToRemove.push(child);
    }
    if (
      child.name !== "ground" &&
      (child instanceof THREE.Mesh ||
        child instanceof THREE.Points ||
        child instanceof THREE.Line) &&
      !(child.geometry instanceof THREE.PlaneGeometry)
    ) {
      console.log(child);
      if (child.geometry) child.geometry.dispose();
      if (child.material.map) child.material.map.dispose();
      objectsToRemove.push(child);
    }
    if (child.name === "scaffoldingModel") {
      objectsToRemove.push(child);
    }
  });
  objectsToRemove.forEach((object: any) => {
    scene.remove(object);
  });

  objectsToRemoveUUID.forEach((uuid: any) => {
    try {
      shadows.deleteShadow(uuid);
    } catch (error) {
      console.error("Error: ", error);
    }
  });
  console.log(scene, components, shadows);
}

// helper function to measure line length
export function measureLineLength(points: any) {
  const lastIndex = points.length - 1;
  const secondToLastIndex = points.length - 2;
  if (points.length > 1) {
    let length;
    // use pythagorean theorem to calculate distance
    const xLeg = Math.abs(points[lastIndex].x - points[secondToLastIndex].x);
    const zLeg = Math.abs(points[lastIndex].z - points[secondToLastIndex].z);
    const hypotenuse = Math.sqrt(Math.pow(xLeg, 2) + Math.pow(zLeg, 2));
    length = hypotenuse;

    return [length, points[lastIndex], points[secondToLastIndex]];
  } else {
    return [0, null, null];
  }
}

// Function to disable OrbitControls
export function disableOrbitControls(controls: any) {
  controls.enabled = false;
  controls.enableZoom = false;
  controls.enablePan = false;
  controls.enableRotate = false;
}

// delete an object when raycast intersects with object
export function deleteObject(object: any, scene: THREE.Scene) {
  // const parentObject = object.parent.children;
  if (object.parent.type === "Object3D") {
    const parent = object.parent;
    console.log(parent);
    // Remove the parent recursively
    removeFromScene(parent, scene);
  } else {
    // Remove the parent recursively
    object.material.dispose();
    scene.remove(object);
  }
}

// Function to remove object from the scene recursively
// this helper function is meant specifically for gltf that contain a tree of objects
function removeFromScene(object: any, scene: THREE.Scene) {
  if (object.parent) {
    // Dispose of materials
    if (object.material) {
      if (Array.isArray(object.material)) {
        object.material.forEach((material: { dispose: () => void }) => {
          material.dispose();
        });
      } else {
        object.material.dispose();
      }
    }

    object.parent.remove(object);
    removeFromScene(object.parent, scene); // Recursively remove parent
  } else {
    // Dispose of materials
    if (object.material) {
      if (Array.isArray(object.material)) {
        object.material.forEach((material: { dispose: () => void }) => {
          material.dispose();
        });
      } else {
        object.material.dispose();
      }
    }

    scene.remove(object); // If no parent, remove from scene
  }
}

export function hideAllCSS2DObjects(scene: THREE.Scene) {
  scene.traverse(function (child) {
    if (child instanceof CSS2DObject) {
      child.element.style.pointerEvents = "none";
      child.visible = false;
    }
  });
}

export function resetSceneExceptSingularObject(scene: THREE.Scene, objectName: string) {
  const objectsToRemove: any = [];
  scene.traverse((child: any) => {
    if (child.name !== "rectangleLabel" && child instanceof CSS2DObject) {
      objectsToRemove.push(child);
    }
    if (
      child.name !== "ground" &&
      child.name !== `${objectName}` &&
      (child instanceof THREE.Mesh ||
        child instanceof THREE.Points ||
        child instanceof THREE.Line) &&
      !(child.geometry instanceof THREE.PlaneGeometry)
    ) {
      objectsToRemove.push(child);
    }
    if (child.name === "scaffoldingModel") {
      objectsToRemove.push(child);
    }
  });

  objectsToRemove.forEach((child: THREE.Object3D<THREE.Object3DEventMap>) => {
    scene.remove(child);
  });
}

export function setInvisibleExceptSingularObject(scene: THREE.Scene, objectName: string) {
  const objectsToRemove: any = [];
  scene.traverse((child: any) => {
    if (child.name !== "rectangleLabel" && child instanceof CSS2DObject) {
      objectsToRemove.push(child);
    }
    if (
      child.name !== "ground" &&
      child.name !== `${objectName}` &&
      (child instanceof THREE.Mesh ||
        child instanceof THREE.Points ||
        child instanceof THREE.Line) &&
      !(child.geometry instanceof THREE.PlaneGeometry)
    ) {
      objectsToRemove.push(child);
    }
    if (child.name === "scaffoldingModel") {
      objectsToRemove.push(child);
    }
  });

  objectsToRemove.forEach((child: THREE.Object3D<THREE.Object3DEventMap>) => {
    child.visible = false
  });
}

// 
export function observeElementAndAddEventListener(
  elementId: string,
  eventType: string,
  eventHandler: (event: Event) => void
 ) {
  const addEventListenerToElement = () => {
     const element = document.getElementById(elementId);
     if (element) {
       console.log(`Element ${elementId} found, adding event listener`);
       element.addEventListener(eventType, eventHandler);
      // optional I am disconnecting observer. this should be used when an element will never be used again
      //  observer.disconnect(); // Stop observing once the element is found
     } else {
       console.log(`Element ${elementId} not found yet`);
     }
  };
 
  // Create a MutationObserver to watch for changes in the DOM
  const observer = new MutationObserver(addEventListenerToElement);
 
  // Start observing the document with the configured callback
  observer.observe(document, { childList: true, subtree: true });
 
  // Call the function once to check if the element is already in the DOM
  addEventListenerToElement();
 }