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
  moveBlueprint,
  editBlueprint,
  editingBlueprint,
  setEditingBlueprint,
  createBlueprintFromMarkup,
  createFlatRoof,
} from "./utilities/mesh";
import {
  createIndividualScaffoldOnClick,
  createScaffoldingShapeIsOutlined,
  createScaffoldModel,
  placeScaffoldModelsAlongLine,
  setPlaceScaffoldIndividually,
  placeScaffoldIndividually,
  generateScaffoldOutline,
  createScaffoldingSheeting,
  deleteRowOfScaffolding,
  deleteColumnOfScaffolding,
  createScaffoldExternalStaircaseModel,
  replaceScaffoldingWithExternalStaircase,
  deleteIndividualScaffolding,
} from "./utilities/scaffold";
import { createToolbar } from "./utilities/toolbar";
import { CustomGrid } from "./utilities/customgrid";
import { createLighting } from "./utilities/lighting";
import {
  CSS2DObject,
  CSS2DRenderer,
} from "three/examples/jsm/renderers/CSS2DRenderer.js";
import {
  calculateTotalAmountScaffoldingInScene,
  calculateTotalSquareFootageForScaffolding,
  calculateTransformedBoundingBox,
  deleteObject,
  disableOrbitControls,
  hideAllCSS2DObjects,
  observeElementAndAddEventListener,
  removeHighlightMesh,
  resetScene,
  setInvisibleExceptSingularObject,
  // createBoundingBoxVisualizationFromBox,
} from "./utilities/helper";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { OrbitViewHelper } from "./utilities/orbit";
import { useStore } from "./store";
import {
  deletionInProgress,
  deletionIndividualScaffoldingInProgress,
  deletionScaffoldingColumnInProgress,
  deletionScaffoldingRowInProgress,
  drawingInProgress,
  drawingInProgressSwitch,
  drawingScaffoldingInProgress,
  isDrawingBlueprint,
  replaceScaffoldingColumnInProgress,
  setDeletionInProgress,
  setDeletionIndividualScaffoldingInProgress,
  setDeletionScaffoldingColumnInProgress,
  setDeletionScaffoldingRowInProgress,
  setDrawingInProgress,
  setDrawingInProgressSwitch,
  setDrawingScaffoldingInProgress,
  setIsDrawingBlueprint,
  setReplaceScaffoldingColumnInProgress,
} from "./utilities/state";
import { loadSymbol } from "./utilities/base";

