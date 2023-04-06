import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GUI } from "dat.gui";

const gui = new GUI()

/* ----------------------- 场景 ----------------------------- */
const scene = new THREE.Scene()


/* ------------------- 相机 ------------------------------ */
// 透视相机
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth/window.innerHeight,
    0.1,
    2000
)

camera.position.set(5, 5, 5)

scene.add(camera)


/* ------------------------------ 物体 -------------------------------- */
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({
    wireframe: true
})
const redMaterial = new THREE.MeshBasicMaterial({
    color: 'red'
})

const cubeArr = []

for (let i = -5; i < 5; i++) {
    for (let j = -5; j < 5; j++) {
        for (let k = -5; k < 5; k++) {
            const cube = new THREE.Mesh(cubeGeometry, material)
            cube.position.set(i, j, k)
            scene.add(cube)
            cubeArr.push(cube)
        }
    }
}

const raycaster = new THREE.Raycaster()

const mouse = new THREE.Vector2()

window.addEventListener('click', event => {

    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

    raycaster.setFromCamera(mouse, camera)

    const result = raycaster.intersectObjects(scene.children)
    if (result[0]) {
        result[0].object.material = redMaterial
    }
})

window.addEventListener('mouseup', () => {
    cubeArr.forEach(item => {
        item.material = material
    })
})

/* ------------------------- 初始化渲染器 ---------------------------- */
const renderer = new THREE.WebGLRenderer()
renderer.shadowMap.enabled = true
// renderer.physicallyCorrectLights = true
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
    // 全屏
    const fullScreenElement = document.fullscreenElement
    if (!fullScreenElement) {
        renderer.domElement.requestFullscreen()
    } else {
        document.exitFullscreen()
    }
})

const clock = new THREE.Clock()

function render() {
    renderer.render(scene, camera)
    camera.updateProjectionMatrix()
    controls.update()

    window.requestAnimationFrame(render)
}

render()

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()


    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
})
