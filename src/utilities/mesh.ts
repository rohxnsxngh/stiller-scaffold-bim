import * as THREE from "three";
import * as OBC from "openbim-components";
import { CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer.js";
import {
  distanceFromPointToLine,
  measureLineLength,
  resetSceneExceptSingularObject,
} from "./helper";
import { rectMaterial, roofMaterial } from "./material";
import { DragControls } from "three/addons/controls/DragControls.js";
import { useStore } from "../store";
import {
  setDeletionInProgress,
  setDrawingInProgress,
  setDrawingScaffoldingInProgress,
  setIsDrawingBlueprint,
} from "./state";

// Create Shape Outline
export function createShapeIsOutlined(
  intersects: any,
  points: any,
  highlightMesh: THREE.Mesh,
  scene: THREE.Scene,
  cube: THREE.Mesh
) {
  intersects.forEach(function (intersect: any) {
    if (intersect.object.name === "ground") {
      points.push(
        new THREE.Vector3(highlightMesh.position.x, 0, highlightMesh.position.z)
      );
      const cubeClone = cube.clone();
      cubeClone.position.set(
        highlightMesh.position.x,
        0.5,
        highlightMesh.position.z
      );
      cubeClone.name = "cubeClone";
      scene.add(cubeClone);

      // Create line segment from the last two points
      if (points.length >= 2) {
        const geometry = new THREE.BufferGeometry().setFromPoints([
          points[points.length - 2],
          points[points.length - 1],
        ]);
        const material = new THREE.LineBasicMaterial({ color: 0x00ff00 });
        const line = new THREE.Line(geometry, material);
        line.name = "line";
        const [length, lastPoint, firstPoint] = measureLineLength([
          points[points.length - 2],
          points[points.length - 1],
        ]);
        line.userData = {
          length: length,
          first_point: firstPoint,
          last_point: lastPoint,
        };
        scene.add(line);
        createLineLabel(
          scene,
          line.userData.first_point,
          line.userData.last_point,
          line.userData.length
        );
      }
    }
  });
}

function createLineLabel(
  scene: THREE.Scene,
  firstPoint: THREE.Vector3,
  lastPoint: THREE.Vector3,
  length: number
) {
  // Calculate midpoint
  const midpoint = new THREE.Vector3();
  midpoint.addVectors(lastPoint, firstPoint).multiplyScalar(0.5);
  const distance = length;
  const labelDiv = document.createElement("div");
  labelDiv.className =
    "label bg-black text-white pointer-events-auto rounded-full py-1";
  labelDiv.textContent = `${distance.toFixed(2)} m.`;
  labelDiv.contentEditable = "true";

  const label = new CSS2DObject(labelDiv);
  label.name = "rectangleRoofLabel";
  label.position.copy(
    new THREE.Vector3(midpoint.x, midpoint.y, midpoint.z + 1)
  );
  scene.add(label);
  return label;
}

// Create Blueprint from Shape Outline
export function createBlueprintFromShapeOutline(
  points: any,
  scene: THREE.Scene
) {
  if (
    points[0].x === points[points.length - 1].x &&
    points[0].z === points[points.length - 1].z
  ) {
    let highlightedMesh: THREE.Mesh<any, any, any>[] = [];
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh && child.name === "highlightMesh") {
        highlightedMesh.push(child);
      }
      if (child instanceof CSS2DObject && child.name === "rectangleLabel") {
        child.element.style.pointerEvents = "none";
        child.visible = false;
      }
    });

    highlightedMesh.forEach((mesh) => {
      scene.remove(mesh);
    });

    // Create shape
    if (points.length >= 3) {
      let shape = new THREE.Shape();
      shape.moveTo(points[0].x, points[0].z);
      for (let i = 1; i < points.length; i++) {
        shape.lineTo(points[i].x, points[i].z);
      }
      shape.lineTo(points[0].x, points[0].z); // close the shape

      // Create mesh from shape
      const geometryShape = new THREE.ShapeGeometry(shape);
      const materialShape = new THREE.MeshBasicMaterial({
        color: 0x7f1d1d,
        side: THREE.DoubleSide,
      });
      const meshShape = new THREE.Mesh(geometryShape, materialShape);
      meshShape.rotateX(Math.PI / 2);
      meshShape.position.y = 0.025;
      meshShape.name = "blueprint";
      meshShape.userData = { shape: shape, blueprintHasBeenUpdated: false };
      const isBlueprintAlreadyPlaced = scene.children.some((child) => {
        return (
          child.name === "blueprint" &&
          child.userData.shape.currentPoint.equals(
            meshShape.userData.shape.currentPoint
          )
        );
      });
      if (!isBlueprintAlreadyPlaced) {
        scene.add(meshShape);
      }
      scene.traverse((child) => {
        if (child.name === "blueprint") {
          console.log("blueprint", child);
        }
      });
    }

    points.length = 0;

    return points;
  }
}

export function createBlueprintFromMarkup(
  points: any,
  blueprintUpdatedState: boolean,
  width: number,
  height: number,
  scene: THREE.Scene
) {
  const rectanglePoints = points;
  if (
    points[0].x === points[points.length - 1].x &&
    points[0].z === points[points.length - 1].z
  ) {
    let highlightedMesh: THREE.Mesh<any, any, any>[] = [];
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh && child.name === "highlightMesh") {
        highlightedMesh.push(child);
      }
      if (child instanceof CSS2DObject && child.name === "rectangleLabel") {
        child.element.style.pointerEvents = "none";
        child.visible = false;
      }
    });

    highlightedMesh.forEach((mesh) => {
      scene.remove(mesh);
    });

    // Create shape
    if (points.length >= 3) {
      let shape = new THREE.Shape();
      shape.moveTo(points[0].x, points[0].z);
      for (let i = 1; i < points.length; i++) {
        shape.lineTo(points[i].x, points[i].z);
      }
      shape.lineTo(points[0].x, points[0].z); // close the shape

      // Create mesh from shape
      const geometryShape = new THREE.ShapeGeometry(shape);
      const materialShape = new THREE.MeshBasicMaterial({
        color: 0x7f1d1d,
        side: THREE.DoubleSide,
      });
      const meshShape = new THREE.Mesh(geometryShape, materialShape);
      meshShape.rotateX(Math.PI / 2);
      meshShape.position.y = 0.025;
      meshShape.name = "blueprint";
      meshShape.userData = {
        shape: shape,
        blueprintHasBeenUpdated: blueprintUpdatedState,
        width: width,
        height: height,
        rectanglePoints: rectanglePoints,
      };
      const isBlueprintAlreadyPlaced = scene.children.some((child) => {
        return (
          child.name === "blueprint" &&
          child.userData.shape.currentPoint.equals(
            meshShape.userData.shape.currentPoint
          )
        );
      });
      if (!isBlueprintAlreadyPlaced) {
        scene.add(meshShape);
      }
      scene.traverse((child) => {
        if (child.name === "blueprint") {
          console.log("blueprint", child);
        }
      });
    }

    points.length = 0;

    return points;
  }
}

