import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as SkeletonUtils from "three/examples/jsm/utils/SkeletonUtils.js";
import {
  isVectorEqual,
  measureLineLength,
  observeElementAndAddEventListener,
} from "./helper";
import { CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer.js";

export let placeScaffoldIndividually = false;

export const setPlaceScaffoldIndividually = (value: boolean) => {
  placeScaffoldIndividually = value;
};

// Create Scaffolding Shape Outline
export async function createScaffoldingShapeIsOutlined(
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
        const material = new THREE.LineBasicMaterial({ color: 0xffffff });
        const line = new THREE.Line(geometry, material);
        line.name = "scaffoldLine";
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
      }
    }
  });
}

export async function placeScaffoldModelsAlongLine(
  line: THREE.Line,
  scene: THREE.Scene,
  scaffoldModeling: any,
  bboxWireframe: any
) {
  const lineLength = line.userData.length;
  const startPoint = line.userData.first_point;
  const endPoint = line.userData.last_point;
  const midPoint = new THREE.Vector3().lerpVectors(startPoint, endPoint, 0.5);
  const numSegments = Math.ceil(lineLength / 1.57); // Assuming each GLB model fits exactly  1.57 meters along the line
  try {
    for (let i = 0; i < numSegments; i++) {
      // Calculate the interpolated position along the line
      const t = i / numSegments; // Parameter for interpolation along the line
      const position = new THREE.Vector3().lerpVectors(startPoint, endPoint, t);

      // Check if there is already a model at this position
      const isModelAlreadyPlaced = scene.children.some((child) => {
        return (
          child instanceof THREE.Object3D && child.position.equals(position)
        );
      });

      if (!isModelAlreadyPlaced) {
        // Instantiate the GLB model
        const modelInstance = SkeletonUtils.clone(scaffoldModeling);
        const boundBoxInstance = bboxWireframe.clone();
        modelInstance.position.copy(position); // Position the model at the interpolated position
        boundBoxInstance.position.copy(position);
        const lineDirection = new THREE.Vector3()
          .subVectors(endPoint, startPoint)
          .normalize();
        // Create a quaternion that represents the rotation needed to align a model with the line
        const quaternion = new THREE.Quaternion().setFromUnitVectors(
          new THREE.Vector3(0, 0, 1),
          lineDirection
        );

        const euler = new THREE.Euler().setFromQuaternion(quaternion);

        modelInstance.rotation.copy(euler);
        boundBoxInstance.rotation.copy(euler);

        // update position userData
        modelInstance.userData.position = position;
        modelInstance.userData.first_point = startPoint;
        modelInstance.userData.last_point = endPoint;
        modelInstance.userData.line_length = lineLength;

        modelInstance.rotateOnAxis(new THREE.Vector3(0, 1, 0), Math.PI / 2);
        boundBoxInstance.rotateOnAxis(new THREE.Vector3(0, 1, 0), Math.PI / 2);

        // this model instance allows me to select a scaffolding individually
        // even though they are being placed in a line almost like a cohesive object
        // Create a new material for the model instance
        const material = new THREE.MeshPhysicalMaterial({
          color: 0x404141, // Dark gray color
          emissive: 0x000000,
        });
        if (modelInstance.children[0] instanceof THREE.Mesh) {
          modelInstance.children[0].material = material;
        } else {
          console.error("The first child of the model instance is not a Mesh.");
        }

        scene.add(modelInstance);
        // scene.add(boundBoxInstance);
      } else {
        console.log("there are already children at this position");
      }
    }
  } catch (error) {
    console.error("Error creating scaffold model:", error);
  }

  const { label } = attachScaffoldStackingLabel(scene, midPoint);
  label.userData = {
    level: 0,
    length: lineLength,
    first_point: startPoint,
    last_point: endPoint,
  };
  attachScaffoldRowLabelChangeHandler(
    label,
    scene,
    scaffoldModeling,
    bboxWireframe
  );
}

