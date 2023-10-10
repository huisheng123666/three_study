import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GUI } from "dat.gui";
import * as CANNON from 'cannon-es'

const gui = new GUI()

const clock = new THREE.Clock()

/* ----------------------- 场景 ----------------------------- */
const scene = new THREE.Scene()


/* ------------------- 相机 ------------------------------ */
// 透视相机giti
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth/window.innerHeight,
    0.1,
    2000
)

camera.position.set(0, 0, 10)

scene.add(camera)


/* ------------------------------ 物体 -------------------------------- */
const sphereGeometry = new THREE.SphereGeometry(1, 20, 20)
const sphereMaterial = new THREE.MeshStandardMaterial({
    metalness: 0.4,
    roughness: 0
})
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)

scene.add(sphere)

const floor = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(20, 20),
    new THREE.MeshStandardMaterial({ side: THREE.DoubleSide })
)

floor.rotation.x = -Math.PI / 2
floor.position.y = -5

scene.add(floor)


/* ------------------------------------  物理世界 -------------------------------- */
const world = new CANNON.World()
world.gravity.set(0, -9.8, 0)
const sphereShape = new CANNON.Sphere(1)
// friction: 0.1,//摩擦力
// restitution: 0.7,//反弹力
const sphereWorldMaterial = new CANNON.Material({
    restitution: 1
})
const sphereBody = new CANNON.Body({
    shape: sphereShape,
    position: new CANNON.Vec3(0, 0, 0),
    // 重量
    mass: 1,
    material: sphereWorldMaterial
})
world.addBody(sphereBody)
const floorShape = new CANNON.Plane()
const floorBody = new CANNON.Body({
    shape: floorShape,
    mass: 0,
    position: new CANNON.Vec3(0, -5, 0),
    material: new CANNON.Material({ restitution: 0.7 })
})
// 在cannon.js中，我们只能使用四元数(Quaternion)来旋转，可以通过setFromAxisAngle(…)方法，第一个参数是旋转轴，第二个参数是角度
// (1, 0, 0) x轴旋转
floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2)
world.addBody(floorBody)
// 碰撞事件
const hitSound = new Audio('/don.mp3')

function hitEvent(e) {
    // 获取碰撞强度
    const impactStrength = e.contact.getImpactVelocityAlongNormal()
    hitSound.volume = impactStrength / 9
    hitSound.currentTime = 0.3
    hitSound.play()
}
sphereBody.addEventListener('collide', hitEvent)






/* ------------------------------- 灯光 ------------------------------ */
// 环境光
const light = new THREE.AmbientLight(0xfffffff, 0.5)

// 直线光
const directionalLight = new THREE.DirectionalLight(0xfffffff, 1)

directionalLight.position.set(-10, 10, 10)

scene.add(directionalLight)

scene.add(light)


/* ----------------------------- 阴影 ---------------------------- */
directionalLight.castShadow = true
sphere.castShadow = true
// plane.castShadow = true
floor.receiveShadow = true
// 阴影模糊度
directionalLight.shadow.radius = 20
// 阴影清晰度
directionalLight.shadow.mapSize.set(4096, 4096)
// 设置平行光投射相机的属性
directionalLight.shadow.camera.near = 0.5
directionalLight.shadow.camera.far = 500
directionalLight.shadow.camera.top = 5
directionalLight.shadow.camera.bottom = -5
directionalLight.shadow.camera.left = -5
directionalLight.shadow.camera.right = 5


/* ------------------------- 初始化渲染器 ---------------------------- */
const renderer = new THREE.WebGLRenderer()
renderer.shadowMap.enabled = true
// renderer.physicallyCorrectLights = true
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.append(renderer.domElement)
renderer.shadowMap.enabled = true

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

function render() {
    renderer.render(scene, camera)
    camera.updateProjectionMatrix()
    controls.update()
    // 帧数
    world.step(1 / 60, clock.getDelta())

    sphere.position.copy(sphereBody.position)

    window.requestAnimationFrame(render)
}

render()

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()


    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
})
