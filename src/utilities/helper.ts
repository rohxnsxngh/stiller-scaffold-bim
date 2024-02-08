import * as OBC from "openbim-components";

export const objectsEqual = (o1: any, o2: any): boolean =>
  typeof o1 === "object" && Object.keys(o1).length > 0
    ? Object.keys(o1).length === Object.keys(o2).length &&
      Object.keys(o1).every((p) => objectsEqual(o1[p], o2[p]))
    : o1 === o2;

export const deepEqual = (x: any, y: any): boolean => {
  return x && y && typeof x === "object" && typeof y === "object"
    ? Object.keys(x).length === Object.keys(y).length &&
        Object.keys(x).reduce(function (isEqual: any, key: any) {
          return isEqual && deepEqual(x[key], y[key]);
        }, true)
    : x === y;
};

export function getMousePosition(
  e: MouseEvent,
  mouse: THREE.Vector2,
  raycaster: THREE.Raycaster,
  scene: THREE.Scene,
  components: OBC.Components
) {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  // @ts-ignore
  raycaster.setFromCamera(mouse, components.camera.activeCamera);
  const intersection = raycaster.intersectObjects(scene.children);
  return intersection;
}

export function distanceFromPointToLine(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  x0: number,
  y0: number
) {
  const A = y2 - y1;
  const B = x1 - x2;
  const C = x2 * y1 - x1 * y2;

  return Math.abs(A * x0 + B * y0 + C) / Math.sqrt(A * A + B * B);
}
