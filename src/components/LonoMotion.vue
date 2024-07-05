<template>
    <div id="lono-bias-page">
        <div id="lono-container">
            <div class="lono-input-part">
                <div class="lono-input-item">
                    <span class="input-lable">{{ $t("message.lonoBiasAdjustment.rightShoulderLabel") }}</span>
                    <el-slider v-model="jointAngles.rightShoulder" :min="0" :max="180" show-input @change="handleChangeSlider('rightShoulder')"/>
                </div>
                <div class="lono-input-item">
                    <span class="input-lable">{{ $t("message.lonoBiasAdjustment.rightElbowLabel") }}</span>
                    <el-slider v-model="jointAngles.rightElbow" :min="0" :max="180" show-input @change="handleChangeSlider('rightElbow')" />
                </div>
                <div class="lono-input-item">
                    <span class="input-lable">{{ $t("message.lonoBiasAdjustment.rightWristLabel") }}</span>
                    <el-slider v-model="jointAngles.rightWrist" :min="0" :max="180" show-input @change="handleChangeSlider('rightWrist')" />
                </div>
                <div class="lono-input-item">
                    <span class="input-lable">{{ $t("message.lonoBiasAdjustment.rightHipLabel") }}</span>
                    <el-slider v-model="jointAngles.rightHip" :min="0" :max="180" show-input @change="handleChangeSlider('rightHip')" />
                </div>
                <div class="lono-input-item">
                    <span class="input-lable">{{ $t("message.lonoBiasAdjustment.rightAnkleLabel") }}</span>
                    <el-slider v-model="jointAngles.rightAnkle" :min="0" :max="180" show-input @change="handleChangeSlider('rightAnkle')" />
                </div>
            </div>
            <div class="lono-model-part">
                <el-tabs stretch type="border-card" class="custom-el-tabs">
                    <el-tab-pane :label='$t("message.lonoBiasAdjustment.middleModelLable")' class="custom-el-tab-pane">
                        <!-- <model-viewer :jointAngles="jointAngles" /> -->
                        <div id="webgl1"></div>
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
                    <el-slider v-model="jointAngles.leftShoulder" :min="0" :max="180" show-input @change="handleChangeSlider('leftShoulder')" />
                </div>
                <div class="lono-input-item">
                    <span class="input-lable">{{ $t("message.lonoBiasAdjustment.leftElbowLabel") }}</span>
                    <el-slider v-model="jointAngles.leftElbow" :min="0" :max="180" show-input @change="handleChangeSlider('leftElbow')" />
                </div>
                <div class="lono-input-item">
                    <span class="input-lable">{{ $t("message.lonoBiasAdjustment.leftWristLabel") }}</span>
                    <el-slider v-model="jointAngles.leftWrist" :min="0" :max="180" show-input @change="handleChangeSlider('leftWrist')" />
                </div>
                <div class="lono-input-item">
                    <span class="input-lable">{{ $t("message.lonoBiasAdjustment.leftHipLabel") }}</span>
                    <el-slider v-model="jointAngles.leftHip" :min="0" :max="180" show-input @change="handleChangeSlider('leftHip')" />
                </div>
                <div class="lono-input-item">
                    <span class="input-lable">{{ $t("message.lonoBiasAdjustment.leftAnkleLabel") }}</span>
                    <el-slider v-model="jointAngles.leftAnkle" :min="0" :max="180" show-input @change="handleChangeSlider('leftAnkle')" />
                </div>
            </div>
        </div>

        <div id="lono-frames">
            <div class="lono-frames-btns">
                <el-button plain @click="handleClickAdd">{{ $t('message.lonoMotionEdit.btnAdd') }}</el-button>
                <el-button plain type="danger" @click="handleClickDelete">{{ $t('message.lonoMotionEdit.btnDelete') }}</el-button>
                <!-- <el-button plain @click="handleClickEdit">{{ $t('message.lonoMotionEdit.btnEdit') }}</el-button> -->
                <el-button plain @click="handleClickForward">{{ $t('message.lonoMotionEdit.btnMoveForward') }}</el-button>
                <el-button plain @click="handleClickBackward">{{ $t('message.lonoMotionEdit.btnMoveBackward') }}</el-button>
                <el-button plain @click="handleClickCopy">{{ $t('message.lonoMotionEdit.btnCopy') }}</el-button>
                <el-button plain @click="handleClickPlaySingle">{{ $t('message.lonoMotionEdit.btnPlaySingle') }}</el-button>
                <el-button plain @click="handleClickPreview">{{ $t('message.lonoMotionEdit.btnPreview') }}</el-button>
                <el-button plain type="success" @click="handleClickExport">{{ $t('message.lonoMotionEdit.btnExport') }}</el-button>
            </div>
            <div class="lono-frames-container">
                <div class="lono-single-frame" v-for="(item, idx) in frames" :key="idx">
                    <img v-if="selectedFrame && idx == selectedFrame.index" class="lono-single-frame-img-selected" :src="item.image" @click="handleClicImg" />
                    <img v-else class="lono-single-frame-img" :src="item.image" @click="handleClicImg" />
                    <div class="lono-single-frame-info">
                        <span class="lono-single-frame-span">Frame {{ idx }}</span>
                        <el-tooltip
                            class="box-item"
                            effect="light"
                            content="motion sequence execution interval, default 100 (ms)"
                            placement="top-start"
                        >
                            <el-input-number v-model="item.interval" :min="100" size="small"/>
                        </el-tooltip>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
