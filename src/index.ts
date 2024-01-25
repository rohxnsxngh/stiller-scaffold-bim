import * as THREE from "three";
import * as OBC from "openbim-components";
import { createSimple2DScene, drawingInProgress } from "./utilities/toolbar";
import { CustomGrid } from "./utilities/customgrid";
import { createLighting } from "./utilities/lighting";
// import { TransformControls } from "three/addons/controls/TransformControls.js";
// import { ShapeUtils } from "three";

let intersects: any, components: OBC.Components;
let drawingButtonBool = false;

export const createModelView = () => {
  const container = document.getElementById("model");
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

  const planeGeometry = new THREE.PlaneGeometry(100, 100);
  const planeMaterial = new THREE.MeshStandardMaterial({
    color: "purple",
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

  components.meshes.push(cube);
  components.meshes.push(plane);
  components.meshes.push(highlightMesh);

  const extrudeButton = createSimple2DScene(components, cube);

  const drawingButton = document.querySelector("#drawing-button");
  drawingButton?.addEventListener("click", () => {
    console.log("hello hello hello");
    drawingButtonBool = !drawingButtonBool;
  });

  const mousePosition = new THREE.Vector2();
  const raycaster = new THREE.Raycaster();

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
            console.error("extrusion raycasting");
            break;
          case "blueprint":
            console.error("blueprint raycasting")
            break;
        }
        // if (intersect.object.name === "extrusions")
      });
      // if (intersects.length > 0) {
      //   switch (intersect.object.name) {
      //     case 'extrusion':
      //       console.error("hello extrusion")
      //       break;
      //   }
      // }
    }
  });

  let points: THREE.Vector3[] = [];

  window.addEventListener("mousedown", function () {
    if (drawingInProgress) {
      intersects.forEach(function (intersect: any) {
        if (intersect.object.name === "ground") {
          points.push(
            new THREE.Vector3(
              highlightMesh.position.x,
              0,
              highlightMesh.position.z
            )
          );
          console.log(points);
          const cubeClone = cube.clone();
          cubeClone.position.set(
            highlightMesh.position.x,
            0.5,
            highlightMesh.position.z
          );
          cubeClone.name = "cubeClone";
          scene.add(cubeClone);

          // Create line segments
          const geometry = new THREE.BufferGeometry().setFromPoints(points);
          const material = new THREE.LineBasicMaterial({ color: 0x00ff00 });
          const line = new THREE.Line(geometry, material);
          scene.add(line);
        }
      });
    }
    if (!drawingInProgress && points.length > 1) {
      console.log("ready for extrusions");

      if (
        points[0].x === points[points.length - 1].x &&
        points[0].z === points[points.length - 1].z
      ) {
        scene.traverse((child) => {
          if (child instanceof THREE.Mesh && child.name === "highlightMesh") {
            scene.remove(child);
          }
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
            color: 0xff0000,
            side: THREE.DoubleSide,
          });
          const meshShape = new THREE.Mesh(geometryShape, materialShape);
          meshShape.rotateX(Math.PI / 2);
          meshShape.name = "blueprint";
          meshShape.userData = points;
          scene.add(meshShape);

          // createExtrusionFromBlueprint(shape, scene)
        }

        //Empty Points
        points = [];
      }
    } else {
      console.log("you must complete the polygon to extrude it");
    }
  });

  extrudeButton.domElement.addEventListener("mousedown", () => {
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh && child.name === "blueprint") {
        // scene.remove(child);
        console.log(child);
        createExtrusionFromBlueprint(child.userData, scene);
      }
    });
    // createExtrusionFromBlueprint(shape, scene)
  });

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

function createExtrusionFromBlueprint(blueprintPoints, scene) {
  console.log("extrude");
  let shape = new THREE.Shape();
  shape.moveTo(blueprintPoints[0].x, blueprintPoints[0].z);
  for (let i = 1; i < blueprintPoints.length; i++) {
    shape.lineTo(blueprintPoints[i].x, blueprintPoints[i].z);
  }
  shape.lineTo(blueprintPoints[0].x, blueprintPoints[0].z); // close the shape
  // createExtrusionFromBlueprint(shape)
  const extrudeSettings = {
    depth: -12,
    bevelEnabled: false, // You can enable beveling if needed
  };

  // Create extruded geometry
  const geometryExtrude = new THREE.ExtrudeGeometry(shape, extrudeSettings);

  // Material for the extruded mesh
  const materialExtrude = new THREE.MeshBasicMaterial({
    color: 0xff0000,
    side: THREE.DoubleSide,
  });

  // Create the mesh with the extruded geometry
  const meshExtrude = new THREE.Mesh(geometryExtrude, materialExtrude);
  meshExtrude.rotateX(Math.PI / 2);
  // meshExtrude.position.y = 1;
  meshExtrude.name = "extrusion";
  scene.add(meshExtrude);

  console.log(meshExtrude);
}
