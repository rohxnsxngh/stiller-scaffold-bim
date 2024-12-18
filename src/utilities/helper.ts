import * as OBC from "openbim-components";
import { CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer.js";
import * as THREE from "three";
import { supplyStore } from "../store";

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

// TODO: make sure this clears the SET that stores scaffolding position eventually
export function resetScene(
  scene: THREE.Scene,
  components: OBC.Components,
  shadows: OBC.ShadowDropper,
  scaffoldPlacedPosition: Map<string, THREE.Vector3>
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
      if (child.geometry) child.geometry.dispose();
      if (child.material.map) child.material.map.dispose();
      objectsToRemove.push(child);
    }
    if (
      child.name === "scaffoldLine" ||
      child.name === "scaffoldingModel" ||
      child.name === "scaffoldingWireframe" ||
      child.name === "scaffoldingStackingLabel" ||
      child.name === "scaffoldingExternalStaircaseModel"
    ) {
      objectsToRemove.push(child);
    }
    if (child.name === "scaffoldingSheet") {
      objectsToRemove.push(child);
    }
    if (child.name === "rectanglePlane" || child.name === "blueprint") {
      objectsToRemove.push(child);
    }
    if (child.name === "markupGroup") {
      // Remove children of the "markupGroup" from the scene
      // TODO check if this implementation removes the blueprint from memory and
      // properly disposes of material
      child.traverse((grandChild) => {
        child.remove(grandChild);
      });
    }
  });
  objectsToRemove.forEach((object: any) => {
    deleteObject(object, scene);
    scene.remove(object);
  });

  objectsToRemoveUUID.forEach((uuid: any) => {
    try {
      shadows.deleteShadow(uuid);
    } catch (error) {
      console.error("Error: ", error);
    }
  });
  scaffoldPlacedPosition.clear();
  console.log(scene, components, shadows, scaffoldPlacedPosition);
  window.location.reload();
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
// TODO: make this method more efficient and more inclusive
export function deleteObject(object: any, scene: THREE.Scene) {
  hideAllCSS2DObjects(scene);
  console.warn("OBJECT TO BE DELETED", object);
  if (object.name === "ground") {
    return
  }
  // special instance for dealing with blueprints and shaderMaterials
  if (object.name === "rectanglePlane" && object.userData.shape) {
    object.visible = false;
  }

  if (object.name === "blueprint") {
    scene.traverse((child) => {
      if (child.name === "rectanglePlane" && object.userData.shape) {
        child.visible = false;
      }
    });
    object.visible = false;
  }
  if (
    object.parent instanceof THREE.Object3D &&
    object.parent.type !== "Scene"
  ) {
    object = findObjectParent(object);
    // Remove the parent recursively
    removeFromScene(object, scene);
  } else {
    // Remove the parent recursively
    console.log(object);
    if (object.material) object.material.dispose();
    if (object.geometry) object.geometry.dispose();
    if (object.userData.label) {
      scene.remove(object.userData.label);
    }
    scene.remove(object);
  }
}

