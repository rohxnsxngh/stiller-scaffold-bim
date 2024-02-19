import * as OBC from "openbim-components";
import * as THREE from "three";

export class CustomGrid extends OBC.SimpleGrid {
  size2: number | undefined;
  size1: number | undefined;
  color: THREE.ColorRepresentation | undefined;
  color2: THREE.ColorRepresentation | undefined;

  constructor(
    components: OBC.Components,
    color?: THREE.Color,
    size1?: number,
    size2?: number,
    distance?: number
  ) {
    super(components, color, size1, size2, distance);
  }


  protected createGrid() {
    const grid = new THREE.GridHelper(
      this.size1,
      this.size2,
      this.color,
      this.color
    );
    return grid;
  }
}