// scaffolding model creation along with bounding box for respective scaffolding model
export function createScaffoldModel(
  length: number,
  height: number,
  width: number
): Promise<[THREE.LineSegments, THREE.Object3D]> {
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();
    loader.load(
      "/models/scaffolding-home-uniform.glb",
      (gltf: any) => {
        const scaffoldModel = gltf.scene;
        scaffoldModel.name = "scaffoldingModel";
        scaffoldModel.userData = {
          name: "scaffoldingModel",
          length: length,
          height: height,
          width: width,
          position: null,
          first_point: null,
          last_point: null,
          line_length: null,
        };
        // Calculate bounding box
        const bbox = new THREE.Box3().setFromObject(scaffoldModel);
        // Get the dimensions of the bounding box
        const size = bbox.getSize(new THREE.Vector3());

        // Calculate the scale factor for each dimension
        const scaleX = length / size.x;
        const scaleY = height / size.y;
        const scaleZ = width / size.z;

        // THIS CODE CREATES THE MODEL AND MAINTAINS THE CORRECT RATIOS
        // Choose the smallest scale factor to maintain aspect ratio
        // const scaleFactor = Math.min(scaleX, scaleY, scaleZ);
        // Apply the scale factor to the model
        // scaffoldModel.scale.set(scaleFactor, scaleFactor, scaleFactor);

        // Apply the scale factor to the model
        scaffoldModel.scale.set(scaleX, scaleY, scaleZ);

        // Update the bounding box with the scaled model
        scaffoldModel.updateMatrixWorld();
        const newBBox = new THREE.Box3().setFromObject(scaffoldModel);

        // Calculate and print the new bounding box dimensions
        const newLength = newBBox.max.z - newBBox.min.z;
        const newWidth = newBBox.max.x - newBBox.min.x;
        const newHeight = newBBox.max.y - newBBox.min.y;
        console.log("New bounding box dimensions:", {
          length: newLength,
          width: newWidth,
          height: newHeight,
        });

        // Create wireframe geometry
        const bboxGeometry = new THREE.BoxGeometry().setFromPoints([
          newBBox.min,
          new THREE.Vector3(newBBox.min.x, newBBox.min.y, newBBox.max.z),
          new THREE.Vector3(newBBox.min.x, newBBox.max.y, newBBox.min.z),
          new THREE.Vector3(newBBox.min.x, newBBox.max.y, newBBox.max.z),
          new THREE.Vector3(newBBox.max.x, newBBox.min.y, newBBox.min.z),
          new THREE.Vector3(newBBox.max.x, newBBox.min.y, newBBox.max.z),
          new THREE.Vector3(newBBox.max.x, newBBox.max.y, newBBox.min.z),
          newBBox.max,
        ]);

        // Create wireframe material
        const bboxMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00 });

        // Create wireframe
        const bboxWireframe = new THREE.LineSegments(
          new THREE.WireframeGeometry(bboxGeometry),
          bboxMaterial
        );
        bboxWireframe.name = "scaffoldingWireframe";
        bboxWireframe.userData = {
          name: "scaffoldingWireframe",
          length: length,
          height: height,
          width: width,
        };

        console.log("scaffolding model", scaffoldModel);

        resolve([bboxWireframe, scaffoldModel]);
      },
      (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      },
      (error) => {
        console.error("Error loading GLB model:", error);
        reject(error);
      }
    );
  });
}

