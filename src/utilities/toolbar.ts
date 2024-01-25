import * as OBC from "openbim-components";
import * as THREE from "three";

export let drawingInProgress = false;

export const setDrawingInProgress = (value: boolean) => {
  drawingInProgress = value;
};

export const createSimple2DScene = (
  components: OBC.Components,
  plane: THREE.Mesh
) => {
  const simple2dScene = new OBC.Simple2DScene(components);
  console.log(simple2dScene);
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
  canvasUI.domElement as HTMLCanvasElement;
  window.ondblclick = () => {
    simple2dScene.scaleY += 0.1;
  };

  const mainWindow = new OBC.FloatingWindow(components);
  components.ui.add(mainWindow);
  mainWindow.visible = false;
  mainWindow.domElement.style.height = "20rem";
  mainWindow.addChild(simple2dScene.uiElement.get("container"));
  mainWindow.onResized.add(() => simple2dScene.grid.regenerate());
  // @ts-ignore
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

  const sideToolBar = new OBC.Toolbar(components);
  sideToolBar.position = "right";
  components.ui.addToolbar(sideToolBar);
  sideToolBar.addChild(mainButton);
  sideToolBar.domElement.addEventListener("mouseleave", () => {
    setDrawingInProgress(true);
  });

  const alertButton = new OBC.Button(components);
  alertButton.materialIcon = "info";
  alertButton.tooltip = "Information";
  alertButton.id = "alert-button";
  mainToolbar.addChild(alertButton);
  alertButton.onClick.add(() => {
    alert("I've been clicked!");
  });

  // Start Drawing Blueprint
  const drawingButton = new OBC.Button(components);
  drawingButton.materialIcon = "draw";
  drawingButton.tooltip = "Draw Blueprint";
  drawingButton.id = "drawing-button";
  mainToolbar.addChild(drawingButton);
  drawingButton.onClick.add(() => {
    setDrawingInProgress(true);
  });

  //Solidify Blueprint
  const blueprintButton = new OBC.Button(components);
  blueprintButton.materialIcon = "view_in_ar";
  blueprintButton.tooltip = "Blueprint Shape";
  blueprintButton.id = "blueprint-button";
  sideToolBar.addChild(blueprintButton);
  blueprintButton.onClick.add(() => {
    setDrawingInProgress(false);
  });
  blueprintButton.domElement.addEventListener("mouseover", () => {
    setDrawingInProgress(false);
  });

  // Create Extrusion from Blueprint
  const extrusionButton = new OBC.Button(components);
  extrusionButton.materialIcon = "expand";
  extrusionButton.tooltip = "Extrude Shape";
  extrusionButton.id = "extrusion-button";
  sideToolBar.addChild(extrusionButton);
  extrusionButton.onClick.add(() => {
    setDrawingInProgress(false);
  });
  extrusionButton.domElement.addEventListener("mouseover", () => {
    setDrawingInProgress(false);
  });

  return extrusionButton;
};