export function createExtrusionFromBlueprint(
  blueprintShape: any,
  scene: any,
  extrude: number
) {
  let shape = blueprintShape.shape;

  const depth = -extrude;

  const extrudeSettings = {
    depth: depth,
    bevelEnabled: false, // You can enable beveling if needed
  };

  // Create extruded geometry
  const geometryExtrude = new THREE.ExtrudeGeometry(shape, extrudeSettings);

  // Material for the extruded mesh
  const materialExtrude = new THREE.MeshStandardMaterial({
    color: 0x9d4b4b,
    side: THREE.DoubleSide,
    wireframe: false,
  });

  // Create the mesh with the extruded geometry
  const meshExtrude = new THREE.Mesh(geometryExtrude, materialExtrude);
  meshExtrude.rotateX(Math.PI / 2);
  meshExtrude.userData = {
    shape: shape,
    blueprintHasBeenUpdated: blueprintShape.blueprintHasBeenUpdated,
    width: blueprintShape.width,
    height: blueprintShape.height,
    label: null,
  };
  console.log(meshExtrude.userData);
  meshExtrude.name = "extrusion";
  scene.add(meshExtrude);

  const label = createExtrusionLabel(scene, shape, depth);
  attachExtrusionLabelChangeHandler(label, meshExtrude, shape);
  meshExtrude.userData.label = label;

  label.userData = meshExtrude;
}

interface IntersectionResult {
  point: THREE.Vector3;
}

// create label for extrusion
function createExtrusionLabel(scene: THREE.Scene, shape: any, depth: number) {
  const startPoint = new THREE.Vector3(
    shape.curves[0].v1.x,
    0,
    shape.curves[0].v1.y
  );
  const endPoint = new THREE.Vector3(
    shape.curves[0].v1.x,
    -depth,
    shape.curves[0].v1.y
  );
  const midpoint = new THREE.Vector3().lerpVectors(startPoint, endPoint, 0.5);
  const distance = -depth;
  const labelDiv = document.createElement("div");
  labelDiv.className =
    "label bg-black text-white pointer-events-auto rounded-full py-1";
  labelDiv.textContent = `${distance.toFixed(2)} m.`;
  labelDiv.contentEditable = "true";

  const label = new CSS2DObject(labelDiv);
  label.name = "rectangleExtrusionLabel";
  label.position.copy(
    new THREE.Vector3(midpoint.x, midpoint.y, midpoint.z + 1)
  );
  scene.add(label);
  return label;
}

function attachExtrusionLabelChangeHandler(
  label: CSS2DObject,
  meshExtrude: THREE.Mesh,
  shape: THREE.Shape
) {
  const labelElement = label.element as HTMLDivElement;
  let oldValue: any;

  labelElement.addEventListener("focus", () => {
    oldValue = labelElement.textContent;
  });

  labelElement.addEventListener("blur", () => {
    handleValueChange(labelElement.textContent);
  });

  labelElement.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevents the default action of the Enter key
      handleValueChange(labelElement.textContent);
    }
  });

  function handleValueChange(newValue: string | null) {
    if (oldValue !== newValue) {
      const store = useStore();
      store.updateDepth(parseFloat(newValue as unknown as string));
      updateExtrusionGeometry(newValue, meshExtrude, shape, label);
    }
  }
}

function updateExtrusionGeometry(
  depth: string | null,
  meshExtrude: THREE.Mesh,
  shape: THREE.Shape,
  label: CSS2DObject
) {
  if (depth === null) {
    throw new Error("Depth cannot be null");
  }
  const updatedDepth = parseFloat(depth);

  // Define the extrude settings with the new depth
  const extrudeSettings = {
    depth: -updatedDepth,
    bevelEnabled: false, // Adjust bevel settings as needed
  };

  const newGeometryExtrude = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  meshExtrude.geometry.dispose();
  meshExtrude.geometry = newGeometryExtrude;

  // Since the geometry has changed, you may need to adjust the mesh position or rotation
  meshExtrude.rotation.set(0, 0, 0);
  meshExtrude.rotateX(Math.PI / 2);
  label.userData = meshExtrude;
  label.position.y = updatedDepth / 2;
  label.element.textContent = `${updatedDepth.toFixed(2)} m.`;

  return meshExtrude;
}

// function to create rectangle blueprint from dragging mouse
export function createRectangle(
  { start, end }: { start: any; end: any },
  markupGroup: THREE.Group,
  markup: any,
  components: OBC.Components,
  plane: THREE.Mesh,
  raycaster: THREE.Raycaster
) {
  markupGroup.children.forEach((child) => {
    markupGroup.remove(child);
  });
  const startPoint = castPoint(start, components, plane, raycaster);
  const endPoint = castPoint(end, components, plane, raycaster);
  if (startPoint == null || endPoint == null) {
    return;
  }

  const pointStartMinY = new THREE.Vector3(
    startPoint.point.x,
    0,
    startPoint.point.z
  );
  const pointStartMaxY = new THREE.Vector3(
    startPoint.point.x,
    0,
    endPoint.point.z
  );
  const pointEndMinY = new THREE.Vector3(
    endPoint.point.x,
    0,
    startPoint.point.z
  );
  const pointEndMaxY = new THREE.Vector3(endPoint.point.x, 0, endPoint.point.z);

  // Calculate the lengths of the sides
  const widthVector = new THREE.Vector3().subVectors(
    pointStartMinY,
    pointStartMaxY
  );
  const heightVector = new THREE.Vector3().subVectors(
    pointEndMaxY,
    pointStartMaxY
  );
  const width = widthVector.z;
  const height = heightVector.x;
  console.log(width, height);

  const rectanglePoints = [
    pointStartMinY,
    pointStartMaxY,
    pointEndMaxY,
    pointEndMinY,
    pointStartMinY,
  ];

  const centerX = startPoint.point.x + height / 2;
  const centerZ = startPoint.point.z + -width / 2;

  //For each side of the rectangle, calculate the midpoint and create a label
  const labels = createLabels(rectanglePoints);
  currentLabels.forEach((label) => {
    attachLabelChangeHandler(
      label,
      markupGroup,
      width,
      height,
      centerX,
      centerZ
    );
  });

  const geometry = new THREE.PlaneGeometry(height, width);
  markup = new THREE.Mesh(geometry, rectMaterial);

  markup.position.set(centerX, -0.025, centerZ);
  markup.rotation.x = Math.PI / 2;
  markup.name = "rectanglePlane";
  if ((width >= 0 && height >= 0) || (width <= 0 && height <= 0)) {
    markup.userData = {
      rectanglePoints: rectanglePoints,
      width: -width,
      height: -height,
      blueprintHasBeenUpdated: true,
    };
  } else {
    markup.userData = {
      rectanglePoints: rectanglePoints,
      width: width,
      height: height,
      blueprintHasBeenUpdated: false,
    };
  }

  markupGroup.add(markup);

  return [markup, labels];
}
let currentLabels: CSS2DObject[] = [];
// create labels for top view rectangle tool
function createLabels(rectanglePoints: THREE.Vector3[] | undefined) {
  // Clear the current labels array
  currentLabels = [];

  if (rectanglePoints) {
    for (let i = 0; i < rectanglePoints.length - 1; i++) {
      const midpoint = new THREE.Vector3().lerpVectors(
        rectanglePoints[i],
        rectanglePoints[i + 1],
        0.5
      );
      const distance = rectanglePoints[i].distanceTo(rectanglePoints[i + 1]);
      const labelDiv = document.createElement("div");
      labelDiv.className =
        "label bg-black text-white pointer-events-auto rounded-full py-1";
      labelDiv.textContent = `${distance.toFixed(2)} m.`;
      labelDiv.contentEditable = "true";

      const label = new CSS2DObject(labelDiv);
      label.name = "rectangleLabel";
      label.position.copy(
        new THREE.Vector3(midpoint.x, midpoint.y, midpoint.z + 1)
      );
      currentLabels.push(label);
    }
  }

  return currentLabels;
}