let scaffoldRotation: number = Math.PI / 2;
// Create Shape Outline
export function createIndividualScaffoldOnClick(
  intersects: any[] = [],
  highlightMesh: THREE.Mesh,
  scene: THREE.Scene,
  scaffoldModeling: any,
  bboxWireframe: any
) {
  if (Array.isArray(intersects)) {
    // Check if intersects is an array
    intersects.forEach(function (intersect: any) {
      if (intersect.object.name === "ground") {
        const modelInstance = SkeletonUtils.clone(scaffoldModeling);
        const boundBoxInstance = bboxWireframe.clone();
        modelInstance.position.set(
          highlightMesh.position.x,
          0,
          highlightMesh.position.z
        );
        boundBoxInstance.position.set(
          highlightMesh.position.x,
          0,
          highlightMesh.position.z
        );

        // TODO DO NOT LET THE BOUNDING BOXES INTERSECT
        // FIND A WAY TO SNAP SCAFFOLDING TOGETHER SO THEY ARE TOUCHING
        // Check if there is already a model at this position
        console.log(boundBoxInstance);

        modelInstance.rotateOnAxis(
          new THREE.Vector3(0, 1, 0),
          scaffoldRotation
        );
        boundBoxInstance.rotateOnAxis(
          new THREE.Vector3(0, 1, 0),
          scaffoldRotation
        );
        scene.add(modelInstance);
        // scene.add(boundBoxInstance);
        const { label, button } = createIndividualScaffoldLabel(
          scene,
          modelInstance,
          boundBoxInstance
        );
        attachIndividualScaffoldLabelChangeHandler(
          label,
          modelInstance,
          boundBoxInstance,
          button
        );
      }
    });
  } else {
    console.error("Intersects is not an array");
  }
}

function createIndividualScaffoldLabel(
  scene: THREE.Scene,
  scaffold: THREE.Object3D,
  scaffoldBoundingBox: any
): { label: CSS2DObject; button: HTMLButtonElement } {
  const position = scaffold.position;
  const rotation = scaffold.rotation;
  const labelDiv = document.createElement("div");
  labelDiv.className =
    "label bg-black text-white pointer-events-auto rounded-full py-1";
  // Convert the rotation Euler angles to degrees and format them as strings
  const rotationY = THREE.MathUtils.RAD2DEG * rotation.y;
  scaffoldRotation = rotation.y;
  labelDiv.textContent = `${rotationY.toFixed(2)}°`;
  labelDiv.contentEditable = "true";

  // Create a button element
  const button = document.createElement("button");
  button.name = "scaffoldButton";
  button.className = "material-icons btn btn-sm btn-ghost mx-2";
  button.textContent = "rotate_right";
  button.contentEditable = "false";

  labelDiv.appendChild(button);

  const label = new CSS2DObject(labelDiv);
  label.name = "scaffoldLabel";
  label.position.copy(
    new THREE.Vector3(position.x, position.y, position.z + 1)
  );
  scene.add(label);
  label.userData = { boundingBox: scaffoldBoundingBox };
  return { label, button };
}

function attachIndividualScaffoldLabelChangeHandler(
  label: CSS2DObject,
  scaffold: THREE.Object3D,
  scaffoldBoundingBox: any,
  button: HTMLButtonElement
) {
  const labelElement = label.element as HTMLDivElement;
  let oldValue: any;

  labelElement.addEventListener("mouseenter", () => {
    setPlaceScaffoldIndividually(false);
  });

  labelElement.addEventListener("mouseleave", () => {
    setPlaceScaffoldIndividually(true);
  });

  labelElement.addEventListener("focus", () => {
    setPlaceScaffoldIndividually(false);
    oldValue = labelElement.textContent;
  });

  button.addEventListener("mousedown", () => {
    const newValue = labelElement.textContent;
    if (oldValue !== newValue) {
      updateScaffoldRotation(newValue, scaffold, scaffoldBoundingBox);
    }
  });
}

