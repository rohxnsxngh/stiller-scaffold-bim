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

  const boxMaterial = new THREE.MeshStandardMaterial({ color: "#6528D7" });
  const boxGeometry = new THREE.BoxGeometry(3, 3, 3);
  const cube = new THREE.Mesh(boxGeometry, boxMaterial);
  cube.position.set(0, 1.5, 0);
  scene.add(cube);

  const shadows = new OBC.ShadowDropper(components);
  shadows.shadowExtraScaleFactor = 15;
  shadows.darkness = 2;
  shadows.shadowOffset = 0.1;
  shadows.renderShadow([cube], "example");

  components.scene.setup();

  // Assuming you have an array of points representing the 2D shape
  let points = [
    [0, 0],
    [1, 0],
    [1, 1],
    [0, 1],
  ];

  // Convert the 2D shape to a 3D shape
  let geometry = new THREE.ExtrudeGeometry(new THREE.Shape(points), {
    depth: 10, // Depth of the extrusion
    bevelEnabled: false,
  });

  let material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  let mesh = new THREE.Mesh(geometry, material);

  scene.add(mesh);

  //   components.camera.controls.setLookAt(10, 10, 10, 0, 0, 0);
};

class CustomGrid extends OBC.SimpleGrid {
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
