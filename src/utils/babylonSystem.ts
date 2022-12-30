import { Scene, Engine, Camera, ArcRotateCamera, Vector3 } from "@babylonjs/core"
export class BabylonSystem {
    scene: Scene
    canvas: HTMLCanvasElement
    engine: Engine
    camera: Camera
    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas
        this.engine = new Engine(this.canvas)
        this.scene = new Scene(this.engine)
        this.camera = new ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 3, new Vector3(0, 0, 0))
    }
    render() {
        this.engine.runRenderLoop(() => {
            this.scene.render()
          })
    }
}