// Function to remove object from the scene recursively
// this helper function is meant specifically for gltf that contain a tree of objects
// TODO: fix the issue with trhis function
function removeFromScene(object: any, scene: THREE.Scene) {
  if (object && object.parent) {
    // Dispose of materials
    if (object.material) {
      if (Array.isArray(object.material)) {
        object.material.forEach((material: { dispose: () => void }) => {
          material.dispose();
        });
      } else {
        object.material.dispose();
      }
    } else {
      console.warn("Cannot read properties of null:", object.material);
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

export function findObjectParent(object: THREE.Object3D) {
  let currentParent = object.parent;

  // Traverse up the hierarchy until a parent that is not the scene is found
  while (currentParent !== null && currentParent.type !== "Scene") {
    // If a parent that is not the scene is found, return it
    if (
      currentParent.parent !== null &&
      currentParent?.parent.type === "Scene"
    ) {
      // console.log(currentParent);
      return currentParent;
    }

    currentParent = currentParent.parent;
  }

  // If no such parent is found, return null
  return null;
}

export function hideAllCSS2DObjects(scene: THREE.Scene) {
  scene.traverse(function (child) {
    if (child instanceof CSS2DObject) {
      child.element.style.pointerEvents = "none";
      child.visible = false;
    }
  });
}

export function resetSceneExceptSingularObject(
  scene: THREE.Scene,
  objectName: string
) {
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

export function setInvisibleExceptSingularObject(
  scene: THREE.Scene,
  objectName: string
) {
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
    child.visible = false;
  });
}

// very important for listening to elements are not in th DOM
// elements in the drawer/sidebar
export function observeElementAndAddEventListener(
  elementId: string,
  eventType: string,
  eventHandler: (event: Event) => void
) {
  const addEventListenerToElement = () => {
    const element = document.getElementById(elementId);
    if (element) {
      //  console.log(`Element ${elementId} found, adding event listener`);
      element.addEventListener(eventType, eventHandler);
      // optional I am disconnecting observer. this should be used when an element will never be used again
      //  observer.disconnect(); // Stop observing once the element is found
    } else {
      //  console.log(`Element ${elementId} not found yet`);
    }
  };

  // Create a MutationObserver to watch for changes in the DOM
  const observer = new MutationObserver(addEventListenerToElement);

  // Start observing the document with the configured callback
  observer.observe(document, { childList: true, subtree: true });

  // Call the function once to check if the element is already in the DOM
  addEventListenerToElement();
}

export function removeHighlightMesh(scene: THREE.Scene) {
  const objects: THREE.Mesh<any, any, any>[] = [];
  scene.traverse(function (child) {
    if (child instanceof THREE.Mesh && child.name === "highlightMesh") {
      objects.push(child);
    }
  });

  objects.forEach((child) => {
    scene.remove(child);
  });
}

export function calculateTotalSquareMetersForScaffolding(scene: THREE.Scene) {
  let totalSquareFootage = 0;
  // TODO need to check the math in this section
  scene.traverse((child) => {
    if (child.name === "scaffoldingModel") {
      const length = child.userData.length;
      const height = child.userData.height;
      const sqCoverage = length * height;
      totalSquareFootage += sqCoverage;
    }
  });

  // console.log("total square meters", totalSquareFootage);

  return totalSquareFootage;
}

export function calculateTotalAmountScaffoldingInScene(scene: THREE.Scene) {
  let scaffoldingModelCount = 0;
  let scaffoldingExternalStaircaseCount = 0;
  let scaffoldingInternalStaircaseCount = 0;
  scene.traverse((child) => {
    if (child.name === "scaffoldingModel") {
      scaffoldingModelCount++;
    }
    if (child.name === "scaffoldingExternalStaircaseModel") {
      scaffoldingExternalStaircaseCount++;
    }
    if (child.name === "scaffoldingInternalStaircaseModel") {
      scaffoldingInternalStaircaseCount++;
    }
  });

  // console.log(
  //   `There are ${scaffoldingModelCount} scaffoldingModel objects in the scene.`
  // );
  // console.log(
  //   `There are ${scaffoldingExternalStaircaseCount} scaffoldingExternalStaircaseCount objects in the scene.`
  // );
  // console.log(
  //   `There are ${scaffoldingInternalStaircaseCount} scaffoldingInternalStaircaseModel objects in the scene.`
  // );
  return [
    scaffoldingModelCount,
    scaffoldingInternalStaircaseCount,
    scaffoldingExternalStaircaseCount,
  ];
}

export function calculateTotalSquareMetersForBlueprint(scene: THREE.Scene) {
  let totalSquareMetersOfBlueprint = 0;
  scene.traverse((child) => {
    if (child.name === "blueprint" && child.userData.shape) {
      const dimensions = calculateDimensions(child.userData.shape);
      console.log(`Width: ${dimensions.width}, Height: ${dimensions.height}`);
      totalSquareMetersOfBlueprint += dimensions.width * dimensions.height;
      console.error(child);
    }
  });

  return totalSquareMetersOfBlueprint;
}

function calculateDimensions(shape: THREE.Shape) {
  const curves = shape.curves;

  let minX = Infinity,
    maxX = -Infinity;
  let minY = Infinity,
    maxY = -Infinity;

  curves.forEach((curve) => {
    // @ts-ignore
    const { x: x1, y: y1 } = curve.v1;
    // @ts-ignore
    const { x: x2, y: y2 } = curve.v2;

    // Update min/max x values
    minX = Math.min(minX, x1, x2);
    maxX = Math.max(maxX, x1, x2);

    // Update min/max y values
    minY = Math.min(minY, y1, y2);
    maxY = Math.max(maxY, y1, y2);
  });

  // Calculate width and height
  const width = maxX - minX;
  const height = maxY - minY;

  return { width, height };
}

export function isVectorEqual(vector1: THREE.Vector3, vector2: THREE.Vector3) {
  return (
    vector1.x === vector2.x &&
    vector1.y === vector2.y &&
    vector1.z === vector2.z
  );
}

// const TOLERANCE = 0.0001; // Adjust this value based on your needs
export function areVectorsEqual(
  v1: THREE.Vector3,
  v2: THREE.Vector3,
  tolerance: number
): boolean {
  return (
    Math.abs(v1.x - v2.x) <= tolerance &&
    Math.abs(v1.y - v2.y) <= tolerance &&
    Math.abs(v1.z - v2.z) <= tolerance
  );
}

export function areAnyTwoAxesEqual(
  v1: THREE.Vector3,
  v2: THREE.Vector3
): boolean {
  return (
    (v1.x === v2.x && v1.y === v2.y) ||
    (v1.x === v2.x && v1.z === v2.z) ||
    (v1.y === v2.y && v1.z === v2.z)
  );
}

export function areVectorsEqualWithEpsilon(
  v1: THREE.Vector3,
  v2: THREE.Vector3,
  epsilon = Number.EPSILON
): boolean {
  return (
    Math.abs(v1.x - v2.x) < epsilon &&
    Math.abs(v1.y - v2.y) < epsilon &&
    Math.abs(v1.z - v2.z) < epsilon
  );
}

export function areAnyTwoAxesEqualWithEpsilon(
  v1: THREE.Vector3,
  v2: THREE.Vector3,
  epsilon = Number.EPSILON
): boolean {
  return (
    (Math.abs(v1.x - v2.x) < epsilon && Math.abs(v1.y - v2.y) < epsilon) ||
    (Math.abs(v1.x - v2.x) < epsilon && Math.abs(v1.z - v2.z) < epsilon) ||
    (Math.abs(v1.y - v2.y) < epsilon && Math.abs(v1.z - v2.z) < epsilon)
  );
}

export function resetScaffolding(scene: THREE.Scene) {
  const scaffoldingObjectsToRemove: THREE.Object3D<THREE.Object3DEventMap>[] =
    [];
  scene.traverse((child: any) => {
    if (
      child.name === "scaffoldLine" ||
      child.name === "scaffoldingModel" ||
      child.name === "scaffoldingWireframe" ||
      child.name === "scaffoldingStackingLabel" ||
      child.name === "scaffoldingExternalStaircaseModel"
    ) {
      scaffoldingObjectsToRemove.push(child);
    }
  });

  scaffoldingObjectsToRemove.forEach((scaffold) => {
    scene.remove(scaffold);
  });
}

export function addScaffoldingPositionIfUnique(
  position: THREE.Vector3,
  map: Map<string, THREE.Vector3>,
  tolerance: number
): boolean {
  for (const existingPosition of map.values()) {
    if (areVectorsEqual(position, existingPosition, tolerance)) {
      // The position is a duplicate within the tolerance
      return false;
    }
  }
  // The position is unique, add it to the map
  const positionKey = `${position.x},${position.y},${position.z}`;
  map.set(positionKey, position);
  return true;
}

// Vendor prefixes for older browsers
export function requestFullscreen(element: any) {
  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (element.mozRequestFullScreen) {
    // Firefox
    element.mozRequestFullScreen();
  } else if (element.webkitRequestFullscreen) {
    // Chrome, Safari, and Opera
    element.webkitRequestFullscreen();
  } else if (element.msRequestFullscreen) {
    // IE/Edge
    element.msRequestFullscreen();
  }
}

export function exitFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
    //@ts-ignore
  } else if (document.mozCancelFullScreen) {
    // Firefox
    //@ts-ignore
    document.mozCancelFullScreen();
    //@ts-ignore
  } else if (document.webkitExitFullscreen) {
    // Chrome, Safari, and Opera
    //@ts-ignore
    document.webkitExitFullscreen();
    //@ts-ignore
  } else if (document.msExitFullscreen) {
    // IE/Edge
    //@ts-ignore
    document.msExitFullscreen();
  }
}

