import * as THREE from "three";
import * as OBC from "openbim-components";
import Stats from "stats.js";
import {
  createShapeIsOutlined,
  createBlueprintFromShapeOutline,
  createExtrusionFromBlueprint,
  createRectangle,
  createRoof,
  createShedRoof,
  editBlueprint,
  createBlueprintFromMarkup,
  createFlatRoof,
  rotateBlueprint,
} from "./utilities/mesh";
import {
  createScaffoldingShapeIsOutlined,
  createScaffoldModel,
  placeScaffoldModelsAlongLine,
  generateScaffoldOutline,
  createScaffoldingSheeting,
  deleteRowOfScaffolding,
  deleteColumnOfScaffolding,
  createScaffoldExternalStaircaseModel,
  createScaffoldInternalStaircaseModel,
  replaceScaffoldingWithStaircase,
} from "./utilities/scaffold";
import { createToolbar } from "./utilities/toolbar";
import { CustomGrid } from "./utilities/customgrid";
import { createLighting } from "./utilities/lighting";
import {
  CSS2DObject,
  CSS2DRenderer,
} from "three/examples/jsm/renderers/CSS2DRenderer.js";
import {
  calculateTransformedBoundingBox,
  debounce,
  deleteObject,
  disableOrbitControls,
  findObjectBuildingRelations,
  findObjectParent,
  hideAllCSS2DObjects,
  observeElementAndAddEventListener,
  resetScaffolding,
  resetScene,
  returnObjectsToOriginalState,
  saveAsImage,
  updateScaffoldingData,
} from "./utilities/helper";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { OrbitViewHelper } from "./utilities/orbit";
import { uploadImageStore, useStore } from "./store";
import {
  deleteBuilding,
  deletionInProgress,
  deletionScaffoldingColumnInProgress,
  deletionScaffoldingRowInProgress,
  drawingInProgress,
  drawingInProgressSwitch,
  drawingScaffoldingInProgress,
  editingBlueprint,
  highlightingObject,
  isDrawingBlueprint,
  movingGeometry,
  replaceScaffoldingColumnWithExternalStaircaseInProgress,
  replaceScaffoldingColumnWithInternalStaircaseInProgress,
  rotatingRoofInProgress,
  setDeleteBuilding,
  setDeletionInProgress,
  setDeletionScaffoldingColumnInProgress,
  setDeletionScaffoldingRowInProgress,
  setDrawingInProgress,
  setDrawingScaffoldingInProgress,
  setEditingBlueprint,
  setIsDrawingBlueprint,
  setMovingGeometry,
  setReplaceScaffoldingColumnWithExternalStaircaseInProgress,
  setReplaceScaffoldingColumnWithInternalStaircaseInProgress,
  setRotatingRoofInProgress,
  setStates,
} from "./utilities/state";
import gsap from "gsap";
import { TransformControls } from "three/addons/controls/TransformControls.js";
import {
  cameraDisableOrbitalFunctionalities,
  cameraEnableOrbitalFunctionality,
  toggleCameraOrthographic,
  toggleCameraPerspective,
} from "./utilities/camera";
import { SceneObserver } from "./utilities/scene";
import Timeline from "./pages/Timeline.vue";

let intersects: any[], components: OBC.Components;
let rectangleBlueprint: any;
let labels: any;
let roofToggleState: number = 0;
let controls: OrbitControls;
let viewHelper: any;
let rotateObject = false;

const stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom);

