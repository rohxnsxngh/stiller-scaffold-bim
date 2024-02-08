import * as OBC from "openbim-components";
import { setDrawingInProgress } from "./toolbar";

export const createDrawer = (
  components: OBC.Components
) => {
  const drawerToolBar = new OBC.Toolbar(components);
  drawerToolBar.position = "right";
  components.ui.addToolbar(drawerToolBar);
  drawerToolBar.domElement.style.position = "absolute";
  drawerToolBar.domElement.style.top = "20px";
  drawerToolBar.domElement.style.right = "10px";
  drawerToolBar.domElement.addEventListener("mouseleave", () => {
    setDrawingInProgress(true);
  });

  const drawerMenuButton = new OBC.Button(components);
  drawerMenuButton.materialIcon = "menu";
  drawerMenuButton.tooltip = "Menu";
  drawerMenuButton.id = "menu-button";
  drawerToolBar.addChild(drawerMenuButton);
  drawerMenuButton.onClick.add(() => {
    setDrawingInProgress(false);
  });
  drawerMenuButton.domElement.addEventListener("mouseover", () => {
    setDrawingInProgress(true);
  });

  const drawer = new OBC.FloatingWindow(components);
  drawer.visible = false;
  drawer.domElement.style.position = "right";
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

  const title = document.createElement("h1");
  title.textContent = "Drawer Title";
  drawer.domElement.appendChild(title);

  const paragraph = document.createElement("p");
  paragraph.textContent = "This is some text in the drawer.";
  drawer.domElement.appendChild(paragraph);

  const button = new OBC.Button(components);
  button.materialIcon = "info";
  button.tooltip = "Info";
  button.id = "info-button";
  drawer.domElement.appendChild(button.domElement);

  // Attach an onClick event handler to the button
  button.onClick.add(() => {
    console.log("Hello button");
  });
};
