import * as OBC from "openbim-components";
import * as THREE from "three";
import { gsap } from "gsap";
import {
  cameraDisableOrbitalFunctionality,
  cameraEnableOrbitalFunctionality,
  cameraPerspectiveView,
  cameraTopView,
} from "./camera";
import { resetScene } from "./helper";
import { createTabs, createTimeline } from "./tab";
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
  alertButton.domElement.classList.remove("hover:bg-ifcjs-200");
  alertButton.domElement.classList.add("hover:bg-red-600");

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
  topViewButton.domElement.classList.remove("hover:bg-ifcjs-200");
  topViewButton.domElement.classList.add("hover:bg-red-600");

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
  createBlueprintRectangleButton.domElement.classList.remove(
    "hover:bg-ifcjs-200"
  );
  createBlueprintRectangleButton.domElement.classList.add("hover:bg-red-600");

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
  perspectiveViewButton.domElement.classList.remove("hover:bg-ifcjs-200");
  perspectiveViewButton.domElement.classList.add("hover:bg-red-600");

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
  freeRotateButton.domElement.classList.remove("hover:bg-ifcjs-200");
  freeRotateButton.domElement.classList.add("hover:bg-red-600");

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
  drawingButton.domElement.classList.remove("hover:bg-ifcjs-200");
  drawingButton.domElement.classList.add("hover:bg-red-600");

  const deleteObjectButton = new OBC.Button(components);
  deleteObjectButton.materialIcon = "delete_forever";
  deleteObjectButton.tooltip = "Delete Object";
  deleteObjectButton.id = "delete-button";
  mainToolbar.addChild(deleteObjectButton);
  deleteObjectButton.onClick.add(() => {
    document.body.style.cursor = "auto";
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
  deleteObjectButton.domElement.classList.remove("hover:bg-ifcjs-200");
  deleteObjectButton.domElement.classList.add("hover:bg-red-600");

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
  clearSceneButton.domElement.classList.remove("hover:bg-ifcjs-200");
  clearSceneButton.domElement.classList.add("hover:bg-red-600");

  //Solidify Blueprint
  const blueprintButton = new OBC.Button(components);
  blueprintButton.materialIcon = "dashboard";
  blueprintButton.tooltip = "Blueprint";
  blueprintButton.id = "blueprint-button";
  sideToolBar.addChild(blueprintButton);
  blueprintButton.onClick.add(() => {
    document.body.style.cursor = "auto";
    roofButton.closeMenus();
    scaffoldButton.closeMenus();
    extrusionButton.closeMenus()
    setDrawingInProgress(false);
    setDeletionInProgress(false);
    setDrawingScaffoldingInProgress(false);
  });
  blueprintButton.domElement.addEventListener("mouseover", () => {
    setDrawingInProgress(false);
    setDrawingScaffoldingInProgress(false);
  });
  blueprintButton.domElement.classList.remove("hover:bg-ifcjs-200");
  blueprintButton.domElement.classList.add("hover:bg-red-600");

  // create blueprint from outline
  const editBlueprintButton = new OBC.Button(components, {
    materialIconName: "category",
    name: "Edit Blueprint",
    closeOnClick: true,
  });
  editBlueprintButton.id = "create-blueprint-button";
  sideToolBar.addChild(editBlueprintButton);
  editBlueprintButton.onClick.add(() => {
    document.body.style.cursor = "auto";
    setDrawingInProgress(false);
    setDeletionInProgress(false);
    setDrawingScaffoldingInProgress(false);
  });
  editBlueprintButton.domElement.addEventListener("mouseover", () => {
    setDrawingInProgress(false);
    setDrawingScaffoldingInProgress(false);
  });
  blueprintButton.addChild(editBlueprintButton)
  editBlueprintButton.domElement.classList.remove("hover:bg-ifcjs-200");
  editBlueprintButton.domElement.classList.add("hover:bg-red-600");

  // move blueprint
  const moveBlueprintButton = new OBC.Button(components, {
    materialIconName: "open_with",
    name: "Move Blueprint",
    closeOnClick: true,
  });
  moveBlueprintButton.id = "move-blueprint-button";
  sideToolBar.addChild(moveBlueprintButton);
  moveBlueprintButton.onClick.add(() => {
    document.body.style.cursor = "grab";
    setDrawingInProgress(false);
    setDeletionInProgress(false);
    setDrawingScaffoldingInProgress(false);
  });
  moveBlueprintButton.domElement.addEventListener("mouseover", () => {
    setDrawingInProgress(false);
    setDrawingScaffoldingInProgress(false);
  });
  blueprintButton.addChild(moveBlueprintButton)
  moveBlueprintButton.domElement.classList.remove("hover:bg-ifcjs-200");
  moveBlueprintButton.domElement.classList.add("hover:bg-red-600");

  // Create Extrusion from Blueprint
  const extrusionButton = new OBC.Button(components);
  extrusionButton.materialIcon = "view_in_ar";
  extrusionButton.tooltip = "Extrude";
  extrusionButton.id = "extrusion-button";
  sideToolBar.addChild(extrusionButton);
  extrusionButton.onClick.add(() => {
    blueprintButton.closeMenus()
    roofButton.closeMenus();
    scaffoldButton.closeMenus();
    document.body.style.cursor = "auto";
    setDrawingInProgress(false);
    setDeletionInProgress(false);
    setDrawingScaffoldingInProgress(false);
  });
  extrusionButton.domElement.addEventListener("mouseover", () => {
    setDrawingInProgress(false);
    setDrawingScaffoldingInProgress(false);
  });
  extrusionButton.domElement.classList.remove("hover:bg-ifcjs-200");
  extrusionButton.domElement.classList.add("hover:bg-red-600");

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
  createExtrusionButton.domElement.classList.remove("hover:bg-ifcjs-200");
  createExtrusionButton.domElement.classList.add("hover:bg-red-600");

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
  createEditExtrusionButton.domElement.classList.remove("hover:bg-ifcjs-200");
  createEditExtrusionButton.domElement.classList.add("hover:bg-red-600");

  const roofButton = new OBC.Button(components, {
    closeOnClick: true,
  });
  roofButton.materialIcon = "roofing";
  roofButton.tooltip = "Roof";
  roofButton.id = "roof-button";
  sideToolBar.addChild(roofButton);
  roofButton.onClick.add(() => {
    blueprintButton.closeMenus()
    extrusionButton.closeMenus();
    scaffoldButton.closeMenus();
    document.body.style.cursor = "auto";
    setDrawingInProgress(false);
    setDeletionInProgress(false);
    setDrawingScaffoldingInProgress(false);
  });
  roofButton.domElement.addEventListener("mouseover", () => {
    setDrawingInProgress(false);
    setDrawingScaffoldingInProgress(false);
  });
  roofButton.domElement.classList.remove("hover:bg-ifcjs-200");
  roofButton.domElement.classList.add("hover:bg-red-600");

  const createGableRoofButton = new OBC.Button(components, {
    materialIconName: "change_history",
    name: "Gable Roof",
    closeOnClick: true,
  });
  createGableRoofButton.onClick.add(() => {
    document.body.style.cursor = "crosshair";
    setDrawingInProgress(false);
    cameraDisableOrbitalFunctionality(gsap, components.camera);
  });
  createGableRoofButton.domElement.addEventListener("mouseleave", () => {
    setDrawingInProgress(true);
  });
  roofButton.addChild(createGableRoofButton);
  createGableRoofButton.domElement.classList.remove("hover:bg-ifcjs-200");
  createGableRoofButton.domElement.classList.add("hover:bg-red-600");

  const createShedRoofButton = new OBC.Button(components, {
    materialIconName: "details",
    name: "Shed Roof",
    closeOnClick: true,
  });
  createShedRoofButton.onClick.add(() => {
    document.body.style.cursor = "crosshair";
    setDrawingInProgress(false);
    cameraDisableOrbitalFunctionality(gsap, components.camera);
  });
  createShedRoofButton.domElement.addEventListener("mouseleave", () => {
    setDrawingInProgress(true);
  });
  roofButton.addChild(createShedRoofButton);
  createShedRoofButton.domElement.classList.remove("hover:bg-ifcjs-200");
  createShedRoofButton.domElement.classList.add("hover:bg-red-600");

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
  roofButton.domElement.classList.remove("hover:bg-ifcjs-200");
  roofButton.domElement.classList.add("hover:bg-red-600");

  const scaffoldButton = new OBC.Button(components);
  scaffoldButton.materialIcon = "foundation";
  scaffoldButton.tooltip = "Scaffolding";
  scaffoldButton.id = "scaffold-button";
  sideToolBar.addChild(scaffoldButton);
  scaffoldButton.onClick.add(() => {
    blueprintButton.closeMenus()
    roofButton.closeMenus();
    extrusionButton.closeMenus();
    setDrawingInProgress(false);
    setDeletionInProgress(false);
    setDrawingScaffoldingInProgress(false);
  });
  scaffoldButton.domElement.addEventListener("mouseover", () => {
    setDrawingInProgress(false);
    setDrawingScaffoldingInProgress(false);
  });
  scaffoldButton.domElement.addEventListener("mouseleave", () => {
    setDrawingInProgress(false);
  });
  scaffoldButton.domElement.addEventListener("mouseenter", () => {
    setDrawingInProgress(false);
    setDrawingScaffoldingInProgress(false);
  });
  scaffoldButton.domElement.classList.remove("hover:bg-ifcjs-200");
  scaffoldButton.domElement.classList.add("hover:bg-red-600");

  // draw scaffolding outline
  const drawScaffoldButton = new OBC.Button(components, {
    materialIconName: "draw",
    name: "Draw Scaffolding Outline",
    closeOnClick: true,
  });
  drawScaffoldButton.onClick.add(() => {
    document.body.style.cursor = "auto";
    setDrawingInProgress(false);
    setDeletionInProgress(false);
    setDrawingScaffoldingInProgress(true);
  });
  drawScaffoldButton.domElement.addEventListener("mouseover", () => {
    setDrawingInProgress(false);
  });
  drawScaffoldButton.domElement.addEventListener("mouseleave", () => {
    setDrawingInProgress(false);
  });
  scaffoldButton.addChild(drawScaffoldButton);
  drawScaffoldButton.domElement.classList.remove("hover:bg-ifcjs-200");
  drawScaffoldButton.domElement.classList.add("hover:bg-red-600");

  // generate scaffolding outline
  const generateScaffoldOutlineButton = new OBC.Button(components, {
    materialIconName: "aspect_ratio",
    name: "Generate Scaffolding Outline",
    closeOnClick: true,
  });
  generateScaffoldOutlineButton.onClick.add(() => {
    document.body.style.cursor = "auto";
    setDrawingInProgress(false);
    setDeletionInProgress(false);
    setDrawingScaffoldingInProgress(false);
  });
  generateScaffoldOutlineButton.domElement.addEventListener("mouseover", () => {
    setDrawingInProgress(false);
  });
  generateScaffoldOutlineButton.domElement.addEventListener(
    "mouseleave",
    () => {
      setDrawingInProgress(false);
    }
  );
  scaffoldButton.addChild(generateScaffoldOutlineButton);
  generateScaffoldOutlineButton.domElement.classList.remove(
    "hover:bg-ifcjs-200"
  );
  generateScaffoldOutlineButton.domElement.classList.add("hover:bg-red-600");

  // generate scaffolding outline
  const placeScaffoldButton = new OBC.Button(components, {
    materialIconName: "domain_add",
    name: "Place Individual Scaffold",
    closeOnClick: true,
  });
  placeScaffoldButton.onClick.add(() => {
    document.body.style.cursor = "auto";
    setDrawingInProgress(false);
    setDeletionInProgress(false);
    setDrawingScaffoldingInProgress(false);
  });
  placeScaffoldButton.domElement.addEventListener("mouseover", () => {
    setDrawingInProgress(false);
  });
  placeScaffoldButton.domElement.addEventListener("mouseleave", () => {
    setDrawingInProgress(false);
  });
  scaffoldButton.addChild(placeScaffoldButton);
  placeScaffoldButton.domElement.classList.remove("hover:bg-ifcjs-200");
  placeScaffoldButton.domElement.classList.add("hover:bg-red-600");

  // generate scaffolding
  const generateScaffoldButton = new OBC.Button(components, {
    materialIconName: "select_all",
    name: "Generate Scaffolding From Outline",
    closeOnClick: true,
  });
  generateScaffoldButton.onClick.add(() => {
    document.body.style.cursor = "auto";
    setDrawingInProgress(false);
    setDeletionInProgress(false);
    setDrawingScaffoldingInProgress(false);
  });
  generateScaffoldButton.domElement.addEventListener("mouseover", () => {
    setDrawingInProgress(false);
  });
  generateScaffoldButton.domElement.addEventListener("mouseleave", () => {
    setDrawingInProgress(false);
  });
  scaffoldButton.addChild(generateScaffoldButton);
  generateScaffoldButton.domElement.classList.remove("hover:bg-ifcjs-200");
  generateScaffoldButton.domElement.classList.add("hover:bg-red-600");

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

  const closeDrawer = () => {
    const closeDrawerElement = Array.from(
      drawer.domElement.querySelectorAll("span")
    ).find((span) => span.textContent === "close");
    if (closeDrawerElement) {
      // @ts-ignore
      closeDrawerElement.classList =
        "material-icons text-2xl ml-4 text-gray-400 z-20 hover:cursor-pointer hover:text-red-500";
      closeDrawerElement.id = "drawerCloseButton";
    }
  };

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
  drawerMenuButton.domElement.classList.remove("hover:bg-ifcjs-200");
  drawerMenuButton.domElement.classList.add("hover:bg-red-600");
  /////////////////////////////////////////////////////////
  // drawer element
  const drawer = new OBC.FloatingWindow(components);
  updateTitle();
  closeDrawer();
  drawer.domElement.style.position = "left";
  drawer.domElement.style.width = "25rem";
  drawer.domElement.style.height = "100vh";
  drawer.domElement.style.left = "0";
  drawer.domElement.style.top = "0";
  drawer.domElement.style.zIndex = "1000";
  drawer.domElement.style.backgroundColor = "#000000";
  drawer.domElement.style.boxShadow = "0px 0px 10px rgba(0, 0, 0, 0.5)";
  drawer.visible = false; // change this to true to make the drawer open on mount
  drawer.domElement.addEventListener("mouseover", () => {
    setDrawingInProgress(false);
  });
  drawer.domElement.addEventListener("mouseleave", () => {
    setDrawingInProgress(true);
  });
  components.ui.add(drawer);
  console.log(drawer);

  const timeline = createTimeline();
  drawer.domElement.appendChild(timeline);

  // TabList
  const tablist = createTabs();
  // Append the tablist to the drawer
  drawer.domElement.appendChild(tablist);

  ////////////////////////////////////////////////
  return [
    blueprintButton,
    editBlueprintButton,
    moveBlueprintButton,
    createBlueprintRectangleButton,
    freeRotateButton,
    drawingButton,
    createGableRoofButton,
    createShedRoofButton,
    createEditExtrusionButton,
    rotateRoofOrientationButton,
    drawScaffoldButton,
    placeScaffoldButton,
    generateScaffoldButton,
    generateScaffoldOutlineButton,
    createExtrusionButton,
  ];
};