// updates the labels after a new dimension has been passed in
function updateLabelsForNewDimensions(
  newRectanglePoints: THREE.Vector3[] | undefined
) {
  // Assuming newRectanglePoints has the updated points for the rectangle
  if (newRectanglePoints) {
    currentLabels.forEach((label, index) => {
      if (index < newRectanglePoints.length - 1) {
        const midpoint = new THREE.Vector3().lerpVectors(
          newRectanglePoints[index],
          newRectanglePoints[index + 1],
          0.5
        );
        const distance = newRectanglePoints[index].distanceTo(
          newRectanglePoints[index + 1]
        );
        label.position.copy(midpoint);
        label.element.textContent = `${distance.toFixed(2)} m.`;
      }
    });
  }
}

// serves as a callback function which listens for when the user clicks on a label
// and when a user changes the value within a label
function attachLabelChangeHandler(
  label: CSS2DObject,
  markupGroup: THREE.Group,
  width: number,
  height: number,
  centerX: any,
  centerZ: any
) {
  const labelElement = label.element as HTMLDivElement;
  let oldValue: any;
  let blurTriggered: boolean = false;

  labelElement.addEventListener("mouseenter", () => {
    document.body.style.cursor = "grab";
    setDrawingInProgress(false);
    setIsDrawingBlueprint(false);
  });

  labelElement.addEventListener("mouseleave", () => {
    document.body.style.cursor = "crosshair";
    setDrawingInProgress(false);
    if (!blurTriggered) {
      setIsDrawingBlueprint(true);
    } else {
      setIsDrawingBlueprint(false);
    }
  });

  labelElement.addEventListener("focus", () => {
    blurTriggered = true;
    setDeletionInProgress(false);
    setDrawingInProgress(false);
    setDrawingScaffoldingInProgress(false);
    oldValue = labelElement.textContent;
  });

  labelElement.addEventListener("blur", () => {
    handleValueChange(labelElement.textContent);
    blurTriggered = false;
  });

  // TODO: There is something wrong with this, this logic needs to be edited
  labelElement.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevents the default action of the Enter key
      handleValueChange(labelElement.textContent);
      blurTriggered = false;
    }
  }, { passive: false });

  function handleValueChange(newValue: string | null) {
    if (oldValue !== newValue) {
      // create new plane based on inputs
      const newRectangleVertices = updateRectangleBlueprintGeometry(
        newValue,
        oldValue,
        markupGroup,
        width,
        height,
        centerX,
        centerZ
      );

      // create new labels based on vertices
      updateLabelsForNewDimensions(newRectangleVertices);

      return currentLabels;
    }
  }
}

// cast point for top view rectangle tool
function castPoint(
  mouse: any,
  components: OBC.Components,
  plane: THREE.Mesh,
  raycaster: THREE.Raycaster
): IntersectionResult | null {
  let result = null;
  // @ts-ignore
  raycaster.setFromCamera(mouse, components.camera.activeCamera);
  const intersects = raycaster.intersectObject(plane);
  intersects.some((item) => {
    if (item.object == plane) {
      result = item;
      return true;
    }
  });
  return result;
}

let blueprintHasBeenUpdated: boolean = false;

// updates the rectangle based new dimensions that are passed in
function updateRectangleBlueprintGeometry(
  newValue: string | null,
  oldValue: string | null,
  markupGroup: THREE.Group,
  width: number,
  height: number,
  centerX: any,
  centerZ: any
) {
  let oldDistance, newDistance;
  if (newValue !== null && oldValue !== null) {
    oldDistance = parseFloat(oldValue).toFixed(2);
    newDistance = parseFloat(newValue).toFixed(2);
  }

  let planeWidth, planeHeight;

  blueprintHasBeenUpdated = true;

  if (
    (markupGroup.children[0] as THREE.Mesh).geometry instanceof
    THREE.PlaneGeometry
  ) {
    const planeGeometry = (markupGroup.children[0] as THREE.Mesh)
      .geometry as THREE.PlaneGeometry;
    planeWidth = planeGeometry.parameters.width.toFixed(2);
  }
  if (
    (markupGroup.children[0] as THREE.Mesh).geometry instanceof
    THREE.PlaneGeometry
  ) {
    const planeGeometry = (markupGroup.children[0] as THREE.Mesh)
      .geometry as THREE.PlaneGeometry;
    planeHeight = planeGeometry.parameters.height.toFixed(2);
  }

  if (
    oldDistance !== undefined &&
    planeWidth !== undefined &&
    parseFloat(oldDistance) === Math.abs(parseFloat(planeWidth))
  ) {
    // reset the width to the current plane
    if (planeHeight !== undefined && planeWidth !== undefined) {
      width = parseFloat(planeHeight);
      height = parseFloat(planeWidth);
    }

    markupGroup.children.forEach((child) => {
      markupGroup.remove(child);
    });

    const geometry = new THREE.PlaneGeometry(Number(newDistance), width);
    const newRectangleBlueprint = new THREE.Mesh(geometry, rectMaterial);
    console.log(centerX, centerZ);
    newRectangleBlueprint.position.set(centerX, -0.125, centerZ);
    const halfWidth = newRectangleBlueprint.geometry.parameters.width / 2;
    const halfHeight = newRectangleBlueprint.geometry.parameters.height / 2;

    // creating vertices from the shape of the plane
    const corner1 = new THREE.Vector3(-halfWidth, 0, -halfHeight)
      .applyMatrix4(newRectangleBlueprint.matrixWorld)
      .add(newRectangleBlueprint.position);
    const corner2 = new THREE.Vector3(halfWidth, 0, -halfHeight)
      .applyMatrix4(newRectangleBlueprint.matrixWorld)
      .add(newRectangleBlueprint.position);
    const corner3 = new THREE.Vector3(halfWidth, 0, halfHeight)
      .applyMatrix4(newRectangleBlueprint.matrixWorld)
      .add(newRectangleBlueprint.position);
    const corner4 = new THREE.Vector3(-halfWidth, 0, halfHeight)
      .applyMatrix4(newRectangleBlueprint.matrixWorld)
      .add(newRectangleBlueprint.position);

    const rectanglePointsUpdated = [
      corner1,
      corner2,
      corner3,
      corner4,
      corner1,
    ];

    newRectangleBlueprint.rotation.x = Math.PI / 2;
    newRectangleBlueprint.name = "rectanglePlane";
    newRectangleBlueprint.userData = {
      rectanglePoints: rectanglePointsUpdated,
      width: width,
      height: height,
      blueprintHasBeenUpdated: true,
    };
    markupGroup.add(newRectangleBlueprint);

    return rectanglePointsUpdated;
  }
  if (
    oldDistance !== undefined &&
    planeHeight !== undefined &&
    parseFloat(oldDistance) === Math.abs(parseFloat(planeHeight))
  ) {
    // reset the width to the current plane
    if (planeHeight !== undefined && planeWidth !== undefined) {
      width = parseFloat(planeHeight);
      height = parseFloat(planeWidth);
    }

    markupGroup.children.forEach((child) => {
      markupGroup.remove(child);
    });

    const geometry = new THREE.PlaneGeometry(height, Number(newDistance));
    const newRectangleBlueprint = new THREE.Mesh(geometry, rectMaterial);
    console.log(centerX, centerZ);
    newRectangleBlueprint.position.set(centerX, -0.125, centerZ);
    const halfWidth = newRectangleBlueprint.geometry.parameters.width / 2;
    const halfHeight = newRectangleBlueprint.geometry.parameters.height / 2;

    // creating vertices from the shape of the plane
    const corner1 = new THREE.Vector3(-halfWidth, 0, -halfHeight)
      .applyMatrix4(newRectangleBlueprint.matrixWorld)
      .add(newRectangleBlueprint.position);
    const corner2 = new THREE.Vector3(halfWidth, 0, -halfHeight)
      .applyMatrix4(newRectangleBlueprint.matrixWorld)
      .add(newRectangleBlueprint.position);
    const corner3 = new THREE.Vector3(halfWidth, 0, halfHeight)
      .applyMatrix4(newRectangleBlueprint.matrixWorld)
      .add(newRectangleBlueprint.position);
    const corner4 = new THREE.Vector3(-halfWidth, 0, halfHeight)
      .applyMatrix4(newRectangleBlueprint.matrixWorld)
      .add(newRectangleBlueprint.position);

    const rectanglePointsUpdated = [
      corner1,
      corner2,
      corner3,
      corner4,
      corner1,
    ];

    newRectangleBlueprint.rotation.x = Math.PI / 2;
    newRectangleBlueprint.name = "rectanglePlane";
    newRectangleBlueprint.userData = {
      rectanglePoints: rectanglePointsUpdated,
      width: width,
      height: height,
      blueprintHasBeenUpdated: true,
    };
    markupGroup.add(newRectangleBlueprint);

    return rectanglePointsUpdated;
  }
}