function updateScaffoldRotation(
  newValue: string | null,
  scaffold: THREE.Object3D,
  boundBox: THREE.Object3D
) {
  // Default rotation angle if newValue is null or doesn't contain a colon
  let rotationAngleInDegrees = 90;

  // Parse the new rotation value from the label text content
  if (newValue != null) {
    const parts = newValue.split("°");
    if (parts.length > 1) {
      rotationAngleInDegrees = parseFloat(parts[0].trim());
      console.log(
        "rotation angle in degrees",
        rotationAngleInDegrees.toFixed(2)
      );
    }
  }

  const rotationAngleInRadians =
    THREE.MathUtils.RAD2DEG * rotationAngleInDegrees;

  scaffoldRotation = rotationAngleInRadians;

  // Rotate the scaffold and bounding box instances
  scaffold.rotation.y = rotationAngleInRadians;
  boundBox.rotation.y = rotationAngleInRadians;

  // Update the label text content to reflect the new rotation
  const labelDiv = document.createElement("div");
  labelDiv.className = "label bg-black text-white pointer-events-auto";
  labelDiv.textContent = `${newValue}`;
  labelDiv.contentEditable = "true";

  // Replace the existing label with the updated one
  const existingLabel = scaffold.getObjectByName(
    "scaffoldLabel"
  ) as CSS2DObject;
  if (existingLabel) {
    existingLabel.element.parentNode?.removeChild(existingLabel.element);
    existingLabel.element = labelDiv;
  }
}

export function generateScaffoldOutline(
  blueprint: THREE.Mesh,
  scene: THREE.Scene
) {
  const shape = blueprint.userData.shape as THREE.Shape;

  const extrudeSettings = {
    steps: 0,
    depth: 0,
    bevelEnabled: true,
    bevelThickness: 0,
    bevelSize: 0,
    bevelOffset: 1,
    bevelSegments: 0,
  };

  const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.rotateX(Math.PI / 2);

  // Access the vertices of the extruded geometry
  // Create a bounding box around the extruded mesh
  const boundingBox = new THREE.Box3().setFromObject(mesh);

  // Get the vertices of the bounding box
  const vertices = [
    boundingBox.min,
    new THREE.Vector3(boundingBox.max.x, 0, boundingBox.min.z),
    boundingBox.max,
    new THREE.Vector3(boundingBox.min.x, 0, boundingBox.max.z),
  ];

  // Create line segments from the vertices of the bounding box
  for (let i = 0; i < vertices.length; i++) {
    const nextIndex = (i + 1) % vertices.length; // Wrap around to the first vertex after the last
    const geometry = new THREE.BufferGeometry().setFromPoints([
      vertices[i],
      vertices[nextIndex],
    ]);
    const material = new THREE.LineBasicMaterial({ color: 0xffffff });
    const line = new THREE.Line(geometry, material);
    // Calculate the length of the line segment
    const length = vertices[i].distanceTo(vertices[nextIndex]);
    const firstPoint = vertices[i];
    const lastPoint = vertices[nextIndex];

    // Add userData to the line
    line.userData = {
      length: length,
      first_point: firstPoint,
      last_point: lastPoint,
    };
    line.name = "scaffoldLine";
    scene.add(line);
  }
}

function attachScaffoldStackingLabel(
  scene: THREE.Scene,
  position: THREE.Vector3
): {
  label: CSS2DObject;
} {
  const labelDiv = document.createElement("div");
  labelDiv.className =
    "label bg-black text-white pointer-events-auto rounded-full py-1 hidden";
  labelDiv.contentEditable = "false";

  const label = new CSS2DObject(labelDiv);
  label.name = "scaffoldingStackingLabel";
  label.position.copy(position);
  scene.add(label);

  return { label };
}
// label that controls how many levels of scaffolding exist
function attachScaffoldRowLabelChangeHandler(
  label: CSS2DObject,
  scene: THREE.Scene,
  scaffold: THREE.Object3D,
  scaffoldBoundingBox: any
) {
  // TODO in the future this level should come from the store which is currently storing the
  // value that is being displayed on the frontend
  let levels = 0;
  const labelElement = label.element as HTMLDivElement;
  labelElement.addEventListener("mouseenter", () => {
    setPlaceScaffoldIndividually(false);
  });

  labelElement.addEventListener("mouseleave", () => {
    setPlaceScaffoldIndividually(true);
  });

  labelElement.addEventListener("focus", () => {
    setPlaceScaffoldIndividually(false);
  });

  observeElementAndAddEventListener(
    "add-scaffolding-level",
    "mousedown",
    () => {
      levels++;
      addScaffoldingLevelForAllScaffolding(
        scene,
        scaffold,
        scaffoldBoundingBox,
        levels
      );
    }
  );

  observeElementAndAddEventListener(
    "remove-scaffolding-level",
    "mousedown",
    () => {
      removeScaffoldingLevelForAllScaffolding(scene, levels);
      levels--;
      // make sure the level cannot go below 0
      if (levels < 0) {
        levels = 0;
      }
    }
  );
}

