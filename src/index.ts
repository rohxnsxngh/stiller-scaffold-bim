import * as THREE from "three";
import * as OBC from "openbim-components";
import {
  createSimple2DScene,
  drawingInProgress,
} from "./utilities/simple2Dscene";
import { ShapeUtils } from "three";

let intersects: any, components: OBC.Components;
let extrusionButtonBool = false;
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

  // console.log(components.camera.activeCamera)

  const scene = components.scene.get();

  const directionalLight = new THREE.DirectionalLight();
  directionalLight.position.set(5, 10, 3);
  directionalLight.intensity = 0.5;
  scene.add(directionalLight);

  const ambientLight = new THREE.AmbientLight();
  ambientLight.intensity = 0.5;
  scene.add(ambientLight);

  // const grid = new OBC.SimpleGrid(components);
  const grid = new CustomGrid(components, new THREE.Color("#FF0000")); // Red color
  console.log(grid);

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
  highlightMesh.name = "highlightMesh"

  components.meshes.push(cube);
  components.meshes.push(plane);
  components.meshes.push(highlightMesh);

  createSimple2DScene(components, cube);

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
      raycaster.setFromCamera(mousePosition, components.camera.activeCamera);
      intersects = raycaster.intersectObjects(scene.children);
      intersects.forEach(function (intersect: any) {
        if (intersect.object.name === "ground") {
          const highlightPos = new THREE.Vector3()
            .copy(intersect.point)
            .floor()
            .addScalar(0.5);
          highlightMesh.position.set(highlightPos.x, 0, highlightPos.z);
        }
      });
    }
  });

  let points: THREE.Vector3[] = [];

  // window.addEventListener("mousedown", (event) =>
  //   createShape(intersects, points, highlightMesh, cube, scene)
  // );

  // let performExtrude = false;

  window.addEventListener("mousedown", function (e) {
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
        scene.add(meshShape);
      }
    }
  });

  console.log(components);

  //   console.log(components.camera.activeCamera)

  const shadows = new OBC.ShadowDropper(components);
  shadows.shadowExtraScaleFactor = 15;
  shadows.darkness = 2;
  shadows.shadowOffset = 0.1;
  // shadows.renderShadow([cube], "example");
  shadows.renderShadow([cube], "example2");

  components.camera.controls.setLookAt(10, 10, 10, 0, 0, 0);

  function animate() {
    requestAnimationFrame(animate);
    // console.log(drawingInProgress)
    // console.log(components._scene);
    // components.renderer.onBeforeUpdate.add(plane);
  }

  animate();
};

class CustomGrid extends OBC.SimpleGrid {
  size2: number | undefined;
  size1: number | undefined;
  color: THREE.ColorRepresentation | undefined;
  constructor(
    components: OBC.Components,
    color?: THREE.Color,
    size1?: number,
    size2?: number,
    distance?: number
  ) {
    super(components, color, size1, size2, distance);
  }

  protected createGrid() {
    const grid = new THREE.GridHelper(
      this.size1,
      this.size2,
      this.color,
      this.color
    );
    return grid;
  }
}

///////////////////////////////////////////////////////////////////
function createShape(
  intersects: any,
  points: any,
  highlightMesh: any,
  cube: any,
  scene: any
) {
  intersects.forEach(function (intersect: any) {
    if (intersect.object.name === "ground") {
      if (points.length < 5) {
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
        const material = new THREE.LineBasicMaterial({ color: 0xff0000 });
        const line = new THREE.Line(geometry, material);
        scene.add(line);
      } else {
        // Create rectangle
        let shape = new THREE.Shape();
        shape.moveTo(points[0].x, points[0].z);
        shape.lineTo(points[1].x, points[1].z);
        shape.lineTo(points[2].x, points[2].z);
        shape.lineTo(points[3].x, points[3].z);
        if (points[4].x != points[0].x || points[4].z != points[0].z) {
          console.error("must complete the shape");
        }
        shape.lineTo(points[4].x, points[4].y);

        let width: number, length: number;

        if (Math.abs(points[1].x - points[0].x) == 0) {
          width = Math.abs(points[1].z - points[0].z);
          length = Math.abs(points[2].x - points[1].x);

          // Create plane
          const geometryPlaneAdded = new THREE.Mesh(
            new THREE.PlaneGeometry(length + 1, width + 1),
            new THREE.MeshBasicMaterial({ side: THREE.DoubleSide })
          );
          geometryPlaneAdded.rotateX(-Math.PI / 2);
          geometryPlaneAdded.position.set(
            points[0].x + length / 2,
            0,
            points[0].z + width / 2
          );
          scene.add(geometryPlaneAdded);
        } else {
          width = Math.abs(points[1].x - points[0].x);
          length = Math.abs(points[2].z - points[1].z);

          // Create plane
          const geometryPlaneAdded = new THREE.Mesh(
            new THREE.PlaneGeometry(width + 1, length + 1),
            new THREE.MeshBasicMaterial({ side: THREE.DoubleSide })
          );
          geometryPlaneAdded.rotateX(-Math.PI / 2);
          geometryPlaneAdded.position.set(
            points[0].x + width / 2,
            0,
            points[0].z + length / 2
          );
          scene.add(geometryPlaneAdded);
        }

        console.log("width", width, "length", length);

        // Reset points
        points = [];
      }
    }
  });
}
