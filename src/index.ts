import * as THREE from "three";
import * as OBC from "openbim-components";
import {
  createShapeIsOutlined,
  createBlueprintFromShapeOutline,
  createExtrusionFromBlueprint,
  createRectangle,
} from "./utilities/mesh";
import {
  createSimple2DScene,
  drawingInProgress,
  setDrawingInProgress,
} from "./utilities/toolbar";
import { CustomGrid } from "./utilities/customgrid";
import { createLighting } from "./utilities/lighting";
import {
  CSS2DObject,
  CSS2DRenderer,
} from "three/examples/jsm/renderers/CSS2DRenderer.js";
// import { TransformControls } from "three/addons/controls/TransformControls.js";
// import { ShapeUtils } from "three";

let intersects: any, components: OBC.Components;
let rectangleBlueprint: any;
// let selectedLine: any;

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
  scene.add(markupGroup);

  // Base plane: need to change the size of the plane to be bigger
  const planeGeometry = new THREE.PlaneGeometry(100, 100);
  const planeMaterial = new THREE.MeshStandardMaterial({
    color: "red",
    side: THREE.DoubleSide,
    visible: false,
  }); // add visible: false to remove from visibility
  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  // plane.position.set(0, 0 ,0)
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
    extrudeButton,
    blueprintButton,
    createBlueprintRectangleButton,
    freeRotateButton,
  ] = createSimple2DScene(components, scene, cube);

  const mousePosition = new THREE.Vector2();
  const raycaster = new THREE.Raycaster();

  const cssRenderer = new CSS2DRenderer();
  cssRenderer.setSize(window.innerWidth, window.innerHeight);
  cssRenderer.domElement.style.position = "relative";
  cssRenderer.domElement.style.top = "0";
  document.body.appendChild(cssRenderer.domElement);

  const labelPanel = document.getElementById("label");
  if (!labelPanel) {
    throw new Error("Label panel not found");
  }
  labelPanel.style.visibility = "hidden";
  const pTag = labelPanel.querySelector("p");
  if (!pTag) {
    throw new Error("Label Paragraph Button not found");
  }
  pTag.addEventListener("mousedown", () => {
    setDrawingInProgress(false);
  });
  const label = new CSS2DObject(labelPanel);
  label.position.set(0, 0, 0);
  console.log("label", label);
  scene.add(label);

  labelPanel.addEventListener("mouseenter", () => {
    setDrawingInProgress(true);
  });
  labelPanel.addEventListener("mouseleave", () => {
    setDrawingInProgress(true);
  });

  const labelButton = document.getElementById("label-enter");
  if (!labelButton) {
    throw new Error("Label Enter Button not found");
  }
  labelButton.addEventListener("mousedown", () => {
    const newMeasurement = labelPanel.textContent;
    if (newMeasurement !== null) {
      const newLength = parseFloat(newMeasurement);
      console.log(newLength);
      console.log(newMeasurement);
    }
  });

  // Set pointer-events to none initially
  labelPanel.style.pointerEvents = "none";

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
            console.log("extrusion raycasting");
            // const ExtrudePos = new THREE.Vector3().copy(intersect.point);
            // const depth =
            //   intersect.object.geometry.parameters.options.depth * -1;
            // labelPanel.style.visibility = "visible";
            // let pTag = labelPanel.querySelector("p");
            // if (pTag !== null) {
            //   pTag.textContent = `${depth} m.`;
            // }
            // label.position.set(ExtrudePos.x, 0, ExtrudePos.z);
            // labelPanel.style.pointerEvents = "auto";
            break;
          case "blueprint":
            // console.log("blueprint raycasting");
            // const BlueprintPos = new THREE.Vector3().copy(intersect.point);
            // labelPanel.style.visibility = "visible";
            // labelPanel.textContent = "Blueprint";
            // label.position.set(BlueprintPos.x, 0, BlueprintPos.z);
            // labelPanel.style.pointerEvents = "auto";
            break;
          case "line":
            // console.log("line")
            // const selectedLine = intersect.object;
            const length = intersect.object.userData.length;
            const LinePos = new THREE.Vector3().copy(intersect.point);
            labelPanel.style.visibility = "visible";
            labelPanel.style.pointerEvents = "auto";
            pTag.textContent = `${length} m.`;
            label.position.set(LinePos.x - 0.5, 0, LinePos.z - 0.5);
            break;
          case "cubeClone":
            // console.log("cube")
            labelPanel.style.visibility = "hidden";
            labelPanel.style.pointerEvents = "none";
            break;
          case "rectangleLine":
            console.log(
              intersect.object.userData.width,
              intersect.object.userData.height
            );
            break;
        }
      });
    } else {
      labelPanel.style.pointerEvents = "none";
    }
  });

  let points: THREE.Vector3[] = [];

  document.addEventListener("mousedown", () => {
    if (drawingInProgress) {
      // create blueprint on screen after the shape has been outlined by the user
      createShapeIsOutlined(intersects, points, highlightMesh, scene, cube);
    }
  });

  blueprintButton.domElement.addEventListener("mousedown", function () {
    if (!drawingInProgress && points.length > 1) {
      // create extrusion from the blueprint after it has been created
      points = createBlueprintFromShapeOutline(points, scene);
    }
    if (rectangleBlueprint) {
      points = createBlueprintFromShapeOutline(
        rectangleBlueprint.userData.rectanglePoints,
        scene
      );
    }
  });

  // create extrusion once from Blueprint THREE.Shape which has been stored in mesh.userData
  extrudeButton.domElement.addEventListener("mousedown", () => {
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

  function handleMouseMove(event: MouseEvent) {
    if (!drawingInProgress && isDrawingBlueprint) {
      if (isDragging) {
        getMousePointer({ event });
        rectangleBlueprint = createRectangle(
          { start: markupStartPoint, end: markupMouse },
          markupGroup,
          markup,
          components,
          plane,
          raycaster
        );
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

  /////////////////////

  const shadows = new OBC.ShadowDropper(components);
  shadows.shadowExtraScaleFactor = 15;
  shadows.darkness = 2;
  shadows.shadowOffset = 0.1;
  shadows.renderShadow([cube], "example2");

  // @ts-ignore
  components.camera.controls.setLookAt(10, 10, 10, 0, 0, 0);

  function animate() {
    requestAnimationFrame(animate);
  }

  animate();
};