export const createModelView = async () => {
  const container = document.getElementById("model") as HTMLCanvasElement;
  if (!container) {
    throw new Error("Container element not found");
  }

  components = new OBC.Components();
  components.scene = new OBC.SimpleScene(components);
  components.renderer = new OBC.SimpleRenderer(components, container);
  components.camera = new OBC.OrthoPerspectiveCamera(components);
  components.raycaster = new OBC.SimpleRaycaster(components);
  components.init();

  // Orbit Controls
  controls = new OrbitControls(
    // @ts-ignore
    components.camera.activeCamera,
    // @ts-ignore
    components.renderer._renderer.domElement
  );

  //@ts-ignore
  components.camera.controls.mouseButtons.left = 1; // 1
  //@ts-ignore
  components.camera.controls.mouseButtons.middle = 16; // 8
  //@ts-ignore
  components.camera.controls.mouseButtons.right = 0; // 2
  //@ts-ignore
  components.camera.controls.mouseButtons.wheel = 16; // 8

  // Obit Controls Gizmo
  viewHelper = new OrbitViewHelper(
    controls,
    { size: 100, padding: 8 },
    components
  );

  // Add the Gizmo to the document
  document.body.appendChild(viewHelper.domElement);

  viewHelper.domElement.addEventListener("mouseover", () => {
    setDrawingInProgress(false);
    setDrawingScaffoldingInProgress(false);
    setDeletionInProgress(false);
    setEditingBlueprint(false);
  });

  // Call the function to disable OrbitControls
  disableOrbitControls(controls);

  // Scene
  const scene = components.scene.get();
  console.log("scene", scene);

  const backgroundColor = new THREE.Color("#252529");
  scene.background = backgroundColor;

  // Lighting
  createLighting(scene);

  // Grid
  const grid = new CustomGrid(components, new THREE.Color("#FF0000"));
  // grid._fade = 0;
  // @ts-ignore
  grid._grid.name = "grid";
  console.log("grid", grid);

  // Cube
  const geometry = new THREE.OctahedronGeometry(0.5); // The parameter is the radius of the octahedron
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const cube = new THREE.Mesh(geometry, material);
  cube.rotateOnAxis(new THREE.Vector3(0, 1, 0), Math.PI / 4);
  cube.position.set(0, -1, 0);

  // for the blueprint rectangle
  const markupGroup = new THREE.Group();
  markupGroup.name = "markupGroup";
  scene.add(markupGroup);

  // Base plane: need to change the size of the plane to be bigger
  const planeGeometry = new THREE.PlaneGeometry(1000, 1000);
  const planeMaterial = new THREE.MeshStandardMaterial({
    side: THREE.DoubleSide,
    visible: false,
    // color: 0x000000
  }); // add visible: false to remove from visibility
  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.rotateOnAxis(new THREE.Vector3(1, 0, 0), Math.PI / 2);
  plane.name = "ground";
  scene.add(plane);

  const highlightMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1),
    new THREE.MeshBasicMaterial({ side: THREE.DoubleSide })
  );
  highlightMesh.rotateX(-Math.PI / 2);
  highlightMesh.position.set(0.5, 0, 0.5);
  highlightMesh.name = "highlightMesh";

  components.meshes.push(cube);
  components.meshes.push(plane);
  components.meshes.push(highlightMesh);

  const [
    blueprintButton,
    createBlueprintRectangleButton,
    freeRotateButton,
    createGableRoofButton,
    createShedRoofButton,
    createEditRoofButton,
    createEditExtrusionButton,
    drawScaffoldButton,
    generateScaffoldButton,
    generateScaffoldOutlineButton,
    createExtrusionButton,
    // clearSceneButton,
    // testButton,
  ] = createToolbar(components, scene);

  const mousePosition = new THREE.Vector2();
  const raycaster = new THREE.Raycaster();

  const cssRenderer = new CSS2DRenderer();
  cssRenderer.setSize(window.innerWidth, window.innerHeight);
  cssRenderer.domElement.style.position = "relative";
  cssRenderer.domElement.style.top = "0";
  document.body.appendChild(cssRenderer.domElement);

  // Modify the mousemove event listener
  let lastHighlightedObject: THREE.Mesh | null = null;
  let lastHighlightedObjectColor: any | null = null;
  let lastHighlightedObjects: THREE.Object3D<THREE.Object3DEventMap>[] = [];

  // Function to reset the color of the last highlighted object
  function resetLastHighlightedObject() {
    if (lastHighlightedObject && lastHighlightedObject.material) {
      const material = lastHighlightedObject.material;
      if (
        material instanceof THREE.MeshBasicMaterial ||
        material instanceof THREE.MeshStandardMaterial ||
        material instanceof THREE.MeshPhongMaterial
      ) {
        material.color.setHex(lastHighlightedObjectColor);
        // material.opacity = 1;
        // material.transparent = false;
        material.needsUpdate = true;
      }
      lastHighlightedObject = null;
    }
  }

  function resetLastHighlightedObjects() {
    if (lastHighlightedObjects.length > 0) {
      const originalMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x404141,
        emissive: 0x000000,
      });
      lastHighlightedObjects.forEach((scaffold: THREE.Object3D) => {
        if (scaffold.children[0] instanceof THREE.Mesh) {
          scaffold.children[0].material = originalMaterial;
          console.log("switching to original color");
        } else {
          console.error("The first child of the model instance is not a Mesh.");
        }
      });
      lastHighlightedObjects = [];
    }
  }

  // Function to highlight the intersected object
  function highlightObject(object: THREE.Mesh, color: number) {
    const material = object.material;
    if (
      material instanceof THREE.MeshStandardMaterial ||
      material instanceof THREE.MeshPhongMaterial
    ) {
      lastHighlightedObjectColor = material.color.getHex();
      material.color.set(color);
      // material.opacity = 0.5;
      // material.transparent = true;
      material.needsUpdate = true;
    }
  }

  // highlight an entire row of scaffolding
  function highlightScaffoldingRow(scaffold: any, color: number) {
    if (scaffold.name === "scaffoldLine") {
      return;
    }
    const lineLength = scaffold.parent.userData.line_length;
    const startPoint = scaffold.parent.userData.first_point;
    const endPoint = scaffold.parent.userData.last_point;
    const numSegments = Math.ceil(lineLength / 1.57);

    try {
      for (let i = 0; i < numSegments; i++) {
        // Calculate the interpolated position along the line
        const t = i / numSegments; // Parameter for interpolation along the line
        const position = new THREE.Vector3().lerpVectors(
          startPoint,
          endPoint,
          t
        );

        scene.traverse((child) => {
          if (
            child instanceof THREE.Object3D &&
            child.position.equals(position)
          ) {
            lastHighlightedObjects.push(child);
          }
        });

        const material = new THREE.MeshPhysicalMaterial({
          color: color,
          emissive: color,
        });

        lastHighlightedObjects.forEach((scaffold: THREE.Object3D) => {
          if (scaffold.children[0] instanceof THREE.Mesh) {
            scaffold.children[0].material = material;
            lastHighlightedObjectColor = material.color.getHex();
          } else {
            console.error(
              "The first child of the model instance is not a Mesh.",
              scaffold
            );
          }
        });
      }
    } catch (error) {
      console.warn("Error highlighting scaffold model:", error, scaffold);
    }
  }

  // highlight entire column of scaffolding
  function highlightScaffoldingColumn(scaffold: any) {
    try {
      if (scaffold.name === "scaffoldLine") {
        return;
      }
      const scaffoldParent = findObjectParent(scaffold);

      scene.traverse((child) => {
        const objectParent = findObjectParent(child);

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
            lastHighlightedObjects.push(objectParent);
          }
        }
      });

      const material = new THREE.MeshPhysicalMaterial({
        color: 0x000000,
        emissive: 0x000000,
      });

      lastHighlightedObjects.forEach((scaffold: THREE.Object3D) => {
        if (scaffold.children[0] instanceof THREE.Mesh) {
          scaffold.children[0].material = material;
          lastHighlightedObjectColor = material.color.getHex();
        } else {
          console.error(
            "The first child of the model instance is not a Mesh.",
            scaffold
          );
        }
      });
    } catch (error) {
      console.warn("Error highlighting scaffold model:", error, scaffold);
    }
  }

  // highlight object whens deletion is in progress
  window.addEventListener("mousemove", function (e) {
    mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1;
    mousePosition.y = -(e.clientY / window.innerHeight) * 2 + 1;
    //@ts-ignore
    raycaster.setFromCamera(mousePosition, components.camera.activeCamera);
    intersects = raycaster.intersectObjects(scene.children);
    if (drawingInProgress) {
      scene.add(highlightMesh);
      intersects.forEach(function (intersect: any) {
        switch (intersect.object.name) {
          case "ground":
            console.warn("highlightmesh", highlightMesh)
            const highlightPos = new THREE.Vector3()
              .copy(intersect.point)
              .floor()
              .addScalar(0.5);
            highlightMesh.position.set(highlightPos.x, 0, highlightPos.z);
            break;
        }
      });
    }

    if (deletionInProgress && !drawingInProgress && !drawingScaffoldingInProgress) {
      if (intersects.length > 0) {
        const intersectedObject = intersects[0].object as THREE.Mesh;
        if (
          intersectedObject !== lastHighlightedObject &&
          intersectedObject.name !== "ground" &&
          intersectedObject.name !== "grid" &&
          intersectedObject.name !== "scaffoldingSheet" &&
          intersectedObject.name !== "blueprint"
        ) {
          console.warn("highlighting");
          resetLastHighlightedObject();
          highlightObject(intersectedObject, 0xff0000);
          lastHighlightedObject = intersectedObject;
        } else if (intersectedObject.name === "ground") {
          resetLastHighlightedObject();
        }
      } else {
        resetLastHighlightedObject();
      }
    }

    if (deletionScaffoldingRowInProgress) {
      if (intersects.length > 0) {
        const intersectedObject = intersects[0].object as THREE.Mesh;
        if (
          intersectedObject !== lastHighlightedObject &&
          intersectedObject.name !== "ground" &&
          intersectedObject.name !== "grid" &&
          (intersectedObject.name.startsWith("scaffolding") ||
            intersectedObject.parent?.name.startsWith("scaffolding") ||
            intersectedObject.name === "scaffoldLine")
        ) {
          resetLastHighlightedObjects();
          highlightScaffoldingRow(intersectedObject, 0x000000);
          lastHighlightedObject = intersectedObject;
        } else if (intersectedObject.name === "ground") {
          resetLastHighlightedObjects();
        }
      } else {
        resetLastHighlightedObjects();
      }
    }

    if (deletionScaffoldingColumnInProgress) {
      if (intersects.length > 0) {
        const intersectedObject = intersects[0].object as THREE.Mesh;
        const object = findObjectParent(intersectedObject);
        if (
          intersectedObject !== lastHighlightedObject &&
          intersectedObject.name !== "ground" &&
          intersectedObject.name !== "grid" &&
          (intersectedObject.name.startsWith("scaffolding") ||
            intersectedObject.parent?.name.startsWith("scaffolding") ||
            intersectedObject.name === "scaffoldLine" ||
            object?.name.startsWith("scaffolding"))
        ) {
          resetLastHighlightedObjects();
          highlightScaffoldingColumn(intersectedObject);
          lastHighlightedObject = intersectedObject;
        } else if (intersectedObject.name === "ground") {
          resetLastHighlightedObjects();
        }
      } else {
        resetLastHighlightedObjects();
      }
    }

    if (
      (editingBlueprint || rotatingRoofInProgress) &&
      !drawingInProgress &&
      !deletionInProgress
    ) {
      if (intersects.length > 0) {
        const intersectedObject = intersects[0].object as THREE.Mesh;
        if (
          intersectedObject !== lastHighlightedObject &&
          intersectedObject.name !== "ground" &&
          intersectedObject.name !== "grid"
        ) {
          resetLastHighlightedObject();
          highlightObject(intersectedObject, 0x111115);
          lastHighlightedObject = intersectedObject;
        } else if (intersectedObject.name === "ground") {
          resetLastHighlightedObject();
        }
      } else {
        resetLastHighlightedObject();
      }
    }

    if (
      // movingGeometry ||
      deleteBuilding &&
      !highlightingObject
    ) {
      if (intersects.length > 0) {
        const intersectedObject = intersects[0].object as THREE.Mesh;

        if (
          intersectedObject.name !== "scaffoldingSheet" &&
          intersectedObject.name !== "rectangle" &&
          intersectedObject.name !== "blueprint"
        ) {
          if (
            intersectedObject !== lastHighlightedObject &&
            intersectedObject.name !== "ground" &&
            intersectedObject.name !== "grid"
          ) {
            resetLastHighlightedObject();
            highlightObject(intersectedObject, 0x0bda51);
            lastHighlightedObject = intersectedObject;
          } else if (intersectedObject.name === "ground") {
            resetLastHighlightedObject();
          }
        }
      } else {
        resetLastHighlightedObject();
      }
    }
  });

  let points: THREE.Vector3[] = [];
  let scaffoldPoints: THREE.Vector3[] = [];

  observeElementAndAddEventListener("reset-scaffolding", "mousedown", () => {
    scaffoldPoints = [];
  });

  window.addEventListener("mousedown", async (event) => {
    if (drawingInProgress && drawingInProgressSwitch) {
      // create blueprint on screen after the shape has been outlined by the user
      createShapeIsOutlined(intersects, points, highlightMesh, scene, cube);
    }
    if (drawingScaffoldingInProgress && !deletionInProgress) {
      event.preventDefault();
      // create blueprint on screen after the shape has been outlined by the user
      if (event.button === 0) {
        createScaffoldingShapeIsOutlined(
          intersects,
          scaffoldPoints,
          highlightMesh,
          scene,
          cube
        );
      }
      if (event.button === 2) {
        document.addEventListener("contextmenu", (event) => {
          event.preventDefault(); // Prevent the context menu from appearing
        });
      }
    }
    if (deletionInProgress && !drawingInProgress) {
      if (intersects.length > 0) {
        const objectToRemove = intersects[0].object;
        deleteObject(objectToRemove, scene);
      }
    }
    // implementation for editing blueprint after it has been created is not complete
    if (editingBlueprint && !drawingInProgress) {
      const blueprintToEdit = intersects[0].object;
      if (blueprintToEdit.name === "blueprint") {
        editBlueprint(scene, blueprintToEdit);
      }
    }
    if (deletionScaffoldingRowInProgress && !drawingInProgress) {
      const scaffoldingRowToRemove = intersects[0].object;
      const object = findObjectParent(scaffoldingRowToRemove);
      if (object && object.name.startsWith("scaffolding")) {
        deleteRowOfScaffolding(scene, scaffoldingRowToRemove);
      }
    }
    if (deletionScaffoldingColumnInProgress && !drawingInProgress) {
      const scaffoldingColumnToRemove = intersects[0].object;
      console.log(
        "SCAFFOLDING COLUMN OBJECT TO REMOVE",
        scaffoldingColumnToRemove
      );
      const object = findObjectParent(scaffoldingColumnToRemove);
      if (object && object.name.startsWith("scaffolding")) {
        deleteColumnOfScaffolding(scene, scaffoldingColumnToRemove);
        if (replaceScaffoldingColumnWithExternalStaircaseInProgress) {
          const [_bboxWireframe, scaffoldExternalStaircaseModeling] =
            await generateScaffoldExternalStaircaseModel();
          replaceScaffoldingWithStaircase(
            scene,
            scaffoldingColumnToRemove,
            scaffoldExternalStaircaseModeling
          );
          setDeletionScaffoldingColumnInProgress(false);
        }
        if (replaceScaffoldingColumnWithInternalStaircaseInProgress) {
          const [_bboxWireframe, scaffoldInternalStaircaseModeling] =
            await generateScaffoldInternalStaircaseModel();
          replaceScaffoldingWithStaircase(
            scene,
            scaffoldingColumnToRemove,
            scaffoldInternalStaircaseModeling
          );
          setDeletionScaffoldingColumnInProgress(false);
        }
      }
    }
    if (deleteBuilding) {
      const building = intersects[0].object;
      const buildings = findObjectBuildingRelations(building, scene);

      buildings.forEach((object) => {
        console.warn(object);
        if (object.parent && object.parent.name === "markupGroup") {
          const parentObject = object.parent;
          // Remove children of the "markupGroup" from the scene
          // TODO check if this implementation removes the blueprint from memory and
          // properly disposes of material
          parentObject.traverse((grandChild) => {
            parentObject.remove(grandChild);
          });
        } else {
          // console.warn(object);
          hideAllCSS2DObjects(scene);
          scene.remove(object);
        }
      });
    }
    if (movingGeometry && !drawingInProgress) {
      if (intersects.length > 0) {
        document.body.style.cursor = "grab";
        // cameraEnableOrbitalFunctionality(gsap, components.camera);
        const mesh = intersects[0].object;
        console.log(mesh);
        hideAllCSS2DObjects(scene);

        const group = new THREE.Group();
        scene.add(group);

        const geometriesToMove = findObjectBuildingRelations(mesh, scene);

        // Store initial world position of the group
        const initialWorldPosition = new THREE.Vector3();
        group.getWorldPosition(initialWorldPosition);

        const initialWorldPositionChildren = new THREE.Vector3();
        mesh.getWorldPosition(initialWorldPositionChildren);
        console.log(
          "initialWorldPositionChildren",
          initialWorldPositionChildren
        );

        // At the beginning of your transform control setup:
        const initialGroupRotation = new THREE.Euler().copy(group.rotation);
        const initialChildRotations = group.children.map((child) =>
          new THREE.Euler().copy(child.rotation)
        );

        group.add(...geometriesToMove);
        console.warn(group);

        /////////////////////////////////

        const transformControls = new TransformControls(
          //@ts-ignore
          components.camera.activeCamera,
          //@ts-ignore
          components.renderer._renderer.domElement
        );

        if (rotateObject) {
          transformControls.setMode("rotate");
          transformControls.showY = true;
          transformControls.showX = false;
          transformControls.showZ = false;
        } else {
          transformControls.setMode("translate");
          transformControls.showY = false;
          transformControls.showX = true;
          transformControls.showZ = true;
        }

        if (
          mesh.name !== "ground" &&
          mesh.name !== "grid" &&
          mesh.name.indexOf("label") === -1
        ) {
          console.log("SELECTED mESH", mesh);
          transformControls.enabled = true;
          transformControls.attach(group);
          transformControls.position.x = mesh.userData.shape.currentPoint.x;
          transformControls.position.z = mesh.userData.shape.currentPoint.y;
          scene.add(transformControls);
        }

        console.log(geometriesToMove, group, transformControls);

        // transformControls.addEventListener("change", render);

        transformControls.addEventListener("mouseDown", function () {
          cameraDisableOrbitalFunctionalities(gsap, components.camera);
          resetLastHighlightedObject();
          freeRotateButton.domElement.click();
          console.warn("BEFORE TRANSLATION", group, transformControls);
        });

        transformControls.addEventListener("mouseUp", function () {
          cameraEnableOrbitalFunctionality(gsap, components.camera);
          transformControls.detach();
          scene.remove(transformControls);
          freeRotateButton.domElement.click();
          returnObjectsToOriginalState();

          // Calculate displacement
          const finalGroupPosition = new THREE.Vector3();
          group.getWorldPosition(finalGroupPosition);

          const xDisplacement = finalGroupPosition.x - initialWorldPosition.x;
          const zDisplacement = finalGroupPosition.z - initialWorldPosition.z;

          console.log("Initial Group Position:", initialWorldPosition);
          console.log("Final Group Position:", finalGroupPosition);
          console.log("Displacement X:", xDisplacement, "Z:", zDisplacement);

          // Reset group position
          group.position.set(
            initialWorldPosition.x,
            initialWorldPosition.y,
            initialWorldPosition.z
          );

          // Handle rotation
          const finalGroupRotation = new THREE.Euler().copy(group.rotation);
          const rotationDifference = new THREE.Euler(
            finalGroupRotation.x - initialGroupRotation.x,
            finalGroupRotation.y - initialGroupRotation.y,
            finalGroupRotation.z - initialGroupRotation.z
          );
          // Calculate the difference in rotation around the y-axis only
          const rotationDifferenceY =
            finalGroupRotation.y - initialGroupRotation.y;

          console.warn(
            "ROTATION DEBUG: ",
            initialGroupRotation,
            finalGroupRotation,
            rotationDifference
          );

          // Reset group rotation
          // group.rotation.copy(initialGroupRotation);

          // Update children
          group.children.forEach((child) => {
            // Update shape
            if (child.userData.shape instanceof THREE.Shape) {
              const newShape = new THREE.Shape();
              child.userData.shape.curves.forEach((curve) => {
                if (curve instanceof THREE.LineCurve) {
                  const startPoint = curve.v1
                    .clone()
                    .add(new THREE.Vector2(xDisplacement, zDisplacement));
                  const endPoint = curve.v2
                    .clone()
                    .add(new THREE.Vector2(xDisplacement, zDisplacement));
                  newShape.moveTo(startPoint.x, startPoint.y);
                  newShape.lineTo(endPoint.x, endPoint.y);
                }
              });
              child.userData.shape = newShape;
            }

            if (
              child.userData.shape instanceof THREE.Shape &&
              rotateObject &&
              child.name === "blueprint"
            ) {
              // Example: Calculate the total rotation magnitude in radians
              const totalGroupRotationMagnitude = new THREE.Vector3(
                finalGroupRotation.x,
                finalGroupRotation.y,
                finalGroupRotation.z
              ).length();
              console.warn("ROTATION RADIANS", rotationDifferenceY);
              rotateBlueprint(child.userData, scene, -rotationDifferenceY);
              // deleteObject(child, scene);
            }

            // Update position
            child.position.x += xDisplacement;
            child.position.z += zDisplacement;

            // Rotate the child's position
            // const rotatedPosition = rotatePoint(
            //   child.position,
            //   rotationDifference
            // );
            // child.position.copy(rotatedPosition);

            // Apply the rotation to the child
            // child.rotation.x += rotationDifference.x;
            // child.rotation.y += rotationDifference.y;
            // child.rotation.z += rotationDifference.z;

            // Update matrices
            child.updateMatrix();
            child.updateMatrixWorld(true);

            console.log(`Child ${child.name} new position:`, child.position);
          });

          // Update group matrix
          group.updateMatrix();
          group.updateMatrixWorld(true);

          console.log("After transformation:", group);
        });
      }
    }

    if (rotatingRoofInProgress && !drawingInProgressSwitch) {
      console.log("ROTATING ROOFS", intersects[0].object);
      // Check if the click is on the roof
      if (intersects.length > 0 && intersects[0].object.name === "roof") {
        console.log("rotating roof", intersects[0].object);
        const roof = intersects[0].object;
        const extrusions: THREE.Mesh[] = [];
        // Toggle the roofToggleState between 0 and  1
        roofToggleState = roofToggleState === 0 ? 1 : 0;

        scene.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            if (child.name === "extrusion") {
              extrusions.push(child);
            }
          }
          if (
            child instanceof CSS2DObject &&
            child.name === "rectangleRoofLabel"
          ) {
            child.element.style.pointerEvents = "none";
            child.visible = false;
          }
        });

        console.log("roof", roof);
        console.log("extrusions", extrusions);
        const store = useStore();
        const height = store.height;

        // Iterate over all extrusions
        extrusions.forEach((extrusion) => {
          // Check if the current extrusion equals a roof position that was selected
          let hasRoof =
            extrusion.userData.shape.currentPoint.x ===
              roof.userData.shape.curves[0].v1.x ||
            extrusion.userData.shape.currentPoint.x ===
              roof.userData.shape.curves[0].v2.x ||
            extrusion.userData.shape.currentPoint.y ===
              roof.userData.shape.curves[0].v1.y ||
            extrusion.userData.shape.currentPoint.y ===
              roof.userData.shape.curves[0].v2.y;

          console.log("hasRoof", hasRoof);
          deleteObject(roof, scene);
          // If the extrusion does nequal a roof, replace the roof with a rotated version
          if (hasRoof) {
            createRoof(extrusion, scene, roofToggleState, height);
          }
        });
      }
      if (intersects.length > 0 && intersects[0].object.name === "shedRoof") {
        console.log("rotating shed roof");
        const roof = intersects[0].object;
        const extrusions: THREE.Mesh[] = [];

        // Toggle the roofToggleState between  0,  1,  2, and  3
        roofToggleState = (roofToggleState + 1) % 4;
        console.log(roofToggleState);

        scene.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            if (child.name === "extrusion") {
              extrusions.push(child);
            }
          }
          if (
            child instanceof CSS2DObject &&
            child.name === "rectangleRoofLabel"
          ) {
            child.element.style.pointerEvents = "none";
            child.visible = false;
          }
        });

        console.log("roofs", roof);
        console.log("extrusions", extrusions);
        const store = useStore();
        const height = store.shedHeight;

        extrusions.forEach((extrusion) => {
          let hasRoof =
            extrusion.userData.shape.currentPoint.x ===
              roof.userData.shape.curves[0].v1.x ||
            extrusion.userData.shape.currentPoint.x ===
              roof.userData.shape.curves[0].v2.x ||
            extrusion.userData.shape.currentPoint.y ===
              roof.userData.shape.curves[0].v1.y ||
            extrusion.userData.shape.currentPoint.y ===
              roof.userData.shape.curves[0].v2.y;

          console.log("hasRoof", hasRoof);
          console.log("curves", roof.userData.shape.curves[0].v1.x);
          scene.remove(roof);
          if (hasRoof) {
            createShedRoof(extrusion, scene, roofToggleState, height);
          }
        });
      }
    }
  });

  blueprintButton.domElement.addEventListener("mousedown", function () {
    setIsDrawingBlueprint(false);
    document.body.style.cursor = "auto";
    if (!drawingInProgress && points.length > 1) {
      // create extrusion from the blueprint after it has been created
      points = createBlueprintFromShapeOutline(points, scene);
    }
    if (rectangleBlueprint) {
      scene.traverse((rectPlane) => {
        if (rectPlane.name === "rectanglePlane") {
          points = createBlueprintFromMarkup(
            rectPlane.userData.rectanglePoints,
            rectPlane.userData.blueprintHasBeenUpdated,
            rectPlane.userData.width,
            rectPlane.userData.height,
            scene
          );
        }
      });
    }
  });

  observeElementAndAddEventListener("create-blueprint", "mousedown", () => {
    setIsDrawingBlueprint(false);
    document.body.style.cursor = "auto";
    if (!drawingInProgress && points.length > 1) {
      // create extrusion from the blueprint after it has been created
      points = createBlueprintFromShapeOutline(points, scene);
    }
    if (rectangleBlueprint) {
      scene.traverse((rectPlane) => {
        if (rectPlane.name === "rectanglePlane") {
          points = createBlueprintFromMarkup(
            rectPlane.userData.rectanglePoints,
            rectPlane.userData.blueprintHasBeenUpdated,
            rectPlane.userData.width,
            rectPlane.userData.height,
            scene
          );
        }
      });
    }
  });

  // create extrusion once from Blueprint THREE.Shape which has been stored in mesh.userData
  createExtrusionButton.domElement.addEventListener("mousedown", () => {
    let blueprints: THREE.Mesh[] = [];
    let extrusions: THREE.Mesh[] = [];

    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        if (child.name === "blueprint") {
          blueprints.push(child);
        } else if (child.name === "extrusion") {
          extrusions.push(child);
        }
      }
    });

    blueprints.forEach((blueprint) => {
      let hasExtrusion = extrusions.some((extrusion) =>
        Object.is(blueprint.userData.shape, extrusion.userData.shape)
      );
      if (!hasExtrusion) {
        createExtrusionFromBlueprint(blueprint.userData, scene, 12);
      }
    });

    blueprints = [];
    extrusions = [];
  });

  // create extrusion once from Blueprint THREE.Shape which has been stored in mesh.userData
  observeElementAndAddEventListener("create-extrusion", "mousedown", () => {
    setDeletionInProgress(false);
    let blueprints: THREE.Mesh[] = [];
    let extrusions: THREE.Mesh[] = [];

    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        if (child.name === "blueprint") {
          blueprints.push(child);
        } else if (child.name === "extrusion") {
          extrusions.push(child);
        }
      }
    });

    blueprints.forEach((blueprint) => {
      let hasExtrusion = extrusions.some((extrusion) =>
        Object.is(blueprint.userData.shape, extrusion.userData.shape)
      );
      if (!hasExtrusion) {
        const depthValue = componentStore.depth;
        console.log(depthValue);
        if (depthValue !== 0) {
          createExtrusionFromBlueprint(blueprint.userData, scene, depthValue);
        }
      }
    });

    blueprints = [];
    extrusions = [];
  });

  createGableRoofButton.domElement.addEventListener("mousedown", () => {
    let extrusions: THREE.Mesh[] = [];
    let roofs: THREE.Mesh[] = [];

    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        if (child.name === "roof" || child.name === "shedRoof") {
          roofs.push(child);
        } else if (child.name === "extrusion") {
          extrusions.push(child);
        }
      }
      if (
        child.name === "rectangleExtrusionLabel" &&
        child instanceof CSS2DObject
      ) {
        child.element.style.pointerEvents = "none";
        child.visible = false;
      }
    });

    console.log("extrusions", extrusions);
    console.log("roofs", roofs);

    extrusions.forEach((extrusion) => {
      let hasRoof = roofs.some(
        (roof) =>
          extrusion.userData.shape.currentPoint.x ===
            roof.userData.shape.curves[0].v1.x ||
          extrusion.userData.shape.currentPoint.x ===
            roof.userData.shape.curves[0].v2.x ||
          extrusion.userData.shape.currentPoint.y ===
            roof.userData.shape.curves[0].v1.y ||
          extrusion.userData.shape.currentPoint.y ===
            roof.userData.shape.curves[0].v2.y
      );
      if (!hasRoof) {
        componentStore.updateRoofHeight(3);
        const heightLevel = componentStore.height;
        createRoof(extrusion, scene, 0, heightLevel);
      }
    });

    roofs = [];
    extrusions = [];
  });

  observeElementAndAddEventListener("create-gable-roof", "mousedown", () => {
    setDeletionInProgress(false);
    let extrusions: THREE.Mesh[] = [];
    let roofs: THREE.Mesh[] = [];

    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        if (child.name === "roof" || child.name === "shedRoof") {
          roofs.push(child);
        } else if (child.name === "extrusion") {
          extrusions.push(child);
        }
      }
      if (
        child.name === "rectangleExtrusionLabel" &&
        child instanceof CSS2DObject
      ) {
        child.element.style.pointerEvents = "none";
        child.visible = false;
      }
    });

    extrusions.forEach((extrusion) => {
      let hasRoof = roofs.some(
        (roof) =>
          extrusion.userData.shape.currentPoint.x ===
            roof.userData.shape.curves[0].v1.x ||
          extrusion.userData.shape.currentPoint.x ===
            roof.userData.shape.curves[0].v2.x ||
          extrusion.userData.shape.currentPoint.y ===
            roof.userData.shape.curves[0].v1.y ||
          extrusion.userData.shape.currentPoint.y ===
            roof.userData.shape.curves[0].v2.y
      );
      if (!hasRoof) {
        const heightValue = componentStore.height;
        if (heightValue !== 0) {
          createRoof(extrusion, scene, 0, heightValue);
        }
      }
    });

    roofs = [];
    extrusions = [];
  });

  observeElementAndAddEventListener("create-flat-roof", "mousedown", () => {
    setDeletionInProgress(false);
    let extrusions: THREE.Mesh[] = [];
    let roofs: THREE.Mesh[] = [];

    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        if (child.name === "roof" || child.name === "shedRoof") {
          roofs.push(child);
        } else if (child.name === "extrusion") {
          extrusions.push(child);
        }
      }
      if (
        child.name === "rectangleExtrusionLabel" &&
        child instanceof CSS2DObject
      ) {
        child.element.style.pointerEvents = "none";
        child.visible = false;
      }
    });

    extrusions.forEach((extrusion) => {
      let hasRoof = roofs.some(
        (roof) =>
          extrusion.userData.shape.currentPoint.x ===
            roof.userData.shape.currentPoint.x ||
          extrusion.userData.shape.currentPoint.y ===
            roof.userData.shape.currentPoint.y
      );
      if (!hasRoof) {
        createFlatRoof(extrusion, scene);
      }
    });

    hideAllCSS2DObjects(scene);
    roofs = [];
    extrusions = [];
  });

  createShedRoofButton.domElement.addEventListener("mousedown", () => {
    let extrusions: THREE.Mesh[] = [];
    let roofs: THREE.Mesh[] = [];

    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        if (child.name === "roof" || child.name === "shedRoof") {
          roofs.push(child);
        }
        if (child.name === "extrusion") {
          extrusions.push(child);
        }
      }
      if (
        child.name === "rectangleExtrusionLabel" &&
        child instanceof CSS2DObject
      ) {
        child.element.style.pointerEvents = "none";
        child.visible = false;
      }
    });

    extrusions.forEach((extrusion) => {
      let hasRoof = roofs.some(
        (roof) =>
          extrusion.userData.shape.currentPoint.x ===
            roof.userData.shape.curves[0].v1.x ||
          extrusion.userData.shape.currentPoint.x ===
            roof.userData.shape.curves[0].v2.x ||
          extrusion.userData.shape.currentPoint.y ===
            roof.userData.shape.curves[0].v1.y ||
          extrusion.userData.shape.currentPoint.y ===
            roof.userData.shape.curves[0].v2.y
      );
      if (!hasRoof) {
        componentStore.updateShedRoofHeight(3);
        const heightLevel = componentStore.shedHeight;
        createShedRoof(extrusion, scene, 0, heightLevel);
      }
    });

    roofs = [];
    extrusions = [];
  });

  observeElementAndAddEventListener("create-shed-roof", "mousedown", () => {
    setDeletionInProgress(false);
    let extrusions: THREE.Mesh[] = [];
    let roofs: THREE.Mesh[] = [];

    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        if (child.name === "roof" || child.name === "shedRoof") {
          roofs.push(child);
        }
        if (child.name === "extrusion") {
          extrusions.push(child);
        }
      }
      if (
        child.name === "rectangleExtrusionLabel" &&
        child instanceof CSS2DObject
      ) {
        child.element.style.pointerEvents = "none";
        child.visible = false;
      }
    });

    extrusions.forEach((extrusion) => {
      let hasRoof = roofs.some(
        (roof) =>
          extrusion.userData.shape.currentPoint.x ===
            roof.userData.shape.curves[0].v1.x ||
          extrusion.userData.shape.currentPoint.x ===
            roof.userData.shape.curves[0].v2.x ||
          extrusion.userData.shape.currentPoint.y ===
            roof.userData.shape.curves[0].v1.y ||
          extrusion.userData.shape.currentPoint.y ===
            roof.userData.shape.curves[0].v2.y
      );
      if (!hasRoof) {
        const heightValue = parseFloat(
          componentStore.shedHeight as unknown as string
        );
        if (heightValue !== 0) {
          createShedRoof(extrusion, scene, 0, heightValue);
        }
      }
    });

    roofs = [];
    extrusions = [];
  });

  // edit extrusion after roof as been created
  createEditExtrusionButton.domElement.addEventListener("mousedown", () => {
    let editedExtrusionHeight: any;
    let roofs: THREE.Mesh[] = [];
    scene.traverse((child) => {
      if (
        child instanceof CSS2DObject &&
        child.name === "rectangleExtrusionLabel"
      ) {
        if (
          child.element.style.pointerEvents === "none" &&
          child.visible === false
        ) {
          child.element.style.pointerEvents = "auto";
          child.visible = true;
          child.element.addEventListener("blur", () => {
            editedExtrusionHeight = parseFloat(
              child.element.textContent as unknown as string
            );
            const mesh = child.userData;
            roofs.forEach((roof) => {
              if (
                mesh.userData.shape.currentPoint.x ===
                  roof.userData.shape.curves[0].v1.x ||
                mesh.userData.shape.currentPoint.x ===
                  roof.userData.shape.curves[0].v2.x ||
                mesh.userData.shape.currentPoint.y ===
                  roof.userData.shape.curves[0].v1.y ||
                mesh.userData.shape.currentPoint.y ===
                  roof.userData.shape.curves[0].v2.y
              ) {
                // extrudedRoof = roof;
                if (mesh) {
                  const transformedBoundingBox =
                    calculateTransformedBoundingBox(roof);

                  const roofBottomVertex = new THREE.Vector3(
                    transformedBoundingBox.min.x,
                    transformedBoundingBox.min.y,
                    transformedBoundingBox.min.z
                  );
                  // difference between the center of the roof and it's bounding box bottom
                  const deltaY = roof.position.y - roofBottomVertex.y;
                  const differenceDeltaY = deltaY + editedExtrusionHeight;

                  roof.position.y = differenceDeltaY;
                } else {
                  console.log("mesh does not exist");
                }
              } else {
                console.log("roof not found");
              }
            });
          });

          roofs = [];
        }
      }
      if (child instanceof CSS2DObject && child.name === "rectangleRoofLabel") {
        child.element.style.pointerEvents = "none";
        child.visible = false;
      }
      if (
        child instanceof THREE.Mesh &&
        (child.name === "roof" || child.name === "shedRoof")
      ) {
        console.log(child);
        roofs.push(child);
      }
    });
  });

  createEditRoofButton.domElement.addEventListener("mousedown", () => {
    console.log("edit roofing button");
    scene.traverse((child) => {
      if (child instanceof CSS2DObject && child.name === "rectangleRoofLabel") {
        child.element.style.pointerEvents = "auto";
        child.visible = true;
      }
    });
  });

  observeElementAndAddEventListener("rotate-roof", "mousedown", () => {
    document.body.style.cursor = "crosshair";
    setRotatingRoofInProgress(true);
    setDeletionInProgress(false);
  });

  drawScaffoldButton.domElement.addEventListener("mousedown", () => {
    setDeletionInProgress(false);
    if (drawingScaffoldingInProgress) {
      // create blueprint on screen after the shape has been outlined by the user
      createScaffoldingShapeIsOutlined(
        intersects,
        points,
        highlightMesh,
        scene,
        cube
      );
    }
  });

  // observeElementAndAddEventListener("draw-scaffold", "mousedown", () => {
  //   setDeletionInProgress(false);
  //   console.warn("drawing scaffolding PRETRIGGER", drawingScaffoldingInProgress)
  //   if (drawingScaffoldingInProgress) {
  //     console.warn("drawing scaffolding in PROGRESS")
  //     // create blueprint on screen after the shape has been outlined by the user
  //     createScaffoldingShapeIsOutlined(
  //       intersects,
  //       points,
  //       highlightMesh,
  //       scene,
  //       cube
  //     );
  //   }
  // });

  observeElementAndAddEventListener("draw-scaffold", "mouseleave", () => {
    console.warn(
      "drawing scaffolding PRETRIGGER",
      drawingScaffoldingInProgress, drawingInProgress, drawingInProgressSwitch, deletionInProgress
    );
    // if (drawingScaffoldingInProgress) {
    //   console.warn("drawing scaffolding in PROGRESS");
    //   // create blueprint on screen after the shape has been outlined by the user
    //   createScaffoldingShapeIsOutlined(
    //     intersects,
    //     points,
    //     highlightMesh,
    //     scene,
    //     cube
    //   );
    // }
  });

  generateScaffoldButton.domElement.addEventListener("mousedown", () => {
    generateScaffolding();
  });

  let scaffoldPlacedPosition = new Map<string, THREE.Vector3>();
  async function generateScaffolding() {
    const [bboxWireframe, scaffoldModeling] = await createScaffoldModel(
      1.57,
      2.0,
      0.73
    );
    const amountOfScaffoldingLines: any[] = [];
    scene.traverse((child) => {
      if (child instanceof THREE.Line && child.name === "scaffoldLine") {
        console.error("existing scaffolding lines", child);
        amountOfScaffoldingLines.push(child);
        placeScaffoldModelsAlongLine(
          child,
          scene,
          scaffoldModeling,
          bboxWireframe,
          scaffoldPlacedPosition
        );
      }
    });
    console.log(amountOfScaffoldingLines, amountOfScaffoldingLines.length);
  }

  generateScaffoldOutlineButton.domElement.addEventListener("mousedown", () => {
    scene.traverse((child: any) => {
      if (child instanceof THREE.Mesh && child.name === "blueprint") {
        generateScaffoldOutline(child, scene);
      }
    });
  });

  observeElementAndAddEventListener("generate-scaffolding", "mousedown", () => {
    setDeletionInProgress(false);
    hideAllCSS2DObjects(scene);
    generateScaffolding();
    const cubeClone: THREE.Object3D<THREE.Object3DEventMap>[] = [];
    scene.traverse((child) => {
      if (child.name === "cubeClone") {
        cubeClone.push(child);
      }
    });

    cubeClone.forEach((cube) => {
      scene.remove(cube);
    });

    updateScaffoldingData(scene);
  });

  // autogenerate scaffolding
  observeElementAndAddEventListener(
    "autogenerate-scaffolding",
    "mousedown",
    () => {
      hideAllCSS2DObjects(scene);

      scene.traverse((child: any) => {
        if (child instanceof THREE.Mesh && child.name === "blueprint") {
          generateScaffoldOutline(child, scene);
        }
      });

      generateScaffolding();
    }
  );

  //////////////////////////////////
  // this section pertains to creating the rectangle from the top view by clicking and dragging
  // need to organize and abstract the way this section is handled
  let isDragging = false;
  // let isDrawingBlueprint = false;
  let markupMouse = new THREE.Vector2();
  let markupStartPoint: THREE.Vector2 | null = null;
  let markup: any = null;

  //////////////////////////////////////////
  // work around to bring functionality to the drawer section
  // TODO: figure out more efficient method to do this or a simpler method to accomplish this
  observeElementAndAddEventListener(
    "startDrawingRectangle",
    "mousedown",
    () => {
      setIsDrawingBlueprint(true);
      if (!isDragging) {
        window.addEventListener("mousedown", handleMouseDown);
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);
      }
    }
  );
  /////////////////////////////////////

  createBlueprintRectangleButton.domElement.addEventListener(
    "mousedown",
    () => {
      setIsDrawingBlueprint(true);
      if (!isDragging) {
        window.addEventListener("mousedown", handleMouseDown);
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);
      }
    }
  );

  function handleMouseDown(event: MouseEvent) {
    if (!drawingInProgress && isDrawingBlueprint) {
      isDragging = true;
      getMousePointer({ event });
      oldLabels.forEach((label) => {
        scene.remove(label);
      });
      updatedDimensions = [];
      markupStartPoint = markupMouse.clone();
      createRectangle(
        { start: markupMouse, end: markupMouse },
        markupGroup,
        markup,
        components,
        plane,
        raycaster,
        gsap
      );
    }
  }

  let oldLabels: THREE.Object3D<THREE.Object3DEventMap>[] = [];

  function handleMouseMove(event: MouseEvent) {
    if (!drawingInProgress && isDrawingBlueprint) {
      if (isDragging) {
        getMousePointer({ event });
        // Remove old labels from the scene
        oldLabels.forEach((label) => {
          scene.remove(label);
        });
        updatedDimensions = [];
        const result = createRectangle(
          { start: markupStartPoint, end: markupMouse },
          markupGroup,
          markup,
          components,
          plane,
          raycaster,
          gsap
        );
        if (result) {
          [rectangleBlueprint, labels] = result;
          // Store the new labels for future removal
          oldLabels = labels;
          labels.forEach((label: THREE.Object3D<THREE.Object3DEventMap>) => {
            scene.add(label);
          });
        }
      }
    }
  }

  const componentStore = useStore();
  let updatedDimensions: number[] = [];
  function handleMouseUp() {
    isDragging = false;
    updatedDimensions = [];
    oldLabels.forEach((label, index) => {
      if (index < 2) {
        const textContent = (label as CSS2DObject).element.textContent;
        if (textContent !== null) {
          updatedDimensions.push(parseFloat(textContent));
        }
      }
    });
    componentStore.updateLength(updatedDimensions[0]);
    componentStore.updateWidth(updatedDimensions[1]);
  }

  function getMousePointer({ event }: { event: MouseEvent }) {
    markupMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    markupMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  }

  freeRotateButton.domElement.addEventListener("mousedown", () => {
    setIsDrawingBlueprint(false);
  });

  /////////////////////
  console.log(components);

  // Shadow
  const shadows = new OBC.ShadowDropper(components);
  shadows.shadowExtraScaleFactor = 15;
  shadows.darkness = 5;
  shadows.shadowOffset = 0.5;
  shadows.resolution = 7.75;
  // Collect all meshes in the scene that you want to have shadows

  const shadowIds = new Set<string>(); // Set to keep track of used shadow IDs

  // document.addEventListener("mousedown", () => {
  //   scene.traverse((object) => {
  //     if (object instanceof THREE.Mesh) {
  //       let shadowId: string;
  //       if (object.name === "cubeClone") {
  //         shadowId = object.uuid;
  //       } else if (object.name === "line") {
  //         shadowId = object.uuid;
  //       } else if (object.name === "blueprint") {
  //         shadowId = object.uuid;
  //       } else if (object.name === "extrusion") {
  //         shadowId = object.uuid;
  //       } else if (object.name === "scaffoldingModel") {
  //         shadowId = object.uuid;
  //       } else {
  //         // Skip if the object name is not one of the specified types
  //         return;
  //       }

  //       // Check if the shadow ID already exists in the set
  //       if (!shadowIds.has(shadowId)) {
  //         shadows.renderShadow([object], shadowId);
  //         shadowIds.add(shadowId); // Add the shadow ID to the set
  //       }
  //     }
  //   });
  // });

  // clearSceneButton.domElement.addEventListener("mousedown", () => {
  //   resetScaffolding(scene);

  //   const store = useStore();
  //   store.updateScaffoldLevel(0);

  //   resetScene(scene, components, shadows, scaffoldPlacedPosition);

  //   scaffoldPoints.length = 0;
  //   points.length = 0;
  // });

  observeElementAndAddEventListener("reset-scene", "mousedown", () => {
    resetScaffolding(scene);

    const store = useStore();
    store.updateScaffoldLevel(0);

    resetScene(scene, components, shadows, scaffoldPlacedPosition);

    scaffoldPoints.length = 0;
    points.length = 0;
  });

  async function generateScaffoldExternalStaircaseModel() {
    const [bboxWireframe, scaffoldExternalStaircaseModeling] =
      await createScaffoldExternalStaircaseModel(1.57, 2.0, 0.73);
    return [bboxWireframe, scaffoldExternalStaircaseModeling];
  }

  async function generateScaffoldInternalStaircaseModel() {
    const [bboxWireframe, scaffoldInternalStaircaseModeling] =
      await createScaffoldInternalStaircaseModel(1.57, 2.0, 0.73);
    return [bboxWireframe, scaffoldInternalStaircaseModeling];
  }

  observeElementAndAddEventListener("generate-supply", "mousedown", () => {
    updateScaffoldingData(scene);
  });

  //TODO
  //FIX FIX FIX
  const observer = new SceneObserver(
    scene,
    debounce(() => updateScaffoldingData(scene), 200)
  );
  observer.startObserving();

  //TODO CHANGE IMPLEMENTATION SO THIS ONLY TRIGGERS WHEN THE SCENE CHANGES
  // Set the debounce delay (e.g., 200ms)
  // document.addEventListener("mousedown", debounce(updateScaffoldingData(scene), 500));

  observeElementAndAddEventListener("cloth-sheet", "mousedown", () => {
    setDeletionInProgress(false);
    const scaffoldOutline: (
      | THREE.Mesh<any, any, any>
      | THREE.Line<any, any>
    )[] = [];
    scene.traverse((child) => {
      if (child instanceof THREE.Line && child.name === "scaffoldLine") {
        scaffoldOutline.push(child);
      }
    });
    console.log(scaffoldOutline);
    createScaffoldingSheeting(scaffoldOutline, scene, 0x23e6a1);
  });

  observeElementAndAddEventListener("tarp-sheet", "mousedown", () => {
    setDeletionInProgress(false);
    const scaffoldOutline: (
      | THREE.Mesh<any, any, any>
      | THREE.Line<any, any>
    )[] = [];
    scene.traverse((child) => {
      if (child instanceof THREE.Line && child.name === "scaffoldLine") {
        scaffoldOutline.push(child);
      }
    });
    console.log(scaffoldOutline);
    createScaffoldingSheeting(scaffoldOutline, scene, 0x0084ff);
  });

  observeElementAndAddEventListener("shrink-wrap-sheet", "mousedown", () => {
    setDeletionInProgress(false);
    const scaffoldOutline: (
      | THREE.Mesh<any, any, any>
      | THREE.Line<any, any>
    )[] = [];
    scene.traverse((child) => {
      if (child instanceof THREE.Line && child.name === "scaffoldLine") {
        scaffoldOutline.push(child);
      }
    });
    console.log(scaffoldOutline);
    createScaffoldingSheeting(scaffoldOutline, scene, 0x9e9e9e);
  });

  observeElementAndAddEventListener(
    "delete-row-scaffolding",
    "mousedown",
    () => {
      console.log("delete row of scaffolding");
      setDeletionScaffoldingRowInProgress(true);
      setDeletionScaffoldingColumnInProgress(false);
      setDrawingInProgress(false);
      setDeletionInProgress(false);
      setEditingBlueprint(false);
      setDrawingScaffoldingInProgress(false);
    }
  );

  observeElementAndAddEventListener(
    "delete-column-scaffolding",
    "mousedown",
    () => {
      console.log("delete column of scaffolding");
      setDeletionScaffoldingColumnInProgress(true);
      setDeletionScaffoldingRowInProgress(false);
      setDrawingInProgress(false);
      setDeletionInProgress(false);
      setEditingBlueprint(false);
      setDrawingScaffoldingInProgress(false);
      setReplaceScaffoldingColumnWithExternalStaircaseInProgress(false);
      setReplaceScaffoldingColumnWithInternalStaircaseInProgress(false);
    }
  );

  observeElementAndAddEventListener(
    "scaffold-external-staircase",
    "mousedown",
    () => {
      console.log("scaffold-external-staircase");
      setDeletionScaffoldingColumnInProgress(true);
      setDeletionScaffoldingRowInProgress(false);
      setDrawingInProgress(false);
      setDeletionInProgress(false);
      setEditingBlueprint(false);
      setDrawingScaffoldingInProgress(false);
      setReplaceScaffoldingColumnWithExternalStaircaseInProgress(true);
      setReplaceScaffoldingColumnWithInternalStaircaseInProgress(false);
    }
  );

  observeElementAndAddEventListener(
    "scaffold-internal-staircase",
    "mousedown",
    () => {
      console.log("scaffold-internal-staircase");
      setDeletionScaffoldingColumnInProgress(true);
      setDeletionScaffoldingRowInProgress(false);
      setDrawingInProgress(false);
      setDeletionInProgress(false);
      setEditingBlueprint(false);
      setDrawingScaffoldingInProgress(false);
      setReplaceScaffoldingColumnWithExternalStaircaseInProgress(false);
      setReplaceScaffoldingColumnWithInternalStaircaseInProgress(true);
    }
  );

  observeElementAndAddEventListener("delete-sheeting", "mousedown", () => {
    const sheetingToRemove: any = [];
    scene.traverse((child) => {
      if (child.name === "scaffoldingSheet") {
        sheetingToRemove.push(child);
      }
    });

    sheetingToRemove.forEach(
      (child: THREE.Object3D<THREE.Object3DEventMap>) => {
        scene.remove(child);
      }
    );
  });

  observeElementAndAddEventListener("move-geometry", "mousedown", () => {
    setMovingGeometry(true);
    rotateObject = false;
  });

  observeElementAndAddEventListener("rotate-geometry", "mousedown", () => {
    setMovingGeometry(true);
    rotateObject = true;
  });

  // Add a basic plane
  let planeBlueprint: any;
  function addPlaneWithTexture(
    texture: THREE.Texture,
    imageWidth: number,
    imageHeight: number
  ) {
    const aspect = imageWidth / imageHeight;
    let width, height;

    // Determine plane size based on aspect ratio
    if (aspect > 1) {
      width = 5;
      height = 5 / aspect;
    } else {
      width = 5 * aspect;
      height = 5;
    }

    const geometry = new THREE.PlaneGeometry(width, height);
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.DoubleSide,
    });

    if (planeBlueprint) {
      scene.remove(planeBlueprint);
    }
    planeBlueprint = new THREE.Mesh(geometry, material);
    planeBlueprint.rotateOnAxis(new THREE.Vector3(1, 0, 0), -Math.PI / 2);
    planeBlueprint.userData.scale = 1;
    planeBlueprint.name = "uploaded-blueprint";
    planeBlueprint.position.y = -0.03;
    scene.add(planeBlueprint);
  }

  // Handle image upload
  function handleImageUpload(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const img = new Image();
        img.onload = function () {
          const texture = new THREE.Texture(img);
          texture.needsUpdate = true;

          // Add plane with texture and adjust size to fit the image
          addPlaneWithTexture(texture, img.width, img.height);
        };
        // @ts-ignore
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
      return reader;
    } else {
      return null;
    }
  }

  // listen for upload blueprint button and then call the hidden file input
  observeElementAndAddEventListener(
    "upload-image-blueprint",
    "mousedown",
    () => {
      console.log("upload image as blueprint");
      const hiddenFileInput = document.getElementById("2D-hidden-file-input");
      if (hiddenFileInput) {
        hiddenFileInput.addEventListener("change", handleImageUpload);
        hiddenFileInput.click();
      }
    }
  );

  observeElementAndAddEventListener("scale-image-blueprint", "blur", () => {
    console.log("blur");
    const uploadStore = uploadImageStore();
    const uploadedBlueprints: THREE.Object3D<THREE.Object3DEventMap>[] = [];
    scene.traverse((child) => {
      if (child.name === "uploaded-blueprint") {
        uploadedBlueprints.push(child);
      }
    });

    console.log(uploadedBlueprints);

    uploadedBlueprints.forEach((blueprint: any) => {
      console.log(uploadStore.scale);
      blueprint.scale.set(
        uploadStore.scale,
        uploadStore.scale,
        uploadStore.scale
      );
    });
  });

  observeElementAndAddEventListener(
    "scale-image-blueprint-button",
    "mousedown",
    () => {
      console.log("blur");
      const uploadStore = uploadImageStore();
      const uploadedBlueprints: THREE.Object3D<THREE.Object3DEventMap>[] = [];
      scene.traverse((child) => {
        if (child.name === "uploaded-blueprint") {
          uploadedBlueprints.push(child);
        }
      });

      console.log(uploadedBlueprints);

      uploadedBlueprints.forEach((blueprint: any) => {
        console.log(uploadStore.scale);
        blueprint.scale.set(
          uploadStore.scale,
          uploadStore.scale,
          uploadStore.scale
        );
      });
    }
  );

  observeElementAndAddEventListener(
    "scale-image-blueprint",
    "keydown",
    (event) => {
      if ((event as KeyboardEvent).key === "Enter") {
        console.log("Enter key was pressed");
        const uploadStore = uploadImageStore();
        const uploadedBlueprints: THREE.Object3D<THREE.Object3DEventMap>[] = [];
        scene.traverse((child) => {
          if (child.name === "uploaded-blueprint") {
            uploadedBlueprints.push(child);
          }
        });

        console.log(uploadedBlueprints);

        uploadedBlueprints.forEach((blueprint: any) => {
          console.log(uploadStore.scale);
          blueprint.scale.set(
            uploadStore.scale,
            uploadStore.scale,
            uploadStore.scale
          );
        });
      }
    }
  );

  observeElementAndAddEventListener("delete-building", "mousedown", () => {
    setDeleteBuilding(true);
  });

  observeElementAndAddEventListener("toggle-orthographic", "mousedown", () => {
    toggleCameraOrthographic(components);
  });

  observeElementAndAddEventListener("toggle-perspective", "mousedown", () => {
    toggleCameraPerspective(components);
  });

  // @ts-ignore
  components.camera.controls.setLookAt(10, 10, 10, 0, 0, 0);

  function animate() {
    stats.begin();
    requestAnimationFrame(animate);

    // console.log("Scene Polycount:", components._renderer._renderer.info.render.triangles);
    // console.log("Active Drawcalls:", components._renderer._renderer.info.render.calls);
    // console.log("Textures in Memory", components._renderer._renderer.info.memory.textures);
    // console.log("Geometries in Memory", components._renderer._renderer.info.memory.geometries);

    controls.update();

    stats.end();
  }

  observeElementAndAddEventListener("screenshot-button", "mousedown", () => {
    saveAsImage(
      //@ts-ignore
      components.renderer._renderer,
      scene,
      //@ts-ignore
      components.camera.activeCamera
    );
  });

  window.addEventListener("resize", () => {
    //@ts-ignore
    components.camera.activeCamera.aspect =
      window.innerWidth / window.innerHeight;
    //@ts-ignore
    components.camera.activeCamera.updateProjectionMatrix();
    //@ts-ignore
    components.renderer._renderer.setSize(
      window.innerWidth,
      window.innerHeight
    );
  });

  // function render() {
  //   //@ts-ignore
  //   components.renderer._renderer.render(scene, components.camera.activeCamera);
  // }

  animate();
};
