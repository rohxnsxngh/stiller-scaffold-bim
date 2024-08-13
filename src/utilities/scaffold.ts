import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as SkeletonUtils from "three/examples/jsm/utils/SkeletonUtils.js";
import {
  addScaffoldingPositionIfUnique,
  findObjectParent,
  isVectorEqual,
  measureLineLength,
  observeElementAndAddEventListener,
  resetScaffolding,
} from "./helper";
import { useStore } from "../store";

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
          level: 0,
        };
        // Check if a line with the same properties already exists in the scene
        const isLineAlreadyPlaced = scene.children.some((child) => {
          return (
            child instanceof THREE.Line &&
            child.name === "scaffoldLine" &&
            child.userData.length === length &&
            child.userData.first_point.equals(firstPoint) &&
            child.userData.last_point.equals(lastPoint) &&
            child.userData.level === 0
          );
        });

        if (!isLineAlreadyPlaced) {
          scene.add(line);
        } else {
          console.log(
            "A line with the same properties already exists in the scene."
          );
        }
      }
    }
  });
}

export async function placeScaffoldModelsAlongLine(
  line: THREE.Line,
  scene: THREE.Scene,
  scaffoldModeling: any,
  bboxWireframe: any,
  scaffoldPlacedPosition: Map<string, THREE.Vector3>
) {
  const lineLength = line.userData.length;
  const startPoint = line.userData.first_point;
  const endPoint = line.userData.last_point;
  // const midPoint = new THREE.Vector3().lerpVectors(startPoint, endPoint, 0.5);
  const numSegments = Math.ceil(lineLength / 1.57); // Assuming each GLB model fits exactly  1.57 meters along the line
  try {
    for (let i = 0; i < numSegments; i++) {
      // Calculate the interpolated position along the line
      const t = i / numSegments; // Parameter for interpolation along the line
      const position = new THREE.Vector3().lerpVectors(startPoint, endPoint, t);

      // Convert the position to a string key for the set
      const positionKey = `${position.x},${position.y},${position.z}`;

      if (
        addScaffoldingPositionIfUnique(position, scaffoldPlacedPosition, 0.0001)
      ) {
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
        modelInstance.userData.line_direction = lineDirection;

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

        // Add the position to the set of placed positions
        scaffoldPlacedPosition.set(positionKey, position);

        // Log the size of the set after all models have been placed
        console.log(
          `Number of unique positions with models: ${scaffoldPlacedPosition.size}`
        );
      }
    }
  } catch (error) {
    console.error("Error creating scaffold model:", error);
  }

  attachScaffoldRowLabelChangeHandler(
    scene,
    scaffoldModeling,
    bboxWireframe,
    line,
    scaffoldPlacedPosition
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
          line_direction: null,
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

    // Check if there is already a line at this position
    const isLineAlreadyPlaced = scene.children.some((child) => {
      return (
        child instanceof THREE.Line &&
        child.name === "scaffoldLine" &&
        child.userData.first_point.equals(firstPoint) &&
        child.userData.last_point.equals(lastPoint) &&
        child.userData.level === 0
      );
    });

    if (!isLineAlreadyPlaced) {
      // Add userData to the line
      line.userData = {
        length: length,
        first_point: firstPoint,
        last_point: lastPoint,
        level: 0,
      };
      line.name = "scaffoldLine";
      scene.add(line);
    } else {
      console.log("scaffolding line already exists at this position");
    }
  }
}

// label that controls how many levels of scaffolding exist
function attachScaffoldRowLabelChangeHandler(
  scene: THREE.Scene,
  scaffold: THREE.Object3D,
  scaffoldBoundingBox: any,
  line: any,
  scaffoldPlacedPosition: Map<string, THREE.Vector3>
) {
  let levels = 0;

  const store = useStore();
  store.updateScaffoldLevel(1);

  observeElementAndAddEventListener(
    "add-scaffolding-level",
    "mousedown",
    () => {
      console.log("add scaffolding level");

      // Check if there is already scaffolding in the scene
      if (scaffoldPlacedPosition.size === 0) {
        console.log(
          "Cannot add scaffolding level. No scaffolding exists in the scene."
        );
        return; // Exit the function if no scaffolding exists
      }

      levels++;
      if (levels < 0) {
        store.updateScaffoldLevel(0);
      } else {
        store.updateScaffoldLevel(levels + 1);
      }
      console.log("store level", store.level);

      addScaffoldingLevel(
        line,
        scene,
        scaffold,
        scaffoldBoundingBox,
        levels,
        scaffoldPlacedPosition
      );
    }
  );

  observeElementAndAddEventListener(
    "remove-scaffolding-level",
    "mousedown",
    () => {
      // removeScaffoldingLevelForAllScaffolding(scene, levels);
      removeScaffoldingLevel(line, scene, levels, scaffoldPlacedPosition);
      levels--;
      // make sure the level cannot go below 0
      if (levels < 0) {
        levels = 0;
      }
      if (levels < 0) {
        store.updateScaffoldLevel(0);
      } else if (levels > 1) {
        store.updateScaffoldLevel(levels - 1);
      }
      console.log("store level", store.level);
    }
  );

  observeElementAndAddEventListener("reset-scaffolding", "mousedown", () => {
    levels = -1;
    line = null;
    resetScaffolding(scene);

    const store = useStore();
    store.updateScaffoldLevel(0);

    scaffoldPlacedPosition.clear();
  });

  observeElementAndAddEventListener("reset-scene", "mousedown", () => {
    levels = -1;
    line = null;
    store.updateScaffoldLevel(0);
  });
}

