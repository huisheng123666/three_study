import * as dat from 'dat.gui'
import * as THREE from 'three'
import { createMultiMaterialObject } from 'three/examples/jsm/utils/SceneUtils.js'

const basicType = {
  color: {
    method: 'addColor',
    getValue: item => item.color.getStyle(),
    setValue: (item, value) => item.color.set(value)
  },
  groundColor: {
    method: 'addColor',
    getValue: item => item.color.getStyle(),
    setValue: (item, value) => item.color.set(value)
  },
  intensity: {
    method: 'add',
    extends: [0, 10],
    getValue: item => item.intensity,
    setValue: (item, value) => item.intensity = +value
  },
  distance: {
    method: 'add',
    extends: [0, 20000],
    getValue: item => item.distance,
    setValue: (item, value) => item.distance = value
  },
  angle: {
    method: 'add',
    extends: [0, Math.PI / 2],
    getValue: item => item.angle,
    setValue: (item, value) => item.angle = +value
  },
  decay: {
    method: 'add',
    extends: [0, 20],
    getValue: item => item.decay,
    setValue: (item, value) => item.decay = +value
  },
  opacity: {
    extends: [0.0, 1.0],
    getValue: item => item.opacity,
    setValue: (item, value) => {
      item.opacity = value.toFixed(1)
      item.alphaTest = value.toFixed(1)
    }
  },
  transparent: {
    getValue: item => item.transparent,
    setValue: (item, value) => {
      item.transparent = value
    }
  },
  wireframe: {
    getValue: item => item.wireframe,
    setValue: (item, value) => item.wireframe = value
  },
  visible: {
    getValue: item => item.visible,
    setValue: (item, value) => item.visible = value
  },
  cameraNear: {
    extends: [0, 50],
    getValue: (item, camera) => camera.near,
    setValue: (item, value, camera) => camera.near = value
  },
  cameraFar: {
    extends: [50, 1000],
    getValue: (item, camera) => camera.far,
    setValue: (item, value, camera) => camera.far = value
  },
  side: {
    extends: [['front', 'back', 'double']],
    getValue: (item, camera) => 'front',
    setValue: (item, value, camera) => {
      switch (value) {
        case 'front':
          item.side = THREE.FrontSide
          break
        case 'back':
          item.side = THREE.BackSide
          break
        case 'double':
          item.side = THREE.DoubleSide
          break
      }
    }
  },
  // ambient: {
  //   method: 'addColor',
  //   getValue: (item, camera) => item.ambient,
  //   setValue: (item, value, camera) => item.ambient.set(value)
  // }
  emissive: {
    method: 'addColor',
    getValue: (item, camera) => item.emissive.getHex(),
    setValue: (item, value, camera) => item.emissive = new THREE.Color(value)
  },
  specular: {
    method: 'addColor',
    getValue: (item, camera) => item.specular.getHex(),
    setValue: (item, value, camera) => item.specular = new THREE.Color(value)
  },
  shininess: {
    extends: [0, 100],
    getValue: (item, camera) => item.shininess,
    setValue: (item, value, camera) => item.shininess = value
  },
  alpha: {
    extends: [0, 1],
    getValue: (item, camera) => item.uniforms.a.value,
    setValue: (item, value, camera) => item.uniforms.a.value = value
  },
  dashSize: {
    extends: [0, 5],
    getValue: (item, camera) => item.dashSize,
    setValue: (item, value, camera) => item.dashSize = +value
  },
  gapSize: {
    extends: [0, 5],
    getValue: (item, camera) => item.dashSize,
    setValue: (item, value, camera) => item.dashSize = +value
  },
  height: getMeshValue([0, 20], 'height'),
  width: getMeshValue([0, 20], 'width'),
  widthSegments: getMeshValue([0, 20], 'widthSegments'),
  heightSegments: getMeshValue([0, 20], 'heightSegments'),
  radius: getMeshValue([1, 20], 'radius'),
  segments: getMeshValue([3, 80], 'segments'),
  thetaStart: getMeshValue([0, Math.PI*2], 'thetaStart'),
  thetaLength: getMeshValue([0, Math.PI*2], 'thetaLength'),
  depth: getMeshValue([0, 20], 'depth'),
  depthSegments: getMeshValue([0, 20], 'depthSegments'),
  phiStart: getMeshValue([0, Math.PI * 2], 'phiStart'),
  phiLength: getMeshValue([0, Math.PI * 2], 'phiLength'),
  radiusTop: getMeshValue([0, 10], 'radiusTop'),
  radiusBottom: getMeshValue([0, 10], 'radiusBottom'),
  radialSegments: getMeshValue([0, 20], 'radialSegments'),
  openEnded: getMeshValue([], 'openEnded'),
  tube: getMeshValue([0, 10], 'tube'),
  tubularSegments: getMeshValue([0, 20], 'radialSegments'),
  arc: getMeshValue([0, Math.PI*2], 'arc'),
  p: getMeshValue([1, 10], 'p'),
  q: getMeshValue([1, 10], 'q'),
  detail: getMeshValue([0, 5], 'detail'),
}

