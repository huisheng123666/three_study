import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

const scene = new THREE.Scene()

const loaderManager = new THREE.LoadingManager()

loaderManager.onProgress = (e) => {
    console.log(e)
}

const textureLoader = new THREE.TextureLoader(loaderManager)
const doorColorTexture = textureLoader.load('/textures/door/color.jpg')
// 透明纹理
const alphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const aoTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')

// 导入置换纹理
const doorHeightTexture = textureLoader.load('/textures/door/height.jpg')
// 导入粗糙度贴图
const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg')
// 导入金属度贴图
const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg')

doorColorTexture.minFilter = THREE.NearestFilter
doorColorTexture.magFilter = THREE.NearestFilter

// 透视相机
const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth/window.innerHeight,
    0.1,
    2000
)

camera.position.set(2, 2, 2)

scene.add(camera)

// 创建几何体
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1, 200, 200, 200)
cubeGeometry.setAttribute('uv2', new THREE.BufferAttribute(cubeGeometry.attributes.uv.array, 2))

const cubeMaterial = new THREE.MeshStandardMaterial({
    map: doorColorTexture,
    alphaMap: alphaTexture,
    transparent: true,
    // side: THREE.DoubleSide,
    aoMap: aoTexture,
    aoMapIntensity: 1,
    displacementMap: doorHeightTexture,
    displacementScale: 0.1,
    // 粗糙度
    roughness: 1,
    roughnessMap: doorRoughnessTexture,
    // 金属度
    metalness: 1,
    metalnessMap: doorMetalnessTexture,
    // 法相贴图
    normalMap: doorNormalTexture,
})

// 根据几何体和材质创建物体
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)

scene.add(cube)

/* --------------------- 灯光 ------------------- */
// 环境光
const light = new THREE.AmbientLight(0xfffffff, 0.5)

// 直线光
const directionalLight = new THREE.DirectionalLight(0xfffffff, 1)

directionalLight.position.set(10, 10, 10)

scene.add(directionalLight)

scene.add(light)

// 初始化渲染器
const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.append(renderer.domElement)

/* ------------------------------------ 轨道控制器 -------------------------------------------------- */
const controls = new OrbitControls(camera, renderer.domElement)
// 设置控制器阻尼（需要render是update）
controls.enableDamping = true

/* ------------------------------------ 坐标轴辅助器 -------------------------------------------------- */
const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)

window.addEventListener('dblclick', () => {
    // if (animation1.isActive()) {
    //     animation1.pause()
    // } else {
    //     animation1.resume()
    // }

    // 全屏
    const fullScreenElement = document.fullscreenElement
    if (!fullScreenElement) {
        renderer.domElement.requestFullscreen()
    } else {
        document.exitFullscreen()
    }
})


function render() {
    renderer.render(scene, camera)

    window.requestAnimationFrame(render)
}

render()

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()


    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
})
