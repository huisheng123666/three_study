import * as THREE from "three";

export function loadImgTexture(path) {
  const loader = new THREE.TextureLoader()

  return new Promise(resolve => {
    loader.load(path, (texture) => {
      resolve(texture)
    })
  })
}