let intersects: any, components: OBC.Components;
let rectangleBlueprint: any;
let labels: any;
let roofToggleState: number = 0;
let controls: OrbitControls;
let viewHelper: any;

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
  components.camera = new OBC.SimpleCamera(components);
  components.raycaster = new OBC.SimpleRaycaster(components);
  components.init();

  // Orbit Controls
  controls = new OrbitControls(
    // @ts-ignore
    components.camera.activeCamera,
    // @ts-ignore
    components.renderer._renderer.domElement
  );

  // Obit Controls Gizmo
  viewHelper = new OrbitViewHelper(controls, { size: 100, padding: 8 });

  // Add the Gizmo to the document
  document.body.appendChild(viewHelper.domElement);

  viewHelper.domElement.addEventListener("mouseover", () => {
    setPlaceScaffoldIndividually(false);
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
  const grid = new CustomGrid(components, new THREE.Color("#FF0000")); // Red color
  // grid.name = "grid"

  // Add some elements to the scene
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshStandardMaterial({ color: 0x9d4b4b });
  const cube = new THREE.Mesh(geometry, material);
  cube.position.set(0, 0.5, 0);
  // scene.add(cube);

  // for the blueprint rectangle
  const markupGroup = new THREE.Group();
  markupGroup.name = "markupGroup";
  scene.add(markupGroup);

  // Base plane: need to change the size of the plane to be bigger
  const planeGeometry = new THREE.PlaneGeometry(1000, 1000);
  const planeMaterial = new THREE.MeshStandardMaterial({
    side: THREE.DoubleSide,
    visible: false,
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

  // createScaffoldModel(scene, 1.57)

  components.meshes.push(cube);
  components.meshes.push(plane);
  components.meshes.push(highlightMesh);

  const [
    blueprintButton,
    editBlueprintButton,
    moveBlueprintButton,
    createBlueprintRectangleButton,
    freeRotateButton,
    // drawingButton,
    createGableRoofButton,
    createShedRoofButton,
    createEditExtrusionButton,
    rotateRoofOrientationButton,
    drawScaffoldButton,
    placeScaffoldButton,
    generateScaffoldButton,
    generateScaffoldOutlineButton,
    createExtrusionButton,
    clearSceneButton,
    testButton,
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

  // highlight object whens deletion is in progress
  window.addEventListener("mousemove", function (e) {
    if ((deletionInProgress || editingBlueprint) && !drawingInProgress) {
      mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1;
      mousePosition.y = -(e.clientY / window.innerHeight) * 2 + 1;
      // @ts-ignore
      raycaster.setFromCamera(mousePosition, components.camera.activeCamera);
      intersects = raycaster.intersectObjects(scene.children);

      // If there is an intersection, apply the glow to the intersected object
      if (intersects.length > 0) {
        const intersectedObject = intersects[0].object;
        if (
          intersectedObject !== lastHighlightedObject &&
          intersectedObject.name !== "ground"
        ) {
          if (lastHighlightedObject) {
            (
              lastHighlightedObject.material as THREE.MeshStandardMaterial
            ).color.setHex(lastHighlightedObjectColor);
            (
              lastHighlightedObject.material as THREE.MeshStandardMaterial
            ).needsUpdate = true;
            lastHighlightedObject = null;
          }
          // Apply the glow to the new intersected object
          lastHighlightedObjectColor =
            intersectedObject.material.color.getHex();
          intersectedObject.material.color.set(0xff0000);
          intersectedObject.material.needsUpdate = true;
          // applyGlow(intersectedObject);
          lastHighlightedObject = intersectedObject;
        } else if (
          intersectedObject !== lastHighlightedObject &&
          intersectedObject.name === "ground"
        ) {
          if (lastHighlightedObject) {
            (
              lastHighlightedObject.material as THREE.MeshStandardMaterial
            ).color.setHex(lastHighlightedObjectColor);
            (
              lastHighlightedObject.material as THREE.MeshStandardMaterial
            ).needsUpdate = true;
            lastHighlightedObject = null;
          }
        }
      } else {
        // If there is no intersection, revert the material of the last highlighted object
        if (lastHighlightedObject) {
          // revertMaterial(lastHighlightedObject);
          // lastHighlightedObject.material = lastHighlightedObject.userData
          lastHighlightedObject = null;
        }
      }
    }
    if (
      (deletionScaffoldingRowInProgress && !drawingInProgress) ||
      (deletionIndividualScaffoldingInProgress && !drawingInProgress)
    ) {
      mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1;
      mousePosition.y = -(e.clientY / window.innerHeight) * 2 + 1;
      // @ts-ignore
      raycaster.setFromCamera(mousePosition, components.camera.activeCamera);
      intersects = raycaster.intersectObjects(scene.children);

      // If there is an intersection, apply the glow to the intersected object
      if (intersects.length > 0) {
        const intersectedObject = intersects[0].object;
        if (
          intersectedObject !== lastHighlightedObject &&
          intersectedObject.name !== "ground"
        ) {
          if (lastHighlightedObject) {
            (
              lastHighlightedObject.material as THREE.MeshStandardMaterial
            ).color.setHex(lastHighlightedObjectColor);
            (
              lastHighlightedObject.material as THREE.MeshStandardMaterial
            ).needsUpdate = true;
            lastHighlightedObject = null;
          }
          // Apply the glow to the new intersected object
          lastHighlightedObjectColor =
            intersectedObject.material.color.getHex();
          intersectedObject.material.color.set(0x000000);
          intersectedObject.material.needsUpdate = true;
          // applyGlow(intersectedObject);
          lastHighlightedObject = intersectedObject;
        } else if (
          intersectedObject !== lastHighlightedObject &&
          intersectedObject.name === "ground"
        ) {
          if (lastHighlightedObject) {
            (
              lastHighlightedObject.material as THREE.MeshStandardMaterial
            ).color.setHex(lastHighlightedObjectColor);
            (
              lastHighlightedObject.material as THREE.MeshStandardMaterial
            ).needsUpdate = true;
            lastHighlightedObject = null;
          }
        }
      } else {
        // If there is no intersection, revert the material of the last highlighted object
        if (lastHighlightedObject) {
          // revertMaterial(lastHighlightedObject);
          // lastHighlightedObject.material = lastHighlightedObject.userData
          lastHighlightedObject = null;
        }
      }
    }
    if (deletionScaffoldingColumnInProgress && !drawingInProgress) {
      mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1;
      mousePosition.y = -(e.clientY / window.innerHeight) * 2 + 1;
      // @ts-ignore
      raycaster.setFromCamera(mousePosition, components.camera.activeCamera);
      intersects = raycaster.intersectObjects(scene.children);

      // If there is an intersection, apply the glow to the intersected object
      if (intersects.length > 0) {
        const intersectedObject = intersects[0].object;
        if (
          intersectedObject !== lastHighlightedObject &&
          intersectedObject.name !== "ground"
        ) {
          if (lastHighlightedObject) {
            (
              lastHighlightedObject.material as THREE.MeshStandardMaterial
            ).color.setHex(lastHighlightedObjectColor);
            (
              lastHighlightedObject.material as THREE.MeshStandardMaterial
            ).needsUpdate = true;
            lastHighlightedObject = null;
          }
          // Apply the glow to the new intersected object
          lastHighlightedObjectColor =
            intersectedObject.material.color.getHex();
          intersectedObject.material.color.set(0xffffff);
          intersectedObject.material.needsUpdate = true;
          // applyGlow(intersectedObject);
          lastHighlightedObject = intersectedObject;
        } else if (
          intersectedObject !== lastHighlightedObject &&
          intersectedObject.name === "ground"
        ) {
          if (lastHighlightedObject) {
            (
              lastHighlightedObject.material as THREE.MeshStandardMaterial
            ).color.setHex(lastHighlightedObjectColor);
            (
              lastHighlightedObject.material as THREE.MeshStandardMaterial
            ).needsUpdate = true;
            lastHighlightedObject = null;
          }
        }
      } else {
        // If there is no intersection, revert the material of the last highlighted object
        if (lastHighlightedObject) {
          // revertMaterial(lastHighlightedObject);
          // lastHighlightedObject.material = lastHighlightedObject.userData
          lastHighlightedObject = null;
        }
      }
    }
  });

  // place scaffold individually
  window.addEventListener("mousemove", function (e) {
    if (placeScaffoldIndividually) {
      scene.add(highlightMesh);
      mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1;
      mousePosition.y = -(e.clientY / window.innerHeight) * 2 + 1;
      // @ts-ignore
      raycaster.setFromCamera(mousePosition, components.camera.activeCamera);
      intersects = raycaster.intersectObjects(scene.children);
      intersects.forEach(function (intersect: any) {
        switch (intersect.object.name) {
          case "ground":
            const highlightPos = new THREE.Vector3().copy(intersect.point);
            highlightMesh.position.set(highlightPos.x, 0, highlightPos.z);
            break;
        }
      });
    }
  });

  // draw scaffolding tool
  window.addEventListener("mousemove", function (e) {
    if (drawingScaffoldingInProgress) {
      scene.add(highlightMesh);
      mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1;
      mousePosition.y = -(e.clientY / window.innerHeight) * 2 + 1;
      // @ts-ignore
      raycaster.setFromCamera(mousePosition, components.camera.activeCamera);
      intersects = raycaster.intersectObjects(scene.children);
      intersects.forEach(function (intersect: any) {
        switch (intersect.object.name) {
          case "ground":
            const highlightPos = new THREE.Vector3()
              .copy(intersect.point)
              .floor()
              .addScalar(0.5);
            highlightMesh.position.set(highlightPos.x, 0, highlightPos.z);
            break;
        }
      });
    }
  });

  // general poly draw tool
  window.addEventListener("mousemove", function (e) {
    if (drawingInProgress) {
      scene.add(highlightMesh);
      mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1;
      mousePosition.y = -(e.clientY / window.innerHeight) * 2 + 1;
      // @ts-ignore
      raycaster.setFromCamera(mousePosition, components.camera.activeCamera);
      intersects = raycaster.intersectObjects(scene.children);
      intersects.forEach(function (intersect: any) {
        switch (intersect.object.name) {
          case "ground":
            const highlightPos = new THREE.Vector3()
              .copy(intersect.point)
              .floor()
              .addScalar(0.5);
            highlightMesh.position.set(highlightPos.x, 0, highlightPos.z);
            break;
          case "extrusion":
            break;
          case "roof":
            break;
          case "blueprint":
            break;
          case "line":
            break;
          case "cubeClone":
            break;
          case "rectangleLine":
            break;
        }
      });
    }
  });

  let points: THREE.Vector3[] = [];
  let scaffoldPoints: THREE.Vector3[] = [];

  window.addEventListener("mousedown", async () => {
    if (drawingInProgress && drawingInProgressSwitch) {
      // create blueprint on screen after the shape has been outlined by the user
      createShapeIsOutlined(intersects, points, highlightMesh, scene, cube);
    }
    if (drawingScaffoldingInProgress) {
      // create blueprint on screen after the shape has been outlined by the user
      createScaffoldingShapeIsOutlined(
        intersects,
        scaffoldPoints,
        highlightMesh,
        scene,
        cube
      );
    }
    if (placeScaffoldIndividually) {
      const [bboxWireframe, scaffoldModeling] = await createScaffoldModel(
        1.57,
        2.0,
        0.73
      );
      //TODO: edit this method since the radian top degree conversion doesn't work correctly anymore
      // createIndividualScaffoldOnClick(
      //   intersects,
      //   highlightMesh,
      //   scene,
      //   scaffoldModeling,
      //   bboxWireframe
      // );
    }
    // delete singular object from scene based on raycasting intersection
    if (deletionInProgress && !drawingInProgress) {
      const objectToRemove = intersects[0].object;
      deleteObject(objectToRemove, scene);
    }
    if (editingBlueprint && !drawingInProgress) {
      const blueprintToEdit = intersects[0].object;
      if (blueprintToEdit.name === "blueprint") {
        editBlueprint(scene, blueprintToEdit);
      }
    }
    if (deletionIndividualScaffoldingInProgress && !drawingInProgress) {
      const scaffoldingToRemove = intersects[0].object;
      if (scaffoldingToRemove.parent.name === "scaffoldingModel") {
        deleteIndividualScaffolding(scene, scaffoldingToRemove);
      }
    }
    if (deletionScaffoldingRowInProgress && !drawingInProgress) {
      const scaffoldingRowToRemove = intersects[0].object;
      if (scaffoldingRowToRemove.parent.name === "scaffoldingModel") {
        deleteRowOfScaffolding(scene, scaffoldingRowToRemove);
      }
    }
    if (deletionScaffoldingColumnInProgress && !drawingInProgress) {
      const scaffoldingColumnToRemove = intersects[0].object;
      if (scaffoldingColumnToRemove.parent.name === "scaffoldingModel") {
        deleteColumnOfScaffolding(scene, scaffoldingColumnToRemove);
        if (replaceScaffoldingColumnInProgress) {
          const [bboxWireframe, scaffoldExternalStaircaseModeling] =
            await generateScaffoldExternalStaircaseModel();
          replaceScaffoldingWithExternalStaircase(
            scene,
            scaffoldingColumnToRemove,
            scaffoldExternalStaircaseModeling
          );
        }
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
      points = createBlueprintFromMarkup(
        markupGroup.children[0].userData.rectanglePoints,
        markupGroup.children[0].userData.blueprintHasBeenUpdated,
        scene
      );
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
      points = createBlueprintFromMarkup(
        markupGroup.children[0].userData.rectanglePoints,
        markupGroup.children[0].userData.blueprintHasBeenUpdated,
        scene
      );
    }
  });

  // Edit Blueprint
  editBlueprintButton.domElement.addEventListener("mousedown", () => {
    setInvisibleExceptSingularObject(scene, "blueprint");
  });

  // Move Blueprint
  moveBlueprintButton.domElement.addEventListener("mousedown", () => {
    const blueprints: any[] = [];
    setIsDrawingBlueprint(false);
    // Array to hold objects that can be dragged
    scene.traverse((child: any) => {
      if (child instanceof THREE.Mesh && child.name === "blueprint") {
        blueprints.push(child);
      }
    });
    const dragControls = moveBlueprint(blueprints, components, scene, shadows);
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
            roof.userData.shape.currentPoint.x ||
          extrusion.userData.shape.currentPoint.y ===
            roof.userData.shape.currentPoint.y
      );
      if (!hasRoof) {
        createRoof(extrusion, scene, 0, 3);
      }
    });

    roofs = [];
    extrusions = [];
  });

  observeElementAndAddEventListener("create-gable-roof", "mousedown", () => {
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
          extrusion.userData.currentPoint.x === roof.userData.currentPoint.x ||
          extrusion.userData.currentPoint.y === roof.userData.currentPoint.y
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
          extrusion.userData.currentPoint.x === roof.userData.currentPoint.x ||
          extrusion.userData.currentPoint.y === roof.userData.currentPoint.y
      );
      if (!hasRoof) {
        createFlatRoof(extrusion, scene);
      }
    });

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
          extrusion.userData.currentPoint.x === roof.userData.currentPoint.x ||
          extrusion.userData.currentPoint.y === roof.userData.currentPoint.y
      );
      if (!hasRoof) {
        createShedRoof(extrusion, scene, 0, 3);
      }
    });

    roofs = [];
    extrusions = [];
  });

  observeElementAndAddEventListener("create-shed-roof", "mousedown", () => {
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
          extrusion.userData.currentPoint.x === roof.userData.currentPoint.x ||
          extrusion.userData.currentPoint.y === roof.userData.currentPoint.y
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
    let originalExtrusionHeight: any;
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
          child.element.addEventListener("focus", () => {
            originalExtrusionHeight = parseFloat(
              child.element.textContent as unknown as string
            );
          });
          child.element.addEventListener("blur", () => {
            editedExtrusionHeight = parseFloat(
              child.element.textContent as unknown as string
            );
            const mesh = child.userData;
            roofs.forEach((roof) => {
              if (
                mesh.userData.currentPoint.x === roof.userData.currentPoint.x ||
                mesh.userData.currentPoint.y === roof.userData.currentPoint.y
              ) {
                // extrudedRoof = roof;
                if (mesh) {
                  const transformedBoundingBox =
                    calculateTransformedBoundingBox(roof);
                  // const boundingBox = createBoundingBoxVisualizationFromBox(
                  //   transformedBoundingBox
                  // );
                  // scene.add(boundingBox);
                  const roofBottomVertex = new THREE.Vector3(
                    transformedBoundingBox.min.x,
                    transformedBoundingBox.min.y,
                    transformedBoundingBox.min.z
                  );
                  // difference between the center of the roof and it's bounding box bottom
                  const deltaY = roof.position.y - roofBottomVertex.y;
                  const differenceDeltaY = deltaY + editedExtrusionHeight;

                  // console.log("deltaY", deltaY);
                  // console.log("roof position", roof.position);
                  // console.log(
                  //   "roof current position",
                  //   roof.userData.currentPoint
                  // );
                  // console.log("roof bottom vertex", roofBottomVertex);
                  // console.log("edited extrusion", editedExtrusionHeight);
                  // console.log("difference delta Y", differenceDeltaY);

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

  // TODO Add a rotation state so that this does not interfere with the deletion event
  // Add a mousedown event listener to the window or a specific element
  // window.addEventListener("mousedown", () => {
  //   if (!drawingInProgressSwitch) {
  //     // Check if the click is on the roof
  //     if (intersects.length > 0 && intersects[0].object.name === "roof") {
  //       console.log("rotating roof");
  //       scene.remove(intersects[0].object);
  //       let extrusions: THREE.Mesh[] = [];
  //       let roofs: THREE.Mesh[] = [];

  //       // Toggle the roofToggleState between  0 and  1
  //       roofToggleState = roofToggleState === 0 ? 1 : 0;

  //       scene.traverse((child) => {
  //         if (child instanceof THREE.Mesh) {
  //           if (child.name === "roof") {
  //             roofs.push(child);
  //           }
  //           if (child.name === "extrusion") {
  //             extrusions.push(child);
  //           }
  //         }
  //         if (
  //           child instanceof CSS2DObject &&
  //           child.name === "rectangleRoofLabel"
  //         ) {
  //           child.element.style.pointerEvents = "none";
  //           child.visible = false;
  //         }
  //       });

  //       console.log("roofs", roofs);
  //       console.log("extrusions", extrusions);

  //       extrusions.forEach((extrusion) => {
  //         let hasRoof = roofs.some(
  //           (roof) =>
  //             extrusion.userData.currentPoint.x ===
  //               roof.userData.currentPoint.x ||
  //             extrusion.userData.currentPoint.y === roof.userData.currentPoint.y
  //         );
  //         if (!hasRoof) {
  //           createRoof(extrusion, scene, roofToggleState, 3);
  //         }
  //       });

  //       roofs = [];
  //       extrusions = [];
  //     }
  //     if (intersects.length > 0 && intersects[0].object.name === "shedRoof") {
  //       console.log("rotating shed roof");
  //       scene.remove(intersects[0].object);
  //       let extrusions: THREE.Mesh[] = [];
  //       let roofs: THREE.Mesh[] = [];

  //       // Toggle the roofToggleState between  0,  1,  2, and  3
  //       roofToggleState = (roofToggleState + 1) % 4;
  //       console.log(roofToggleState);

  //       scene.traverse((child) => {
  //         if (child instanceof THREE.Mesh) {
  //           if (child.name === "shedRoof") {
  //             roofs.push(child);
  //           }
  //           if (child.name === "extrusion") {
  //             extrusions.push(child);
  //           }
  //         }
  //         if (
  //           child instanceof CSS2DObject &&
  //           child.name === "rectangleRoofLabel"
  //         ) {
  //           child.element.style.pointerEvents = "none";
  //           child.visible = false;
  //         }
  //       });

  //       console.log("roofs", roofs);
  //       console.log("extrusions", extrusions);

  //       extrusions.forEach((extrusion) => {
  //         let hasRoof = roofs.some(
  //           (roof) =>
  //             extrusion.userData.currentPoint.x ===
  //               roof.userData.currentPoint.x ||
  //             extrusion.userData.currentPoint.y === roof.userData.currentPoint.y
  //         );
  //         if (!hasRoof) {
  //           createShedRoof(extrusion, scene, roofToggleState, 3);
  //         }
  //       });

  //       roofs = [];
  //       extrusions = [];
  //     }
  //   }
  // });

  // handles roof rotation, snap the roof to a different rotation.
  rotateRoofOrientationButton.domElement.addEventListener("mousedown", () => {
    setDrawingInProgressSwitch(false);
  });

  drawScaffoldButton.domElement.addEventListener("mousedown", () => {
    setPlaceScaffoldIndividually(false);
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

  observeElementAndAddEventListener("draw-scaffold", "mousedown", () => {
    setPlaceScaffoldIndividually(false);
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

  placeScaffoldButton.domElement.addEventListener("mousedown", async () => {
    setPlaceScaffoldIndividually(true);
  });

  generateScaffoldButton.domElement.addEventListener("mousedown", () => {
    generateScaffolding();
  });

  async function generateScaffolding() {
    const [bboxWireframe, scaffoldModeling] = await createScaffoldModel(
      1.57,
      2.0,
      0.73
    );
    scene.traverse((child) => {
      if (child instanceof THREE.Line && child.name === "scaffoldLine") {
        placeScaffoldModelsAlongLine(
          child,
          scene,
          scaffoldModeling,
          bboxWireframe
        );
      }
    });
  }

  generateScaffoldOutlineButton.domElement.addEventListener("mousedown", () => {
    scene.traverse((child: any) => {
      if (child instanceof THREE.Mesh && child.name === "blueprint") {
        generateScaffoldOutline(child, scene);
      }
    });
  });

  observeElementAndAddEventListener("generate-scaffolding", "mousedown", () => {
    generateScaffolding();
  });

  // autogenerate scaffolding
  observeElementAndAddEventListener(
    "autogenerate-scaffolding",
    "mousedown",
    () => {
      scene.traverse((child: any) => {
        if (child instanceof THREE.Mesh && child.name === "blueprint") {
          generateScaffoldOutline(child, scene);
        }
      });
      generateScaffolding();
    }
  );

  // reset all scaffolding
  observeElementAndAddEventListener("reset-scaffolding", "mousedown", () => {
    const scaffoldingObjectsToRemove: THREE.Object3D<THREE.Object3DEventMap>[] =
      [];
    scene.traverse((child) => {
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
  });

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
        raycaster
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
          raycaster
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

  // observeElementAndAddEventListener("top-view", "mousedown", () => {
  //   setIsDrawingBlueprint(false);
  // })

  // drawingButton.domElement.addEventListener("mousedown", () => {
  //   setIsDrawingBlueprint(false);
  //   setDrawingInProgressSwitch(true);
  // });

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

  document.addEventListener("mousedown", () => {
    scene.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        let shadowId: string;
        if (object.name === "cubeClone") {
          shadowId = object.uuid;
        } else if (object.name === "line") {
          shadowId = object.uuid;
        } else if (object.name === "blueprint") {
          shadowId = object.uuid;
        } else if (object.name === "extrusion") {
          shadowId = object.uuid;
        } else if (object.name === "scaffoldingModel") {
          shadowId = object.uuid;
        } else {
          // Skip if the object name is not one of the specified types
          return;
        }

        // Check if the shadow ID already exists in the set
        if (!shadowIds.has(shadowId)) {
          shadows.renderShadow([object], shadowId);
          shadowIds.add(shadowId); // Add the shadow ID to the set
        }
      }
    });
  });

  clearSceneButton.domElement.addEventListener("mousedown", () => {
    resetScene(scene, components, shadows);

    scaffoldPoints = [];
    points = [];
  });

  observeElementAndAddEventListener("reset-scene", "mousedown", () => {
    resetScene(scene, components, shadows);

    scaffoldPoints = [];
    points = [];
  });

  async function generateScaffoldExternalStaircaseModel() {
    const [bboxWireframe, scaffoldExternalStaircaseModeling] =
      await createScaffoldExternalStaircaseModel(1.57, 2.0, 0.73);
    return [bboxWireframe, scaffoldExternalStaircaseModeling];
  }

  testButton.domElement.addEventListener("mousedown", async () => {
    console.log("test button");
    calculateTotalAmountScaffoldingInScene(scene);
    calculateTotalSquareFootageForScaffolding(scene);
    loadSymbol(scene)
  });

  observeElementAndAddEventListener("cloth-sheet", "mousedown", () => {
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
    "delete-individual-scaffolding",
    "mousedown",
    () => {
      console.log("delete individual scaffolding");
      setDeletionIndividualScaffoldingInProgress(true);
      setDeletionScaffoldingColumnInProgress(false);
      setDrawingInProgress(false);
      setDeletionInProgress(false);
      setEditingBlueprint(false);
      setDrawingScaffoldingInProgress(false);
    }
  );

  observeElementAndAddEventListener(
    "delete-row-scaffolding",
    "mousedown",
    () => {
      console.log("delete row of scaffolding");
      setDeletionScaffoldingRowInProgress(true);
      setDeletionScaffoldingColumnInProgress(false);
      setDeletionIndividualScaffoldingInProgress(false);
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
      setDeletionIndividualScaffoldingInProgress(false);
      setDrawingInProgress(false);
      setDeletionInProgress(false);
      setEditingBlueprint(false);
      setDrawingScaffoldingInProgress(false);
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
      setReplaceScaffoldingColumnInProgress(true);
    }
  );

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

  animate();
};