// create roof from extrusion shape
export function createRoof(
  child: any,
  scene: THREE.Scene,
  index: number,
  height: number
) {
  const roofToRemove: THREE.Object3D<THREE.Object3DEventMap>[] = [];
  // check if duplicate roof exists
  scene.traverse((children) => {
    if (children.name === "roof") {
      if (
        children.userData.shape.currentPoint.x ===
          child.userData.shape.currentPoint.x ||
        children.userData.shape.currentPoint.y ===
          child.userData.shape.currentPoint.y
      ) {
        console.log("DUPLICATE ROOF");
        roofToRemove.push(children);
        return;
      }
    }
  });

  roofToRemove.forEach((roof) => {
    scene.remove(roof);
  });

  const rectShape = child.userData.shape;
  // Calculate the midpoint between the two points
  const midpoint = new THREE.Vector2();
  midpoint
    .addVectors(rectShape.curves[index].v1, rectShape.curves[index].v2)
    .multiplyScalar(0.5);

  // Create a third point that forms a right angle with the line formed by the two points
  const direction = new THREE.Vector2();
  direction.subVectors(rectShape.curves[index].v2, rectShape.curves[index].v1);
  // Normalize the direction vector to get the unit vector
  direction.normalize();

  // Calculate the perpendicular vector to the direction vector
  const perpendicular = new THREE.Vector2(-direction.y, direction.x);

  // Scale the perpendicular vector by the desired distance (10 units)
  const scaledPerpendicular = perpendicular.clone().multiplyScalar(-height);

  // Add the scaled perpendicular vector to the midpoint to get the third point
  const thirdPoint = midpoint.clone().add(scaledPerpendicular);
  const triangleHeightOffsetDistance = distanceFromPointToLine(
    rectShape.curves[index].v1.x,
    rectShape.curves[index].v1.y,
    rectShape.curves[index].v2.x,
    rectShape.curves[index].v2.y,
    thirdPoint.x,
    thirdPoint.y
  );

  // Create a triangle using these three points
  const shape = new THREE.Shape();
  shape.moveTo(rectShape.curves[index].v1.x, rectShape.curves[index].v1.y);
  shape.lineTo(rectShape.curves[index].v2.x, rectShape.curves[index].v2.y);
  shape.lineTo(thirdPoint.x, thirdPoint.y);
  shape.lineTo(rectShape.curves[index].v1.x, rectShape.curves[index].v1.y); // close the shape

  const extrudeHeight = -1 * child.geometry.parameters.options.depth;

  const startPoint = new THREE.Vector3(
    rectShape.curves[index].v1.x,
    extrudeHeight,
    rectShape.curves[index].v1.y
  );
  const endPoint = new THREE.Vector3(
    rectShape.curves[index].v2.x,
    extrudeHeight,
    rectShape.curves[index].v2.y
  );

  const edgeDirection = new THREE.Vector3()
    .subVectors(endPoint, startPoint)
    .normalize();
  const rotationAngle = Math.PI / 2;

  const geometry = new THREE.ShapeGeometry(shape);
  const material = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide,
  });
  const triangle = new THREE.Mesh(geometry, material);
  triangle.position.y = extrudeHeight;
  const quaternionY = new THREE.Quaternion();
  quaternionY.setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / 2);
  triangle.applyQuaternion(quaternionY);

  const customQuaternion = new THREE.Quaternion();
  customQuaternion.setFromAxisAngle(edgeDirection, rotationAngle);
  triangle.applyQuaternion(customQuaternion);
  triangle.position.sub(startPoint);
  triangle.position.applyQuaternion(customQuaternion);
  triangle.position.add(startPoint);
  triangle.updateMatrix();
  triangle.updateMatrixWorld(true);
  triangle.name = "roofTriangle";

  const nextPoint = new THREE.Vector3(
    rectShape.curves[index + 1].v2.x,
    extrudeHeight,
    rectShape.curves[index + 1].v2.y
  );

  const extrusionPath = new THREE.CatmullRomCurve3([endPoint, nextPoint]);
  const extrusionDistance = endPoint.distanceTo(nextPoint);
  let extrusionSettings;
  console.error("blueprint state", blueprintHasBeenUpdated);
  if (child.userData.blueprintHasBeenUpdated) {
    extrusionSettings = {
      bevelEnabled: true,
      depth: -extrusionDistance,
      // @ts-ignore
      path: extrusionPath,
    };
  } else {
    extrusionSettings = {
      bevelEnabled: true,
      depth: extrusionDistance,
      // @ts-ignore
      path: extrusionPath,
    };
  }

  const extrudeGeometry = new THREE.ExtrudeGeometry(
    shape, // The shape to extrude
    extrusionSettings // Extrusion settings
  );

  const extrudedMesh = new THREE.Mesh(extrudeGeometry, roofMaterial);
  extrudedMesh.position.copy(triangle.position);
  extrudedMesh.rotation.copy(triangle.rotation);
  extrudedMesh.name = "roof";
  extrudedMesh.userData = {
    shape: shape,
    blueprintHasBeenUpdated: child.userData.blueprintHasBeenUpdated,
    label: null,
  };
  scene.add(extrudedMesh);

  const label = createRoofLabel(
    scene,
    endPoint,
    thirdPoint,
    triangleHeightOffsetDistance
  );
  label.userData = extrudedMesh;
  attachRoofLabelChangeHandler(
    label,
    child,
    index,
    midpoint,
    scene,
    triangle,
    extrudedMesh
  );
  extrudedMesh.userData.label = label;
  blueprintHasBeenUpdated = false;
}

