import * as THREE from "three";
import * as OBC from "openbim-components";
import { CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer.js";

// Create Shape Outline
export function createShapeIsOutlined(
  intersects: any,
  points: any,
  highlightMesh: THREE.Mesh,
  scene: THREE.Scene,
  cube: THREE.Mesh
) {
  intersects.forEach(function (intersect: any) {
    if (intersect.object.name === "ground") {
      points.push(
        new THREE.Vector3(highlightMesh.position.x, 0, highlightMesh.position.z)
      );
      const cubeClone = cube.clone();
      cubeClone.position.set(
        highlightMesh.position.x,
        0.5,
        highlightMesh.position.z
      );
      cubeClone.name = "cubeClone";
      scene.add(cubeClone);

      // Create line segment from the last two points
      if (points.length >= 2) {
        const geometry = new THREE.BufferGeometry().setFromPoints([
          points[points.length - 2],
          points[points.length - 1],
        ]);
        const material = new THREE.LineBasicMaterial({ color: 0x00ff00 });
        const line = new THREE.Line(geometry, material);
        line.name = "line";
        const [length, lastPoint, firstPoint] = measureLineLength([
          points[points.length - 2],
          points[points.length - 1],
        ]);
        line.userData = {
          length: length,
          first_point: firstPoint,
          last_point: lastPoint,
        };
        scene.add(line);
      }
    }
  });
}

// helper function to measure line length
function measureLineLength(points: any) {
  const lastIndex = points.length - 1;
  const secondToLastIndex = points.length - 2;
  if (points.length > 1) {
    let length;
    // use pythagorean theorem to calculate distance
    const xLeg = Math.abs(points[lastIndex].x - points[secondToLastIndex].x);
    const zLeg = Math.abs(points[lastIndex].z - points[secondToLastIndex].z);
    const hypotenuse = Math.sqrt(Math.pow(xLeg, 2) + Math.pow(zLeg, 2));
    length = hypotenuse;

    return [length, points[lastIndex], points[secondToLastIndex]];
  } else {
    return [0, null, null];
  }
}

// Create Blueprint from Shape Outline
export function createBlueprintFromShapeOutline(
  points: any,
  scene: THREE.Scene
) {
  if (
    points[0].x === points[points.length - 1].x &&
    points[0].z === points[points.length - 1].z
  ) {
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh && child.name === "highlightMesh") {
        scene.remove(child);
      }
    });

    // Create shape
    if (points.length >= 3) {
      let shape = new THREE.Shape();
      shape.moveTo(points[0].x, points[0].z);
      for (let i = 1; i < points.length; i++) {
        shape.lineTo(points[i].x, points[i].z);
      }
      shape.lineTo(points[0].x, points[0].z); // close the shape

      // Create mesh from shape
      const geometryShape = new THREE.ShapeGeometry(shape);
      const materialShape = new THREE.MeshBasicMaterial({
        color: 0xff0000,
        side: THREE.DoubleSide,
      });
      const meshShape = new THREE.Mesh(geometryShape, materialShape);
      meshShape.rotateX(Math.PI / 2);
      //   meshShape.position.y = 0.2
      meshShape.name = "blueprint";
      meshShape.userData = shape;
      scene.add(meshShape);
    }

    //Empty Points
    points = [];

    return points;
  }
}

export function createExtrusionFromBlueprint(blueprintShape: any, scene: any) {
  let shape = blueprintShape;
  const extrudeSettings = {
    depth: -12,
    bevelEnabled: false, // You can enable beveling if needed
  };

  // Create extruded geometry
  const geometryExtrude = new THREE.ExtrudeGeometry(shape, extrudeSettings);

  // Material for the extruded mesh
  const materialExtrude = new THREE.MeshBasicMaterial({
    color: 0xff0000,
    side: THREE.DoubleSide,
    wireframe: true,
  });

  // Create the mesh with the extruded geometry
  const meshExtrude = new THREE.Mesh(geometryExtrude, materialExtrude);
  meshExtrude.rotateX(Math.PI / 2);
  meshExtrude.userData = shape;
  meshExtrude.name = "extrusion";
  scene.add(meshExtrude);
}

interface IntersectionResult {
  point: THREE.Vector3;
}

