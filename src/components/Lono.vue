<template>
    <div id="lono-bias-page">
        <div id="lono-container">
            <div class="lono-input-part">
                <div class="lono-input-item">
                    <span class="input-lable">{{ $t("message.lonoBiasAdjustment.rightShoulderLabel") }}</span>
                    <el-slider v-model="jointBiasAngles.rightShoulder" :min="-90" :max="90" show-input @change="handleChangeSlider('rightShoulder')"/>
                </div>
                <div class="lono-input-item">
                    <span class="input-lable">{{ $t("message.lonoBiasAdjustment.rightElbowLabel") }}</span>
                    <el-slider v-model="jointBiasAngles.rightElbow" :min="-90" :max="90" show-input @change="handleChangeSlider('rightElbow')" />
                </div>
                <div class="lono-input-item">
                    <span class="input-lable">{{ $t("message.lonoBiasAdjustment.rightWristLabel") }}</span>
                    <el-slider v-model="jointBiasAngles.rightWrist" :min="-90" :max="90" show-input @change="handleChangeSlider('rightWrist')" />
                </div>
                <div class="lono-input-item">
                    <span class="input-lable">{{ $t("message.lonoBiasAdjustment.rightHipLabel") }}</span>
                    <el-slider v-model="jointBiasAngles.rightHip" :min="-90" :max="90" show-input @change="handleChangeSlider('rightHip')" />
                </div>
                <div class="lono-input-item">
                    <span class="input-lable">{{ $t("message.lonoBiasAdjustment.rightAnkleLabel") }}</span>
                    <el-slider v-model="jointBiasAngles.rightAnkle" :min="-90" :max="90" show-input @change="handleChangeSlider('rightAnkle')" />
                </div>
            </div>
            <div class="lono-model-part">
                <el-tabs stretch type="border-card" class="custom-el-tabs">
                    <el-tab-pane :label='$t("message.lonoBiasAdjustment.middleModelLable")' class="custom-el-tab-pane">
                        <!-- <model-viewer :jointAngles="jointAngles" /> -->
                        <div id="webgl"></div>
                    </el-tab-pane>
                    <el-tab-pane :label='$t("message.lonoBiasAdjustment.middleJointDesc")' class="custom-el-tab-pane">
                        <div class="joint-desc-img">
                            <img v-if="this.$i18n.locale=='en'" src="../../public/images/lono-joint-en.jpg" />
                            <img v-if="this.$i18n.locale=='cn'" src="../../public/images/lono-joint-cn.jpg" />
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </div>
            <div class="lono-input-part">
                <div class="lono-input-item">
                    <span class="input-lable">{{ $t("message.lonoBiasAdjustment.leftShoulderLabel") }}</span>
                    <el-slider v-model="jointBiasAngles.leftShoulder" :min="-90" :max="90" show-input @change="handleChangeSlider('leftShoulder')" />
                </div>
                <div class="lono-input-item">
                    <span class="input-lable">{{ $t("message.lonoBiasAdjustment.leftElbowLabel") }}</span>
                    <el-slider v-model="jointBiasAngles.leftElbow" :min="-90" :max="90" show-input @change="handleChangeSlider('leftElbow')" />
                </div>
                <div class="lono-input-item">
                    <span class="input-lable">{{ $t("message.lonoBiasAdjustment.leftWristLabel") }}</span>
                    <el-slider v-model="jointBiasAngles.leftWrist" :min="-90" :max="90" show-input @change="handleChangeSlider('leftWrist')" />
                </div>
                <div class="lono-input-item">
                    <span class="input-lable">{{ $t("message.lonoBiasAdjustment.leftHipLabel") }}</span>
                    <el-slider v-model="jointBiasAngles.leftHip" :min="-90" :max="90" show-input @change="handleChangeSlider('leftHip')" />
                </div>
                <div class="lono-input-item">
                    <span class="input-lable">{{ $t("message.lonoBiasAdjustment.leftAnkleLabel") }}</span>
                    <el-slider v-model="jointBiasAngles.leftAnkle" :min="-90" :max="90" show-input @change="handleChangeSlider('leftAnkle')" />
                </div>
            </div>
        </div>

        <div id="lono-page-btns">
            <el-button type="danger" plain  @click="handleClickReset">{{ $t("message.lonoBiasAdjustment.resetBtn") }}</el-button>
            <el-button type="success" plain @click="handleClickSave">{{ $t("message.lonoBiasAdjustment.saveBtn") }}</el-button>
        </div>
    </div>
    
</template>

<script>

// import ModelViewer from "./modelViewer.vue";