function createRoofLabel(
  scene: THREE.Scene,
  endPoint: THREE.Vector3,
  thirdPoint: THREE.Vector2,
  triangleHeightOffsetDistance: number
) {
  const topTrianglePoint = new THREE.Vector3(
    thirdPoint.x,
    endPoint.y + triangleHeightOffsetDistance,
    thirdPoint.y
  );
  const midpoint = new THREE.Vector3().lerpVectors(
    endPoint,
    topTrianglePoint,
    0.5
  );
  const distance = triangleHeightOffsetDistance;
  const labelDiv = document.createElement("div");
  labelDiv.className =
    "label bg-black text-white pointer-events-auto rounded-full py-1";
  labelDiv.textContent = `${distance.toFixed(2)} m.`;
  labelDiv.contentEditable = "true";

  const label = new CSS2DObject(labelDiv);
  label.name = "rectangleRoofLabel";
  label.position.copy(
    new THREE.Vector3(midpoint.x, midpoint.y, midpoint.z + 1)
  );
  scene.add(label);
  return label;
}

function attachRoofLabelChangeHandler(
  label: CSS2DObject,
  child: any,
  index: number,
  midpoint: THREE.Vector2,
  scene: THREE.Scene,
  triangleMesh: THREE.Mesh,
  extrudedRoofMesh: THREE.Mesh
) {
  const labelElement = label.element as HTMLDivElement;
  let oldValue: any;

  labelElement.addEventListener("focus", () => {
    oldValue = labelElement.textContent;
    console.log(oldValue);
  });

  labelElement.addEventListener("blur", () => {
    handleValueChange(labelElement.textContent);
  });

  labelElement.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevents the default action of the Enter key
      handleValueChange(labelElement.textContent);
    }
  });

  function handleValueChange(newValue: string | null) {
    if (oldValue !== newValue) {
      console.log("values do not match");
      const store = useStore();
      store.updateRoofHeight(parseFloat(newValue as unknown as string));
      if (label.userData) {
        scene.remove(label.userData as THREE.Object3D);
      }
      updateRoofGeometry(
        child,
        index,
        newValue,
        midpoint,
        scene,
        triangleMesh,
        extrudedRoofMesh,
        label
      );
    }
  }
}

function updateRoofGeometry(
  child: any,
  index: number,
  triangleHeightOffsetDistance: string | null,
  midpoint: THREE.Vector2,
  scene: THREE.Scene,
  triangleMesh: THREE.Mesh,
  extrudedRoofMesh: THREE.Mesh,
  label: CSS2DObject
) {
  // Calculate the offset based on the desired triangle height
  const desiredHeight = parseFloat(
    triangleHeightOffsetDistance as unknown as string
  );

  const rectShape = child.userData.shape;

  // Recalculate the third point with the new offset factor
  const direction = new THREE.Vector2();
  direction.subVectors(rectShape.curves[index].v2, rectShape.curves[index].v1);
  // Normalize the direction vector to get the unit vector
  direction.normalize();

  // Calculate the perpendicular vector to the direction vector
  const perpendicular = new THREE.Vector2(-direction.y, direction.x);

  // Scale the perpendicular vector by the desired distance (10 units)
  const scaledPerpendicular = perpendicular
    .clone()
    .multiplyScalar(-desiredHeight);

  // Add the scaled perpendicular vector to the midpoint to get the third point
  const thirdPoint = midpoint.clone().add(scaledPerpendicular);

  // triangleMesh.geometry.dispose();
  // extrudedRoofMesh.geometry.dispose();
  scene.remove(triangleMesh);
  scene.remove(extrudedRoofMesh);

  const extrudeHeight = -1 * child.geometry.parameters.options.depth;

  const startPoint = new THREE.Vector3(
    rectShape.curves[index].v1.x,
    extrudeHeight,
    rectShape.curves[index].v1.y
  );
  const endPoint = new THREE.Vector3(
    rectShape.curves[index].v2.x,
    extrudeHeight,
    rectShape.curves[index].v2.y
  );

  const topTrianglePoint = new THREE.Vector3(
    thirdPoint.x,
    endPoint.y + desiredHeight,
    thirdPoint.y
  );
  const updatedMidpoint = new THREE.Vector3().lerpVectors(
    endPoint,
    topTrianglePoint,
    0.5
  );

  // Create a triangle using these three points
  const shape = new THREE.Shape();
  shape.moveTo(rectShape.curves[index].v1.x, rectShape.curves[index].v1.y);
  shape.lineTo(rectShape.curves[index].v2.x, rectShape.curves[index].v2.y);
  shape.lineTo(thirdPoint.x, thirdPoint.y);
  shape.lineTo(rectShape.curves[index].v1.x, rectShape.curves[index].v1.y); // close the shape

  const edgeDirection = new THREE.Vector3()
    .subVectors(endPoint, startPoint)
    .normalize();
  const rotationAngle = Math.PI / 2;

  const geometry = new THREE.ShapeGeometry(shape);
  const material = new THREE.MeshBasicMaterial({
    color: 0x0000ff,
    side: THREE.DoubleSide,
  });
  const triangle = new THREE.Mesh(geometry, material);
  triangle.position.y = extrudeHeight;

  const quaternionY = new THREE.Quaternion();
  quaternionY.setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / 2);
  triangle.applyQuaternion(quaternionY);

  const customQuaternion = new THREE.Quaternion();
  customQuaternion.setFromAxisAngle(edgeDirection, rotationAngle);
  triangle.applyQuaternion(customQuaternion);
  triangle.position.sub(startPoint);
  triangle.position.applyQuaternion(customQuaternion);
  triangle.position.add(startPoint);
  triangle.updateMatrix();
  triangle.updateMatrixWorld(true);
  triangle.name = "roofTriangle";

  const nextPoint = new THREE.Vector3(
    rectShape.curves[index + 1].v2.x,
    extrudeHeight,
    rectShape.curves[index + 1].v2.y
  );

  const extrusionPath = new THREE.CatmullRomCurve3([endPoint, nextPoint]);
  const extrusionDistance = endPoint.distanceTo(nextPoint);
  let extrusionSettings;
  if (child.userData.blueprintHasBeenUpdated) {
    extrusionSettings = {
      bevelEnabled: true,
      depth: -extrusionDistance,
      // @ts-ignore
      path: extrusionPath,
    };
  } else {
    extrusionSettings = {
      bevelEnabled: true,
      depth: extrusionDistance,
      // @ts-ignore
      path: extrusionPath,
    };
  }

  const extrudeGeometry = new THREE.ExtrudeGeometry(
    shape, // The shape to extrude
    extrusionSettings // Extrusion settings
  );

  const extrudedMesh = new THREE.Mesh(extrudeGeometry, roofMaterial);
  extrudedMesh.position.copy(triangle.position);
  extrudedMesh.rotation.copy(triangle.rotation);
  extrudedMesh.name = "roof";
  extrudedMesh.userData.shape = shape;
  label.userData = extrudedMesh;
  console.log("extrude height", extrudeHeight);
  label.position.copy(
    new THREE.Vector3(
      updatedMidpoint.x,
      updatedMidpoint.y,
      updatedMidpoint.z + 1
    )
  );
  label.element.textContent = `${desiredHeight.toFixed(2)} m.`;
  scene.add(extrudedMesh);
}