function addScaffoldingLevelForAllScaffolding(
  scene: THREE.Scene,
  scaffold: THREE.Object3D,
  scaffoldBoundingBox: any,
  level: number
) {
  const scaffoldingLabels: CSS2DObject[] = [];
  scene.traverse((child) => {
    if (
      child instanceof CSS2DObject &&
      child.name === "scaffoldingStackingLabel"
    ) {
      scaffoldingLabels.push(child);
    }
  });

  scaffoldingLabels.forEach((label) => {
    addScaffoldingLevel(label, scene, scaffold, scaffoldBoundingBox, level);
  });
}

function removeScaffoldingLevelForAllScaffolding(
  scene: THREE.Scene,
  level: number
) {
  const scaffoldingLabels: CSS2DObject[] = [];
  scene.traverse((child) => {
    if (
      child instanceof CSS2DObject &&
      child.name === "scaffoldingStackingLabel"
    ) {
      scaffoldingLabels.push(child);
    }
  });

  scaffoldingLabels.forEach((label) => {
    removeScaffoldingLevel(label, scene, level);
  });
}

// add a level of scaffolding to the selected side
function addScaffoldingLevel(
  label: CSS2DObject,
  scene: THREE.Scene,
  scaffold: THREE.Object3D,
  scaffoldBoundingBox: any,
  level: number
) {
  label.userData.level = level;
  const lineLength = label.userData.length;
  const lineLevel = level;
  const startPoint = new THREE.Vector3(
    label.userData.first_point.x,
    lineLevel * 2,
    label.userData.first_point.z
  );
  const endPoint = new THREE.Vector3(
    label.userData.last_point.x,
    lineLevel * 2,
    label.userData.last_point.z
  );
  const numSegments = Math.ceil(lineLength / 1.57);
  try {
    for (let i = 0; i < numSegments; i++) {
      // Calculate the interpolated position along the line
      const t = i / numSegments; // Parameter for interpolation along the line
      const position = new THREE.Vector3().lerpVectors(startPoint, endPoint, t);

      // Check if there is already a model at this position
      const isModelAlreadyPlaced = scene.children.some((child) => {
        return (
          child instanceof THREE.Object3D && child.position.equals(position)
        );
      });

      // add scaffolding line
      const geometry = new THREE.BufferGeometry().setFromPoints([
        endPoint,
        startPoint,
      ]);
      const material = new THREE.LineBasicMaterial({ color: 0xffffff });
      const line = new THREE.Line(geometry, material);
      line.name = "scaffoldLine";
      const [length, lastPoint, firstPoint] = measureLineLength([
        endPoint,
        startPoint,
      ]);
      line.userData = {
        length: length,
        first_point: firstPoint,
        last_point: lastPoint,
      };
      scene.add(line);

      if (!isModelAlreadyPlaced) {
        // Instantiate the GLB model
        const modelInstance = SkeletonUtils.clone(scaffold);
        const boundBoxInstance = scaffoldBoundingBox.clone();
        modelInstance.position.copy(position); // Position the model at the interpolated position
        boundBoxInstance.position.copy(position);
        const lineDirection = new THREE.Vector3()
          .subVectors(endPoint, startPoint)
          .normalize();
        // Create a quaternion that represents the rotation needed to align a model with the line
        const quaternion = new THREE.Quaternion().setFromUnitVectors(
          new THREE.Vector3(0, 0, 1),
          lineDirection
        );

        const euler = new THREE.Euler().setFromQuaternion(quaternion);

        modelInstance.rotation.copy(euler);
        boundBoxInstance.rotation.copy(euler);
        modelInstance.userData.position = position;
        modelInstance.userData.first_point = startPoint;
        modelInstance.userData.last_point = endPoint;
        modelInstance.userData.line_length = lineLength;

        const material = new THREE.MeshPhysicalMaterial({
          color: 0x404141, // Dark gray color
          emissive: 0x000000,
        });
        if (modelInstance.children[0] instanceof THREE.Mesh) {
          modelInstance.children[0].material = material;
        } else {
          console.error("The first child of the model instance is not a Mesh.");
        }

        modelInstance.rotateOnAxis(new THREE.Vector3(0, 1, 0), Math.PI / 2);
        boundBoxInstance.rotateOnAxis(new THREE.Vector3(0, 1, 0), Math.PI / 2);

        scene.add(modelInstance);
        // scene.add(boundBoxInstance);
      } else {
        console.log("there are already children at this position");
      }
    }
  } catch (error) {
    console.error("Error creating scaffold model:", error);
  }
  console.log(label.userData.level);
}

