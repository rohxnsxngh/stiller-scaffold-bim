import * as OBC from "openbim-components";
import * as THREE from "three";
import { gsap } from "gsap";
import {
  cameraDisableOrbitalFunctionality,
  cameraEnableOrbitalFunctionality,
  cameraPerspectiveView,
  cameraTopView,
} from "./camera";
export let drawingInProgress = false;

export const setDrawingInProgress = (value: boolean) => {
  drawingInProgress = value;
};

export const createSimple2DScene = (
  components: OBC.Components,
  scene: THREE.Scene,
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

  console.log(components.camera)

  // Move camera to top view button
  const topViewButton = new OBC.Button(components);
  topViewButton.materialIcon = "crop_free";
  topViewButton.tooltip = "Top View";
  topViewButton.id = "delete-button";
  mainToolbar.addChild(topViewButton);
  topViewButton.onClick.add(() => {
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh && child.name === "highlightMesh") {
        scene.remove(child);
      }
    });
    cameraTopView(gsap, components.camera);
    setDrawingInProgress(false);
  });
  topViewButton.domElement.addEventListener("mouseover", () => {
    setDrawingInProgress(false);
  });

  const createBlueprintRectangleButton = new OBC.Button(components, {
    materialIconName: "square",
    name: "Layout",
    closeOnClick: true,
  });
  createBlueprintRectangleButton.onClick.add(() => {
    document.body.style.cursor = "crosshair";
    setDrawingInProgress(false);
    cameraDisableOrbitalFunctionality(gsap, components.camera);
  });
  topViewButton.addChild(createBlueprintRectangleButton);

  // Move camera to perspective view button
  const perspectiveViewButton = new OBC.Button(components);
  perspectiveViewButton.materialIcon = "fullscreen_exit";
  perspectiveViewButton.tooltip = "Perspective View";
  perspectiveViewButton.id = "delete-button";
  mainToolbar.addChild(perspectiveViewButton);
  perspectiveViewButton.onClick.add(() => {
    document.body.style.cursor = "auto";
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh && child.name === "highlightMesh") {
        scene.remove(child);
      }
    });
    cameraPerspectiveView(gsap, components.camera);
    setDrawingInProgress(false);
  });
  perspectiveViewButton.domElement.addEventListener("mouseover", () => {
    setDrawingInProgress(false);
  });
  perspectiveViewButton.domElement.addEventListener("mouseleave", () => {
    setDrawingInProgress(true);
  });

  // Allow panning and rotating button
  const freeRotateButton = new OBC.Button(components);
  freeRotateButton.materialIcon = "pan_tool";
  freeRotateButton.tooltip = "Free Rotate";
  freeRotateButton.id = "delete-button";
  mainToolbar.addChild(freeRotateButton);
  freeRotateButton.onClick.add(() => {
    document.body.style.cursor = "grab";
    cameraEnableOrbitalFunctionality(gsap, components.camera);
    setDrawingInProgress(false);
  });
  freeRotateButton.domElement.addEventListener("mouseenter", () => {
    setDrawingInProgress(false);
  });

  // Start Drawing Blueprint
  const drawingButton = new OBC.Button(components);
  drawingButton.materialIcon = "polyline";
  drawingButton.tooltip = "Draw Blueprint";
  drawingButton.id = "drawing-button";
  mainToolbar.addChild(drawingButton);
  drawingButton.onClick.add(() => {
    document.body.style.cursor = "auto";
    setDrawingInProgress(true);
  });

  //Solidify Blueprint
  const blueprintButton = new OBC.Button(components);
  blueprintButton.materialIcon = "view_in_ar";
  blueprintButton.tooltip = "Blueprint Shape";
  blueprintButton.id = "blueprint-button";
  sideToolBar.addChild(blueprintButton);
  blueprintButton.onClick.add(() => {
    document.body.style.cursor = "auto";
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
    document.body.style.cursor = "auto";
    setDrawingInProgress(false);
  });
  extrusionButton.domElement.addEventListener("mouseover", () => {
    setDrawingInProgress(false);
  });

  const drawerToolBar = new OBC.Toolbar(components);
  drawerToolBar.position = "right";
  components.ui.addToolbar(drawerToolBar);
  drawerToolBar.domElement.style.position = "absolute";
  drawerToolBar.domElement.style.top = "40px";
  drawerToolBar.domElement.style.right = "10px";
  drawerToolBar.domElement.addEventListener("mouseleave", () => {
    document.body.style.cursor = "auto";
    setDrawingInProgress(true);
  });

  //Drawer Menu Button
  const drawerMenuButton = new OBC.Button(components);
  drawerMenuButton.materialIcon = "menu";
  drawerMenuButton.tooltip = "Menu";
  drawerMenuButton.id = "menu-button";
  drawerToolBar.addChild(drawerMenuButton);
  drawerMenuButton.onClick.add(() => {
    setDrawingInProgress(false);
    drawer.visible = !drawer.visible;
  });
  drawerMenuButton.domElement.addEventListener("mouseover", () => {
    setDrawingInProgress(true);
  });
  /////////////////////////////////////////////////////////
  // drawer element
  const drawer = new OBC.FloatingWindow(components);
  drawer.visible = false;
  drawer.domElement.style.position = "left";
  drawer.domElement.style.width = "20rem";
  drawer.domElement.style.height = "100vh";
  drawer.domElement.style.left = "0";
  drawer.domElement.style.top = "0";
  drawer.domElement.style.zIndex = "1000";
  drawer.domElement.style.backgroundColor = "#000000";
  drawer.domElement.style.boxShadow = "0px 0px 10px rgba(0, 0, 0, 0.5)";
  drawer.domElement.addEventListener("mouseover", () => {
    setDrawingInProgress(false);
  });
  drawer.domElement.addEventListener("mouseleave", () => {
    setDrawingInProgress(true);
  });
  components.ui.add(drawer);
  console.log(drawer);

  // Create a title
  const title = document.createElement("h1");
  title.textContent = "Drawer Title";
  drawer.domElement.appendChild(title);

  // Create a paragraph
  const paragraph = document.createElement("p");
  paragraph.textContent = "This is some text in the drawer.";
  drawer.domElement.appendChild(paragraph);

  // Create a button
  const button = new OBC.Button(components);
  button.materialIcon = "info";
  button.tooltip = "Info";
  button.id = "info-button";
  drawer.domElement.appendChild(button.domElement);

  // Attach an onClick event handler to the button
  button.onClick.add(() => {
    console.log("Hello button");
    window.location.href = "/home";
  });
  ////////////////////////////////////////////////
  return [extrusionButton, blueprintButton, createBlueprintRectangleButton, freeRotateButton, drawingButton];
};
