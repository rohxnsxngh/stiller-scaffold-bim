import * as OBC from "openbim-components";
import { Vector2 } from "three";

let drawingShape = false;
let shapeVertices: Vector2[] | undefined = [];
export const createSimple2DScene = (
  components: OBC.Components,
  cube: THREE.Mesh
) => {
  const simple2dScene = new OBC.Simple2DScene(components);
  const scene2d = simple2dScene.get();
  scene2d.add(cube);
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
  mainWindow.domElement.style.width = "60rem";
  mainWindow.domElement.style.height = "60rem";
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

  console.log(mainWindow)

  canvas.addEventListener("mousedown", (event) => {
    drawingShape = true;
    shapeVertices = [];
  });

  canvas.addEventListener("mousemove", (event) => {
    if (drawingShape) {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      console.log(x, y)
    //   shapeVertices.push(new THREE.Vector2(x, y));
    }
  });

//   canvas.addEventListener("mouseup", (event) => {
//     if (drawingShape) {
//       drawingShape = false;
//       // Create a shape with the collected vertices
//       const shape = new THREE.Shape(shapeVertices);
//       // Create a geometry from the shape
//       const geometry = new THREE.ShapeBufferGeometry(shape);
//       // Create a mesh from the geometry
//       const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
//       const mesh = new THREE.Mesh(geometry, material);
//       // Add the mesh to the scene
//       scene.add(mesh);
//     }
//   });
};