export const vertices = [
  1, 1, 1,
  -1, -1, 1,
  -1, 1, -1,
  1, -1, -1
]

export const indices = [
  2, 1, 0,
  0, 3, 2,
  1, 3, 0,
  2, 3, 1
]

const isPolyhedron = item => item.type === 'PolyhedronGeometry'

function createMaterial(geometry) {
  const lambert = new THREE.MeshLambertMaterial({ color: 0xff0000 })
  const basic = new THREE.MeshBasicMaterial({ wireframe: true })

  return createMultiMaterialObject(geometry, [lambert, basic]);
}

const roundValue = {
  detail: 1
}

function removeAndAdd(item, value, camera, cube, scene, controls) {
  const x = cube.pointer.rotation.x
  const y = cube.pointer.rotation.y
  scene.remove(cube.pointer)
  const arr = []
  for (const key in controls) {
    if (roundValue[key]) {
      controls[key] = ~~controls[key]
    }
    arr.push(controls[key])
  }
  if (isPolyhedron(item)) {
    arr.unshift(vertices, indices)
  }
  cube.pointer = createMaterial(new THREE[item.type](...arr))
  cube.pointer.rotation.x = x
  cube.pointer.rotation.y = y
  scene.add(cube.pointer)
}

function getMeshValue(extend, name) {
  return {
    extends: extend,
    getValue: (item, camera, cube) => cube.children[0].geometry.parameters[name],
    setValue: (...arg) => removeAndAdd(...arg)
  }
}

const itemType = {
  SpotLight: ['color', 'intensity', 'distance', 'angle', 'decay'],
  AmbientLight: ['color'],
  PointLight: ['color', 'intensity', 'distance'],
  DirectionalLight: ['color', 'intensity'],
  HemisphereLight: ['skyColor', 'groundColor', 'intensity'],
  MeshBasicMaterial: ['color', 'opacity', 'transparent', 'wireframe', 'visible'],
  MeshDepthMaterial: ['wireframe', 'cameraNear', 'cameraFar'],
  MeshNormalMaterial: ['opacity', 'transparent', 'wireframe', 'visible', 'side'],
  MeshLambertMaterial: ['opacity', 'transparent', 'wireframe', 'visible', 'side', 'emissive', 'color'],
  MeshPhongMaterial: ['opacity', 'transparent', 'wireframe', 'visible', 'side', 'emissive', 'color', 'specular', 'shininess'],
  ShaderMaterial: ['alpha'],
  LineDashedMaterial: ['color', 'dashSize', 'gapSize'],
  PlaneGeometry: ['width', 'height', 'widthSegments', 'heightSegments'],
  CircleGeometry: ['radius', 'segments', 'thetaStart', 'thetaLength'],
  BoxGeometry: ['width', 'height', 'depth', 'widthSegments', 'heightSegments', 'depthSegments'],
  SphereGeometry: ['radius', 'widthSegments', 'heightSegments', 'phiStart', 'phiLength', 'thetaStart', 'thetaLength'],
  CylinderGeometry: ['radiusTop', 'radiusBottom', 'height', 'radialSegments', 'heightSegments', 'openEnded'],
  TorusGeometry: ['radius', 'tube', 'radialSegments', 'tubularSegments', 'arc'],
  TorusKnotGeometry: ['radius', 'tube', 'radialSegments', 'tubularSegments', 'p', 'q'],
  PolyhedronGeometry: ['radius', 'detail']
}

export function initControls(item, camera, cube, scene) {
  const typeList = itemType[item.type] || []

  const controls = {}
  console.log(item)

  if (!typeList.length) return;

  const gui = new dat.GUI()

  for (let i = 0; i < typeList.length; i++) {
    const child = basicType[typeList[i]]
    if (child) {
      controls[typeList[i]] = child.getValue(item, camera, cube.pointer)
      const childExtends = child.extends || []
      gui[child.method || 'add'](controls, typeList[i], ...childExtends).onChange((value) => {
        child.setValue(item, value, camera, cube, scene, controls)
      })
    }
  }
}