// function to create rectangle blueprint from dragging mouse
export function createRectangle(
  { start, end }: { start: any; end: any },
  markupGroup: THREE.Group,
  markup: any,
  components: OBC.Components,
  plane: THREE.Mesh,
  raycaster: THREE.Raycaster
) {
  markupGroup.children.forEach((child) => {
    markupGroup.remove(child);
  });
  const startPoint = castPoint(start, components, plane, raycaster);
  const endPoint = castPoint(end, components, plane, raycaster);
  if (startPoint == null || endPoint == null) {
    return;
  }

  const pointStartMinY = new THREE.Vector3(
    startPoint.point.x,
    0,
    startPoint.point.z
  );
  const pointStartMaxY = new THREE.Vector3(
    startPoint.point.x,
    0,
    endPoint.point.z
  );
  const pointEndMinY = new THREE.Vector3(
    endPoint.point.x,
    0,
    startPoint.point.z
  );
  const pointEndMaxY = new THREE.Vector3(endPoint.point.x, 0, endPoint.point.z);

  // Calculate the lengths of the sides
  const width = pointStartMinY.distanceTo(pointStartMaxY);
  const height = pointStartMaxY.distanceTo(pointEndMaxY);

  const rectanglePoints = [
    pointStartMinY,
    pointStartMaxY,
    pointEndMaxY,
    pointEndMinY,
    pointStartMinY,
  ];

  const centerX = startPoint.point.x + height / 2;
  const centerZ = startPoint.point.z + width / 2;

  //For each side of the rectangle, calculate the midpoint and create a label
  const labels = createLabels(rectanglePoints);
  currentLabels.forEach((label) => {
    attachLabelChangeHandler(
      label,
      markupGroup,
      width,
      height,
      centerX,
      centerZ
    );
  });

  const geometry = new THREE.PlaneGeometry(height, width);
  const material = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide,
  });
  markup = new THREE.Mesh(geometry, material);
  markup.position.set(centerX, 0, centerZ);
  markup.rotation.x = Math.PI / 2;
  markup.name = "rectanglePlane";
  markup.userData = {
    rectanglePoints: rectanglePoints,
    width: width,
    height: height,
  };
  markupGroup.add(markup);

  return [markup, labels];
}
let currentLabels: CSS2DObject[] = [];
// create labels for top view rectangle tool
function createLabels(rectanglePoints: THREE.Vector3[] | undefined) {
  // Clear the current labels array
  currentLabels = [];

  if (rectanglePoints) {
    for (let i = 0; i < rectanglePoints.length - 1; i++) {
      const midpoint = new THREE.Vector3().lerpVectors(
        rectanglePoints[i],
        rectanglePoints[i + 1],
        0.5
      );
      const distance = rectanglePoints[i].distanceTo(rectanglePoints[i + 1]);
      const labelDiv = document.createElement("div");
      labelDiv.className = "label bg-black text-white pointer-events-auto";
      labelDiv.textContent = `${distance.toFixed(2)} m.`;
      labelDiv.contentEditable = "true";

      const label = new CSS2DObject(labelDiv);
      label.name = "rectangleLabel";
      label.position.copy(
        new THREE.Vector3(midpoint.x, midpoint.y, midpoint.z + 1)
      );
      currentLabels.push(label);
    }
  }

  return currentLabels;
}

// updates the labels after a new dimension has been passed in
function updateLabelsForNewDimensions(
  newRectanglePoints: THREE.Vector3[] | undefined
) {
  // Assuming newRectanglePoints has the updated points for the rectangle
  if (newRectanglePoints) {
    currentLabels.forEach((label, index) => {
      if (index < newRectanglePoints.length - 1) {
        const midpoint = new THREE.Vector3().lerpVectors(
          newRectanglePoints[index],
          newRectanglePoints[index + 1],
          0.5
        );
        const distance = newRectanglePoints[index].distanceTo(
          newRectanglePoints[index + 1]
        );
        label.position.copy(midpoint);
        label.element.textContent = `${distance.toFixed(2)} m.`;
      }
    });
  }
}

// serves as a callback function which listens for when the user clicks on a label
// and when a user changes the value within a label
function attachLabelChangeHandler(
  label: CSS2DObject,
  markupGroup: THREE.Group,
  width: number,
  height: number,
  centerX: any,
  centerZ: any
) {
  const labelElement = label.element as HTMLDivElement;
  let oldValue: any;

  labelElement.addEventListener("focus", () => {
    oldValue = labelElement.textContent;
  });

  labelElement.addEventListener("blur", () => {
    const newValue = labelElement.textContent;
    if (oldValue !== newValue) {
      // create new plane based on inputs
      const newRectangleVertices = updateRectangleBlueprintGeometry(
        newValue,
        oldValue,
        markupGroup,
        width,
        height,
        centerX,
        centerZ
      );

      // create new labels based on vertices
      updateLabelsForNewDimensions(newRectangleVertices);

      return currentLabels;
    }
  });
}

