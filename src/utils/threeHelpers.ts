import * as THREE from 'three';

export function createScene() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xeeeeee);
  return scene;
}

export function createCamera() {
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 1, 5);
  return camera;
}

export function createRenderer() {
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  return renderer;
}

export function createLight() {
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(5, 10, 7.5);
  return light;
}

/**
 * Adds wooden boards to a Three.js container object
 * @param container - The THREE.Object3D container to add the wooden board to
 */
export function addWoodenBoards(container: THREE.Object3D): void {
  const geometry = new THREE.BoxGeometry(1, 0.1, 0.5);
  const material = new THREE.MeshStandardMaterial({ color: 0x8B4513 }); // Brown color for wood
  const board = new THREE.Mesh(geometry, material);
  container.add(board);
}

/**
 * Creates a wooden texture for Three.js materials
 * @returns THREE.Texture for wood material
 */
export function createWoodenTexture(): THREE.Texture {
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load('/textures/wood.jpg');
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1, 1);
  return texture;
}

/**
 * Creates a container mesh with wooden appearance
 * @param width - Width of the container
 * @param height - Height of the container
 * @param depth - Depth of the container
 * @param transparent - Whether the container should be transparent
 * @returns THREE.Mesh representing the container
 */
export function createContainerMesh(
  width: number,
  height: number,
  depth: number,
  transparent: boolean = true
): THREE.Mesh {
  const geometry = new THREE.BoxGeometry(width, height, depth);
  const material = new THREE.MeshStandardMaterial({
    color: 0xa0522d,
    transparent: transparent,
    opacity: transparent ? 0.3 : 1.0,
    side: THREE.DoubleSide
  });
  
  return new THREE.Mesh(geometry, material);
}

/**
 * Adds a wooden board with specific dimensions at a specific position
 * @param container - The THREE.Object3D container to add the wooden board to
 * @param width - Width of the board
 * @param height - Height of the board
 * @param depth - Depth of the board
 * @param position - Position [x, y, z] of the board
 * @param rotation - Rotation [x, y, z] of the board in radians
 */
export function addBoard(
  container: THREE.Object3D,
  width: number,
  height: number,
  depth: number,
  position: [number, number, number] = [0, 0, 0],
  rotation: [number, number, number] = [0, 0, 0]
): THREE.Mesh {
  const geometry = new THREE.BoxGeometry(width, height, depth);
  const material = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
  const board = new THREE.Mesh(geometry, material);
  
  board.position.set(...position);
  board.rotation.set(...rotation);
  
  container.add(board);
  return board;
}

/**
 * Updates the camera and renderer on window resize
 * @param camera - The THREE.PerspectiveCamera to update
 * @param renderer - The THREE.WebGLRenderer to update
 * @param container - The HTML element containing the renderer
 */
export function handleResize(
  camera: THREE.PerspectiveCamera,
  renderer: THREE.WebGLRenderer,
  container: HTMLElement
): void {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
}