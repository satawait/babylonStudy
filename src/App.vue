<script setup lang="ts">
// import HelloWorld from './components/HelloWorld.vue'
import { ref, onMounted } from 'vue'
import * as BABYLON from "@babylonjs/core"
import { Artifice } from './utils/artifice'
import { BabylonSystem } from './utils/babylonSystem'

const babylonCanvas = ref<HTMLCanvasElement | null>(null)
const babylonSystem = ref<BabylonSystem | null>(null)
onMounted(() => {
  if (babylonCanvas.value) {
    babylonSystem.value = new BabylonSystem(babylonCanvas.value)
    babylonSystem.value.render()
  }
})
const add = () => {
  if (babylonSystem.value) {
    const x = Artifice.getRandomBetween(-20, 20)
    const firework = new Artifice(babylonSystem.value.scene)
    firework.shoot(x)
  }
}
</script>

<template>
  <div style="position: relative;">
    <canvas id="babylonCanvas" ref="babylonCanvas" style="width: 100%; height: 100%; background-color: black;"></canvas>
    <div class="button" @click="add">发射</div>
  </div>
  <!-- <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
  </div>
  <HelloWorld msg="Vite + Vue" /> -->
</template>

<style scoped>
#babylonCanvas {
  width: 100%;
    height: 100%;
    background-color: black;
    display: block;
}
.button {
  position: absolute;
  width: 120px;
  height: 40px;
  font-size: 20px;
  line-height: 40px;
  background-color:antiquewhite;
  color: black;
  text-align: center;
  bottom: 0;
  right: 0;
  cursor: pointer;
}
</style>