import * as Three from 'three';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import URDFLoader from 'urdf-loader';

import {webSerial} from "../serial/index.js";

let scene, camera, renderer, controls, robot;

export default {
    data() {
        return {
            jointBiasAngles: {
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
            },
            jointAngles: {
                rightShoulder: 90,
                rightElbow: 90,
                rightWrist: 90,
                rightHip: 90,
                rightAnkle: 90,
                leftShoulder: 90,
                leftElbow: 90,
                leftWrist: 90,
                leftHip: 90,
                leftAnkle: 90,
            },
            windowWidth: 500,
            windowHeight: 500,
            jointMap: {
                rightShoulder: 0,
                rightElbow: 1,
                rightWrist: 2,
                rightHip: 3,
                rightAnkle: 4,
                leftShoulder: 5,
                leftElbow: 6,
                leftWrist: 7,
                leftHip: 8,
                leftAnkle: 9,
            }
        }
    },
    props: {
    
    },
    components: {
        // ModelViewer
    },
    mounted() {
        this.init();
        this.render();
    },
    methods: {
        async handleChangeSlider(jointName) {
            for (const key in this.jointBiasAngles) {
                this.jointAngles[key] = 90 + this.jointBiasAngles[key];
            }
            if (robot) {
                for (const joint in this.jointAngles) {
                    if (robot.joints[joint]) {
                        robot.joints[joint].setJointValue(Three.MathUtils.degToRad(this.jointAngles[joint] - 90));
                    }
                }
            }
            // send command to robot, protocol refer to the help page
            let jointIdx = this.jointMap[jointName];
            let angle = this.jointAngles[jointName] - 90;
            let cmd = 'b ' + jointIdx + ' ' + angle + '\r';
            try {
                const resp = await webSerial.sendMessage(cmd)
                if (resp != 'OK') {
                    this.$notify({
                        title: 'Warning',
                        message: 'Failed to send command to robot1',
                        type: 'warning'
                    });
                }
            } catch (error) {
                console.log(error)
                this.$notify({
                    title: 'Warning',
                    message: 'Failed to send command to robot2',
                    type: 'warning'
                });
            }
        },
        async handleClickReset() {
            for (const key in this.jointBiasAngles) {
                this.jointBiasAngles[key] = 0;
                this.jointAngles[key] = 90;
            }
            if (robot) {
                for (const joint in this.jointAngles) {
                    if (robot.joints[joint]) {
                        robot.joints[joint].setJointValue(0);
                    }
                }
            }
            try {
                const resp = await webSerial.sendMessage('r\r')
                if (resp != 'OK') {
                    this.$notify({
                        title: 'Warning',
                        message: 'Failed to send command to robot',
                        type: 'warning'
                    });
                }
            } catch (error) {
                this.$notify({
                    title: 'Warning',
                    message: 'Failed to send command to robot',
                    type: 'warning'
                });
            }
        },
        async handleClickSave() {
            try {
                const resp = await webSerial.sendMessage('s\r')
                if (resp != 'OK') {
                    this.$notify({
                        title: 'Warning',
                        message: 'Failed to send command to robot',
                        type: 'warning'
                    });
                }
            } catch (error) {
                this.$notify({
                    title: 'Warning',
                    message: 'Failed to send command to robot',
                    type: 'warning'
                });
            }
        },
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

            // const axesHelper = new Three.AxesHelper(5);
            // scene.add(axesHelper);

            controls = new OrbitControls(camera, renderer.domElement);
            controls.enableRotate = false;
            controls.enableZoom = false;
            controls.enablePan = false;
            // controls.minDistance = 4;
            // controls.target.y = 1;
            controls.update();

            // Load robot
            const manager = new Three.LoadingManager();
            try {
                const loader = new URDFLoader(manager);
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

                this.onResize();
                // window.addEventListener('resize', onResize);
            } catch (error) {
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

#lono-bias-page {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

#lono-container {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.lono-input-part {
    width: 30%;
    height: 100%;

    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;

}

.lono-input-item {
    width: 90%;
    margin: 20px 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
}

.input-lable {
    width: 90%;
    height: 30px;
    margin-bottom: 10px;
}

.lono-model-part {
    width: 40%;
    height: 100%;

    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
}

.custom-el-tabs {
    width: 100%;
    height: calc(50vh);
}

.custom-el-tab-pane {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

#lono-page-btns {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    margin-top: 50px;
}

.joint-desc-img {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;
}

.joint-desc-img > img {
    width: 100%;
    height: 100%;
    transform: scale(1.5); /* 放大1.2倍 */
    margin-top: 70px;
}

</style>