// add a level of scaffolding to the selected side
function addScaffoldingLevel(
  line: THREE.Line,
  scene: THREE.Scene,
  scaffold: THREE.Object3D,
  scaffoldBoundingBox: any,
  level: number,
  scaffoldPlacedPosition: Map<string, THREE.Vector3>
) {
  console.log("add scaffolding level", level);
  const lineLength = line.userData.length;
  const startPoint = new THREE.Vector3(
    line.userData.first_point.x,
    level * 2,
    line.userData.first_point.z
  );
  const endPoint = new THREE.Vector3(
    line.userData.last_point.x,
    level * 2,
    line.userData.last_point.z
  );
  const numSegments = Math.ceil(lineLength / 1.57);

  // add scaffolding line
  const geometry = new THREE.BufferGeometry().setFromPoints([
    endPoint,
    startPoint,
  ]);
  const material = new THREE.LineBasicMaterial({ color: 0xffffff });
  const newLine = new THREE.Line(geometry, material);
  newLine.name = "scaffoldLine";
  const [length, lastPoint, firstPoint] = measureLineLength([
    endPoint,
    startPoint,
  ]);

  // Check if a line with the same properties already exists in the scene
  const isLineAlreadyPlaced = scene.children.some((child) => {
    return (
      child instanceof THREE.Line &&
      child.name === "scaffoldLine" &&
      child.userData.length === length &&
      child.userData.first_point.equals(firstPoint) &&
      child.userData.last_point.equals(lastPoint) &&
      child.userData.level === level
    );
  });
  if (!isLineAlreadyPlaced) {
    // Add userData to the line
    newLine.userData = {
      length: length,
      first_point: firstPoint,
      last_point: lastPoint,
      level: level,
    };
    newLine.name = "scaffoldLine";
    scene.add(newLine);
  }

  try {
    for (let i = 0; i < numSegments; i++) {
      // Calculate the interpolated position along the line
      const t = i / numSegments; // Parameter for interpolation along the line
      const position = new THREE.Vector3().lerpVectors(startPoint, endPoint, t);

      // Convert the position to a string key for the set
      const positionKey = `${position.x},${position.y},${position.z}`;

      if (
        addScaffoldingPositionIfUnique(position, scaffoldPlacedPosition, 0.0001)
      ) {
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
        modelInstance.userData.line_direction = lineDirection;

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

        // Add the position to the set of placed positions
        scaffoldPlacedPosition.set(positionKey, position);
      } else {
        console.log("there are already children at this position");
      }
    }
  } catch (error) {
    console.error("Error creating scaffold model:", error);
  }
}