// TODO: fix rotation bug
export function createShedRoof(
  child: any,
  scene: THREE.Scene,
  index: number,
  height: number
) {
  const roofToRemove: THREE.Object3D<THREE.Object3DEventMap>[] = [];
  console.log("child", child.userData.blueprintHasBeenUpdated, child);
  // check if duplicate roof exists
  scene.traverse((children) => {
    if (children.name === "shedRoof") {
      if (
        child.userData.shape.currentPoint.x ===
          children.userData.shape.curves[0].v1.x ||
        child.userData.shape.currentPoint.x ===
          children.userData.shape.curves[0].v2.x ||
        child.userData.shape.currentPoint.y ===
          children.userData.shape.curves[0].v1.y ||
        child.userData.shape.currentPoint.y ===
          children.userData.shape.curves[0].v2.y
      ) {
        console.log("DUPLICATE ROOF");
        roofToRemove.push(children);
      }
    }
  });

  roofToRemove.forEach((roof) => {
    scene.remove(roof);
  });

  let thirdPoint: THREE.Vector2 = new THREE.Vector2(0, 0);
  const rectShape = child.userData.shape;
  console.log(
    "rect shape",
    rectShape.curves[index].v1.x,
    rectShape.curves[index].v1.y
  );
  console.log("width and height", child.userData.width, child.userData.height);
  const blueprintWidth = child.userData.width;
  const blueprintHeight = child.userData.height;
  if (!child.userData.blueprintHasBeenUpdated) {
    switch (index) {
      case 0:
        if (blueprintWidth < 0) {
          thirdPoint = new THREE.Vector2(
            rectShape.curves[index].v1.x +
              parseFloat(height as unknown as string),
            rectShape.curves[index].v1.y
          );
        }

        if (blueprintHeight < 0) {
          thirdPoint = new THREE.Vector2(
            rectShape.curves[index].v1.x -
              parseFloat(height as unknown as string),
            rectShape.curves[index].v1.y
          );
        }
        break;
      case 1:
        if (blueprintWidth < 0) {
          thirdPoint = new THREE.Vector2(
            rectShape.curves[index].v1.x,
            rectShape.curves[index].v1.y -
              parseFloat(height as unknown as string)
          );
        }

        if (blueprintHeight < 0) {
          thirdPoint = new THREE.Vector2(
            rectShape.curves[index].v1.x,
            rectShape.curves[index].v1.y +
              parseFloat(height as unknown as string)
          );
        }
        break;
      case 2:
        if (blueprintWidth < 0) {
          thirdPoint = new THREE.Vector2(
            rectShape.curves[index].v1.x -
              parseFloat(height as unknown as string),
            rectShape.curves[index].v1.y
          );
        }

        if (blueprintHeight < 0) {
          thirdPoint = new THREE.Vector2(
            rectShape.curves[index].v1.x +
              parseFloat(height as unknown as string),
            rectShape.curves[index].v1.y
          );
        }
        break;
      case 3:
        if (blueprintWidth < 0) {
          thirdPoint = new THREE.Vector2(
            rectShape.curves[index].v1.x,
            rectShape.curves[index].v1.y +
              parseFloat(height as unknown as string)
          );
        }

        if (blueprintHeight < 0) {
          thirdPoint = new THREE.Vector2(
            rectShape.curves[index].v1.x,
            rectShape.curves[index].v1.y -
              parseFloat(height as unknown as string)
          );
        }
        break;
    }
  } else {
    switch (index) {
      case 0:
        if (blueprintWidth > 0 && blueprintHeight > 0) {
          thirdPoint = new THREE.Vector2(
            rectShape.curves[index].v1.x +
              parseFloat(height as unknown as string),
            rectShape.curves[index].v1.y
          );
        }

        if (blueprintWidth < 0 && blueprintHeight < 0) {
          thirdPoint = new THREE.Vector2(
            rectShape.curves[index].v1.x -
              parseFloat(height as unknown as string),
            rectShape.curves[index].v1.y
          );
        }

        break;
      case 1:
        if (blueprintWidth > 0 && blueprintHeight > 0) {
          thirdPoint = new THREE.Vector2(
            rectShape.curves[index].v1.x,
            rectShape.curves[index].v1.y +
              parseFloat(height as unknown as string)
          );
        }

        if (blueprintWidth < 0 && blueprintHeight < 0) {
          thirdPoint = new THREE.Vector2(
            rectShape.curves[index].v1.x,
            rectShape.curves[index].v1.y -
              parseFloat(height as unknown as string)
          );
        }
        break;
      case 2:
        if (blueprintWidth > 0 && blueprintHeight > 0) {
          thirdPoint = new THREE.Vector2(
            rectShape.curves[index].v1.x -
              parseFloat(height as unknown as string),
            rectShape.curves[index].v1.y
          );
        }

        if (blueprintWidth < 0 && blueprintHeight < 0) {
          thirdPoint = new THREE.Vector2(
            rectShape.curves[index].v1.x +
              parseFloat(height as unknown as string),
            rectShape.curves[index].v1.y
          );
        }
        break;
      case 3:
        if (blueprintWidth > 0 && blueprintHeight > 0) {
          thirdPoint = new THREE.Vector2(
            rectShape.curves[index].v1.x,
            rectShape.curves[index].v1.y -
              parseFloat(height as unknown as string)
          );
        }

        if (blueprintWidth < 0 && blueprintHeight < 0) {
          thirdPoint = new THREE.Vector2(
            rectShape.curves[index].v1.x,
            rectShape.curves[index].v1.y +
              parseFloat(height as unknown as string)
          );
        }
        break;
    }
  }

  console.log("third point", thirdPoint);
  const triangleHeightOffsetDistance = Math.round(
    distanceFromPointToLine(
      rectShape.curves[index].v1.x,
      rectShape.curves[index].v1.y,
      rectShape.curves[index].v2.x,
      rectShape.curves[index].v2.y,
      thirdPoint.x,
      thirdPoint.y
    )
  );

  // Create a right triangle using the two points and the third point
  const shape = new THREE.Shape();
  shape.moveTo(rectShape.curves[index].v1.x, rectShape.curves[index].v1.y);
  shape.lineTo(rectShape.curves[index].v2.x, rectShape.curves[index].v2.y);
  shape.lineTo(thirdPoint.x, thirdPoint.y);
  shape.lineTo(rectShape.curves[index].v1.x, rectShape.curves[index].v1.y); // close the shape

  console.log("blueprint child", rectShape);
  console.log("triangle shape", shape);
  console.log("third point", thirdPoint);
  console.log("height of the third point", triangleHeightOffsetDistance);

  const extrudeHeight = -1 * child.geometry.parameters.options.depth;

  console.log(
    "EXTRUSION HEIGHT AND TRRIANGLE THIRD POINT",
    extrudeHeight,
    thirdPoint.y
  );

  const startPoint = new THREE.Vector3(
    rectShape.curves[index].v1.x,
    extrudeHeight,
    rectShape.curves[index].v1.y
  );
  const endPoint = new THREE.Vector3(
    rectShape.curves[index].v2.x,
    extrudeHeight,
    rectShape.curves[index].v2.y
  );

  const edgeDirection = new THREE.Vector3()
    .subVectors(endPoint, startPoint)
    .normalize();
  const rotationAngle = Math.PI / 2;

  const geometry = new THREE.ShapeGeometry(shape);
  const material = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide,
  });
  const triangle = new THREE.Mesh(geometry, material);
  triangle.position.y = extrudeHeight;
  const quaternionY = new THREE.Quaternion();
  quaternionY.setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / 2);
  triangle.applyQuaternion(quaternionY);

  const customQuaternion = new THREE.Quaternion();
  customQuaternion.setFromAxisAngle(edgeDirection, rotationAngle);
  triangle.applyQuaternion(customQuaternion);
  triangle.position.sub(startPoint);
  triangle.position.applyQuaternion(customQuaternion);
  triangle.position.add(startPoint);
  triangle.updateMatrix();
  triangle.updateMatrixWorld(true);
  triangle.name = "shedRoofTriangle";

  let nextPoint: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
  if (index == 3) {
    nextPoint = new THREE.Vector3(
      rectShape.curves[0].v2.x,
      extrudeHeight,
      rectShape.curves[0].v2.y
    );
  } else {
    nextPoint = new THREE.Vector3(
      rectShape.curves[index + 1].v2.x,
      extrudeHeight,
      rectShape.curves[index + 1].v2.y
    );
  }

  const extrusionPath = new THREE.CatmullRomCurve3([endPoint, nextPoint]);
  const extrusionDistance = endPoint.distanceTo(nextPoint);
  let extrusionSettings;
  console.error("blueprint state", child.userData.blueprintHasBeenUpdated);
  if (child.userData.blueprintHasBeenUpdated) {
    extrusionSettings = {
      bevelEnabled: true,
      depth: -extrusionDistance,
      // @ts-ignore
      path: extrusionPath,
    };
  } else {
    extrusionSettings = {
      bevelEnabled: true,
      depth: extrusionDistance,
      // @ts-ignore
      path: extrusionPath,
    };
  }

  const extrudeGeometry = new THREE.ExtrudeGeometry(
    shape, // The shape to extrude
    extrusionSettings // Extrusion settings
  );

  const extrudedMesh = new THREE.Mesh(extrudeGeometry, roofMaterial);
  extrudedMesh.position.copy(triangle.position);
  extrudedMesh.rotation.copy(triangle.rotation);
  extrudedMesh.name = "shedRoof";
  extrudedMesh.userData = {
    shape: shape,
    blueprintHasBeenUpdated: child.userData.blueprintHasBeenUpdated,
    label: null,
  };
  scene.add(extrudedMesh);

  const label = createRoofLabel(
    scene,
    endPoint,
    thirdPoint,
    triangleHeightOffsetDistance
  );
  attachShedRoofLabelChangeHandler(
    label,
    child,
    index,
    scene,
    triangle,
    extrudedMesh
  );
  extrudedMesh.userData.label = label;
}

