import { MeshBuilder, ParticleSystem, Scene, Vector3, Texture, Color4, Particle, VertexBuffer } from "@babylonjs/core";
import type { Mesh } from "@babylonjs/core";

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
        this.textureFirework = new URL('../assets/imgs/flare.png', import.meta.url).href
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
        particleSystem.direction1 = new Vector3(0, -2, 0)
        particleSystem.direction2 = new Vector3(0, -2, 0)
        particleSystem.minEmitPower = 1
        particleSystem.maxEmitPower = 1
        particleSystem.updateSpeed = 0.005

        let bigEnough = false
        const updateFunction = (particles: Particle[]) => {
            for (let index = 0; index < particles.length; index++) {
                const particle = particles[index]
                particle.age += particleSystem._scaledUpdateSpeed
                if (particle.age >= particle.lifeTime) {
                    particleSystem.recycleParticle(particle)
                    index--
                    continue
                } else {
                    if (!bigEnough) {
                        particle.size -= 0.01
                    }
                    particle.direction.scaleToRef(particleSystem._scaledUpdateSpeed, particleSystem._scaledDirection)
                    particle.position.addInPlace(particleSystem._scaledDirection)
                    particleSystem.gravity.scaleToRef(particleSystem._scaledUpdateSpeed, particleSystem._scaledGravity)
                    particle.direction.addInPlace(particleSystem._scaledGravity)
                }
            }
        }
        particleSystem.updateFunction = updateFunction
        particleSystem.start()

        this.scene.registerBeforeRender(() => {
            if (!this.isFired) {
                if (!this.isTop) {
                    startSphere.position.y += 0.5
                    if (startSphere.position.y > 30) {
                        this.isTop = !this.isTop
                        if (this.isTop) {
                            this.posX = startSphere.position.x
                            this.posY = startSphere.position.y
                            this.posZ = startSphere.position.z
                        }
                    }
                    particleSystem.stop()
                    startSphere.position.x -= 0.5
                } else {
                    this.timer += 5
                    if (this.timer === 125) {
                        for (let i = 0; i < 2; i++) {
                            this.firework()
                        }
                        this.isFired = !this.isFired
                    }
                }
            }
        })
    }

    static getRandomBetween(min: number, max: number) {
        const range = max - min
        const rand = Math.random()
        const num = min + Math.round(rand * range)
        return num
    }
    
    firework() {
        const fountain = MeshBuilder.CreateSphere('explosion', {
            segments: 4,
            diameter: 1
        }, this.scene)
        fountain.isVisible = false
        fountain.position.x = this.posX
        fountain.position.y = this.posY
        fountain.position.z = this.posZ
        const particleFromVerticesEmitter = fountain
        particleFromVerticesEmitter.useVertexColors = true
        const verticesPositions = particleFromVerticesEmitter.getVerticesData(VertexBuffer.PositionKind) as []
        const verticesNormals = particleFromVerticesEmitter.getVerticesData(VertexBuffer.NormalKind) as []
        const verticesColor = []
        for (let i = 0; i < verticesPositions.length; i += 3) {
            const vertexPosition = new Vector3(verticesPositions[i], verticesPositions[i + 1], verticesPositions[i + 2])
            const vertexNormal = new Vector3(verticesNormals[i], verticesNormals[i + 1], verticesNormals[i + 2])
            const color = new Color4(Math.random(), Math.random(), Math.random(), 1)
            verticesColor.push(color.r, color.g, color.b, color.a)
            const gizmo = MeshBuilder.CreateBox('gizmo', {
                size: 0.001
            }, this.scene)
            gizmo.position = vertexPosition
            gizmo.parent = particleFromVerticesEmitter
            this.createParticleSystem(gizmo, vertexNormal.normalize().scale(1), color)
        }
        particleFromVerticesEmitter.setVerticesData(VertexBuffer.ColorKind, verticesColor)
    }
    createParticleSystem(emitter: Mesh, direction: Vector3, color: Color4) {
        let bigEnough = false
        const particleSystem1 = new ParticleSystem('particles', 500, this.scene)
        const updateFunction = (particles: Particle[]) => {
            for (let index = 0; index < particles.length; index++) {
                const particle = particles[index]
                particle.age += particleSystem1._scaledUpdateSpeed
                if (particle.age >= particle.lifeTime) {
                    particleSystem1.recycleParticle(particle)
                    index--
                    continue
                } else {
                    if (!bigEnough) {
                        particle.size = particle.size + 0.005
                        if (particle.size >= 0.162) {
                            bigEnough = !bigEnough
                        }
                    }
                    particle.direction.scaleToRef(particleSystem1._scaledUpdateSpeed, particleSystem1._scaledDirection)
                    particle.position.addInPlace(particleSystem1._scaledDirection)
                    particleSystem1.gravity.scaleToRef(particleSystem1._scaledUpdateSpeed, particleSystem1._scaledGravity)
                    particle.direction.addInPlace(particleSystem1._scaledGravity)
                }
            }
        }
        particleSystem1.updateFunction = updateFunction
		// particleSystem1.domeRadius = 10
		particleSystem1.particleTexture = new Texture(this.textureFirework, this.scene)
		particleSystem1.emitter = emitter; // the starting object, the emitter
		particleSystem1.minEmitBox = new Vector3(1, 0, 0); // Starting all from
		particleSystem1.maxEmitBox = new Vector3(1, 0, 0); // To...
		particleSystem1.color1 = color
		particleSystem1.color2 = color
		particleSystem1.colorDead = new Color4(0, 0, 0, 0.0)
		particleSystem1.minSize = 0.1
		particleSystem1.maxSize = 0.1
		particleSystem1.minLifeTime = 1
		particleSystem1.maxLifeTime = 2
		particleSystem1.emitRate = 500
		particleSystem1.blendMode = ParticleSystem.BLENDMODE_ONEONE
		particleSystem1.gravity = new Vector3(0, -9.81, 0)
		particleSystem1.direction1 = direction
		particleSystem1.direction2 = direction          
		particleSystem1.minEmitPower = 10
		particleSystem1.maxEmitPower = 13
		particleSystem1.updateSpeed = 0.01	
		particleSystem1.start()

        this.scene.registerBeforeRender(() => {
            if (this.timer1 < 300) {
                this.timer1 += 0.15
            } else {
                particleSystem1.stop()
            }
        })
    }
}