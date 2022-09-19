import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import gsap from 'gsap'
import * as dat from 'dat.gui'
import { BufferGeometry, Side } from 'three'

const scene = new THREE.Scene()

// 透视相机
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth/window.innerHeight,
    0.1,
    1000
)

camera.position.set(0, 0, 10)
scene.add(camera)

// 导入纹理
const textureLoader = new THREE.TextureLoader()
const mafeiColorTexture = textureLoader.load('./textures/mafei.jpg')
// 透明纹理
const alphaTexture = textureLoader.load('./textures/lxq.jpg')

const mafeiAoTexture = textureLoader.load('./textures/hr@2.png')

// mafeiColorTexture.offset.set(0.1, 0.1)
// mafeiColorTexture.rotation = Math.PI / 4
// mafeiColorTexture.center.set(0.5, 0.5)

// // 设置重复
// mafeiColorTexture.repeat.set(1, 2)
// // 水平方向
// mafeiColorTexture.wrapS = THREE.MirroredRepeatWrapping // 镜像重复
// // 垂直方向
// mafeiColorTexture.wrapT = THREE.RepeatWrapping

// texture纹理显示设置
mafeiColorTexture.minFilter = THREE.NearestFilter
mafeiColorTexture.magFilter = THREE.NearestFilter

// 创建几何体
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1)
const cubeMaterial = new THREE.MeshBasicMaterial({
    map: mafeiColorTexture,
    alphaMap: alphaTexture,
    // transparent: true,
    side: THREE.DoubleSide, // 平面渲染几面
    // aoMap: mafeiAoTexture, // 环境光遮挡
})
// 根据几何体和材质创建物体
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)

scene.add(cube)

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

// 添加平面
const planeGeometry = new THREE.PlaneGeometry(1, 1)
const plane = new THREE.Mesh(planeGeometry, cubeMaterial)

plane.position.set(3, 0, 0)
scene.add(plane)

// 给平面设置第二组UV
planeGeometry.setAttribute('uv2', new THREE.BufferAttribute(planeGeometry.attributes.uv.array, 2))
