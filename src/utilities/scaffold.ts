import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as SkeletonUtils from "three/examples/jsm/utils/SkeletonUtils.js";
import { measureLineLength } from "./helper";
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
  const numSegments = Math.ceil(lineLength / 1.57); // Assuming each GLB model fits exactly  1.57 meters along the line
  try {
    const startPoint = line.userData.first_point;
    const endPoint = line.userData.last_point;
    console.log(startPoint, endPoint);

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
        console.log("model instance", modelInstance);

        scene.add(modelInstance);
        scene.add(boundBoxInstance);
      } else {
        console.log("there are already children at this position");
      }
    }
  } catch (error) {
    console.error("Error creating scaffold model:", error);
  }
}

// scaffolding model creation along with bounding box for respective scaffolding model
export function createScaffoldModel(
  length: number
): Promise<[THREE.LineSegments, THREE.Object3D]> {
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();
    loader.load(
      "/models/scaffolding-home.glb",
      (gltf: any) => {
        const scaffoldModel = gltf.scene;
        scaffoldModel.name = "scaffoldingModel";
        scaffoldModel.userData.name = "scaffoldingModel";
        // Calculate bounding box
        const bbox = new THREE.Box3().setFromObject(scaffoldModel);
        const currentLength = bbox.max.z - bbox.min.z; // Assuming length is along X axis

        // Calculate scale factor to achieve desired length (1.57 meters)
        const scaleFactor = length / currentLength;

        // Apply scale factor to the model
        scaffoldModel.scale.set(scaleFactor, scaleFactor, scaleFactor);

        // Update the bounding box with the scaled model
        scaffoldModel.updateMatrixWorld();
        const newBBox = new THREE.Box3().setFromObject(scaffoldModel);

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

        // TODO Solution for improving speed of model loading
        // Create instanced mesh for the model and its bounding box
        // Traverse the scaffoldModel and remove non-Mesh children
        // const scaffoldingModelChildren = scaffoldModel.children[0];
        // Remove non-Mesh children from scaffoldingModelChildren using a forEach loop
        // scaffoldingModelChildren.children.forEach(
        //   (child: any, index: number) => {
        //     if (!(child instanceof THREE.Mesh)) {
        //       scaffoldingModelChildren.children.splice(index, 1);
        //     }
        //   }
        // );
        // console.log("scaffolding model", scaffoldModel);

        // const modelInstances = new THREE.InstancedMesh(
        //   scaffoldModel.geometry,
        //   scaffoldModel.material,
        //   numSegments
        // );
        // const boundBoxInstances = new THREE.InstancedMesh(
        //   bboxWireframe.geometry,
        //   bboxMaterial,
        //   numSegments
        // );

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

// Create Shape Outline
export function createIndividualScaffoldOnClick(
  intersects: any,
  highlightMesh: THREE.Mesh,
  scene: THREE.Scene,
  scaffoldModeling: any,
  bboxWireframe: any
) {
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
      scene.add(modelInstance);
      scene.add(boundBoxInstance);
      modelInstance.rotateOnAxis(new THREE.Vector3(0, 1, 0), Math.PI / 2);
      boundBoxInstance.rotateOnAxis(new THREE.Vector3(0, 1, 0), Math.PI / 2);
      const label = createIndividualScaffoldLabel(
        scene,
        modelInstance,
        boundBoxInstance
      );
      attachIndividualScaffoldLabelChangeHandler(
        label,
        modelInstance,
        boundBoxInstance
      );
    }
  });
}

function createIndividualScaffoldLabel(
  scene: THREE.Scene,
  scaffold: THREE.Object3D,
  scaffoldBoundingBox: any
) {
  const position = scaffold.position;
  const rotation = scaffold.rotation;
  const labelDiv = document.createElement("div");
  labelDiv.className = "label bg-black text-white pointer-events-auto";
  // Convert the rotation Euler angles to degrees and format them as strings
  const rotationY = (rotation.y * (180 / Math.PI)).toFixed(2);
  labelDiv.textContent = `Rotation: ${rotationY}°`;
  labelDiv.contentEditable = "true";

  const label = new CSS2DObject(labelDiv);
  label.name = "scaffoldLabel";
  label.position.copy(
    new THREE.Vector3(position.x, position.y, position.z + 1)
  );
  scene.add(label);
  return label;
}

function attachIndividualScaffoldLabelChangeHandler(
  label: CSS2DObject,
  scaffold: THREE.Object3D,
  scaffoldBoundingBox: any
) {
  const labelElement = label.element as HTMLDivElement;
  let oldValue: any;

  labelElement.addEventListener("mouseenter", () => {
    setPlaceScaffoldIndividually(false);
  });

  labelElement.addEventListener("focus", () => {
    setPlaceScaffoldIndividually(false);
    oldValue = labelElement.textContent;
  });

  labelElement.addEventListener("blur", () => {
    setPlaceScaffoldIndividually(true);
    const newValue = labelElement.textContent;
    if (oldValue !== newValue) {
      updateScaffoldRotation(newValue, scaffold, scaffoldBoundingBox);
      console.log(newValue);
    }
  });
}

function updateScaffoldRotation(
  newValue: string | null,
  scaffold: THREE.Object3D,
  boundBox: THREE.Object3D
) {
  // Parse the new rotation value from the label text content
  if (newValue == null) {
    newValue = "90";
  }
  const rotationAngleInDegrees = parseFloat(newValue.split(":")[1].trim());
  const rotationAngleInRadians = THREE.MathUtils.degToRad(
    rotationAngleInDegrees
  );

  // Rotate the scaffold and bounding box instances
  scaffold.rotation.y = rotationAngleInRadians;
  boundBox.rotation.y = rotationAngleInRadians;

  // Update the label text content to reflect the new rotation
  const labelDiv = document.createElement("div");
  labelDiv.className = "label bg-black text-white pointer-events-auto";
  labelDiv.textContent = `Rotation: ${newValue}`;
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
