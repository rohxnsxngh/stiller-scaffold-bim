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
} from "./utilities/mesh";
import {
  createScaffoldingShapeIsOutlined,
  createScaffoldModel,
  placeScaffoldModelsAlongLine,
} from "./utilities/scaffold";
import {
  createToolbar,
  drawingInProgress,
  drawingScaffoldingInProgress,
  deletionInProgress,
} from "./utilities/toolbar";
import { CustomGrid } from "./utilities/customgrid";
import { createLighting } from "./utilities/lighting";
import {
  CSS2DObject,
  CSS2DRenderer,
} from "three/examples/jsm/renderers/CSS2DRenderer.js";
import { calculateTransformedBoundingBox, createBoundingBoxVisualizationFromBox } from "./utilities/helper";

let intersects: any, components: OBC.Components;
let rectangleBlueprint: any;
let labels: any;
let roofToggleState: number = 0;
let placeScaffoldIndividually: boolean = false;
// let selectedLine: any;

const stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
// document.body.appendChild(stats.dom);

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

  // Scene
  const scene = components.scene.get();

  // Lighting
  createLighting(scene);

  // Grid
  new CustomGrid(components, new THREE.Color("#FF0000")); // Red color

  // Add some elements to the scene
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshStandardMaterial({ color: "purple" });
  const cube = new THREE.Mesh(geometry, material);
  cube.position.set(0, 0.5, 0);
  // scene.add(cube);

  // for the blueprint rectangle
  const markupGroup = new THREE.Group();
  markupGroup.name = "markupGroup";
  scene.add(markupGroup);

  // Base plane: need to change the size of the plane to be bigger
  const planeGeometry = new THREE.PlaneGeometry(100, 100);
  const planeMaterial = new THREE.MeshStandardMaterial({
    color: "red",
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
    createBlueprintRectangleButton,
    freeRotateButton,
    drawingButton,
    createGableRoofButton,
    createShedRoofButton,
    createEditExtrusionButton,
    rotateRoofOrientationButton,
    drawScaffoldButton,
    placeScaffoldButton,
    generateScaffoldButton,
    createExtrusionButton,
  ] = createToolbar(components, scene);

  const mousePosition = new THREE.Vector2();
  const raycaster = new THREE.Raycaster();

  const cssRenderer = new CSS2DRenderer();
  cssRenderer.setSize(window.innerWidth, window.innerHeight);
  cssRenderer.domElement.style.position = "relative";
  cssRenderer.domElement.style.top = "0";
  document.body.appendChild(cssRenderer.domElement);

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
            highlightMesh.material.color.set(0x00ff00);
            break;
        }
      });
    }
  });

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
            if (deletionInProgress) {
              window.addEventListener("mousedown", () => {
                intersect.object.geometry.dispose();
                scene.remove(intersect.object);
              });
            }
            break;
          case "roof":
            console.log("roof");
            // implementation of delete button
            // TODO tweak so that it only grabs one object
            if (deletionInProgress) {
              window.addEventListener("mousedown", () => {
                intersect.object.geometry.dispose();
                scene.remove(intersect.object);
              });
            }
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
  let drawingInProgressSwitch: boolean = true;

  document.addEventListener("mousedown", () => {
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
  });

  blueprintButton.domElement.addEventListener("mousedown", function () {
    if (!drawingInProgress && points.length > 1) {
      // create extrusion from the blueprint after it has been created
      points = createBlueprintFromShapeOutline(points, scene);
    }
    if (rectangleBlueprint) {
      points = createBlueprintFromShapeOutline(
        markupGroup.children[0].userData.rectanglePoints,
        scene
      );
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
        Object.is(blueprint.userData, extrusion.userData)
      );
      if (!hasExtrusion) {
        createExtrusionFromBlueprint(blueprint.userData, scene);
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

    console.log("roofs", roofs);
    console.log("extrusions", extrusions);

    extrusions.forEach((extrusion) => {
      let hasRoof = roofs.some(
        (roof) =>
          extrusion.userData.currentPoint.x === roof.userData.currentPoint.x ||
          extrusion.userData.currentPoint.y === roof.userData.currentPoint.y
      );
      if (!hasRoof) {
        createRoof(extrusion, scene, 0);
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

    console.log("roofs", roofs);
    console.log("extrusions", extrusions);

    extrusions.forEach((extrusion) => {
      let hasRoof = roofs.some(
        (roof) =>
          extrusion.userData.currentPoint.x === roof.userData.currentPoint.x ||
          extrusion.userData.currentPoint.y === roof.userData.currentPoint.y
      );
      if (!hasRoof) {
        createShedRoof(extrusion, scene, 0);
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
            console.log(originalExtrusionHeight);
          });
          child.element.addEventListener("blur", () => {
            editedExtrusionHeight = parseFloat(
              child.element.textContent as unknown as string
            );
            const mesh = child.userData;
            console.log(roofs);
            roofs.forEach((roof) => {
              console.log(mesh.userData.currentPoint);
              console.log(roof.userData.currentPoint);
              if (
                mesh.userData.currentPoint.x === roof.userData.currentPoint.x ||
                mesh.userData.currentPoint.y === roof.userData.currentPoint.y
              ) {
                // extrudedRoof = roof;
                if (mesh) {
                  const transformedBoundingBox =
                    calculateTransformedBoundingBox(roof);
                  const boundingBox = createBoundingBoxVisualizationFromBox(
                    transformedBoundingBox
                  );
                  scene.add(boundingBox);
                  const roofBottomVertex = new THREE.Vector3(
                    transformedBoundingBox.min.x,
                    transformedBoundingBox.min.y,
                    transformedBoundingBox.min.z
                  );
                  // difference between the center of the roof and it's bounding box bottom
                  const deltaY = roof.position.y - roofBottomVertex.y;
                  const differenceDeltaY = deltaY + editedExtrusionHeight;

                  console.log("deltaY", deltaY)
                  console.log("roof position", roof.position)
                  console.log("roof current position", roof.userData.currentPoint)
                  console.log("roof bottom vertex", roofBottomVertex)
                  console.log("edited extrusion", editedExtrusionHeight)
                  console.log("difference delta Y", differenceDeltaY)

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

  // Add a mousedown event listener to the window or a specific element
  window.addEventListener("mousedown", () => {
    if (!drawingInProgressSwitch) {
      // Check if the click is on the roof
      if (intersects.length > 0 && intersects[0].object.name === "roof") {
        console.log("rotating roof");
        scene.remove(intersects[0].object);
        let extrusions: THREE.Mesh[] = [];
        let roofs: THREE.Mesh[] = [];

        // Toggle the roofToggleState between  0 and  1
        roofToggleState = roofToggleState === 0 ? 1 : 0;

        scene.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            if (child.name === "roof") {
              roofs.push(child);
            }
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

        console.log("roofs", roofs);
        console.log("extrusions", extrusions);

        extrusions.forEach((extrusion) => {
          let hasRoof = roofs.some(
            (roof) =>
              extrusion.userData.currentPoint.x ===
                roof.userData.currentPoint.x ||
              extrusion.userData.currentPoint.y === roof.userData.currentPoint.y
          );
          if (!hasRoof) {
            createRoof(extrusion, scene, roofToggleState);
          }
        });

        roofs = [];
        extrusions = [];
      }
      if (intersects.length > 0 && intersects[0].object.name === "shedRoof") {
        console.log("rotating shed roof");
        scene.remove(intersects[0].object);
        let extrusions: THREE.Mesh[] = [];
        let roofs: THREE.Mesh[] = [];

        // Toggle the roofToggleState between  0,  1,  2, and  3
        roofToggleState = (roofToggleState + 1) % 4;
        console.log(roofToggleState);

        scene.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            if (child.name === "shedRoof") {
              roofs.push(child);
            }
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

        console.log("roofs", roofs);
        console.log("extrusions", extrusions);

        extrusions.forEach((extrusion) => {
          let hasRoof = roofs.some(
            (roof) =>
              extrusion.userData.currentPoint.x ===
                roof.userData.currentPoint.x ||
              extrusion.userData.currentPoint.y === roof.userData.currentPoint.y
          );
          if (!hasRoof) {
            createShedRoof(extrusion, scene, roofToggleState);
          }
        });

        roofs = [];
        extrusions = [];
      }
    }
  });

  // handles roof rotation, snap the roof to a different rotation.
  rotateRoofOrientationButton.domElement.addEventListener("mousedown", () => {
    drawingInProgressSwitch = false;
  });

  drawScaffoldButton.domElement.addEventListener("mousedown", () => {
    if (drawingScaffoldingInProgress) {
      // create blueprint on screen after the shape has been outlined by the user
      console.log("creating scaffolding", scene);
      createScaffoldingShapeIsOutlined(
        intersects,
        points,
        highlightMesh,
        scene,
        cube
      );
    }
  });

  placeScaffoldButton.domElement.addEventListener("mousedown", () => {
    console.log("place scaffold individually");
    placeScaffoldIndividually = true;
  });

  generateScaffoldButton.domElement.addEventListener("mousedown", () => {
    console.log("generate scaffolding");
    generateScaffolding();
  });
  async function generateScaffolding() {
    const [bboxWireframe, scaffoldModeling] = await createScaffoldModel(1.57);
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

  //////////////////////////////////
  // this section pertains to creating the rectangle from the top view by clicking and dragging
  // need to organize and abstract the way this section is handled
  let isDragging = false;
  let isDrawingBlueprint = false;
  let markupMouse = new THREE.Vector2();
  let markupStartPoint: THREE.Vector2 | null = null;
  let markup: any = null;

  createBlueprintRectangleButton.domElement.addEventListener(
    "mousedown",
    () => {
      isDrawingBlueprint = true;
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

  function handleMouseUp() {
    isDragging = false;
  }

  function getMousePointer({ event }: { event: MouseEvent }) {
    markupMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    markupMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  }

  freeRotateButton.domElement.addEventListener("mousedown", () => {
    isDrawingBlueprint = false;
  });

  drawingButton.domElement.addEventListener("mousedown", () => {
    isDrawingBlueprint = false;
  });

  drawingButton.domElement.addEventListener("mousedown", () => {
    drawingInProgressSwitch = true;
  });

  /////////////////////

  const shadows = new OBC.ShadowDropper(components);
  shadows.shadowExtraScaleFactor = 15;
  shadows.darkness = 2;
  shadows.shadowOffset = 0.1;
  shadows.renderShadow([cube], "example2");

  // @ts-ignore
  components.camera.controls.setLookAt(10, 10, 10, 0, 0, 0);

  function animate() {
    stats.begin();
    requestAnimationFrame(animate);
    // cssRenderer.render(scene, components.camera.activeCamera)
    stats.end();
  }

  animate();
};
