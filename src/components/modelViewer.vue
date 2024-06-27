<template>
    <div id="model-viewer">
        <div id="webgl"></div>
    </div>
</template>

<script>

import * as Three from 'three';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import URDFLoader from 'urdf-loader';

// global variables
let scene, camera, renderer, controls, robot;

export default {
    data() {
        return {
            windowWidth: 500,
            windowHeight: 500,
            
        }
    },
    props: {
        jointAngles: {
            type: Object,
            default: () => ({
                rightShoulder: 0,
                rightElbow: 0,
                rightWrist: 0,
                rightHip: 0,
                rightAnkle: 0,
                leftShoulder: 0,
                leftElbow: 0,
                leftWrist: 0,
                leftHip: 0,
                leftAnkle: 0,
            })
        }  
    },
    watch: {
        jointAngles: {
            handler(newVal, oldVal) {
                if (robot) {
                    for (const joint in newVal) {
                        console.log("joint_name:", joint)
                        if (robot.joints[joint]) {
                            // robot joint init angle is 90
                            robot.joints[joint].setJointValue(Three.MathUtils.degToRad(newVal[joint] - 90));
                        }
                    }
                }
            },
            deep: true
        }
    },
    mounted() {
        this.init();
        this.render();
    },
    methods: {
        init() {
            scene = new Three.Scene();
            scene.background = new Three.Color(0xffffff);

            camera = new Three.PerspectiveCamera();
            camera.position.set(0, 0.5, 5);
            camera.lookAt(0, 0, 0);
            scene.add(camera);

            renderer = new Three.WebGLRenderer({ antialias: true });
            // renderer.outputEncoding = sRGBEncoding;
            renderer.shadowMap.enabled = true;
            renderer.shadowMap.type = Three.PCFSoftShadowMap;
            // renderer.setClearColor('#ffffff');
            document.getElementById('webgl').appendChild(renderer.domElement);

            const directionalLight = new Three.DirectionalLight(0xfefefe, 1);
            directionalLight.castShadow = true;
            // directionalLight.shadow.mapSize.setScalar(1024);
            directionalLight.shadow.mapSize.width = 1024;
            directionalLight.shadow.mapSize.height = 1024;
            directionalLight.shadow.camera.near = 0.5;
            directionalLight.shadow.camera.far = 500;
            directionalLight.position.set(0, -1, 6);
            scene.add(directionalLight);

            const ambientLight = new Three.AmbientLight(0xffffff, 0.2);
            scene.add(ambientLight);

            // const axesHelper = new Three.AxesHelper(5); // 参数为坐标轴的长度
            // scene.add(axesHelper);

            // const ground = new Mesh(new PlaneGeometry(), new ShadowMaterial({ opacity: 0.25 }));
            // ground.rotation.x = -Math.PI / 2;
            // ground.scale.setScalar(30);
            // ground.receiveShadow = true;
            // scene.add(ground);

            controls = new OrbitControls(camera, renderer.domElement);
            controls.enableRotate = false;
            controls.enableZoom = false;//禁止缩放
            controls.enablePan = false; //禁止右键拖拽
            // controls.minDistance = 4;
            // controls.target.y = 1;
            controls.update();

            // Load robot
            const manager = new Three.LoadingManager();
            try {
                const loader = new URDFLoader(manager);
                console.log("loader", loader)
                loader.load('../../public/urdf/lono/urdf/lono.urdf', result => {

                    robot = result;
                    robot.rotation.x = Math.PI / 2;
                    robot.rotation.y = 0;
                    robot.rotation.z = Math.PI;
                    //设置ROBOT在坐标原点
                    robot.position.x = 0;
                    robot.position.y = 0;
                    robot.position.z = -0.5;

                    robot.scale.set(20, 20, 20);
                    scene.add(robot);
                });

                // wait until all the geometry has loaded to add the model to the scene
                // manager.onLoad = () => {

                //     robot.rotation.x = Math.PI / 2;
                //     // robot.traverse(c => {
                //     //     c.castShadow = true;
                //     // });
                //     // for (let i = 1; i <= 6; i++) {

                //     //     robot.joints[`HP${ i }`].setJointValue(MathUtils.degToRad(30));
                //     //     robot.joints[`KP${ i }`].setJointValue(MathUtils.degToRad(120));
                //     //     robot.joints[`AP${ i }`].setJointValue(MathUtils.degToRad(-60));

                //     // }
                //     robot.updateMatrixWorld(true);

                //     const bb = new Box3();
                //     bb.setFromObject(robot);

                //     robot.position.y -= bb.min.y;
                //     scene.add(robot);

                // };
                

                this.onResize();
                // window.addEventListener('resize', onResize);
            } catch (error) {
                console.log("error", error)
                this.$alert('Failed to load robot model', 'Error', {
                    confirmButtonText: 'OK',
                    callback: action => {
                        this.$router.push('/');
                    }
                });
            }
            

        },
        onResize() {
            renderer.setSize(this.windowWidth, this.windowHeight);
            renderer.setPixelRatio(window.devicePixelRatio);

            camera.aspect = this.windowWidth / this.windowHeight;
            camera.updateProjectionMatrix();
        },
        render() {
            requestAnimationFrame(this.render);
            renderer.render(scene, camera);
        }
    }
}

</script>


<style>



</style>