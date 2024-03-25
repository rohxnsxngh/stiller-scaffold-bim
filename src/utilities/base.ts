import * as THREE from "three";
import { SVGLoader } from "three/addons/loaders/SVGLoader.js";
import svg from "../assets/images/GeneralSection/TerrainBlockGrass.svg";

export function loadSymbol(scene: THREE.Scene) {
  const loader = new SVGLoader();

  loader.load(svg, function (data) {
    const group = new THREE.Group();
    group.scale.multiplyScalar(0.25);
    group.position.x = -70;
    group.position.y = 70;
    group.scale.y *= -1;

    let renderOrder = 0;

    for (const path of data.paths) {
      const fillColor = path.userData.style.fill;

      if (fillColor !== undefined && fillColor !== "none") {
        const material = new THREE.MeshBasicMaterial({
          color: new THREE.Color().setStyle(fillColor),
          opacity: path.userData.style.fillOpacity,
          transparent: true,
          side: THREE.DoubleSide,
          depthWrite: false,
        });

        const shapes = SVGLoader.createShapes(path);

        for (const shape of shapes) {
          const geometry = new THREE.ShapeGeometry(shape);
          const mesh = new THREE.Mesh(geometry, material);
          mesh.renderOrder = renderOrder++;

          group.add(mesh);
        }
      }

      const strokeColor = path.userData.style.stroke;

      if (strokeColor !== undefined && strokeColor !== "none") {
        const material = new THREE.MeshBasicMaterial({
          color: new THREE.Color().setStyle(strokeColor),
          opacity: path.userData.style.strokeOpacity,
          transparent: true,
          side: THREE.DoubleSide,
          depthWrite: false,
        });

        for (const subPath of path.subPaths) {
          const geometry = SVGLoader.pointsToStroke(
            subPath.getPoints(),
            path.userData.style
          );

          if (geometry) {
            const mesh = new THREE.Mesh(geometry, material);
            mesh.renderOrder = renderOrder++;

            group.add(mesh);
          }
        }
      }
    }

    scene.add(group);
  });
}
