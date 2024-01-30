import * as THREE from "three";
import * as OBC from "openbim-components";

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
        console.log(line);
        console.log(scene);
      }
    }
  });
}

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
  });

  // Create the mesh with the extruded geometry
  const meshExtrude = new THREE.Mesh(geometryExtrude, materialExtrude);
  meshExtrude.rotateX(Math.PI / 2);
  meshExtrude.userData = shape;
  // meshExtrude.position.y = 1;
  meshExtrude.name = "extrusion";
  scene.add(meshExtrude);
}

interface IntersectionResult {
  point: THREE.Vector3;
}

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

  const rectanglePoints = [
    pointStartMinY,
    pointStartMaxY,
    pointEndMaxY,
    pointEndMinY,
    pointStartMinY,
  ];

  const geometry = new THREE.BufferGeometry().setFromPoints(rectanglePoints);
  const material = new THREE.LineBasicMaterial({ color: 0x000000 });
  markup = new THREE.Line(geometry, material);
  markup.name = "rectangle line";
  markup.userData = rectanglePoints;
  console.log(markup);
  markupGroup.add(markup);
}

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
