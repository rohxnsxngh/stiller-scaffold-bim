import * as OBC from "openbim-components";
import * as THREE from "three";
import { gsap } from "gsap";
import {
  cameraDisableOrbitalFunctionality,
  cameraEnableOrbitalFunctionality,
  cameraTopView,
} from "./camera";
import {
  observeElementAndAddEventListener,
  removeHighlightMesh,
  setTimelineToBeginningState,
} from "./helper";
import MountPoint from "../pages/MountPoint.vue";
//@ts-ignore
import Timeline from "../pages/Timeline.vue";
import { createApp } from "vue";
import {
  setDeletionInProgress,
  setDrawingInProgress,
  setDrawingInProgressSwitch,
  setDrawingScaffoldingInProgress,
  setIsDrawingBlueprint,
  setStates,
} from "./state";
import { selectedStore } from "../store";

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
  // const mainToolbar = new OBC.Toolbar(components);
  // mainToolbar.position = "left";
  // components.ui.addToolbar(mainToolbar);
  // mainToolbar.domElement.addEventListener("mousedown", () => {
  //   setStates()
  // });
  // mainToolbar.domElement.classList.remove("bg-ifcjs-100");
  // mainToolbar.domElement.classList.add("bg-glass");
  // mainToolbar.domElement.classList.add("hover:bg-[#111115]");
  // side tool bar
  // const sideToolBar = new OBC.Toolbar(components);
  // sideToolBar.position = "right";
  // components.ui.addToolbar(sideToolBar);
  // sideToolBar.domElement.addEventListener("mouseover", () => {
  //   // setStates();
  // });
  // sideToolBar.domElement.addEventListener("mouseleave", () => {
  //   if (startDrawing) {
  //     setDrawingInProgress(true);
  //   }
  // });
  // sideToolBar.domElement.classList.remove("bg-ifcjs-100");
  // sideToolBar.domElement.classList.add("bg-glass");
  // sideToolBar.domElement.classList.add("hover:bg-[#111115]");

  // top tool bar
  const topToolBar = new OBC.Toolbar(components);
  topToolBar.position = "top";
  components.ui.addToolbar(topToolBar);
  topToolBar.domElement.style.position = "fixed";
  topToolBar.domElement.style.top = "20px";
  topToolBar.domElement.style.right = "100px";
  topToolBar.domElement.classList.remove("bg-ifcjs-100");
  topToolBar.domElement.classList.add("bg-[#111115]");

  // show which tool is currently being used
  // const selectedToolsBar = new OBC.Toolbar(components);
  // selectedToolsBar.position = "bottom";
  // components.ui.addToolbar(selectedToolsBar);
  // selectedToolsBar.domElement.addEventListener("mouseover", () => {
  //   // setStates();
  // });
  // selectedToolsBar.domElement.addEventListener("mouseleave", () => {
  //   if (startDrawing) {
  //     setDrawingInProgress(true);
  //   }
  // });
  // selectedToolsBar.domElement.classList.remove("bg-ifcjs-100");
  // selectedToolsBar.domElement.classList.add("bg-glass");
  // selectedToolsBar.domElement.classList.add("hover:bg-[#111115]");

  const selected = selectedStore();
  // const selectedButtonDisplay = new OBC.Button(components, {
  //   name: selected.selected,
  // });
  // selectedButtonDisplay.id = "selected-tool-button";
  // topToolBar.addChild(selectedButtonDisplay);
  // selectedButtonDisplay.domElement.classList.remove("hover:bg-ifcjs-200");
  // selectedButtonDisplay.domElement.classList.remove("hover:text-black");
  // selectedButtonDisplay.domElement.classList.add("hover:text-white");
  // selectedButtonDisplay.domElement.classList.remove("text-white");
  // selectedButtonDisplay.domElement.classList.add("text-amber-500");

  // IFC loader button
  const fragments = new OBC.FragmentManager(components);
  console.log(fragments);
  const fragmentIfcLoader = new OBC.FragmentIfcLoader(components);
  fragmentIfcLoader.settings.webIfc.COORDINATE_TO_ORIGIN = false;
  fragmentIfcLoader.settings.webIfc.OPTIMIZE_PROFILES = true;
  fragmentIfcLoader.setup();

  observeElementAndAddEventListener("upload-ifc", "mousedown", () => {
    setStates();
    console.log("uploading ifc model");
    selected.updateSelected(ifcButton.name);
    ifcButton.domElement.click();
  });

  const ifcButton = fragmentIfcLoader.uiElement.get("main");
  ifcButton.domElement.classList.remove("hover:bg-ifcjs-200");
  ifcButton.domElement.classList.add("hover:bg-slate-300");
  // sideToolBar.addChild(ifcButton as OBC.Button);

  // Vue instance inside of top tool bar
  const vueComponentTimeline = createApp(Timeline);

  // Create a new DOM element to serve as the mounting point for the Vue component
  const mountPointTimeline = document.createElement("div");
  mountPointTimeline.style.height = "0%";

  // Mount the Vue component instance to the new DOM element
  vueComponentTimeline.mount(mountPointTimeline);

  // Append the new DOM element to topToolBar.domElement
  topToolBar.domElement.appendChild(mountPointTimeline);

  // const generalMenuButton = new OBC.Button(components, {
  //   name: "Underlag",
  // });
  // generalMenuButton.id = "general-button";
  // topToolBar.addChild(generalMenuButton);
  // generalMenuButton.onClick.add(() => {
  //   setDrawingInProgress(false);
  //   if (titleElement) {
  //     titleElement.textContent = "Underlag";
  //   }
  //   // @ts-ignore
  //   window.setActiveSection("general");
  // });
  // generalMenuButton.domElement.classList.remove("hover:bg-ifcjs-200");
  // generalMenuButton.domElement.classList.add("hover:bg-slate-300");

  const blueprintMenuButton = new OBC.Button(components, {
    name: "Plantegning og bygg",
  });
  blueprintMenuButton.id = "blueprint-button";
  topToolBar.addChild(blueprintMenuButton);
  blueprintMenuButton.onClick.add(() => {
    setStates();
    // if (titleElement) {
    //   titleElement.textContent = "Plantegning og bygg";
    // }
    // @ts-ignore
    // window.setActiveSection("blueprint");
  });
  blueprintMenuButton.domElement.addEventListener("mouseover", () => {
    setStates();
  });
  blueprintMenuButton.domElement.classList.remove("hover:bg-ifcjs-200");
  blueprintMenuButton.domElement.classList.add("hover:bg-slate-300");

  observeElementAndAddEventListener("go-to-blueprint", "mousedown", () => {
    setDrawingInProgress(false);
    setStates();
    if (titleElement) {
      titleElement.textContent = "Plantegning og bygg";
    }
  });

  const roofMenuButton = new OBC.Button(components, {
    name: "Tak",
  });
  roofMenuButton.id = "roof-button";
  topToolBar.addChild(roofMenuButton);
  roofMenuButton.onClick.add(() => {
    setStates();
    // if (titleElement) {
    //   titleElement.textContent = "Tak";
    // }
    // @ts-ignore
    // window.setActiveSection("roof");
  });
  roofMenuButton.domElement.classList.remove("hover:bg-ifcjs-200");
  roofMenuButton.domElement.classList.add("hover:bg-slate-300");

  observeElementAndAddEventListener(
    "go-to-previous-general",
    "mousedown",
    () => {
      if (titleElement) {
        titleElement.textContent = "Underlag";
      }
    }
  );

  observeElementAndAddEventListener("go-to-next-roof", "mousedown", () => {
    if (titleElement) {
      titleElement.textContent = "Tak";
    }
  });

  const scaffoldMenuButton = new OBC.Button(components, {
    name: "Stillas",
  });
  scaffoldMenuButton.id = "scaffold-button";
  topToolBar.addChild(scaffoldMenuButton);
  scaffoldMenuButton.onClick.add(() => {
    setStates();
    // if (titleElement) {
    //   titleElement.textContent = "Stillas";
    // }
    // @ts-ignore
    // window.setActiveSection("scaffold");
  });
  scaffoldMenuButton.domElement.classList.remove("hover:bg-ifcjs-200");
  scaffoldMenuButton.domElement.classList.add("hover:bg-slate-300");

  observeElementAndAddEventListener(
    "go-to-previous-blueprint",
    "mousedown",
    () => {
      if (titleElement) {
        titleElement.textContent = "Plantegning og bygg";
      }
    }
  );

  observeElementAndAddEventListener("go-to-next-scaffold", "mousedown", () => {
    if (titleElement) {
      titleElement.textContent = "Stillas";
    }
  });

  observeElementAndAddEventListener("go-to-previous-roof", "mousedown", () => {
    if (titleElement) {
      titleElement.textContent = "Tak";
    }
  });

  observeElementAndAddEventListener("go-to-next-supply", "mousedown", () => {
    if (titleElement) {
      titleElement.textContent = "Tillegg";
    }
  });

  const suppliesMenuButton = new OBC.Button(components, {
    name: "Tillegg",
  });
  suppliesMenuButton.id = "supplies-button";
  topToolBar.addChild(suppliesMenuButton);
  suppliesMenuButton.onClick.add(() => {
    setStates();
    // if (titleElement) {
    //   titleElement.textContent = "Tillegg";
    // }
    // // @ts-ignore
    // window.setActiveSection("supply");
  });
  suppliesMenuButton.domElement.classList.remove("hover:bg-ifcjs-200");
  suppliesMenuButton.domElement.classList.add("hover:bg-slate-300");

  observeElementAndAddEventListener(
    "go-to-previous-scaffold",
    "mousedown",
    () => {
      if (titleElement) {
        titleElement.textContent = "Stillas";
      }
    }
  );

  const orderMenuButton = new OBC.Button(components, {
    name: "Oppsummering",
  });
  orderMenuButton.id = "supplies-button";
  topToolBar.addChild(orderMenuButton);
  orderMenuButton.onClick.add(() => {
    setStates();
    if (drawer.visible) {
      const modalElement = document.getElementById("my_modal_1");
      if (modalElement && modalElement instanceof HTMLDialogElement) {
        modalElement.showModal();
      } else {
        console.error("Modal element not found or not an HTMLDialogElement");
      }
    }
  });
  orderMenuButton.domElement.classList.remove("hover:bg-ifcjs-200");
  orderMenuButton.domElement.classList.add("hover:bg-slate-300");
  orderMenuButton.domElement.classList.add("btn");
  orderMenuButton.domElement.classList.add("btn-sm");

  console.log(components.camera);

  // Move camera to top view button and create blueprint
  const createBlueprintRectangleButton = new OBC.Button(components);
  createBlueprintRectangleButton.materialIcon = "crop_free";
  createBlueprintRectangleButton.name = "Draw Blueprint";
  createBlueprintRectangleButton.tooltip = "Draw Blueprint";
  createBlueprintRectangleButton.id = "top-view-button";
  // sideToolBar.addChild(createBlueprintRectangleButton);
  createBlueprintRectangleButton.onClick.add(() => {
    console.log(createBlueprintRectangleButton.name);
    selected.updateSelected(createBlueprintRectangleButton.name);
    document.body.style.cursor = "crosshair";
    startDrawing = false;
    removeHighlightMesh(scene);
    cameraTopView(gsap, components.camera);
    setStates();
    cameraDisableOrbitalFunctionality(gsap, components.camera);
  });
  createBlueprintRectangleButton.domElement.addEventListener(
    "mouseover",
    () => {
      setStates();
    }
  );
  createBlueprintRectangleButton.domElement.classList.remove(
    "hover:bg-ifcjs-200"
  );
  createBlueprintRectangleButton.domElement.classList.add("hover:bg-slate-300");

  observeElementAndAddEventListener("top-view", "mousedown", () => {
    selected.updateSelected("Top View");
    removeHighlightMesh(scene);
    cameraTopView(gsap, components.camera);
    setStates();
  });

  observeElementAndAddEventListener("top-view", "mouseover", () => {
    // setStates();
  });

  observeElementAndAddEventListener("free-rotate", "mousedown", () => {
    document.body.style.cursor = "grab";
    selected.updateSelected("Free Rotate");
    startDrawing = false;
    cameraEnableOrbitalFunctionality(gsap, components.camera);
    setStates();
  });

  observeElementAndAddEventListener("free-rotate", "mouseenter", () => {
    setStates();
    removeHighlightMesh(scene);
    setIsDrawingBlueprint(false);
  });

  observeElementAndAddEventListener("delete-object", "mousedown", () => {
    document.body.style.cursor = "auto";
    selected.updateSelected("Delete Object");
    removeHighlightMesh(scene);
    setStates({ deletionInProgress: true });
  });

  observeElementAndAddEventListener("reset-scene", "mousedown", () => {
    selected.updateSelected("Reset Scene");
    // @ts-ignore
    window.setActiveSection("blueprint");
    setTimelineToBeginningState();

    setStates();
  });

  observeElementAndAddEventListener("move-geometry", "mousedown", () => {
    selected.updateSelected("Move Building");
  });

  observeElementAndAddEventListener("delete-building", "mousedown", () => {
    selected.updateSelected("Delete Building");
  });

  observeElementAndAddEventListener("reset-scene", "mouseover", () => {
    setStates();
  });

  observeElementAndAddEventListener("reset-scene", "mouseleave", () => {
    setStates();
  });

  //Solidify Blueprint
  const blueprintButton = new OBC.Button(components);
  blueprintButton.name = "Confirm Blueprint";
  blueprintButton.materialIcon = "dashboard";
  blueprintButton.tooltip = "Blueprint";
  blueprintButton.id = "blueprint-button";
  // sideToolBar.addChild(blueprintButton);
  blueprintButton.onClick.add(() => {
    selected.updateSelected(blueprintButton.name);
    roofButton.closeMenus();
    scaffoldButton.closeMenus();
    extrusionButton.closeMenus();
    document.body.style.cursor = "grab";
    cameraEnableOrbitalFunctionality(gsap, components.camera);
    setStates();
  });
  blueprintButton.domElement.addEventListener("mouseover", () => {
    setStates();
  });
  blueprintButton.domElement.classList.remove("hover:bg-ifcjs-200");
  blueprintButton.domElement.classList.add("hover:bg-slate-300");

  observeElementAndAddEventListener("create-blueprint", "mousedown", () => {
    document.body.style.cursor = "grab";
    cameraEnableOrbitalFunctionality(gsap, components.camera);
    setStates();
  });

  observeElementAndAddEventListener("create-blueprint", "mouseover", () => {
    setStates();
  });

  // Create Extrusion from Blueprint
  const extrusionButton = new OBC.Button(components);
  extrusionButton.name = "Extrude";
  extrusionButton.materialIcon = "view_in_ar";
  extrusionButton.tooltip = "Extrude";
  extrusionButton.id = "extrusion-button";
  // sideToolBar.addChild(extrusionButton);
  extrusionButton.onClick.add(() => {
    selected.updateSelected(extrusionButton.name);
    blueprintButton.closeMenus();
    roofButton.closeMenus();
    scaffoldButton.closeMenus();
    document.body.style.cursor = "auto";
    setStates();
  });
  extrusionButton.domElement.addEventListener("mouseover", () => {
    setStates();
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
    selected.updateSelected("Create Extrusion");
    setStates();
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
    selected.updateSelected("Edit Extrusion");
    setStates();
    cameraDisableOrbitalFunctionality(gsap, components.camera);
  });
  extrusionButton.addChild(createEditExtrusionButton);
  createEditExtrusionButton.domElement.classList.remove("hover:bg-ifcjs-200");
  createEditExtrusionButton.domElement.classList.add("hover:bg-slate-300");

  const roofButton = new OBC.Button(components, {
    closeOnClick: true,
  });
  roofButton.materialIcon = "roofing";
  roofButton.name = "Roof";
  roofButton.tooltip = "Roof";
  roofButton.id = "roof-button";
  // sideToolBar.addChild(roofButton);
  roofButton.onClick.add(() => {
    selected.updateSelected(roofButton.name);
    blueprintButton.closeMenus();
    extrusionButton.closeMenus();
    scaffoldButton.closeMenus();
    document.body.style.cursor = "auto";
    setStates();
  });
  roofButton.domElement.addEventListener("mouseover", () => {
    setStates();
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
    selected.updateSelected("Gable Roof");
    setStates();
    cameraDisableOrbitalFunctionality(gsap, components.camera);
  });
  createGableRoofButton.domElement.addEventListener("mouseleave", () => {
    setStates({ drawingInProgress: true });
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
    selected.updateSelected("Shed Roof");
    setStates();
    cameraDisableOrbitalFunctionality(gsap, components.camera);
  });
  createShedRoofButton.domElement.addEventListener("mouseleave", () => {
    setStates({ drawingInProgress: true });
  });
  roofButton.addChild(createShedRoofButton);
  createShedRoofButton.domElement.classList.remove("hover:bg-ifcjs-200");
  createShedRoofButton.domElement.classList.add("hover:bg-slate-300");

  const createEditRoofButton = new OBC.Button(components, {
    materialIconName: "unfold_less",
    name: "Edit Roof",
    closeOnClick: true,
  });
  createEditRoofButton.onClick.add(() => {
    document.body.style.cursor = "crosshair";
    selected.updateSelected("Edit Roof");
    setStates();
    cameraDisableOrbitalFunctionality(gsap, components.camera);
  });
  roofButton.addChild(createEditRoofButton);
  createEditRoofButton.domElement.classList.remove("hover:bg-ifcjs-200");
  createEditRoofButton.domElement.classList.add("hover:bg-slate-300");

  const scaffoldButton = new OBC.Button(components);
  scaffoldButton.materialIcon = "foundation";
  scaffoldButton.tooltip = "Scaffolding";
  scaffoldButton.name = "Scaffolding";
  scaffoldButton.id = "scaffold-button";
  // sideToolBar.addChild(scaffoldButton);
  scaffoldButton.onClick.add(() => {
    selected.updateSelected(scaffoldButton.name);
    blueprintButton.closeMenus();
    roofButton.closeMenus();
    extrusionButton.closeMenus();
    // setStates()
  });
  scaffoldButton.domElement.addEventListener("mouseover", () => {
    // setStates()
  });
  scaffoldButton.domElement.addEventListener("mouseleave", () => {
    // setStates()
  });
  scaffoldButton.domElement.addEventListener("mouseenter", () => {
    setStates();
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
    startDrawing = true;
    document.body.style.cursor = "auto";
    selected.updateSelected("Draw Scaffolding Outline");
    removeHighlightMesh(scene);
    setDrawingInProgress(false);
    setDeletionInProgress(false);
    setDrawingScaffoldingInProgress(false);
    setDrawingInProgressSwitch(false);
  });
  // drawScaffoldButton.domElement.addEventListener("mouseover", () => {
  //   setDrawingInProgress(false);
  // });
  drawScaffoldButton.domElement.addEventListener("mouseleave", () => {
    if (startDrawing) {
      selected.updateSelected("Draw Scaffolding Outline");
      document.body.style.cursor = "auto";
      removeHighlightMesh(scene);
      setDrawingInProgress(false);
      setDeletionInProgress(false);
      setDrawingScaffoldingInProgress(true);
    }
  });
  scaffoldButton.addChild(drawScaffoldButton);
  drawScaffoldButton.domElement.classList.remove("hover:bg-ifcjs-200");
  drawScaffoldButton.domElement.classList.add("hover:bg-slate-300");

  observeElementAndAddEventListener("draw-scaffold", "mousedown", () => {
    startDrawing = true;
    document.body.style.cursor = "auto";
    cameraTopView(gsap, components.camera);
    //@ts-ignore
    components.camera.setProjection("Orthographic");
    removeHighlightMesh(scene);
    setDrawingInProgress(false);
    setDeletionInProgress(false);
    setDrawingScaffoldingInProgress(false);
    setDrawingInProgressSwitch(false);
  });

  observeElementAndAddEventListener("draw-scaffold", "mouseleave", () => {
    if (startDrawing) {
      document.body.style.cursor = "auto";
      removeHighlightMesh(scene);
      setDrawingInProgress(false);
      setDeletionInProgress(false);
      setDrawingScaffoldingInProgress(true);
    }
  });

  // generate scaffolding outline
  const generateScaffoldOutlineButton = new OBC.Button(components, {
    materialIconName: "aspect_ratio",
    name: "Generate Scaffolding Outline",
    closeOnClick: true,
  });
  generateScaffoldOutlineButton.onClick.add(() => {
    selected.updateSelected("Generate Scaffolding Outline");
    document.body.style.cursor = "auto";
    setStates();
  });
  generateScaffoldOutlineButton.domElement.addEventListener("mouseover", () => {
    setStates();
  });
  generateScaffoldOutlineButton.domElement.addEventListener(
    "mouseleave",
    () => {
      setStates();
    }
  );
  scaffoldButton.addChild(generateScaffoldOutlineButton);
  generateScaffoldOutlineButton.domElement.classList.remove(
    "hover:bg-ifcjs-200"
  );
  generateScaffoldOutlineButton.domElement.classList.add("hover:bg-slate-300");

  observeElementAndAddEventListener("generate-scaffolding", "mousedown", () => {
    selected.updateSelected("Generate Scaffolding Outline");
    document.body.style.cursor = "auto";
    setStates();
  });

  // generate scaffolding
  const generateScaffoldButton = new OBC.Button(components, {
    materialIconName: "select_all",
    name: "Generate Scaffolding From Outline",
    closeOnClick: true,
  });
  generateScaffoldButton.onClick.add(() => {
    selected.updateSelected("Generate Scaffolding From Outline");
    document.body.style.cursor = "auto";
    setStates();
  });
  generateScaffoldButton.domElement.addEventListener("mouseover", () => {
    setStates();
  });
  generateScaffoldButton.domElement.addEventListener("mouseleave", () => {
    setStates();
  });
  scaffoldButton.addChild(generateScaffoldButton);
  generateScaffoldButton.domElement.classList.remove("hover:bg-ifcjs-200");
  generateScaffoldButton.domElement.classList.add("hover:bg-slate-300");

  const drawerToolBar = new OBC.Toolbar(components);
  drawerToolBar.position = "right";
  components.ui.addToolbar(drawerToolBar);
  drawerToolBar.domElement.style.position = "absolute";
  drawerToolBar.domElement.style.top = "20px";
  drawerToolBar.domElement.style.right = "15px";
  drawerToolBar.domElement.addEventListener("mouseleave", () => {
    document.body.style.cursor = "auto";
    setDrawingInProgress(true);
  });
  drawerToolBar.domElement.classList.remove("bg-ifcjs-100");
  drawerToolBar.domElement.classList.add("bg-glass");
  drawerToolBar.domElement.classList.add("hover:bg-[#111115]");

  //Solidify Blueprint
  // const testButton = new OBC.Button(components);
  // testButton.materialIcon = "quiz";
  // testButton.tooltip = "Test";
  // testButton.id = "blueprint-button";
  // mainToolbar.addChild(testButton);

  // testButton.onClick.add(() => {
  //   document.body.style.cursor = "auto";
  //   roofButton.closeMenus();
  //   scaffoldButton.closeMenus();
  //   extrusionButton.closeMenus();
  //   setStates();
  // });
  // testButton.domElement.addEventListener("mouseover", () => {
  //   setStates();
  // });
  // testButton.domElement.classList.remove("hover:bg-ifcjs-200");
  // testButton.domElement.classList.add("hover:bg-slate-300");

  // Allow panning and rotating button
  const freeRotateButton = new OBC.Button(components);
  freeRotateButton.materialIcon = "pan_tool";
  freeRotateButton.tooltip = "Free Rotate";
  freeRotateButton.id = "rotate-button";
  freeRotateButton.name = "Free Rotate";
  // sideToolBar.addChild(freeRotateButton);
  freeRotateButton.onClick.add(() => {
    startDrawing = false;
    selected.updateSelected(freeRotateButton.name);
    removeHighlightMesh(scene);
    document.body.style.cursor = "grab";
    cameraEnableOrbitalFunctionality(gsap, components.camera);
    setStates();
  });
  freeRotateButton.domElement.addEventListener("mouseenter", () => {
    setStates();
  });
  freeRotateButton.domElement.classList.remove("hover:bg-ifcjs-200");
  freeRotateButton.domElement.classList.add("hover:bg-slate-300");

  const cameraToggleButton = new OBC.Button(components);
  cameraToggleButton.name = "Toggle Camera";
  cameraToggleButton.materialIcon = "cameraswitch";
  cameraToggleButton.tooltip = "Toggle View";
  cameraToggleButton.id = "rotate-button";
  // sideToolBar.addChild(cameraToggleButton);
  cameraToggleButton.onClick.add(() => {
    selected.updateSelected(cameraToggleButton.name);
    document.body.style.cursor = "grab";
    cameraEnableOrbitalFunctionality(gsap, components.camera);
    setStates();
    // @ts-ignore
    components.camera.toggleProjection();
  });
  cameraToggleButton.domElement.addEventListener("mouseenter", () => {
    setStates();
  });
  cameraToggleButton.domElement.classList.remove("hover:bg-ifcjs-200");
  cameraToggleButton.domElement.classList.add("hover:bg-slate-300");

  const deleteObjectButton = new OBC.Button(components);
  deleteObjectButton.materialIcon = "delete_forever";
  deleteObjectButton.tooltip = "Delete Object";
  deleteObjectButton.name = "Delete Object";
  deleteObjectButton.id = "delete-button";
  // sideToolBar.addChild(deleteObjectButton);
  deleteObjectButton.onClick.add(() => {
    selected.updateSelected(deleteObjectButton.name);
    document.body.style.cursor = "auto";
    removeHighlightMesh(scene);
    setStates({ deletionInProgress: true });
  });
  deleteObjectButton.domElement.classList.remove("hover:bg-ifcjs-200");
  deleteObjectButton.domElement.classList.add("hover:bg-slate-300");

  // Clear Scene
  // const clearSceneButton = new OBC.Button(components);
  // clearSceneButton.materialIcon = "check_box_outline_blank";
  // clearSceneButton.tooltip = "Reset Scene";
  // clearSceneButton.id = "clear-scene-button";
  // clearSceneButton.domElement.id = "clear-scene-button"
  // mainToolbar.addChild(clearSceneButton);
  // clearSceneButton.onClick.add(() => {
  //   document.body.style.cursor = "auto";
  //   setStates()
  //   // console.log(clearSceneButton.domElement)
  // });
  // clearSceneButton.domElement.addEventListener("mouseover", () => {
  //   setStates()
  // });
  // clearSceneButton.domElement.addEventListener("mouseleave", () => {
  //   setStates()
  // });
  // clearSceneButton.domElement.classList.remove("hover:bg-ifcjs-200");
  // clearSceneButton.domElement.classList.add("hover:bg-slate-300");

  // Function to update the title
  let titleElement: Element | null;
  const updateTitle = () => {
    titleElement = drawer.domElement.querySelector(
      "h3.text-3xl.text-ifcjs-200.font-medium.my-0"
    );
    if (titleElement) {
      titleElement.textContent = "Plantegning og bygg";
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
    setStates();
    drawer.visible = !drawer.visible;
  });
  drawerMenuButton.domElement.addEventListener("mouseover", () => {
    removeHighlightMesh(scene);
    setStates();
  });
  drawerMenuButton.domElement.addEventListener("mouseleave", () => {
    setStates();
  });
  drawerMenuButton.domElement.classList.remove("hover:bg-ifcjs-200");
  drawerMenuButton.domElement.classList.add("hover:bg-slate-300");

  // menu power button
  const menuPowerButton = new OBC.Button(components);
  menuPowerButton.materialIcon = "fullscreen";
  menuPowerButton.id = "menu-power-button";
  drawerToolBar.addChild(menuPowerButton);
  menuPowerButton.onClick.add(() => {
    // window.location.href = "/home";
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen();
    }
  });
  menuPowerButton.domElement.classList.remove("hover:bg-ifcjs-200");
  menuPowerButton.domElement.classList.add("hover:bg-slate-300");

  // save button
  const menuSaveButton = new OBC.Button(components);
  menuSaveButton.materialIcon = "save";
  menuSaveButton.id = "menu-save-button";
  drawerToolBar.addChild(menuSaveButton);
  menuSaveButton.domElement.classList.remove("hover:bg-ifcjs-200");
  menuSaveButton.domElement.classList.add("hover:bg-slate-300");
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
  drawer.visible = true; // change this to true to make the drawer open on mount
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
      selected.updateSelected("Tegn Plantegning");
      startDrawing = false;
      removeHighlightMesh(scene);
      cameraTopView(gsap, components.camera);
      setStates();
      cameraDisableOrbitalFunctionality(gsap, components.camera);
    }
  );

  // observeElementAndAddEventListener("startDrawingPolygon", "mousedown", () => {
  //   startDrawing = true;
  //   console.log("draw polygon");
  //   document.body.style.cursor = "auto";
  //   setStates();
  // });

  // observeElementAndAddEventListener("startDrawingPolygon", "mouseleave", () => {
  //   if (startDrawing) {
  //     console.log("polygon drawing start");
  //     setStates({ drawingInProgress: true, drawingInProgressSwitch: true });
  //   }
  // });

  ////////////////////////////////////////////////
  return [
    blueprintButton,
    createBlueprintRectangleButton,
    freeRotateButton,
    createGableRoofButton,
    createShedRoofButton,
    createEditRoofButton,
    createEditExtrusionButton,
    drawScaffoldButton,
    generateScaffoldButton,
    generateScaffoldOutlineButton,
    createExtrusionButton,
    // clearSceneButton,
    // testButton,
  ];
};