</template>

<script>

// import ModelViewer from "./modelViewer.vue";

import * as Three from 'three';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import URDFLoader from 'urdf-loader';

import {webSerial} from "../serial/index.js";

import { deepClone } from "../utils/utils.js";
import { ElLoading } from 'element-plus';

let scene, camera, renderer, controls, robot;

export default {
    data() {
        return {
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
            },
            jointMapReverse: {
                0: 'rightShoulder',
                1: 'rightElbow',
                2: 'rightWrist',
                3: 'rightHip',
                4: 'rightAnkle',
                5: 'leftShoulder',
                6: 'leftElbow',
                7: 'leftWrist',
                8: 'leftHip',
                9: 'leftAnkle',
            },
            frames: [],
            frameCount: 0,
            selectedFrame: null,
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

        document.addEventListener('click', this.handleDocumentClick);
    },
    methods: {
        handleDocumentClick(event) {
            if (event.target.className != 'lono-single-frame-img') {
                if (this.selectedFrame) {
                    let index = this.selectedFrame.index;
                    let tag = document.getElementsByClassName('lono-single-frame-img-selected')[0];
                    if (tag) {
                        tag.className = 'lono-single-frame-img';
                    }
                }
            }
        },
        async handleChangeSlider(jointName) {
            let jointAngle = this.jointAngles[jointName];
            if (!jointAngle) {
                return;
            }

            if (robot) {
                robot.joints[jointName].setJointValue(Three.MathUtils.degToRad(jointAngle - 90));
            }

            let jointIndex = this.jointMap[jointName];
            let cmd = 'm ' + jointIndex + ' ' + jointAngle + '\r';
            try {
                await webSerial.sendMessage(cmd);
            } catch (error) {
                console.log("error", error)
            }
        },
        resetJointAngles() {
            this.jointAngles = {
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
            }
            if (robot) {
                for (let key in this.jointAngles) {
                    robot.joints[key].setJointValue(0);
                }
            }
        },
        handleClicImg(event) {
            // get the selected frame
            if (this.selectedTag) {
                this.selectedTag.className = 'lono-single-frame-img';
            }
            event.target.className = 'lono-single-frame-img-selected';
            this.selectedFrame = this.frames[event.target.parentNode.childNodes[1].innerText.split(' ')[1]];
            event.stopPropagation();
        },
        handleClickAdd() {
            let frameData = {};
            let frame = deepClone(this.jointAngles);
            frameData.frame = frame;  
            frameData.index = this.frameCount;
            frameData.interval = 100;
            const imageData = this.takeRenderShot();
            frameData.image = imageData;
            this.frames.push(frameData);
            this.frameCount++;
            this.resetJointAngles();
        },
        handleClickDelete() {
            if (this.selectedFrame) {
                let container = document.getElementsByClassName('lono-frames-container')[0];
                let siblings = this.selectedTag.parentNode.childNodes;
                let span = siblings[1];
                let frameIndex = span.innerText.split(' ')[1];
                container.removeChild(this.selectedTag.parentNode);

                // move the frames after the deleted frame to the front
                let newFrames = {};
                let count = 0;
                for (let key in this.frames) {
                    if (key < frameIndex) {
                        newFrames[key] = this.frames[key];
                    } else if (key > frameIndex){
                        newFrames[parseInt(key) - 1] = this.frames[key];
                    }
                }
                this.frames = newFrames;
                this.frameCount--;

                this.selectedFrame = null;
                this.selectedTag = null;
                console.log("frames", this.frames);
            }
        },
        handleClickForward(event) {
            // move the selected frame forward
            if (this.selectedFrame) {
                let frameIndex = this.selectedFrame.index;

                if (frameIndex < this.frameCount && frameIndex > 0) {
                    let forwardFrame = this.frames[parseInt(frameIndex) - 1];
                    this.frames[parseInt(frameIndex) - 1] = this.selectedFrame;
                    this.frames[frameIndex] = forwardFrame;

                    // change index
                    this.frames[frameIndex].index = frameIndex;
                    this.frames[parseInt(frameIndex) - 1].index = parseInt(frameIndex) - 1;

                    this.selectedFrame = this.frames[parseInt(frameIndex) - 1];
                }
            }
            event.stopPropagation();
        },
        handleClickBackward(event) {
            // move the selected frame forward
            if (this.selectedFrame) {
                let frameIndex = this.selectedFrame.index;

                if (frameIndex < this.frameCount-1 && frameIndex >= 0) {
                    let backwardFrame = this.frames[parseInt(frameIndex) + 1];
                    this.frames[parseInt(frameIndex) + 1] = this.selectedFrame;
                    this.frames[frameIndex] = backwardFrame;

                    // change index
                    this.frames[frameIndex].index = frameIndex;
                    this.frames[parseInt(frameIndex) + 1].index = parseInt(frameIndex) + 1;

                    this.selectedFrame = this.frames[parseInt(frameIndex) + 1];
                }
            }
            event.stopPropagation();
        },
        handleClickCopy(event) {
            if (this.selectedFrame) {
                let frameData = deepClone(this.selectedFrame);
                frameData.index = this.frameCount;
                this.frames.push(frameData);
                this.frameCount++;
                this.selectedFrame = this.frames[this.frameCount - 1];
            }
            event.stopPropagation();
        },
        handleClickExport() {
            // export c++ code, array format
            let code = 'uint16_t motion[] = {' + '\n';
            for (let i = 0; i < this.frameCount; i++) {
                let frame = this.frames[i];
                code += '{';
                for (let key in frame.frame) {
                    code += frame.frame[key] + ',';
                }
                code += frame.interval + '},\n';
            }
            // remove the last comma
            code = code.substring(0, code.length - 2) + '\n';
            code += '}';
            console.log("code", code);

            // message box preview and click sure to copy
            this.$alert('<pre>' + code + '</pre>', 'Export', {
                confirmButtonText: 'Copy',
                callback: action => {
                    const input = document.createElement('textarea');
                    input.innerHTML = code;
                    document.body.appendChild(input);
                    input.select();
                    document.execCommand('copy');
                    document.body.removeChild(input);
                    this.$message({
                        message: 'Copy successfully',
                        type: 'success'
                    });
                },
                dangerouslyUseHTMLString: true,
            });

        },
        async handleClickPlaySingle() {
            if (this.selectedFrame) {
                let frame = this.selectedFrame;
                let cmd = 'p ';
                for (let i=0; i < Object.keys(this.jointAngles).length; i++) {
                    let key = this.jointMapReverse[i];
                    console.log("key", key);
                    cmd += frame.frame[key] + ' ';
                }
                cmd += frame.interval;
                cmd += '\r';
                console.log("cmd", cmd);
                try {
                    await webSerial.sendMessage(cmd);
                } catch (error) {
                    console.log("error", error)
                }
            }
        },
        async handleClickPreview() {
            if (this.frames.length > 16) {
                this.$message({
                    message: 'The maximum number of frames is 16',
                    type: 'warning'
                });
                return;
            }
            if (this.frames.length > 0) {
                const loading = ElLoading.service({
                    lock: true,
                    text: 'Uploading...',
                    background: 'rgba(0, 0, 0, 0.7)',
                })
                setTimeout(() => {
                    loading.close()
                }, 10000);
                // start transmitting the motion sequence
                let cmd = 'S ' + this.frames.length + '\r';
                try {
                    console.log("cmd", cmd)
                    const resp = await webSerial.sendMessage(cmd);
                    if (resp != 'OK') {
                        // this.$message({
                        //     message: 'Failed to preview the motion sequence',
                        //     type: 'error'
                        // });
                        loading.close();
                        return
                    }
                } catch (error) {
                    console.log("error", error)
                    // this.$message({
                    //     message: 'Failed to preview the motion sequence',
                    //     type: 'error'
                    // });
                    loading.close();
                    return
                }

                for (let i = 0; i < this.frames.length; i++) {
                    let frame = this.frames[i];
                    let cmd = 'p ';
                    for (let j=0; j < Object.keys(this.jointAngles).length; j++) {
                        let key = this.jointMapReverse[j];
                        cmd += frame.frame[key] + ' ';
                    }
                    cmd += frame.interval;
                    cmd += '\r';
                    try {
                        console.log("cmd", cmd)
                        const resp = await webSerial.sendMessage(cmd);
                        if (resp != 'OK') {
                            loading.close();
                            return
                        }
                    } catch (error) {
                        loading.close();
                        console.log("error", error)
                    }
                }

                // stop transmitting the motion sequence
                // let stopCmd = 'E\r';
                // try {
                //     console.log("cmd", cmd)
                //     await webSerial.sendMessage(stopCmd);
                // } catch (error) {
                //     console.log("error", error)
                // }
                loading.close();
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
            document.getElementById('webgl1').appendChild(renderer.domElement);

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
                console.log("loader", loader)
                loader.load('/urdf/lono/urdf/lono.urdf', result => {

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
        },
        takeRenderShot() {
            if (robot) {
                renderer.render(scene, camera);
                const imgData = renderer.domElement.toDataURL("image/png");
                return imgData;
            }
            return null;
        },
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

#lono-frames {
    width: 100%;
    height: calc(30vh);
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
}

.lono-frames-btns {
    width: 100%;
    margin-top: 20px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
}

.lono-frames-container {
    width: calc(100%);
    height: calc(100% - 20px);
    margin-top: 10px;
    display: flex;
    flex-direction: row;
    /* justify-content: flex-start; */
    align-items: center;
    flex-wrap: nowrap;
    overflow-x: auto;
    /* background-color: aquamarine; */
}

.lono-single-frame {
    width: 200px;
    height: 220px;
    margin-right: 10px;
    /* background-color: green; */
    margin: auto 10px;
    flex: 0 0 auto;
}

.lono-single-frame-img {
    width: 200px;
    height: 200px;
    box-shadow: 4px -10px 10px rgba(0, 0, 0, 0.5),
                10px 1px 10px rgba(0, 0, 0, 0.5); 
}

.lono-single-frame-img-selected {
    width: 200px;
    height: 200px;
    box-shadow: 4px -10px 10px #5C9FF9,
                10px 1px 10px #5C9FF9; 
}

.lono-single-frame-info {
    width: 100%;
    height: 20px;
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;
}

.lono-single-frame-span {
    text-align: center;
    color: #000;
    font-size: 15px;
}

</style>