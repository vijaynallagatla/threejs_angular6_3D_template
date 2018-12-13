import { Component, ElementRef, ViewChild, AfterViewInit, HostListener } from '@angular/core';
import * as THREE from 'three';
import {MTLLoader, OBJLoader} from 'three-obj-mtl-loader';
import * as OrbitControls from 'three-orbitcontrols';

// MTLLoader(THREE);
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  @ViewChild('rendererContainer') rendererContainer;
  @HostListener('window:resize', ['$event'])

  title = 'Pastels';
  renderer = new THREE.WebGLRenderer();
  scene = null;
  camera = null;
  mesh = null;
  lighting: boolean;
  ambient;
  keyLight;
  backLight;
  fillLight;
  controls;

  constructor() {
    // Camera
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
    this.camera.position.z = 3;

    // scene
    this.scene = new THREE.Scene();
    this.lighting = false;
    this.ambient = new THREE.AmbientLight(0xffffff, 1.0);
    this.scene.add(this.ambient);
    this.keyLight = new THREE.DirectionalLight(new THREE.Color('hsl(30, 100%, 75%)'), 1.0);
    this.keyLight.position.set(-100, 0, 100);
    this.fillLight = new THREE.DirectionalLight(new THREE.Color('hsl(240, 100%, 75%)'), 0.75);
    this.fillLight.position.set(100, 0, 100);
    this.backLight = new THREE.DirectionalLight(0xffffff, 1.0);
    this.backLight.position.set(100, 0, -100).normalize();

    /* Model */
    const mtlLoader = new MTLLoader();
    mtlLoader.setBaseUrl('../assets/');
    mtlLoader.setPath('../assets/');
    // mtlLoader.load('Shelby.stl', function (geometry) {
    //   const material = new THREE.MeshNormalMaterial();
    //   const mesh = new THREE.Mesh(geometry, material);
    //   this.scene.add(mesh);
    // });
    mtlLoader.load('Shelby.mtl', (materials) => {
      materials.preload();
      // materials.materials.default.map.magFilter = THREE.NearestFilter;
      // materials.materials.default.map.minFilter = THREE.LinearFilter;
      const objLoader = new OBJLoader();
      objLoader.setMaterials(materials);
      objLoader.setPath('../assets/');
      objLoader.load('Shelby.obj', (object) => {
        this.scene.add(object);
      });
    });

    // const objLoader = new OBJLoader();
    //   objLoader.setPath('../assets/');
    //   objLoader.load('drone.obj', (object) => {
    //     this.scene.add(object);
    //   });
  }

  ngAfterViewInit() {
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    // this.renderer.setClearColor(new THREE.Color('hsl(0, 0%, 10%)'));
    this.rendererContainer.nativeElement.appendChild(this.renderer.domElement);
    /* Controls */
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.25;
    this.controls.enableZoom = true;

    /* Events */
    window.addEventListener('resize', this.onWindowResize, false);
    window.addEventListener('keydown', this.onKeyboardEvent, false);


    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.rendererContainer.nativeElement.append(this.renderer.domElement);
    this.animate();
  }

  onWindowResize(event) {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  onKeyboardEvent(e): void {
    if (e.code === 'KeyL') {
      this.lighting = !this.lighting;
      if (this.lighting) {
        this.ambient.intensity = 0.25;
        this.scene.add(this.keyLight);
        this.scene.add(this.fillLight);
        this.scene.add(this.backLight);
      } else {
        this.ambient.intensity = 1.0;
        this.scene.remove(this.keyLight);
        this.scene.remove(this.fillLight);
        this.scene.remove(this.backLight);
      }
    }
  }
  animate() {
    window.requestAnimationFrame(() => this.animate());
      this.controls.update();
      this.render();
  }
  render() {
    this.renderer.render(this.scene, this.camera);
  }
}
