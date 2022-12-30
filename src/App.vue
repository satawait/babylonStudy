<script setup lang="ts">
// import HelloWorld from './components/HelloWorld.vue'
import { ref, onMounted } from 'vue'
import * as BABYLON from "@babylonjs/core"

const babylonCanvas = ref<HTMLCanvasElement | null>(null)
onMounted(() => {
  if (babylonCanvas.value) {
    const engine = new BABYLON.Engine(babylonCanvas.value as HTMLCanvasElement)
    const createScene = () => {
      const scene = new BABYLON.Scene(engine)
      scene.clearColor = new BABYLON.Color4(0, 0, 0, 1)

      const camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 3, new BABYLON.Vector3(0, 0, 0))
      camera.attachControl(babylonCanvas.value, true)

      // const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene)

      // const box = BABYLON.MeshBuilder.CreateBox("box", {}, scene)
      // // box.position.set(0, 0, 10)

       // 创建粒子
      const particleSystem = new BABYLON.ParticleSystem("particles", 2000, scene)

      // 粒子贴图
      particleSystem.particleTexture = new BABYLON.Texture(new URL('./assets/imgs/flare.png', import.meta.url).href)

      // 发射位置
      particleSystem.emitter = new BABYLON.Vector3(0,0, 0);

      particleSystem.start();

      return scene
    }

    const scene = createScene()

    engine.runRenderLoop(() => {
      scene.render()
    })
  }
})
</script>

<template>
  <canvas id="babylonCanvas" ref="babylonCanvas" style="width: 100%; height: 100%; background-color: black;"></canvas>
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
</style>