function attachShedRoofLabelChangeHandler(
  label: CSS2DObject,
  child: any,
  index: number,
  scene: THREE.Scene,
  triangleMesh: THREE.Mesh,
  extrudedRoofMesh: THREE.Mesh
) {
  const labelElement = label.element as HTMLDivElement;
  let oldValue: any;

  labelElement.addEventListener("focus", () => {
    oldValue = labelElement.textContent;
    console.log(oldValue);
  });

  labelElement.addEventListener("blur", () => {
    handleValueChange(labelElement.textContent);
  });

  labelElement.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevents the default action of the Enter key
      handleValueChange(labelElement.textContent);
    }
  });

  function handleValueChange(newValue: string | null) {
    if (oldValue !== newValue) {
      const store = useStore();
      store.updateShedRoofHeight(parseFloat(newValue as unknown as string));
      console.log("values do not match");
      if (label.userData) {
        scene.remove(label.userData as THREE.Object3D);
      }
      updateShedRoofGeometry(
        child,
        index,
        newValue,
        scene,
        triangleMesh,
        extrudedRoofMesh,
        label
      );
    }
  }
}

function updateShedRoofGeometry(
  child: any,
  index: number,
  triangleHeightOffsetDistance: string | null,
  scene: THREE.Scene,
  triangleMesh: THREE.Mesh,
  extrudedRoofMesh: THREE.Mesh,
  label: CSS2DObject
) {
  const desiredHeight = parseFloat(
    triangleHeightOffsetDistance as unknown as string
  );
  const rectShape = child.userData.shape;
  let thirdPoint: THREE.Vector2 = new THREE.Vector2(0, 0);
  if (!child.userData.blueprintHasBeenUpdated) {
    if (index == 0) {
      thirdPoint = new THREE.Vector2(
        rectShape.curves[index].v1.x + desiredHeight,
        rectShape.curves[index].v1.y
      );
    }
    if (index == 1) {
      thirdPoint = new THREE.Vector2(
        rectShape.curves[index].v1.x,
        rectShape.curves[index].v1.y - desiredHeight
      );
    }
    if (index == 2) {
      thirdPoint = new THREE.Vector2(
        rectShape.curves[index].v1.x - desiredHeight,
        rectShape.curves[index].v1.y
      );
    }
    if (index == 3) {
      thirdPoint = new THREE.Vector2(
        rectShape.curves[index].v1.x,
        rectShape.curves[index].v1.y + desiredHeight
      );
    }
  } else {
    if (index == 0) {
      thirdPoint = new THREE.Vector2(
        rectShape.curves[index].v1.x,
        rectShape.curves[index].v1.y - desiredHeight
      );
    }
    if (index == 1) {
      thirdPoint = new THREE.Vector2(
        rectShape.curves[index].v1.x + desiredHeight,
        rectShape.curves[index].v1.y
      );
    }
    if (index == 2) {
      thirdPoint = new THREE.Vector2(
        rectShape.curves[index].v1.x,
        rectShape.curves[index].v1.y + desiredHeight
      );
    }
    if (index == 3) {
      thirdPoint = new THREE.Vector2(
        rectShape.curves[index].v1.x - desiredHeight,
        rectShape.curves[index].v1.y
      );
    }
  }

  scene.remove(triangleMesh);
  scene.remove(extrudedRoofMesh);

  const extrudeHeight = -1 * child.geometry.parameters.options.depth;

  const startPoint = new THREE.Vector3(
    rectShape.curves[index].v1.x,
    extrudeHeight,
    rectShape.curves[index].v1.y
  );
  const endPoint = new THREE.Vector3(
    rectShape.curves[index].v2.x,
    extrudeHeight,
    rectShape.curves[index].v2.y
  );

  const topTrianglePoint = new THREE.Vector3(
    thirdPoint.x,
    endPoint.y + desiredHeight,
    thirdPoint.y
  );
  const updatedMidpoint = new THREE.Vector3().lerpVectors(
    endPoint,
    topTrianglePoint,
    0.5
  );

  // Create a triangle using these three points
  const shape = new THREE.Shape();
  shape.moveTo(rectShape.curves[index].v1.x, rectShape.curves[index].v1.y);
  shape.lineTo(rectShape.curves[index].v2.x, rectShape.curves[index].v2.y);
  shape.lineTo(thirdPoint.x, thirdPoint.y);
  shape.lineTo(rectShape.curves[index].v1.x, rectShape.curves[index].v1.y); // close the shape

  const edgeDirection = new THREE.Vector3()
    .subVectors(endPoint, startPoint)
    .normalize();
  const rotationAngle = Math.PI / 2;

  const geometry = new THREE.ShapeGeometry(shape);
  const material = new THREE.MeshBasicMaterial({
    color: 0x0000ff,
    side: THREE.DoubleSide,
  });
  const triangle = new THREE.Mesh(geometry, material);
  triangle.position.y = extrudeHeight;

  const quaternionY = new THREE.Quaternion();
  quaternionY.setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / 2);
  triangle.applyQuaternion(quaternionY);

  const customQuaternion = new THREE.Quaternion();
  customQuaternion.setFromAxisAngle(edgeDirection, rotationAngle);
  triangle.applyQuaternion(customQuaternion);
  triangle.position.sub(startPoint);
  triangle.position.applyQuaternion(customQuaternion);
  triangle.position.add(startPoint);
  triangle.updateMatrix();
  triangle.updateMatrixWorld(true);
  triangle.name = "shedRoofTriangle";

  let nextPoint: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
  if (index == 3) {
    nextPoint = new THREE.Vector3(
      rectShape.curves[0].v2.x,
      extrudeHeight,
      rectShape.curves[0].v2.y
    );
  } else {
    nextPoint = new THREE.Vector3(
      rectShape.curves[index + 1].v2.x,
      extrudeHeight,
      rectShape.curves[index + 1].v2.y
    );
  }

  const extrusionPath = new THREE.CatmullRomCurve3([endPoint, nextPoint]);
  const extrusionDistance = endPoint.distanceTo(nextPoint);
  let extrusionSettings;
  console.error("blueprint state", blueprintHasBeenUpdated);
  if (child.userData.blueprintHasBeenUpdated) {
    extrusionSettings = {
      bevelEnabled: true,
      depth: -extrusionDistance,
      // @ts-ignore
      path: extrusionPath,
    };
  } else {
    extrusionSettings = {
      bevelEnabled: true,
      depth: extrusionDistance,
      // @ts-ignore
      path: extrusionPath,
    };
  }
  const extrudeGeometry = new THREE.ExtrudeGeometry(
    shape, // The shape to extrude
    extrusionSettings // Extrusion settings
  );

  const extrudedMesh = new THREE.Mesh(extrudeGeometry, roofMaterial);
  extrudedMesh.position.copy(triangle.position);
  extrudedMesh.rotation.copy(triangle.rotation);
  extrudedMesh.name = "shedRoof";
  extrudedMesh.userData.shape = shape;
  label.userData = extrudedMesh;
  label.position.copy(
    new THREE.Vector3(
      updatedMidpoint.x,
      updatedMidpoint.y,
      updatedMidpoint.z + 1
    )
  );
  label.element.textContent = `${desiredHeight.toFixed(2)} m.`;
  scene.add(extrudedMesh);
}

