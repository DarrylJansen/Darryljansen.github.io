import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

// Loading
const textureLoader = new THREE.TextureLoader()

// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')



// Scene
const scene = new THREE.Scene()
scene.fog = new THREE.FogExp2(0xFFFFFF, 0.15)



// Objects
const geometry = new THREE.SphereBufferGeometry(.5, 64, 64);
const particlesGeometry = new THREE.BufferGeometry;
const particlesGeometry2 = new THREE.BufferGeometry;
const particlesCnt = 2500;

const posArray = new Float32Array(particlesCnt * 3);
const posArray2 = new Float32Array(particlesCnt * 3);

for(let i=0; i< particlesCnt*3; i++){
    posArray[i] = (Math.random()-0.5)*4
    posArray2[i] = (Math.random()-0.5)*4
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3))
particlesGeometry2.setAttribute('position', new THREE.BufferAttribute(posArray2, 3))


// Materials

const material = new THREE.MeshStandardMaterial();
const normalTexture = textureLoader.load('dist/maps/normalmap.jpg')
material.normalMap = normalTexture

material.color = new THREE.Color(0x000000)
material.metalness = 0.9
material.roughness = 0.75

const particlesMaterial = new THREE.PointsMaterial()
particlesMaterial.color = new THREE.Color(0x333366)
particlesMaterial.size = 0.0015

const particlesMaterial2 = new THREE.PointsMaterial()
particlesMaterial2.color = new THREE.Color(0xaa88cc)
particlesMaterial2.size = 0.0015

// Mesh
const sphere = new THREE.Mesh(geometry,material)
const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial)
const particlesMesh2 = new THREE.Points(particlesGeometry2, particlesMaterial2)
scene.add(sphere, particlesMesh, particlesMesh2)

// Lights

const pointLight = new THREE.PointLight(0x00ffff, 60)
pointLight.position.set(2,3,4);
scene.add(pointLight)

const pointLight2 = new THREE.PointLight(0xff0022, 30)
pointLight2.position.set(1,-2,0);
scene.add(pointLight2)

const pointLight3 = new THREE.PointLight(0xaabbcc, 60)
pointLight3.position.set(-2,4,1);
scene.add(pointLight3)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 2
scene.add(camera)

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */

document.addEventListener('mousemove', onDocumentMouseMove)
document.addEventListener('mouseleave', onDocumentMouseOut)

let mouseX = 0
let mouseY = 0

let targetX = 0
let targetY = 0

const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight /2;



function onDocumentMouseMove(event) {
    mouseX = (event.clientX - windowHalfX)
    mouseY = (event.clientY - windowHalfY)

}
function onDocumentMouseOut() {
    mouseX = 0
    mouseY = 0
    targetX = 0
    targetY = 0
}
const clock = new THREE.Clock()

const tick = () =>
{

    targetX = mouseX * 0.0005
    targetY = mouseY * 0.0005
    

    const elapsedTime = clock.getElapsedTime()

    // Update objects
    sphere.rotation.y = .125 * elapsedTime
    sphere.rotation.z =  .025 * elapsedTime
    sphere.position.z = 0.01 * elapsedTime

    camera.rotation.y += .002 * (-targetX - camera.rotation.y)
    camera.rotation.x += .002 * (-targetY - camera.rotation.x)

    camera.rotation.y = Math.max(-0.07, Math.min(0.07, camera.rotation.y))
    camera.rotation.x = Math.max(-0.07, Math.min(0.07, camera.rotation.x))

    // Update Orbital Controls
    // controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()