import * as OBC from "openbim-components";
import * as THREE from "three";
import { gsap } from "gsap";
import {
  cameraDisableOrbitalFunctionality,
  cameraEnableOrbitalFunctionality,
  cameraTopView,
} from "./camera";
import {
  hideAllCSS2DObjects,
  observeElementAndAddEventListener,
  removeHighlightMesh,
} from "./helper";
import MountPoint from "../pages/MountPoint.vue";
import Timeline from "../pages/Timeline.vue";
import { createApp } from "vue";
import { setPlaceScaffoldIndividually } from "./scaffold";
import { setEditingBlueprint } from "./mesh";
import lastSavedSvg from "../assets/images/SavedDisc.svg";
import {
  setDeletionInProgress,
  setDeletionIndividualScaffoldingInProgress,
  setDeletionScaffoldingColumnInProgress,
  setDeletionScaffoldingRowInProgress,
  setDrawingInProgress,
  setDrawingInProgressSwitch,
  setDrawingScaffoldingInProgress,
  setIsDrawingBlueprint,
  setReplaceScaffoldingColumnWithExternalStaircaseInProgress,
  setReplaceScaffoldingColumnWithInternalStaircaseInProgress,
  setRotatingRoofInProgress,
} from "./state";

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
  // main tool bar
  const mainToolbar = new OBC.Toolbar(components);
  mainToolbar.position = "bottom";
  components.ui.addToolbar(mainToolbar);
  mainToolbar.domElement.addEventListener("mousedown", () => {
    setDrawingInProgress(false);
    setPlaceScaffoldIndividually(false);
  });
  mainToolbar.domElement.classList.remove("bg-ifcjs-100");
  mainToolbar.domElement.classList.add("bg-glass");
  // side tool bar
  const sideToolBar = new OBC.Toolbar(components);
  sideToolBar.position = "right";
  components.ui.addToolbar(sideToolBar);
  sideToolBar.domElement.addEventListener("mouseover", () => {
    setDrawingInProgress(false);
    setPlaceScaffoldIndividually(false);
  });
  sideToolBar.domElement.classList.remove("bg-ifcjs-100");
  sideToolBar.domElement.classList.add("bg-glass");

  // top tool bar
  const topToolBar = new OBC.Toolbar(components);
  topToolBar.position = "top";
  components.ui.addToolbar(topToolBar);
  topToolBar.domElement.style.position = "fixed";
  topToolBar.domElement.style.top = "20px";
  topToolBar.domElement.style.right = "100px";
  topToolBar.domElement.addEventListener("mouseover", () => {
    setDrawingInProgress(false);
    setPlaceScaffoldIndividually(false);
    setDrawingScaffoldingInProgress(false);
  });
  topToolBar.domElement.classList.remove("bg-ifcjs-100");
  topToolBar.domElement.classList.add("bg-[#111115]");

  // Vue instance inside of top tool bar
  const vueComponentTimeline = createApp(Timeline);

  // Create a new DOM element to serve as the mounting point for the Vue component
  const mountPointTimeline = document.createElement("div");
  mountPointTimeline.style.height = "0%";

  // Mount the Vue component instance to the new DOM element
  vueComponentTimeline.mount(mountPointTimeline);

  // Append the new DOM element to topToolBar.domElement
  topToolBar.domElement.appendChild(mountPointTimeline);

  const generalMenuButton = new OBC.Button(components, {
    name: "Generelt",
  });
  generalMenuButton.id = "general-button";
  topToolBar.addChild(generalMenuButton);
  generalMenuButton.onClick.add(() => {
    setDrawingInProgress(false);
    if (titleElement) {
      titleElement.textContent = "Generelt";
    }
    // @ts-ignore
    window.setActiveSection("general");
  });
  generalMenuButton.domElement.classList.remove("hover:bg-ifcjs-200");
  generalMenuButton.domElement.classList.add("hover:bg-slate-300");

  const blueprintMenuButton = new OBC.Button(components, {
    name: "Plantegning og bygg",
  });
  blueprintMenuButton.id = "blueprint-button";
  topToolBar.addChild(blueprintMenuButton);
  blueprintMenuButton.onClick.add(() => {
    setDrawingInProgress(false);
    if (titleElement) {
      titleElement.textContent = "Plantegning og bygg";
    }
    // @ts-ignore
    window.setActiveSection("blueprint");
  });
  blueprintMenuButton.domElement.classList.remove("hover:bg-ifcjs-200");
  blueprintMenuButton.domElement.classList.add("hover:bg-slate-300");

  const roofMenuButton = new OBC.Button(components, {
    name: "Tak",
  });
  roofMenuButton.id = "roof-button";
  topToolBar.addChild(roofMenuButton);
  roofMenuButton.onClick.add(() => {
    setDrawingInProgress(false);
    if (titleElement) {
      titleElement.textContent = "Tak";
    }
    // @ts-ignore
    window.setActiveSection("roof");
  });
  roofMenuButton.domElement.classList.remove("hover:bg-ifcjs-200");
  roofMenuButton.domElement.classList.add("hover:bg-slate-300");

  const scaffoldMenuButton = new OBC.Button(components, {
    name: "Stillas",
  });
  scaffoldMenuButton.id = "scaffold-button";
  topToolBar.addChild(scaffoldMenuButton);
  scaffoldMenuButton.onClick.add(() => {
    setDrawingInProgress(false);
    if (titleElement) {
      titleElement.textContent = "Stillas";
    }
    // @ts-ignore
    window.setActiveSection("scaffold");
  });
  scaffoldMenuButton.domElement.classList.remove("hover:bg-ifcjs-200");
  scaffoldMenuButton.domElement.classList.add("hover:bg-slate-300");

  const suppliesMenuButton = new OBC.Button(components, {
    name: "Tillegg",
  });
  suppliesMenuButton.id = "supplies-button";
  topToolBar.addChild(suppliesMenuButton);
  suppliesMenuButton.onClick.add(() => {
    setDrawingInProgress(false);
    if (titleElement) {
      titleElement.textContent = "Tillegg";
    }
    // @ts-ignore
    window.setActiveSection("supply");
  });
  suppliesMenuButton.domElement.classList.remove("hover:bg-ifcjs-200");
  suppliesMenuButton.domElement.classList.add("hover:bg-slate-300");

  const orderMenuButton = new OBC.Button(components, {
    name: "Prisforespørsel",
  });
  orderMenuButton.id = "supplies-button";
  topToolBar.addChild(orderMenuButton);
  orderMenuButton.onClick.add(() => {
    setDrawingInProgress(false);
    const modalElement = document.getElementById("my_modal_1");
    if (modalElement && modalElement instanceof HTMLDialogElement) {
      modalElement.showModal();
    } else {
      console.error("Modal element not found or not an HTMLDialogElement");
    }
  });
  orderMenuButton.domElement.classList.remove("hover:bg-ifcjs-200");
  orderMenuButton.domElement.classList.add("hover:bg-slate-300");
  orderMenuButton.domElement.classList.add("btn");
  orderMenuButton.domElement.classList.add("btn-sm");

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
  topViewButton.domElement.classList.add("hover:bg-slate-300");

  observeElementAndAddEventListener("top-view", "mousedown", () => {
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh && child.name === "highlightMesh") {
        scene.remove(child);
      }
    });
    cameraTopView(gsap, components.camera);
    setDrawingInProgress(false);
    setDrawingScaffoldingInProgress(false);
  });

  observeElementAndAddEventListener("top-view", "mouseover", () => {
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
  createBlueprintRectangleButton.domElement.classList.remove(
    "hover:bg-ifcjs-200"
  );
  createBlueprintRectangleButton.domElement.classList.add("hover:bg-slate-300");

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
    setDeletionScaffoldingRowInProgress(false);
    setDeletionScaffoldingColumnInProgress(false);
    setReplaceScaffoldingColumnWithExternalStaircaseInProgress(false);
    setReplaceScaffoldingColumnWithInternalStaircaseInProgress(false);
    setDeletionIndividualScaffoldingInProgress(false);
  });
  freeRotateButton.domElement.addEventListener("mouseenter", () => {
    setDrawingInProgress(false);
    setDrawingScaffoldingInProgress(false);
    setIsDrawingBlueprint(false);
  });
  freeRotateButton.domElement.classList.remove("hover:bg-ifcjs-200");
  freeRotateButton.domElement.classList.add("hover:bg-slate-300");

  observeElementAndAddEventListener("free-rotate", "mousedown", () => {
    document.body.style.cursor = "grab";
    cameraEnableOrbitalFunctionality(gsap, components.camera);
    setDeletionInProgress(false);
    setDrawingInProgress(false);
    setDrawingScaffoldingInProgress(false);
    setDeletionScaffoldingRowInProgress(false);
    setDeletionScaffoldingColumnInProgress(false);
    setReplaceScaffoldingColumnWithExternalStaircaseInProgress(false);
    setReplaceScaffoldingColumnWithInternalStaircaseInProgress(false);
    setDeletionIndividualScaffoldingInProgress(false);
    setRotatingRoofInProgress(false);
  });

  observeElementAndAddEventListener("free-rotate", "mouseenter", () => {
    setDrawingInProgress(false);
    setDrawingScaffoldingInProgress(false);
    setIsDrawingBlueprint(false);
  });

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
  deleteObjectButton.domElement.classList.add("hover:bg-slate-300");

  observeElementAndAddEventListener("delete-object", "mousedown", () => {
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

  observeElementAndAddEventListener("delete-object", "mouseover", () => {
    setDrawingInProgress(false);
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
    // resetScene(scene, components);
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
  clearSceneButton.domElement.classList.add("hover:bg-slate-300");

  observeElementAndAddEventListener("reset-scene", "mousedown", () => {
    setDeletionInProgress(false);
    setDrawingInProgress(true);
    setDrawingScaffoldingInProgress(false);
  });

  observeElementAndAddEventListener("reset-scene", "mouseover", () => {
    setDrawingInProgress(false);
    setDrawingScaffoldingInProgress(false);
  });

  observeElementAndAddEventListener("reset-scene", "mouseleave", () => {
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
    roofButton.closeMenus();
    scaffoldButton.closeMenus();
    extrusionButton.closeMenus();
    setDrawingInProgress(false);
    setDeletionInProgress(false);
    setDrawingScaffoldingInProgress(false);
  });
  blueprintButton.domElement.addEventListener("mouseover", () => {
    setDrawingInProgress(false);
    setDrawingScaffoldingInProgress(false);
  });
  blueprintButton.domElement.classList.remove("hover:bg-ifcjs-200");
  blueprintButton.domElement.classList.add("hover:bg-slate-300");

  observeElementAndAddEventListener("create-blueprint", "mousedown", () => {
    document.body.style.cursor = "auto";
    setDrawingInProgress(false);
    setDeletionInProgress(false);
    setDrawingScaffoldingInProgress(false);
  });

  observeElementAndAddEventListener("create-blueprint", "mouseover", () => {
    setDrawingInProgress(false);
    setDrawingScaffoldingInProgress(false);
  });

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
    setEditingBlueprint(true);
    setDrawingInProgress(false);
    setDeletionInProgress(false);
    setDrawingScaffoldingInProgress(false);
    cameraTopView(gsap, components.camera);
    cameraDisableOrbitalFunctionality(gsap, components.camera);
  });
  editBlueprintButton.domElement.addEventListener("mouseover", () => {
    setDrawingInProgress(false);
    setDrawingScaffoldingInProgress(false);
  });
  blueprintButton.addChild(editBlueprintButton);
  editBlueprintButton.domElement.classList.remove("hover:bg-ifcjs-200");
  editBlueprintButton.domElement.classList.add("hover:bg-slate-300");

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
    cameraTopView(gsap, components.camera);
    cameraDisableOrbitalFunctionality(gsap, components.camera);
  });
  moveBlueprintButton.domElement.addEventListener("mouseover", () => {
    setDrawingInProgress(false);
    setDrawingScaffoldingInProgress(false);
  });
  blueprintButton.addChild(moveBlueprintButton);
  moveBlueprintButton.domElement.classList.remove("hover:bg-ifcjs-200");
  moveBlueprintButton.domElement.classList.add("hover:bg-slate-300");

  // Create Extrusion from Blueprint
  const extrusionButton = new OBC.Button(components);
  extrusionButton.materialIcon = "view_in_ar";
  extrusionButton.tooltip = "Extrude";
  extrusionButton.id = "extrusion-button";
  sideToolBar.addChild(extrusionButton);
  extrusionButton.onClick.add(() => {
    blueprintButton.closeMenus();
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
  extrusionButton.domElement.classList.add("hover:bg-slate-300");

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
  createExtrusionButton.domElement.classList.add("hover:bg-slate-300");

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
  createEditExtrusionButton.domElement.classList.add("hover:bg-slate-300");

  const roofButton = new OBC.Button(components, {
    closeOnClick: true,
  });
  roofButton.materialIcon = "roofing";
  roofButton.tooltip = "Roof";
  roofButton.id = "roof-button";
  sideToolBar.addChild(roofButton);
  roofButton.onClick.add(() => {
    blueprintButton.closeMenus();
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
  roofButton.domElement.classList.add("hover:bg-slate-300");

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
  createGableRoofButton.domElement.classList.add("hover:bg-slate-300");

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
  createShedRoofButton.domElement.classList.add("hover:bg-slate-300");

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
  roofButton.domElement.classList.add("hover:bg-slate-300");

  const scaffoldButton = new OBC.Button(components);
  scaffoldButton.materialIcon = "foundation";
  scaffoldButton.tooltip = "Scaffolding";
  scaffoldButton.id = "scaffold-button";
  sideToolBar.addChild(scaffoldButton);
  scaffoldButton.onClick.add(() => {
    blueprintButton.closeMenus();
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
  scaffoldButton.domElement.classList.add("hover:bg-slate-300");

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
  drawScaffoldButton.domElement.classList.add("hover:bg-slate-300");

  observeElementAndAddEventListener("draw-scaffold", "mousedown", () => {
    document.body.style.cursor = "auto";
    removeHighlightMesh(scene);
    setDrawingInProgress(false);
    setDeletionInProgress(false);
    setDrawingScaffoldingInProgress(false);
  });

  observeElementAndAddEventListener("draw-scaffold", "mouseover", () => {
    document.body.style.cursor = "auto";
    removeHighlightMesh(scene);
    setDrawingInProgress(false);
    setDeletionInProgress(false);
    setDrawingScaffoldingInProgress(true);
  });

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
  generateScaffoldOutlineButton.domElement.classList.add("hover:bg-slate-300");

  observeElementAndAddEventListener("generate-scaffolding", "mousedown", () => {
    document.body.style.cursor = "auto";
    setDrawingInProgress(false);
    setDeletionInProgress(false);
    setDrawingScaffoldingInProgress(false);
  });

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
  placeScaffoldButton.domElement.classList.add("hover:bg-slate-300");

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
  generateScaffoldButton.domElement.classList.add("hover:bg-slate-300");

  const drawerToolBar = new OBC.Toolbar(components);
  drawerToolBar.position = "right";
  components.ui.addToolbar(drawerToolBar);
  drawerToolBar.domElement.style.position = "absolute";
  drawerToolBar.domElement.style.top = "20px";
  drawerToolBar.domElement.style.right = "10px";
  drawerToolBar.domElement.addEventListener("mouseleave", () => {
    document.body.style.cursor = "auto";
    setDrawingInProgress(true);
  });
  drawerToolBar.domElement.classList.remove("bg-ifcjs-100");
  drawerToolBar.domElement.classList.add("bg-glass");

  const removeLabelsButton = new OBC.Button(components);
  removeLabelsButton.materialIcon = "disabled_by_default";
  removeLabelsButton.tooltip = "Hide Labels";
  removeLabelsButton.id = "scaffold-button";
  sideToolBar.addChild(removeLabelsButton);
  removeLabelsButton.onClick.add(() => {
    blueprintButton.closeMenus();
    roofButton.closeMenus();
    extrusionButton.closeMenus();
    scaffoldButton.closeMenus();
    setDrawingInProgress(false);
    setDeletionInProgress(false);
    setDrawingScaffoldingInProgress(false);
    hideAllCSS2DObjects(scene);
  });
  removeLabelsButton.domElement.addEventListener("mouseover", () => {
    setDrawingInProgress(false);
    setDrawingScaffoldingInProgress(false);
  });
  removeLabelsButton.domElement.addEventListener("mouseleave", () => {
    setDrawingInProgress(false);
  });
  removeLabelsButton.domElement.addEventListener("mouseenter", () => {
    setDrawingInProgress(false);
    setDrawingScaffoldingInProgress(false);
  });
  removeLabelsButton.domElement.classList.remove("hover:bg-ifcjs-200");
  removeLabelsButton.domElement.classList.add("hover:bg-slate-300");

  //Solidify Blueprint
  const testButton = new OBC.Button(components);
  testButton.materialIcon = "quiz";
  testButton.tooltip = "Blueprint";
  testButton.id = "blueprint-button";
  sideToolBar.addChild(testButton);
  testButton.onClick.add(() => {
    document.body.style.cursor = "auto";
    roofButton.closeMenus();
    scaffoldButton.closeMenus();
    extrusionButton.closeMenus();
    setDrawingInProgress(false);
    setDeletionInProgress(false);
    setDrawingScaffoldingInProgress(false);
  });
  testButton.domElement.addEventListener("mouseover", () => {
    setDrawingInProgress(false);
    setDrawingScaffoldingInProgress(false);
  });
  testButton.domElement.classList.remove("hover:bg-ifcjs-200");
  testButton.domElement.classList.add("hover:bg-slate-300");

  // Function to update the title
  let titleElement: Element | null;
  const updateTitle = () => {
    titleElement = drawer.domElement.querySelector(
      "h3.text-3xl.text-ifcjs-200.font-medium.my-0"
    );
    if (titleElement) {
      titleElement.textContent = "Generelt";
      // @ts-ignore
      titleElement.classList =
        "text-3xl text-[#DEDEDE] font-medium my-0 btn btn-ghost";
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
        "material-icons text-2xl ml-4 text-gray-400 z-20 hover:cursor-pointer hover:text-white";
      closeDrawerElement.id = "drawerCloseButton";
    }
  };

  //Drawer Menu Button
  const drawerMenuButton = new OBC.Button(components);
  drawerMenuButton.materialIcon = "menu";
  drawerMenuButton.id = "menu-button";
  drawerToolBar.addChild(drawerMenuButton);
  drawerMenuButton.onClick.add(() => {
    setDrawingInProgress(false);
    setPlaceScaffoldIndividually(false);
    setDrawingScaffoldingInProgress(false);
    setDrawingInProgressSwitch(false);
    drawer.visible = !drawer.visible;
  });
  drawerMenuButton.domElement.addEventListener("mouseover", () => {
    removeHighlightMesh(scene);
    setDrawingInProgress(false);
    setPlaceScaffoldIndividually(false);
    setDrawingScaffoldingInProgress(false);
    setDrawingInProgressSwitch(false);
  });
  drawerMenuButton.domElement.addEventListener("mouseleave", () => {
    setDrawingInProgress(false);
    setPlaceScaffoldIndividually(false);
    setDrawingScaffoldingInProgress(false);
    setDrawingInProgressSwitch(false);
  });
  drawerMenuButton.domElement.classList.remove("hover:bg-ifcjs-200");
  drawerMenuButton.domElement.classList.add("hover:bg-slate-300");

  // Fetch the SVG content from the file
  fetch(lastSavedSvg)
    .then((response) => response.text())
    .then((svgContent) => {
      // Create a new button
      const menuSaveButton = new OBC.Button(components);
      menuSaveButton.id = "menu-button";
      drawerToolBar.addChild(menuSaveButton);

      // Create a new DOM element for the SVG
      const svgElement = document.createElement("div");
      svgElement.innerHTML = svgContent;

      // Append the SVG element to the button's DOM element
      menuSaveButton.domElement.appendChild(svgElement);
      menuSaveButton.domElement.classList.remove("hover:bg-ifcjs-200");
      menuSaveButton.domElement.classList.add("hover:bg-slate-300");
      menuSaveButton.domElement.classList.add("hover:text-black");
    })
    .catch((error) => {
      console.error("Error fetching SVG:", error);
    });

    // menu power button
    const menuPowerButton = new OBC.Button(components);
    menuPowerButton.materialIcon = "power_settings_new";
    menuPowerButton.id = "power-button";
    drawerToolBar.addChild(menuPowerButton);
    menuPowerButton.onClick.add(() => {
      window.location.href = "/home";
    })
    menuPowerButton.domElement.classList.remove("hover:bg-ifcjs-200");
    menuPowerButton.domElement.classList.add("hover:bg-slate-300");
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
  drawer.domElement.style.zIndex = "50";
  drawer.domElement.style.backgroundColor = "#111115";
  drawer.domElement.style.boxShadow = "0px 0px 10px rgba(0, 0, 0, 0.5)";
  drawer.visible = false; // change this to true to make the drawer open on mount
  drawer.domElement.addEventListener("mouseover", () => {
    removeHighlightMesh(scene);
    setDrawingInProgress(false);
  });
  drawer.domElement.addEventListener("mouseleave", () => {
    if (startDrawing) {
      setDrawingInProgress(true);
    }
  });
  components.ui.add(drawer);
  console.log(drawer);

  // Vue instance inside of drawer
  const vueComponentInstance = createApp(MountPoint);

  // Optionally, if you want to append it as a child of the drawer's DOM element
  // you can use the following:
  // drawer.domElement.appendChild(vueComponentInstance);

  // Create a new DOM element to serve as the mounting point for the Vue component
  const mountPoint = document.createElement("div");

  // Mount the Vue component instance to the new DOM element
  vueComponentInstance.mount(mountPoint);

  // Append the new DOM element to drawer.domElement
  drawer.domElement.appendChild(mountPoint);

  //////////////////////////////////////////
  // Create a function to add the event listener
  let startDrawing = false;
  observeElementAndAddEventListener(
    "startDrawingRectangle",
    "mousedown",
    () => {
      document.body.style.cursor = "crosshair";
      startDrawing = false;
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh && child.name === "highlightMesh") {
          scene.remove(child);
        }
      });
      cameraTopView(gsap, components.camera);
      setDrawingInProgress(false);
      setDeletionInProgress(false);
      setDrawingScaffoldingInProgress(false);
      cameraDisableOrbitalFunctionality(gsap, components.camera);
    }
  );

  observeElementAndAddEventListener("startDrawingPolygon", "mousedown", () => {
    startDrawing = true;
    console.log("draw polygon");
    document.body.style.cursor = "auto";
    setDeletionInProgress(false);
    setDrawingScaffoldingInProgress(false);
    setDrawingInProgress(false);
    setDrawingInProgressSwitch(false);
  });

  observeElementAndAddEventListener("startDrawingPolygon", "mouseleave", () => {
    if (startDrawing) {
      console.log("polygon drawing start");
      setDrawingInProgressSwitch(true);
      setDrawingInProgress(true);
      setIsDrawingBlueprint(false);
    }
  });

  ////////////////////////////////////////////////
  return [
    blueprintButton,
    editBlueprintButton,
    moveBlueprintButton,
    createBlueprintRectangleButton,
    freeRotateButton,
    // drawingButton,
    createGableRoofButton,
    createShedRoofButton,
    createEditExtrusionButton,
    rotateRoofOrientationButton,
    drawScaffoldButton,
    placeScaffoldButton,
    generateScaffoldButton,
    generateScaffoldOutlineButton,
    createExtrusionButton,
    clearSceneButton,
    testButton,
  ];
};
