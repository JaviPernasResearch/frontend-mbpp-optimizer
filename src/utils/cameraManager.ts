import { PerspectiveCamera, OrthographicCamera, Vector3, Box3, Object3D } from 'three';

// Create a utility class to manage camera operations
class CameraManager {
  camera: PerspectiveCamera | OrthographicCamera | null = null;
  controls: any = null;

  setCameraPosition(position: [number, number, number], target: [number, number, number]) {
    if (!this.camera) return;
    
    this.camera.position.set(...position);
    this.camera.lookAt(new Vector3(...target));
    this.camera.updateProjectionMatrix();
    
    if (this.controls) {
      this.controls.target.set(...target);
      this.controls.update();
    }
  }

  fitCameraToObject(object: Object3D, offset: number = 1.25) {
    if (!this.camera || !object) return;
    
    const boundingBox = new Box3().setFromObject(object);
    const center = boundingBox.getCenter(new Vector3());
    const size = boundingBox.getSize(new Vector3());
    
    const maxDim = Math.max(size.x, size.y, size.z);
    
    if (this.camera instanceof PerspectiveCamera) {
      const fov = this.camera.fov * (Math.PI / 180);
      let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2)) * offset;
      
      this.setCameraPosition(
        [center.x, center.y, center.z + cameraZ], 
        [center.x, center.y, center.z]
      );
    } else if (this.camera instanceof OrthographicCamera) {
      const distance = maxDim * offset;
      this.camera.zoom = 1 / distance;
      this.camera.position.set(center.x, center.y, center.z + distance);
      this.camera.lookAt(center);
      this.camera.updateProjectionMatrix();
    }
  }

  getPresets() {
    return {
      isometric: () => this.setCameraPosition([2000, 2500, 2000], [500, 0, 500]),
      top: () => this.setCameraPosition([500, 2500, 500], [500, 0, 500]),
      side: () => this.setCameraPosition([2500, 500, 500], [500, 0, 500]),
      front: () => this.setCameraPosition([500, 500, 2500], [500, 0, 500])
    };
  }

  setCamera(camera: PerspectiveCamera | OrthographicCamera | null) {
    this.camera = camera;
  }

  registerControls(controls: any) {
    this.controls = controls;
  }
}

// Create a singleton instance
export const cameraManager = new CameraManager();