// cast point for top view rectangle tool
function castPoint(
  mouse: any,
  components: OBC.Components,
  plane: THREE.Mesh,
  raycaster: THREE.Raycaster
): IntersectionResult | null {
  let result = null;
  // @ts-ignore
  raycaster.setFromCamera(mouse, components.camera.activeCamera);
  const intersects = raycaster.intersectObject(plane);
  intersects.some((item) => {
    if (item.object == plane) {
      result = item;
      return true;
    }
  });
  return result;
}

// updates the rectangle based new dimensions that are passed in
function updateRectangleBlueprintGeometry(
  newValue: string | null,
  oldValue: string | null,
  markupGroup: THREE.Group,
  width: number,
  height: number,
  centerX: any,
  centerZ: any
) {
  let oldDistance, newDistance;
  if (newValue !== null && oldValue !== null) {
    oldDistance = parseFloat(oldValue).toFixed(2);
    newDistance = parseFloat(newValue).toFixed(2);
  }

  let planeWidth, planeHeight;

  if (
    (markupGroup.children[0] as THREE.Mesh).geometry instanceof
    THREE.PlaneGeometry
  ) {
    const planeGeometry = (markupGroup.children[0] as THREE.Mesh)
      .geometry as THREE.PlaneGeometry;
    planeWidth = planeGeometry.parameters.width.toFixed(2);
  }
  if (
    (markupGroup.children[0] as THREE.Mesh).geometry instanceof
    THREE.PlaneGeometry
  ) {
    const planeGeometry = (markupGroup.children[0] as THREE.Mesh)
      .geometry as THREE.PlaneGeometry;
    planeHeight = planeGeometry.parameters.height.toFixed(2);
  }

  if (oldDistance === planeWidth) {
    // reset the width to the current plane
    if (planeHeight !== undefined && planeWidth !== undefined) {
      width = parseFloat(planeHeight);
      height = parseFloat(planeWidth);
    }

    markupGroup.children.forEach((child) => {
      markupGroup.remove(child);
    });

    const geometry = new THREE.PlaneGeometry(Number(newDistance), width);
    const material = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
    });
    const newRectangleBlueprint = new THREE.Mesh(geometry, material);
    newRectangleBlueprint.position.set(centerX, 0, centerZ);
    const halfWidth = newRectangleBlueprint.geometry.parameters.width / 2;
    const halfHeight = newRectangleBlueprint.geometry.parameters.height / 2;

    // creating vertices from the shape of the plane
    const corner1 = new THREE.Vector3(-halfWidth, 0, -halfHeight)
      .applyMatrix4(newRectangleBlueprint.matrixWorld)
      .add(newRectangleBlueprint.position);
    const corner2 = new THREE.Vector3(halfWidth, 0, -halfHeight)
      .applyMatrix4(newRectangleBlueprint.matrixWorld)
      .add(newRectangleBlueprint.position);
    const corner3 = new THREE.Vector3(halfWidth, 0, halfHeight)
      .applyMatrix4(newRectangleBlueprint.matrixWorld)
      .add(newRectangleBlueprint.position);
    const corner4 = new THREE.Vector3(-halfWidth, 0, halfHeight)
      .applyMatrix4(newRectangleBlueprint.matrixWorld)
      .add(newRectangleBlueprint.position);

    const rectanglePointsUpdated = [
      corner1,
      corner2,
      corner3,
      corner4,
      corner1,
    ];

    newRectangleBlueprint.rotation.x = Math.PI / 2;
    newRectangleBlueprint.name = "rectanglePlane";
    newRectangleBlueprint.userData = {
      rectanglePoints: rectanglePointsUpdated,
      width: width,
      height: height,
    };
    markupGroup.add(newRectangleBlueprint);

    return rectanglePointsUpdated;
  }
  if (oldDistance === planeHeight) {
    // reset the width to the current plane
    if (planeHeight !== undefined && planeWidth !== undefined) {
      width = parseFloat(planeHeight);
      height = parseFloat(planeWidth);
    }

    markupGroup.children.forEach((child) => {
      markupGroup.remove(child);
    });

    const geometry = new THREE.PlaneGeometry(height, Number(newDistance));
    const material = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
    });
    const newRectangleBlueprint = new THREE.Mesh(geometry, material);
    newRectangleBlueprint.position.set(centerX, 0, centerZ);
    const halfWidth = newRectangleBlueprint.geometry.parameters.width / 2;
    const halfHeight = newRectangleBlueprint.geometry.parameters.height / 2;

    // creating vertices from the shape of the plane
    const corner1 = new THREE.Vector3(-halfWidth, 0, -halfHeight)
      .applyMatrix4(newRectangleBlueprint.matrixWorld)
      .add(newRectangleBlueprint.position);
    const corner2 = new THREE.Vector3(halfWidth, 0, -halfHeight)
      .applyMatrix4(newRectangleBlueprint.matrixWorld)
      .add(newRectangleBlueprint.position);
    const corner3 = new THREE.Vector3(halfWidth, 0, halfHeight)
      .applyMatrix4(newRectangleBlueprint.matrixWorld)
      .add(newRectangleBlueprint.position);
    const corner4 = new THREE.Vector3(-halfWidth, 0, halfHeight)
      .applyMatrix4(newRectangleBlueprint.matrixWorld)
      .add(newRectangleBlueprint.position);

    const rectanglePointsUpdated = [
      corner1,
      corner2,
      corner3,
      corner4,
      corner1,
    ];

    newRectangleBlueprint.rotation.x = Math.PI / 2;
    newRectangleBlueprint.name = "rectanglePlane";
    newRectangleBlueprint.userData = {
      rectanglePoints: rectanglePointsUpdated,
      width: width,
      height: height,
    };
    markupGroup.add(newRectangleBlueprint);

    return rectanglePointsUpdated;
  }
}

