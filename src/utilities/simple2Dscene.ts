import * as OBC from "openbim-components";
import * as THREE from "three";
import { Vector2 } from "three";

let drawingShape = false;
let shapeVertices: Vector2[] | undefined = [];
export const createSimple2DScene = (
  components: OBC.Components,
  plane: THREE.Mesh
) => {
  const simple2dScene = new OBC.Simple2DScene(components);
  console.log(simple2dScene)
  const scene2d = simple2dScene.get();
  scene2d.add(plane);
  const directionalLight2 = new THREE.DirectionalLight();
  directionalLight2.position.set(5, 10, 3);
  directionalLight2.intensity = 0.5;
  scene2d.add(directionalLight2);
  const ambientLight2 = new THREE.AmbientLight();
  ambientLight2.intensity = 0.5;
  scene2d.add(ambientLight2);
  const canvasUI = simple2dScene.uiElement.get("container");
  const canvas = canvasUI.domElement as HTMLCanvasElement;
  window.ondblclick = () => {
    simple2dScene.scaleY += 0.1;
  };

  const mainWindow = new OBC.FloatingWindow(components);
  components.ui.add(mainWindow);
  mainWindow.visible = false;
  mainWindow.domElement.style.height = "20rem";
  mainWindow.addChild(simple2dScene.uiElement.get("container"));
  mainWindow.onResized.add(() => simple2dScene.grid.regenerate());
  components.renderer.onAfterUpdate.add(() => {
    if (mainWindow.visible) {
      simple2dScene.update();
    }
  });
  mainWindow.slots.content.domElement.style.padding = "0";
  mainWindow.slots.content.domElement.style.overflow = "hidden";
  mainWindow.onResized.add(() => {
    const { width, height } = mainWindow.containerSize;
    simple2dScene.setSize(height, width);
  });
  mainWindow.domElement.style.width = "20rem";
  mainWindow.domElement.style.height = "20rem";
  mainWindow.onVisible.add(() => {
    if (mainWindow.visible) {
      simple2dScene.grid.regenerate();
    }
  });
  const mainButton = new OBC.Button(components);
  mainButton.materialIcon = "fact_check";
  mainButton.tooltip = "2D scene";
  mainButton.onClick.add(() => {
    mainWindow.visible = !mainWindow.visible;
  });
  const mainToolbar = new OBC.Toolbar(components);
  components.ui.addToolbar(mainToolbar);
  mainToolbar.addChild(mainButton);

  // console.log(mainWindow);
  const raycaster = new THREE.Raycaster()

  canvas.addEventListener("click", (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Create a 2D vector representing the mouse position
    const mousePosition = new THREE.Vector2(x, y);
    
    raycaster.setFromCamera(mousePosition, simple2dScene.camera)
    const intersects = raycaster.intersectObject(plane)
    console.log(intersects)

});
};