let previousSelectedGeometries: THREE.Object3D<THREE.Object3DEventMap>[] = [];
let originalOpacities: Map<
  THREE.Object3D<THREE.Object3DEventMap>,
  number
> = new Map();

export function findObjectBuildingRelations(object: any, scene: THREE.Scene) {
  // Revert the opacity of previously selected geometries
  previousSelectedGeometries.forEach((geometry: any) => {
    if (originalOpacities.has(geometry)) {
      geometry.material.opacity = originalOpacities.get(geometry) || 1;
      geometry.material.transparent = geometry.material.opacity < 1;
      geometry.material.needsUpdate = true;
    }
  });

  const selectedGeometries: THREE.Object3D<THREE.Object3DEventMap>[] = [];

  if (object.userData && object.userData.shape) {
    const currentPoint = object.userData.shape.currentPoint;

    scene.traverse((child) => {
      if (
        child.userData &&
        child.userData.shape &&
        child.userData.shape.currentPoint.equals(currentPoint)
      ) {
        selectedGeometries.push(child);
      } else {
        // console.error("This child is not included", child);
      }
    });
  }

  selectedGeometries.forEach((geometry: any) => {
    if (!originalOpacities.has(geometry)) {
      // Store the original opacity if it's not already stored
      originalOpacities.set(geometry, geometry.material.opacity);
    }
    geometry.material.opacity = 0.5;
    geometry.material.transparent = true;
    geometry.material.needsUpdate = true;
  });

  // Update the reference to the currently selected geometries
  previousSelectedGeometries = selectedGeometries;

  return selectedGeometries;
}