// create roof from extrusion shape
export function createRoof(child: any, scene: THREE.Scene) {
  console.log(child, "extrusion found");
  console.log("depth:", child.geometry.parameters.options.depth);
  console.log("position:", child.userData);
  console.log("line curve points:", child.userData.curves[0].v1);
  console.log("line curve points:", child.userData.curves[0].v2);

  // Calculate the midpoint between the two points
  const midpoint = new THREE.Vector2();
  midpoint
    .addVectors(child.userData.curves[0].v1, child.userData.curves[0].v2)
    .multiplyScalar(0.5);

  // Create a third point that forms a right angle with the line formed by the two points
  const direction = new THREE.Vector2();
  direction.subVectors(
    child.userData.curves[0].v2,
    child.userData.curves[0].v1
  );
  const normal = new THREE.Vector2(direction.y, -direction.x);
  const thirdPoint = new THREE.Vector2();
  thirdPoint.addVectors(midpoint, normal);

  // Create a triangle using these three points
  const shape = new THREE.Shape();
  shape.moveTo(child.userData.curves[0].v1.x, child.userData.curves[0].v1.y);
  shape.lineTo(child.userData.curves[0].v2.x, child.userData.curves[0].v2.y);
  shape.lineTo(thirdPoint.x, thirdPoint.y);
  shape.lineTo(child.userData.curves[0].v1.x, child.userData.curves[0].v1.y); // close the shape

  const extrudeHeight = -1 * child.geometry.parameters.options.depth;

  const geometry = new THREE.ShapeGeometry(shape);
  const material = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide,
  });
  const triangle = new THREE.Mesh(geometry, material);
  triangle.position.y = extrudeHeight;
  triangle.rotateOnAxis(new THREE.Vector3(1, 0, 0), Math.PI / 2);

  const startPoint = new THREE.Vector3(
    child.userData.curves[0].v1.x,
    extrudeHeight,
    child.userData.curves[0].v1.y
  );
  const endPoint = new THREE.Vector3(
    child.userData.curves[0].v2.x,
    extrudeHeight,
    child.userData.curves[0].v2.y
  );

  const lineGeometry = new THREE.BufferGeometry().setFromPoints([
    startPoint,
    endPoint,
  ]);
  const lineMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00 }); // Red color
  const rotationAxisLine = new THREE.Line(lineGeometry, lineMaterial);
  scene.add(rotationAxisLine);

  // // Assuming 'objectToRotate' is the object you want to rotate around the line
  // // Calculate the direction vector from startPoint to endPoint
  const edgeDirection = new THREE.Vector3()
    .subVectors(endPoint, startPoint)
    .normalize();

  // // Calculate the translation vector to move the object to the origin
  // const translationToOrigin = new THREE.Vector3().copy(startPoint).negate();

  // // Translate the object to the origin
  // triangle.position.add(translationToOrigin);

  // // Determine the angle of rotation (in radians)
  // const angle = Math.PI / 2; // Example: Rotate 45 degrees

  // // Rotate the object around the axis
  // triangle.rotateOnAxis(edgeDirection, angle);

  // // Translate the object back to its original position
  // triangle.position.sub(translationToOrigin);

  scene.add(triangle);
  console.log("triangle", triangle)

  // After creating the triangle...
  const axesHelper = new THREE.AxesHelper(5); // Length of the axes
  axesHelper.position.copy(triangle.position); // Position the axes helper at the triangle's position
  scene.add(axesHelper); // Add the axes helper to the scene
}
