import * as OBC from "openbim-components";
import * as THREE from "three";
import { gsap } from "gsap";
import {
  cameraDisableOrbitalFunctionality,
  cameraEnableOrbitalFunctionality,
  cameraPerspectiveView,
  cameraTopView,
} from "./camera";
import deletePNG from "../assets/images/delete.png";
import { createSelect } from "./drawer";
import { resetScene } from "./helper";

export let drawingInProgress = false;
export let drawingScaffoldingInProgress = false;
export let deletionInProgress = false;

export const setDrawingInProgress = (value: boolean) => {
  drawingInProgress = value;
};

export const setDrawingScaffoldingInProgress = (value: boolean) => {
  drawingScaffoldingInProgress = value;
};

export const setDeletionInProgress = (value: boolean) => {
  deletionInProgress = value;
};

export const createToolbar = (
  components: OBC.Components,
  scene: THREE.Scene
) => {
  const mainWindow = new OBC.FloatingWindow(components);
  components.ui.add(mainWindow);
  mainWindow.visible = false;
  mainWindow.domElement.style.height = "20rem";
  mainWindow.slots.content.domElement.style.padding = "0";
  mainWindow.slots.content.domElement.style.overflow = "hidden";
  mainWindow.domElement.style.width = "20rem";
  mainWindow.domElement.style.height = "20rem";
  const mainToolbar = new OBC.Toolbar(components);
  components.ui.addToolbar(mainToolbar);

  const sideToolBar = new OBC.Toolbar(components);
  sideToolBar.position = "right";
  components.ui.addToolbar(sideToolBar);
  sideToolBar.domElement.addEventListener("mouseleave", () => {
    // setDrawingInProgress(false);
  });

  const alertButton = new OBC.Button(components);
  alertButton.materialIcon = "info";
  alertButton.tooltip = "Information";
  alertButton.id = "alert-button";
  mainToolbar.addChild(alertButton);
  alertButton.onClick.add(() => {
    alert("I've been clicked!");
  });

  console.log(components.camera);

  // Move camera to top view button
  const topViewButton = new OBC.Button(components);
  topViewButton.materialIcon = "crop_free";
  topViewButton.tooltip = "Draw Blueprint";
  topViewButton.id = "top-view-button";
  mainToolbar.addChild(topViewButton);
  topViewButton.onClick.add(() => {
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh && child.name === "highlightMesh") {
        scene.remove(child);
      }
    });
    cameraTopView(gsap, components.camera);
    setDrawingInProgress(false);
    setDrawingScaffoldingInProgress(false);
  });
  topViewButton.domElement.addEventListener("mouseover", () => {
    setDrawingInProgress(false);
    setDrawingScaffoldingInProgress(false);
  });

  const createBlueprintRectangleButton = new OBC.Button(components, {
    materialIconName: "square",
    name: "Layout",
    closeOnClick: true,
  });
  createBlueprintRectangleButton.onClick.add(() => {
    document.body.style.cursor = "crosshair";
    setDrawingInProgress(false);
    setDeletionInProgress(false);
    setDrawingScaffoldingInProgress(false);
    cameraDisableOrbitalFunctionality(gsap, components.camera);
  });
  topViewButton.addChild(createBlueprintRectangleButton);

  // Move camera to perspective view button
  const perspectiveViewButton = new OBC.Button(components);
  perspectiveViewButton.materialIcon = "fullscreen_exit";
  perspectiveViewButton.tooltip = "Perspective View";
  perspectiveViewButton.id = "perspective-button";
  mainToolbar.addChild(perspectiveViewButton);
  perspectiveViewButton.onClick.add(() => {
    document.body.style.cursor = "auto";
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh && child.name === "highlightMesh") {
        scene.remove(child);
      }
    });
    cameraPerspectiveView(gsap, components.camera);
    setDeletionInProgress(false);
    setDrawingInProgress(false);
  });
  perspectiveViewButton.domElement.addEventListener("mouseover", () => {
    setDrawingInProgress(false);
    setDrawingScaffoldingInProgress(false);
  });
  perspectiveViewButton.domElement.addEventListener("mouseleave", () => {
    setDrawingInProgress(true);
    setDrawingScaffoldingInProgress(false);
  });

  // Allow panning and rotating button
  const freeRotateButton = new OBC.Button(components);
  freeRotateButton.materialIcon = "pan_tool";
  freeRotateButton.tooltip = "Free Rotate";
  freeRotateButton.id = "rotate-button";
  mainToolbar.addChild(freeRotateButton);
  freeRotateButton.onClick.add(() => {
    document.body.style.cursor = "grab";
    cameraEnableOrbitalFunctionality(gsap, components.camera);
    setDeletionInProgress(false);
    setDrawingInProgress(false);
    setDrawingScaffoldingInProgress(false);
  });
  freeRotateButton.domElement.addEventListener("mouseenter", () => {
    setDrawingInProgress(false);
    setDrawingScaffoldingInProgress(false);
  });

  // Start Drawing Blueprint
  const drawingButton = new OBC.Button(components);
  drawingButton.materialIcon = "polyline";
  drawingButton.tooltip = "Polygon Sketch";
  drawingButton.id = "drawing-button";
  mainToolbar.addChild(drawingButton);
  drawingButton.onClick.add(() => {
    document.body.style.cursor = "auto";
    setDeletionInProgress(false);
    setDrawingInProgress(true);
    setDrawingScaffoldingInProgress(false);
  });

  const deleteObjectButton = new OBC.Button(components);
  deleteObjectButton.materialIcon = "delete_forever";
  deleteObjectButton.tooltip = "Delete Object";
  deleteObjectButton.id = "delete-button";
  mainToolbar.addChild(deleteObjectButton);
  deleteObjectButton.onClick.add(() => {
    document.body.style.cursor = `url(${deletePNG}), auto;`;
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh && child.name === "highlightMesh") {
        scene.remove(child);
      }
    });
    setDeletionInProgress(true);
    setDrawingInProgress(false);
    setDrawingScaffoldingInProgress(false);
  });
  deleteObjectButton.domElement.addEventListener("mouseover", () => {
    setDrawingInProgress(false);
    setDrawingScaffoldingInProgress(false);
  });
  deleteObjectButton.domElement.addEventListener("mouseleave", () => {
    setDrawingInProgress(true);
    setDrawingScaffoldingInProgress(false);
  });

  // Start Drawing Blueprint
  const clearSceneButton = new OBC.Button(components);
  clearSceneButton.materialIcon = "check_box_outline_blank";
  clearSceneButton.tooltip = "Reset Scene";
  clearSceneButton.id = "drawing-button";
  mainToolbar.addChild(clearSceneButton);
  clearSceneButton.onClick.add(() => {
    document.body.style.cursor = "auto";
    resetScene(scene);
    setDeletionInProgress(false);
    setDrawingInProgress(true);
    setDrawingScaffoldingInProgress(false);
  });
  clearSceneButton.domElement.addEventListener("mouseover", () => {
    setDrawingInProgress(false);
    setDrawingScaffoldingInProgress(false);
  });
  clearSceneButton.domElement.addEventListener("mouseleave", () => {
    setDrawingInProgress(true);
    setDrawingScaffoldingInProgress(false);
  });

  //Solidify Blueprint
  const blueprintButton = new OBC.Button(components);
  blueprintButton.materialIcon = "dashboard";
  blueprintButton.tooltip = "Blueprint";
  blueprintButton.id = "blueprint-button";
  sideToolBar.addChild(blueprintButton);
  blueprintButton.onClick.add(() => {
    document.body.style.cursor = "auto";
    setDrawingInProgress(false);
    setDeletionInProgress(false);
    setDrawingScaffoldingInProgress(false);
  });
  blueprintButton.domElement.addEventListener("mouseover", () => {
    setDrawingInProgress(false);
    setDrawingScaffoldingInProgress(false);
  });

  // Create Extrusion from Blueprint
  const extrusionButton = new OBC.Button(components);
  extrusionButton.materialIcon = "view_in_ar";
  extrusionButton.tooltip = "Extrude";
  extrusionButton.id = "extrusion-button";
  sideToolBar.addChild(extrusionButton);
  extrusionButton.onClick.add(() => {
    document.body.style.cursor = "auto";
    setDrawingInProgress(false);
    setDeletionInProgress(false);
    setDrawingScaffoldingInProgress(false);
  });
  extrusionButton.domElement.addEventListener("mouseover", () => {
    setDrawingInProgress(false);
    setDrawingScaffoldingInProgress(false);
  });

  const createExtrusionButton = new OBC.Button(components, {
    materialIconName: "expand",
    name: "Create Extrusion",
    closeOnClick: true,
  });
  createExtrusionButton.onClick.add(() => {
    document.body.style.cursor = "crosshair";
    setDrawingInProgress(false);
    setDeletionInProgress(false);
    setDrawingScaffoldingInProgress(false);
    cameraDisableOrbitalFunctionality(gsap, components.camera);
  });
  extrusionButton.addChild(createExtrusionButton);

  const createEditExtrusionButton = new OBC.Button(components, {
    materialIconName: "unfold_less",
    name: "Edit Extrusion",
    closeOnClick: true,
  });
  createEditExtrusionButton.onClick.add(() => {
    document.body.style.cursor = "crosshair";
    setDrawingInProgress(false);
    setDeletionInProgress(false);
    setDrawingScaffoldingInProgress(false);
    cameraDisableOrbitalFunctionality(gsap, components.camera);
  });
  extrusionButton.addChild(createEditExtrusionButton);

  const roofButton = new OBC.Button(components);
  roofButton.materialIcon = "roofing";
  roofButton.tooltip = "Roof";
  roofButton.id = "roof-button";
  sideToolBar.addChild(roofButton);
  roofButton.onClick.add(() => {
    document.body.style.cursor = "auto";
    setDrawingInProgress(false);
    setDeletionInProgress(false);
    setDrawingScaffoldingInProgress(false);
  });
  roofButton.domElement.addEventListener("mouseover", () => {
    setDrawingInProgress(false);
    setDrawingScaffoldingInProgress(false);
  });

  const scaffoldButton = new OBC.Button(components);
  scaffoldButton.materialIcon = "foundation";
  scaffoldButton.tooltip = "Scaffolding";
  scaffoldButton.id = "scaffold-button";
  sideToolBar.addChild(scaffoldButton);
  scaffoldButton.onClick.add(() => {
    setDrawingInProgress(false);
    setDeletionInProgress(false);
    setDrawingScaffoldingInProgress(true);
  });
  scaffoldButton.domElement.addEventListener("mouseover", () => {
    setDrawingInProgress(false);
  });
  scaffoldButton.domElement.addEventListener("mouseleave", () => {
    setDrawingInProgress(false);
  });

  const rotateRoofOrientationButton = new OBC.Button(components, {
    materialIconName: "360",
    name: "Rotate Roof",
    closeOnClick: true,
  });
  rotateRoofOrientationButton.onClick.add(() => {
    document.body.style.cursor = "crosshair";
    setDrawingInProgress(false);
    cameraDisableOrbitalFunctionality(gsap, components.camera);
  });
  rotateRoofOrientationButton.domElement.addEventListener("mouseleave", () => {
    setDrawingInProgress(true);
  });
  roofButton.addChild(rotateRoofOrientationButton);

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
    updateTitle();
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

  // Function to update the title
  const updateTitle = () => {
    const titleElement = drawer.domElement.querySelector(
      "h3.text-3xl.text-ifcjs-200.font-medium.my-0"
    );
    if (titleElement) {
      titleElement.textContent = "Stiller";
      // @ts-ignore
      titleElement.classList =
        "text-3xl text-red-500 font-medium my-0 btn btn-ghost";
      titleElement.id = "drawerTitle";
      titleElement.addEventListener("mousedown", () => {
        window.location.href = "/home";
      });
    }
  };

  // Create a title 1/5
  const title1 = document.createElement("h1");
  title1.textContent = "1/5";
  // @ts-ignore
  title1.classList =
    "stacked-fractions text-red-500 text-2xl font-bold p-2 ml-4";
  drawer.domElement.appendChild(title1);

  // Example usage of the createSelect function
  // Example usage of the createSelect function with a custom default option text
  const selectOptions1 = ["Length", "Height", "Area"];
  const customDefaultOptionText1 = "Building Shape";
  const selectElement1 = createSelect(selectOptions1, customDefaultOptionText1);
  drawer.domElement.appendChild(selectElement1);

  // Create a title 2/5
  const title2 = document.createElement("h1");
  title2.textContent = "2/5";
  // @ts-ignore
  title2.classList =
    "stacked-fractions text-red-500 text-2xl font-bold p-2 ml-4";
  drawer.domElement.appendChild(title2);

  // Example usage of the createCollapse function
  // const collapseTitle = "Click me to show/hide content";
  // const collapseContent = "hello";
  // const collapse = createCollapse(collapseTitle, collapseContent);
  // drawer.domElement.appendChild(collapse);

  // Create a title 3/5
  const title3 = document.createElement("h1");
  title3.textContent = "3/5";
  // @ts-ignore
  title3.classList =
    "stacked-fractions text-red-500 text-2xl font-bold p-2 ml-4";
  drawer.domElement.appendChild(title3);

  // Example usage of the createSelect function
  const selectOptions = ["Svelte", "Vue", "React"];
  const selectElement = createSelect(selectOptions);
  drawer.domElement.appendChild(selectElement);

  // Create a title 4/5
  const title4 = document.createElement("h1");
  title4.textContent = "4/5";
  // @ts-ignore
  title4.classList =
    "stacked-fractions text-red-500 text-2xl font-bold p-2 ml-4";
  drawer.domElement.appendChild(title4);

  // Create a title 5/5
  const title5 = document.createElement("h1");
  title5.textContent = "5/5";
  // @ts-ignore
  title5.classList =
    "stacked-fractions text-red-500 text-2xl font-bold p-2 ml-4";
  drawer.domElement.appendChild(title5);

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
  return [
    extrusionButton,
    blueprintButton,
    createBlueprintRectangleButton,
    freeRotateButton,
    drawingButton,
    roofButton,
    createEditExtrusionButton,
    rotateRoofOrientationButton,
    scaffoldButton,
    createExtrusionButton,
  ];
};