// remove a level of scaffolding from the selected side
function removeScaffoldingLevel(
  label: CSS2DObject,
  scene: THREE.Scene,
  level: number
) {
  label.userData.level = level;
  const lineLength = label.userData.length;
  const lineLevel = level;
  console.log("linelevel", lineLevel);
  const startPoint = new THREE.Vector3(
    label.userData.first_point.x,
    lineLevel * 2,
    label.userData.first_point.z
  );
  const endPoint = new THREE.Vector3(
    label.userData.last_point.x,
    lineLevel * 2,
    label.userData.last_point.z
  );
  const numSegments = Math.ceil(lineLength / 1.57);
  try {
    for (let i = 0; i < numSegments; i++) {
      if (startPoint.y === 0 || endPoint.y === 0) {
        console.log("level cannot be lower than 0");
        return;
      }
      // Calculate the interpolated position along the line
      const t = i / numSegments; // Parameter for interpolation along the line
      const position = new THREE.Vector3().lerpVectors(startPoint, endPoint, t);

      const scaffoldingLevelToBeRemoved: THREE.Object3D<THREE.Object3DEventMap>[] =
        [];
      scene.traverse((child) => {
        if (
          child instanceof THREE.Object3D &&
          child.position.equals(position)
        ) {
          scaffoldingLevelToBeRemoved.push(child);
        }
        if (
          child instanceof THREE.Line &&
          child.name === "scaffoldLine" &&
          child.userData.first_point.y === position.y
        ) {
          scaffoldingLevelToBeRemoved.push(child);
        }
      });

      scaffoldingLevelToBeRemoved.forEach((scaffold: THREE.Object3D) => {
        scene.remove(scaffold);
      });
    }
  } catch (error) {
    console.error("Error creating scaffold model:", error);
  }
  label.userData.level = level;
}

export function createScaffoldingSheeting(
  scaffoldOutline: (THREE.Mesh<any, any, any> | THREE.Line<any, any>)[],
  scene: THREE.Scene,
  sheetColor: number
) {
  scaffoldOutline.forEach((scaffold) => {
    const firstPoint = scaffold.userData.first_point as THREE.Vector3;
    const lastPoint = scaffold.userData.last_point as THREE.Vector3;
    const length = scaffold.userData.length;
    const midPoint = new THREE.Vector3().lerpVectors(
      firstPoint,
      lastPoint,
      0.5
    );

    // Calculate the direction vector of the line
    const direction = new THREE.Vector3()
      .subVectors(lastPoint, firstPoint)
      .normalize();

    // Choose a normal vector for the plane
    // For simplicity, we'll use the cross product of the direction vector and the up vector (0, 1, 0)
    const normal = new THREE.Vector3()
      .crossVectors(direction, new THREE.Vector3(0, 1, 0))
      .normalize();

    // Create a mesh with a PlaneGeometry and a MeshBasicMaterial
    const planeGeometry = new THREE.PlaneGeometry(length, 2); // Adjust the size as needed
    const planeMaterial = new THREE.MeshBasicMaterial({
      color: sheetColor,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.5,
    }); // Adjust the material properties as needed
    const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);

    // Position the plane mesh at the first point of the line
    planeMesh.position.copy(midPoint);

    // Rotate the plane mesh to align with the plane
    planeMesh.lookAt(midPoint.clone().add(normal));
    planeMesh.position.y = firstPoint.y + 1; //half of the height

    planeMesh.userData = {
      first_point: firstPoint,
      last_point: lastPoint,
      length: length,
    };
    planeMesh.name = "scaffoldingSheet";

    // Check if there is already a planeMesh at the same location
    const isMeshAlreadyPlaced = scene.children.some((child) => {
      return (
        child instanceof THREE.Mesh &&
        child.name === "scaffoldingSheet" &&
        child.position.equals(planeMesh.position)
      );
    });

    if (!isMeshAlreadyPlaced) {
      // Add the plane mesh to the scene
      scene.add(planeMesh);
    }
  });
}