// remove a level of scaffolding from the selected side
function removeScaffoldingLevel(
  line: any,
  scene: THREE.Scene,
  level: number,
  scaffoldPlacedPosition: Map<string, THREE.Vector3>
) {
  const lineLength = line.userData.length;
  const lineLevel = level;
  console.log("linelevel", lineLevel);
  const startPoint = new THREE.Vector3(
    line.userData.first_point.x,
    lineLevel * 2,
    line.userData.first_point.z
  );
  const endPoint = new THREE.Vector3(
    line.userData.last_point.x,
    lineLevel * 2,
    line.userData.last_point.z
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

      // Convert the position to a string key for the set
      const positionKey = `${position.x},${position.y},${position.z}`;

      // Check if the position is in the set of placed positions
      if (
        !addScaffoldingPositionIfUnique(
          position,
          scaffoldPlacedPosition,
          0.0001
        )
      ) {
        // Remove the position from the set
        scaffoldPlacedPosition.delete(positionKey);

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
    }
  } catch (error) {
    console.error("Error creating scaffold model:", error);
  }
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
      // if (startPoint.y < 0 || endPoint.y < 0) {
      //   console.log("level cannot be lower than 0");
      //   return;
      // }
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
  const scaffoldParent = findObjectParent(scaffold);
  try {
    scene.traverse((child) => {
      const objectParent = findObjectParent(child);
      console.log(objectParent);
      if (
        objectParent &&
        (objectParent.name === "scaffoldingModel" ||
          objectParent.name === "scaffoldingStaircase" ||
          objectParent.name === "scaffoldingExternalStaircaseModel" ||
          objectParent.name === "scaffoldingInternalStaircaseModel")
      ) {
        if (
          scaffoldParent &&
          objectParent.userData.position.x ===
            scaffoldParent.userData.position.x &&
          objectParent.userData.position.z ===
            scaffoldParent.userData.position.z
        ) {
          scaffoldingColumnToRemove.push(objectParent);
        }
      }
    });

    scaffoldingColumnToRemove.forEach((child) => {
      scene.remove(child);
      // deleteObject(child, scene);
    });
  } catch (error) {
    console.warn("Error:", error);
  }
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
      "/models/scaffolding-external.glb",
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
        const scaleY = height / size.y;
        const scaleZ = length / size.z;

        // Apply the scale factor to the model
        scaffoldExternalStaircaseModel.scale.set(scaleX, scaleY, scaleZ);

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

export function replaceScaffoldingWithStaircase(
  scene: THREE.Scene,
  scaffold: any,
  scaffoldExternalStaircase: any
) {
  console.log("replace scaffolding with external staircase");
  console.log(scaffold.parent.userData.position);
  const scaffoldPositionX = scaffold.parent.userData.position.x;
  const scaffoldPositionZ = scaffold.parent.userData.position.z;
  const scaffoldDirectionOrientation = scaffold.parent.userData.line_direction;
  console.log(scaffoldPositionX, scaffoldPositionZ);

  const store = useStore();
  const level = store.level;
  console.log(level);
  for (let lvl = 0; lvl < level; lvl++) {
    const externalStaircaseInstance = SkeletonUtils.clone(
      scaffoldExternalStaircase
    );
    // Define the new material you want to assign to the meshes
    const newMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x404141, // Dark gray color
      emissive: 0x000000,
    });

    // Traverse the model and find all meshes
    externalStaircaseInstance.traverse((object: any) => {
      if (object instanceof THREE.Mesh) {
        // Assign the new material to the mesh
        object.material = newMaterial;
      }
    });
    externalStaircaseInstance.position.set(
      scaffoldPositionX,
      lvl * 2,
      scaffoldPositionZ
    );
    externalStaircaseInstance.userData.position = new THREE.Vector3(
      scaffoldPositionX,
      lvl * 2,
      scaffoldPositionZ
    );
    const quaternion = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 0, 1),
      scaffoldDirectionOrientation
    );

    const euler = new THREE.Euler().setFromQuaternion(quaternion);
    externalStaircaseInstance.rotation.copy(euler);
    scene.add(externalStaircaseInstance);
  }
}

// scaffolding internal staircase model creation
export function createScaffoldInternalStaircaseModel(
  length: number,
  height: number,
  width: number
): Promise<[THREE.LineSegments, THREE.Object3D]> {
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();
    loader.load(
      "/models/scaffolding-external.glb",
      (gltf: any) => {
        const scaffoldInternalStaircaseModel = gltf.scene;
        scaffoldInternalStaircaseModel.name =
          "scaffoldingInternalStaircaseModel";
        scaffoldInternalStaircaseModel.userData = {
          name: "scaffoldingInternalStaircaseModel",
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
          scaffoldInternalStaircaseModel
        );
        // Get the dimensions of the bounding box
        const size = bbox.getSize(new THREE.Vector3());

        // Calculate the scale factor for each dimension
        const scaleX = width / size.x;
        const scaleY = height / size.y;
        const scaleZ = length / size.z;

        // Apply the scale factor to the model
        scaffoldInternalStaircaseModel.scale.set(scaleX, scaleY, scaleZ);

        // Update the bounding box with the scaled model
        scaffoldInternalStaircaseModel.updateMatrixWorld();
        const newBBox = new THREE.Box3().setFromObject(
          scaffoldInternalStaircaseModel
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
          scaffoldInternalStaircaseModel
        );

        resolve([bboxWireframe, scaffoldInternalStaircaseModel]);
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
