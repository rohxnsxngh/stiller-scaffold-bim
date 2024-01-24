import * as THREE from "three";
import * as OBC from "openbim-components";
import { createSimple2DScene } from "./utilities/simple2Dscene";

let intersects, components;

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

  const geometry = new THREE.BoxGeometry(3, 3, 3);
  const material = new THREE.MeshStandardMaterial({ color: "purple" });
  const cube = new THREE.Mesh(geometry, material);
  cube.position.set(0, 1.5, 0);
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
  scene.add(highlightMesh);

  components.meshes.push(cube);
  components.meshes.push(plane);
  components.meshes.push(highlightMesh);

  const mousePosition = new THREE.Vector2();
  const raycaster = new THREE.Raycaster();
  let intersects;

  window.addEventListener("mousemove", function (e) {
    mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1;
    mousePosition.y = -(e.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mousePosition, components.camera.activeCamera);
    intersects = raycaster.intersectObjects(scene.children);
    intersects.forEach(function (intersect) {
      if ((intersect.object.name = "ground")) {
        const highlightPos = new THREE.Vector3()
          .copy(intersect.point)
          .floor()
          .addScalar(0.5);
        highlightMesh.position.set(highlightPos.x, 0, highlightPos.z);
      }
    });
  });

  console.log(components);

  //   console.log(components.camera.activeCamera)

  const shadows = new OBC.ShadowDropper(components);
  shadows.shadowExtraScaleFactor = 15;
  shadows.darkness = 2;
  shadows.shadowOffset = 0.1;
  // shadows.renderShadow([cube], "example");
  shadows.renderShadow([cube], "example2");


  //   const frustum = new THREE.Frustum();

  //////////////////////
  // createSimple2DScene(components, cube);
  //////////////////////

  //   const dimensions = new OBC.AreaMeasurement(components);
  //   dimensions.enabled = true;
  //   dimensions.snapDistance = 1;

  //   container.ondblclick = () => dimensions.create();
  //   container.oncontextmenu = () => dimensions.endCreation();


  components.camera.controls.setLookAt(10, 10, 10, 0, 0, 0);

  function animate() {
    requestAnimationFrame(animate);
    // console.log("hello")
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

// window.onmousemove = () => {
//   const result = components.raycaster.castRay(plane);
//   console.log(result)
// };

// function onMouseMove(event) {
//     // calculate mouse position in normalized device coordinates (-1 to +1) for both components
//     mousePosition.x = (event.clientX / window.innerWidth) * 2 - 1;
//     mousePosition.y = -(event.clientY / window.innerHeight) * 2 + 1;
// }

// function onWindowResize() {
//   camera.aspect = window.innerWidth / window.innerHeight;
//   camera.updateProjectionMatrix();

//   renderer.setSize(window.innerWidth, window.innerHeight);

//   render();
// }