// delete a row of scaffolding
export function deleteRowOfScaffolding(scene: THREE.Scene, scaffold: any) {
  console.log("deleting row of scaffolding");
  console.log(scaffold.parent.userData);

  const lineLength = scaffold.parent.userData.line_length;
  const startPoint = scaffold.parent.userData.first_point;
  const endPoint = scaffold.parent.userData.last_point;
  const numSegments = Math.ceil(lineLength / 1.57);
  try {
    for (let i = 0; i < numSegments; i++) {
      if (startPoint.y === 0 || endPoint.y === 0) {
        console.log("level cannot be lower than 0");
        return;
      }
      // Calculate the interpolated position along the line
      const t = i / numSegments; // Parameter for interpolation along the line
      const position = new THREE.Vector3().lerpVectors(startPoint, endPoint, t);

      const scaffoldingLevelToBeRemoved: THREE.Object3D<THREE.Object3DEventMap>[] =
        [];
      scene.traverse((child) => {
        if (
          child instanceof THREE.Object3D &&
          child.position.equals(position)
        ) {
          scaffoldingLevelToBeRemoved.push(child);
        }
        if (
          child instanceof THREE.Line &&
          child.name === "scaffoldLine" &&
          child.userData.first_point.y === position.y &&
          isVectorEqual(
            child.userData.first_point,
            scaffold.parent.userData.last_point
          ) &&
          isVectorEqual(
            child.userData.last_point,
            scaffold.parent.userData.first_point
          )
        ) {
          scaffoldingLevelToBeRemoved.push(child);
        } else {
        }
      });

      scaffoldingLevelToBeRemoved.forEach((scaffold: THREE.Object3D) => {
        scene.remove(scaffold);
      });
    }
  } catch (error) {
    console.error("Error creating scaffold model:", error);
  }
}

// delete column of scaffolding
export function deleteColumnOfScaffolding(scene: THREE.Scene, scaffold: any) {
  let scaffoldingColumnToRemove: THREE.Object3D<THREE.Object3DEventMap>[] = [];
  scene.traverse((child) => {
    if (child.name === "scaffoldingModel") {
      if (
        child.userData.position.x === scaffold.parent.userData.position.x &&
        child.userData.position.z === scaffold.parent.userData.position.z
      ) {
        scaffoldingColumnToRemove.push(child);
      }
    }
  });

  scaffoldingColumnToRemove.forEach((child) => {
    scene.remove(child);
  });
}

