import * as THREE from "three";
import * as OBC from "openbim-components";

export const createModelView = () => {
  const container = document.getElementById("model");
  if (!container) {
    throw new Error("Container element not found");
  }

  const components = new OBC.Components();
  components.scene = new OBC.SimpleScene(components);
  components.renderer = new OBC.SimpleRenderer(components, container);
  components.camera = new OBC.SimpleCamera(components);
  components.raycaster = new OBC.SimpleRaycaster(components);

  components.init();

  const scene = components.scene.get();

  // const grid = new OBC.SimpleGrid(components);
  const grid = new CustomGrid(components, new THREE.Color("#FF0000")); // Red color

  // Add some elements to the scene

  const geometry = new THREE.BoxGeometry(3, 3, 3);
  const material = new THREE.MeshStandardMaterial({ color: "purple" });
  const cube = new THREE.Mesh(geometry, material);
  cube.position.set(0, 1.5, 0);
  scene.add(cube);

  const planeGeometry = new THREE.PlaneGeometry(10, 10);
  const planeMaterial = new THREE.MeshBasicMaterial({
    color: 0xffff00,
    side: THREE.DoubleSide,
  }); // add visible: false to remove from visibility
  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.rotateOnAxis(new THREE.Vector3(1, 0, 0), Math.PI / 2);
  scene.add(plane);

  //   components.meshes.push(cube);
  components.meshes.push(plane);

  const dimensions = new OBC.AreaMeasurement(components);
  dimensions.enabled = true;
  dimensions.snapDistance = 1;

  container.ondblclick = () => dimensions.create();
  container.oncontextmenu = () => dimensions.endCreation();

  const directionalLight = new THREE.DirectionalLight();
  directionalLight.position.set(5, 10, 3);
  directionalLight.intensity = 0.5;
  scene.add(directionalLight);

  const ambientLight = new THREE.AmbientLight();
  ambientLight.intensity = 0.5;
  scene.add(ambientLight);

  const shadows = new OBC.ShadowDropper(components);
  shadows.shadowExtraScaleFactor = 15;
  shadows.darkness = 2;
  shadows.shadowOffset = 0.1;
  shadows.renderShadow([cube], "example");

  components.camera.controls.setLookAt(10, 10, 10, 0, 0, 0);
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