export function createFlatRoof(child: any, scene: THREE.Scene) {
  console.log("create flat roof", child.userData);
  const extrudeHeight = -1 * child.geometry.parameters.options.depth;
  const shape = child.userData.shape;

  // Create a new geometry from the shape
  const geometry = new THREE.ShapeGeometry(shape);

  // Create a mesh using the geometry and material
  const roofMesh = new THREE.Mesh(geometry, roofMaterial);

  // Position the roof mesh above the child object
  // add offset to avoid z-fighting
  roofMesh.position.y = extrudeHeight + 0.025;
  roofMesh.rotateOnAxis(new THREE.Vector3(1, 0, 0), Math.PI / 2);
  scene.add(roofMesh);

  roofMesh.name = "flatRoof";
  roofMesh.userData = {
    shape: shape,
    blueprintHasBeenUpdated: child.userData.blueprintHasBeenUpdated,
    label: null,
  };
}

// move blueprint
export function moveBlueprint(
  blueprints: any[],
  components: OBC.Components,
  scene: THREE.Scene,
  shadows: OBC.ShadowDropper
) {
  // remove all objects before moving the blueprint
  // since you are literally moving the foundation of the building
  resetSceneExceptSingularObject(scene, "blueprint");

  const dragControls: DragControls = new DragControls(
    blueprints,
    // @ts-ignore
    components.camera.activeCamera,
    // @ts-ignore
    components.renderer._renderer.domElement
  );

  let originalLocation: THREE.Vector3;
  let newLocation: THREE.Vector3;

  dragControls.addEventListener("dragstart", (event) => {
    originalLocation = event.object.position.clone(); // Create a copy of the position vector
  });

  dragControls.addEventListener("dragend", (event) => {
    if (event.object instanceof THREE.Mesh) {
      shadows.renderShadow([event.object], event.object.uuid);
      event.object.position.y = 0.025;
      newLocation = event.object.position; // Update newLocation here

      const xDisplacement = newLocation.x - originalLocation.x;
      const yDisplacement = newLocation.z - originalLocation.z;
      const previousShape = event.object.userData.shape;
      if (previousShape instanceof THREE.Shape) {
        const newShape = new THREE.Shape();
        previousShape.curves.forEach((curve) => {
          if (curve instanceof THREE.LineCurve) {
            const startPoint = curve.v1
              .clone()
              .add(new THREE.Vector2(xDisplacement, yDisplacement));
            const endPoint = curve.v2
              .clone()
              .add(new THREE.Vector2(xDisplacement, yDisplacement));
            newShape.moveTo(startPoint.x, startPoint.y);
            newShape.lineTo(endPoint.x, endPoint.y);
          }
        });

        event.object.userData.shape = newShape;
      }
    }

    event.object.updateMatrix();
  });

  dragControls.addEventListener("hoveron", (event) => {
    if (event.object instanceof THREE.Mesh) {
      event.object.material.color.set(0xb72c2c);
      shadows.deleteShadow(event.object.uuid);
    }
  });

  dragControls.addEventListener("hoveroff", (event) => {
    if (event.object instanceof THREE.Mesh) {
      event.object.material.color.set(0x7f1d1d);
    }
  });

  return dragControls;
}

// edit blueprint
export function editBlueprint(scene: THREE.Scene, blueprint: THREE.Mesh) {
  console.log("editing blueprint", blueprint.userData);

  const shape = blueprint.userData as THREE.Shape;
  scene.remove(blueprint);

  const firstCurve = shape.curves[0];
  const secondCurve = shape.curves[1];
  if (
    firstCurve instanceof THREE.LineCurve &&
    secondCurve instanceof THREE.LineCurve
  ) {
    const startPoint = firstCurve.v1;
    const endPoint = secondCurve.v2;

    const pointStartMinY = new THREE.Vector3(startPoint.x, 0, startPoint.y);
    const pointStartMaxY = new THREE.Vector3(startPoint.x, 0, endPoint.y);
    const pointEndMinY = new THREE.Vector3(endPoint.x, 0, startPoint.y);
    const pointEndMaxY = new THREE.Vector3(endPoint.x, 0, endPoint.y);

    // Calculate the lengths of the sides
    const width = pointStartMinY.distanceTo(pointStartMaxY);
    const height = pointStartMaxY.distanceTo(pointEndMaxY);

    const rectanglePoints = [
      pointStartMinY,
      pointStartMaxY,
      pointEndMaxY,
      pointEndMinY,
      pointStartMinY,
    ];

    const centerX = startPoint.x + height / 2;
    const centerZ = startPoint.y + width / 2;

    //For each side of the rectangle, calculate the midpoint and create a label
    const labels = createLabels(rectanglePoints);
    labels.forEach((label) => {
      scene.add(label);
    });

    const geometry = new THREE.PlaneGeometry(height, width);
    const newBlueprint = new THREE.Mesh(geometry, rectMaterial);
    newBlueprint.position.set(centerZ, -0.025, centerX);
    newBlueprint.rotation.x = Math.PI / 2;
    newBlueprint.name = "rectanglePlane";
    newBlueprint.userData = {
      rectanglePoints: rectanglePoints,
      width: width,
      height: height,
    };
    scene.add(newBlueprint);
    //  markupGroup.add(markup);

    //  return [markup, labels];
  }
}