export function returnObjectsToOriginalState() {
  // Revert the opacity of previously selected geometries
  previousSelectedGeometries.forEach((geometry: any) => {
    if (originalOpacities.has(geometry)) {
      geometry.material.opacity = originalOpacities.get(geometry) || 1;
      geometry.material.transparent = geometry.material.opacity < 1;
      geometry.material.needsUpdate = true;
    }
  });
}

export function saveAsImage(
  renderer: THREE.Renderer,
  scene: THREE.Scene,
  camera: THREE.Camera
) {
  let imgData;

  try {
    // Force a render before capturing the screenshot
    renderer.render(scene, camera);

    // Wait for the next animation frame to ensure the render is complete
    requestAnimationFrame(() => {
      var strMime = "image/jpeg";
      var strDownloadMime = "image/octet-stream";

      imgData = renderer.domElement.toDataURL(strMime);

      saveFile(imgData.replace(strMime, strDownloadMime), "screenshot.jpg");
    });
  } catch (e) {
    console.log(e);
    return;
  }
}

function saveFile(strData: string, filename: string) {
  var link = document.createElement("a");
  if (typeof link.download === "string") {
    document.body.appendChild(link); //Firefox requires the link to be in the body
    link.download = filename;
    link.href = strData;
    link.click();
    document.body.removeChild(link); //remove the link when done
  } else {
    location.replace(strData);
  }
}

export function setTimelineToBeginningState() {
  const svgElement = document.getElementById("general-svg");
  const svgElementLine = document.getElementById("general-svg-line");
  if (svgElement && svgElementLine) {
    svgElement.style.stroke = "white";
    svgElementLine.style.stroke = "white";
  } else {
    console.error("timeline not found");
  }

  const svgElementBlueprint = document.getElementById("blueprint-svg");
  const svgElementLineBlueprint = document.getElementById("blueprint-svg-line");
  if (svgElementBlueprint && svgElementLineBlueprint) {
    svgElementBlueprint.style.stroke = "white";
    svgElementLineBlueprint.style.stroke = "white";
  } else {
    console.error("timeline not found");
  }

  const svgElementRoof = document.getElementById("roof-svg");
  const svgElementLineRoof = document.getElementById("roof-svg-line");
  const svgElementScaffold = document.getElementById("scaffold-svg");
  const svgElementLineScaffold = document.getElementById("scaffold-svg-line");
  if (
    svgElementRoof &&
    svgElementLineRoof &&
    svgElementScaffold &&
    svgElementLineScaffold
  ) {
    svgElementRoof.style.stroke = "white";
    svgElementLineRoof.style.stroke = "white";
    svgElementScaffold.style.stroke = "white";
    svgElementLineScaffold.style.stroke = "white";
  } else {
    console.error("timeline not found");
  }

  const svgElementSupply = document.getElementById("supply-svg");
  if (svgElementSupply) {
    svgElementSupply.style.stroke = "white";
  } else {
    console.error("timeline not found");
  }
}

export const updateScaffoldingData = (scene: THREE.Scene) => {
  const [scaffolding, internalScaffolding, externalScaffolding] =
    calculateTotalAmountScaffoldingInScene(scene);
  const totalSquareFootageOfScaffolding =
    calculateTotalSquareMetersForScaffolding(scene);
  console.log(totalSquareFootageOfScaffolding);
  const totalBuildingSquareMeterage =
    calculateTotalSquareMetersForBlueprint(scene);

  const supply = supplyStore();
  supply.updateScaffolding(scaffolding);
  supply.updateInternalScaffolding(internalScaffolding);
  supply.updateExternalScaffolding(externalScaffolding);
  supply.updateSquareMetersOfScaffolding(
    totalSquareFootageOfScaffolding.toFixed(2)
  );
  supply.updateSquareMetersOfBuilding(totalBuildingSquareMeterage.toFixed(2));
};

export function debounce<T extends (...args: any[]) => void>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  return function (...args: Parameters<T>) {
    clearTimeout(timeout);
    //@ts-ignore
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
}

// Helper function to rotate a point or Vector3
export function rotatePoint(point: any, rotation: any) {
  const rotationMatrix = new THREE.Matrix4().makeRotationFromEuler(rotation);
  return point.applyMatrix4(rotationMatrix);
}
