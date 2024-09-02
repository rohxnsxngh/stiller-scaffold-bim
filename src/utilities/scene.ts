export class SceneObserver {
  private previousChildrenCount: number;

  constructor(private scene: THREE.Scene, private callback: () => void) {
    this.previousChildrenCount = scene.children.length;
  }

  startObserving() {
    const observer = () => {
      const currentChildrenCount = this.scene.children.length;

      if (currentChildrenCount !== this.previousChildrenCount) {
        this.previousChildrenCount = currentChildrenCount;
        this.callback();
      }

      // Continue observing
      requestAnimationFrame(observer);
    };

    observer();
  }
}

// IMPLEMENTATION
//   const observer = new SceneObserver(scene, debounce(updateScaffoldingData, 200));
//   observer.startObserving();