// scaffolding model creation along with bounding box for respective scaffolding model
export function createScaffoldExternalStaircaseModel(
  length: number,
  height: number,
  width: number
): Promise<[THREE.LineSegments, THREE.Object3D]> {
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();
    loader.load(
      "/models/scaffolding-external-staircase-no-texture.glb",
      (gltf: any) => {
        const scaffoldExternalStaircaseModel = gltf.scene;
        scaffoldExternalStaircaseModel.name =
          "scaffoldingExternalStaircaseModel";
        scaffoldExternalStaircaseModel.userData = {
          name: "scaffoldingExternalStaircaseModel",
          length: length,
          height: height,
          width: width,
          position: null,
          first_point: null,
          last_point: null,
          line_length: null,
        };
        // Calculate bounding box
        const bbox = new THREE.Box3().setFromObject(
          scaffoldExternalStaircaseModel
        );
        // Get the dimensions of the bounding box
        const size = bbox.getSize(new THREE.Vector3());

        // Calculate the scale factor for each dimension
        const scaleX = (width * 2) / size.x;
        const scaleY = (height) / size.y;
        const scaleZ = length / size.z;

        // THIS CODE CREATES THE MODEL AND MAINTAINS THE CORRECT RATIOS
        // Choose the smallest scale factor to maintain aspect ratio
        // const scaleFactor = Math.min(scaleX, scaleY, scaleZ);
        // Apply the scale factor to the model
        // scaffoldModel.scale.set(scaleFactor, scaleFactor, scaleFactor);

        // Apply the scale factor to the model
        scaffoldExternalStaircaseModel.scale.set(scaleX, scaleY, scaleZ);

        // Define the new material you want to assign to the meshes
        const newMaterial = new THREE.MeshPhysicalMaterial({
          color: 0x404141, // Dark gray color
          emissive: 0x000000,
        });

        // Traverse the model and find all meshes
        scaffoldExternalStaircaseModel.traverse((object: any) => {
          if (object instanceof THREE.Mesh) {
            // Assign the new material to the mesh
            object.material = newMaterial;
          }
        });

        // Update the bounding box with the scaled model
        scaffoldExternalStaircaseModel.updateMatrixWorld();
        const newBBox = new THREE.Box3().setFromObject(
          scaffoldExternalStaircaseModel
        );

        // Calculate and print the new bounding box dimensions
        const newLength = newBBox.max.z - newBBox.min.z;
        const newWidth = newBBox.max.x - newBBox.min.x;
        const newHeight = newBBox.max.y - newBBox.min.y;
        console.log("New bounding box dimensions:", {
          length: newLength,
          width: newWidth,
          height: newHeight,
        });

        // Create wireframe geometry
        const bboxGeometry = new THREE.BoxGeometry().setFromPoints([
          newBBox.min,
          new THREE.Vector3(newBBox.min.x, newBBox.min.y, newBBox.max.z),
          new THREE.Vector3(newBBox.min.x, newBBox.max.y, newBBox.min.z),
          new THREE.Vector3(newBBox.min.x, newBBox.max.y, newBBox.max.z),
          new THREE.Vector3(newBBox.max.x, newBBox.min.y, newBBox.min.z),
          new THREE.Vector3(newBBox.max.x, newBBox.min.y, newBBox.max.z),
          new THREE.Vector3(newBBox.max.x, newBBox.max.y, newBBox.min.z),
          newBBox.max,
        ]);

        // Create wireframe material
        const bboxMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00 });

        // Create wireframe
        const bboxWireframe = new THREE.LineSegments(
          new THREE.WireframeGeometry(bboxGeometry),
          bboxMaterial
        );
        bboxWireframe.name = "scaffoldingWireframe";
        bboxWireframe.userData = {
          name: "scaffoldingWireframe",
          length: length,
          height: height,
          width: width,
        };

        console.log(
          "scaffolding external staircase model",
          scaffoldExternalStaircaseModel
        );

        resolve([bboxWireframe, scaffoldExternalStaircaseModel]);
      },
      (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      },
      (error) => {
        console.error("Error loading GLB model:", error);
        // Check if the error is related to missing texture
        if (error instanceof Error && error.message.includes("load texture")) {
          // Ignore the error related to missing texture and resolve the promise
          resolve([new THREE.LineSegments(), new THREE.Object3D()]);
        } else {
          // Reject the promise for other types of errors
          reject(error);
        }
      }
    );
  });
}
