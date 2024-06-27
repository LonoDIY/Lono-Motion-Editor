<template>
  <div id="container">
    <div class="header">
      <div class="header-item header-image">
        <img src="./assets/images/lono.png"></img>
      </div>
      <!-- <div class="header-item">
        <span class="input-label">{{ $t("message.deviceLabel") }}</span>
        <el-select v-model="device" placeholder="" style="width: 240px">
          <el-option
            v-for="(item,idx) in deviceList"
            :key="idx"
            :value="item"
          />
        </el-select>
      </div> -->
      <div class="header-item">
        <span class="input-label">{{ $t("message.baudRateLabel") }}</span>
        <el-select v-model="baudRate" placeholder="" style="width: 240px">
          <el-option
            v-for="(item,idx) in commonBaudRate"
            :key="idx"
            :value="item"
          />
        </el-select>
      </div>
      <div class="header-item">
        <el-button @click="handleConnect" plain>{{ $t("message.connectionBtn") }}</el-button>
        <el-button type="danger" @click="handleDisconnect" plain>{{ $t("message.disconnectionBtn") }}</el-button>
      </div>
      <div class="header-item state-item">
        <span class="input-label">{{ $t("message.connectionState") }}</span>
        <div id="state-sign" :style="stateDynamicStyle"></div>
      </div>

      <div class="header-item">
        <el-switch
          v-model="lang"
          inline-prompt
          style="--el-switch-on-color: #848080; --el-switch-off-color: #848080"
          active-text="Lang/CN"
          active-value="cn"
          inactive-text="Lang/EN"
          inactive-value="en"
          @change="changeLanguage"
        />
      </div>
    </div>

    <div class="content">
      <el-tabs stretch  v-model="activeTab" class="demo-tabs" @tab-click="handleTabClick">
        <el-tab-pane :label='$t("message.lonoTabLable")' name="lono">
          <lono />
        </el-tab-pane>
        <el-tab-pane :label='$t("message.lonoMotionTabLabel")' name="lono-motion">
          <lono-motion />
        </el-tab-pane>
        <el-tab-pane :label='$t("message.lonoProTabLable")' name="lono-pro">
          <lono-pro />
        </el-tab-pane>
        <el-tab-pane :label='$t("message.lonoProMotionTabLabel")' name="lono-pro-motion">
        </el-tab-pane>
        <el-tab-pane label="firmware" name="firmware">
        </el-tab-pane>
        <el-tab-pane label="Help" name="help-doc">
          <help />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>

import Lono from "./components/Lono.vue";
import LonoMotion from "./components/LonoMotion.vue";
import LonoPro from "./components/LonoPro.vue";
import Help from "./components/Help.vue";

import {webSerial} from "./serial/index.js";
import LonoMotionVue from './components/LonoMotion.vue';

export default {
  data() {
    return {
      lang: "en",
      device: "",
      baudRate: "9600",
      commonBaudRate: [
        300,
        600,
        1200,
        2400,
        4800,
        9600,
        14400,
        19200,
        38400,
        57600,
        115200,
        230400,
        460800,
        921600,
      ],
      deviceList: [],
      isConnected: false,
      activeTab: "lono",
    };
  },
  components: {
    Lono,
    LonoPro,
    LonoMotion,
    Help,
  },
  computed: {
    stateDynamicStyle() {
      return {
        backgroundColor: this.isConnected ? "#06c750" : "#e90d48",
      }
    }
  },
  beforeCreate() {
    // does not support mobile devices
    if (window.innerWidth < 1024) {
      this.$alert(this.$t("message.smallScreenHint"), "Warning", {
        confirmButtonText: "OK",
        callback: (action) => {
          this.$router.push("/");
        },
      });
    }

    // check if the browser supports Web Serial API
    if (!("serial" in navigator)) {
      this.$alert(this.$t("message.nowebSerialAPIHint"), "Warning", {
        confirmButtonText: "OK",
        callback: (action) => {
          this.$router.push("/");
        },
      });
    }
  },
  mounted() {
    navigator.serial.addEventListener("disconnect", (event) => {

    })
  },
  methods: {
    changeLanguage(lang) {
      console.log("lang: ", lang);
      this.$i18n.locale = lang;
    },
    async handleConnect() {
      await webSerial.connect(this.baudRate);
      this.isConnected = webSerial.isConnected;
    },
    async handleDisconnect() {
      await webSerial.disconnect();
      this.isConnected = webSerial.isConnected;
    },
    handleTabClick(e) {
      console.log("old activeTab: ", e);
    }
  }
}
</script>

<style>
html, body, #app {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}

#container {
  width: 100vw;
  height: 100vh;
  background-color: #fff;
  box-sizing: border-box;
  padding-top: 20px;
}

.header {
  width: 80%;
  height: 100px;
  margin: auto;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
  border-bottom: 1px solid #ebeef5;
}


.header-image {
  width: 100px;
  height: 100px;
}

.header-image > img {
  width: 100%;
  height: 100%;
}

.input-label {
  margin-right: 10px;
}

.state-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

#state-sign {
  width: 25px;
  height: 25px;
  border-radius: 50%;
}

.content {
  width: 80%;
  height: calc(100vh - 130px);
  margin: auto;
}

</style>
