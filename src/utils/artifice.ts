import { MeshBuilder, ParticleSystem, Scene, Vector3, Texture, Color4 } from "@babylonjs/core";

export class Artifice {
    scene: Scene
    isTop: boolean
    timer: number
    isFired: boolean
    timer1: number
    textureFirework: string
    posX: number
    posY: number
    posZ: number

    constructor(scene: Scene) {
        this.scene = scene
        this.isTop = false
        this.timer = 0
        this.isFired = false
        this.timer1 = 0
        this.textureFirework = new URL('./assets/imgs/flare.png', import.meta.url).href
        this.posX = 0
        this.posY = 0
        this.posZ = 0
    }

    shoot(posX = 0, posY = -20, posZ = 0) {
        let startSphere = MeshBuilder.CreateSphere('shoot', {
            segments: 4,
            diameter: 1,
        }, this.scene)
        startSphere.position = new Vector3(posX, posY, posZ)
        startSphere.isVisible = false

        const particleSystem = new ParticleSystem('particles', 350, this.scene)
        particleSystem.particleTexture = new Texture(this.textureFirework)
        particleSystem.emitter = startSphere
        particleSystem.minEmitBox = new Vector3(0, 0, 0)
        particleSystem.maxEmitBox = new Vector3(0, 0, 0)
        particleSystem.color1 = new Color4(1, 0.8, 1.0, 1.0)
        particleSystem.color2 = new Color4(1, 0.5, 1.0, 1.0)
        particleSystem.colorDead = new Color4(0, 0, 0.2, 0.5)
        particleSystem.minSize = 1
        particleSystem.maxSize = 1
        particleSystem.minLifeTime = 0.5
        particleSystem.maxLifeTime = 0.5
        particleSystem.emitRate = 350
        particleSystem.blendMode = ParticleSystem.BLENDMODE_ONEONE
    }
}