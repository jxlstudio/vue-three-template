<template>
  <div class="home">
    <div v-if="isMobile()">
      <b-notification class="content" type="is-warning" aria-close-label="Close notification" role="alert" :active.sync="notificationActive">
        <p><strong>It appears you are on a mobile device!</strong></p>
        <p>If this is not the case, please close this alert and continue 😀</p>
        <button class="button is-fullwidth" @click="notificationActive = !notificationActive">Close</button>
      </b-notification>
    </div>
    <div class="columns">
      <div class="column">
        <div id="tool">
          <Logo/>
          <div id="spinner"><font-awesome-icon icon="spinner" size="3x" spin /></div>
          <div id="ui-controls">
            <a class="controls" @click="zoomIn()"><font-awesome-icon icon="plus" size="2x" /></a>
            <a class="controls" @click="zoomOut()"><font-awesome-icon icon="minus" size="2x" /></a>
            <a class="controls" @click="resetView()"><font-awesome-icon icon="undo-alt" size="2x" /></a>
            <a v-if="!isMobile()" class="controls" @click="saveAsImage()"><font-awesome-icon icon="download" size="2x" /></a>
            <a v-if="!isMobile()" class="controls" @click="createPDF()"><font-awesome-icon icon="file-pdf" size="2x" /></a>
            <a class="controls" @click="copyShareLink()"><font-awesome-icon class="fa-fw" icon="share-square" size="2x" /></a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import jsPDF from 'jspdf'
import Logo from '@/components/Logo.vue'
import * as clipboard from 'clipboard-polyfill/build/clipboard-polyfill.promise'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js'

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 3000)
const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true, alpha: true })
renderer.setClearColor(0x777777, 1)
const loader = new STLLoader()

const mixinDetectingMobile = {
  methods: {
    isMobile: function () {
      var check = false;
      (function (a) {
        // eslint-disable-next-line
        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true
      })(navigator.userAgent || navigator.vendor || window.opera)
      return check
    }
  }
}

export default {
  name: 'home',
  components: {
    Logo
  },
  data () {
    return {
      meshMaterial: null,
      grid: null,
      axis: null,
      controls: null,
      manager: null,
      cameraZoomDefault: 1.2,
      cameraZoomMobile: 0.8,
      toolHeight: window.innerHeight,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
      mobileMinHeight: 668,
      mobileMinHeightDifference: 200,
      mobileMinWidth: 600
    }
  },
  mixins: [mixinDetectingMobile],
  computed: {
    stl: function () {
      return './assets/models/stl/model.stl'
    },
    shareLink: function () {
      let link = ''
      return link
    }
  },
  watch: {

  },
  methods: {
    init () {
      let container = document.getElementById('tool')

      camera.position.set(10, 10, 10)

      this.addLights()

      this.addRenderer(this.viewportWidth, this.toolHeight)

      container.appendChild(renderer.domElement)

      this.addManager()

      loader.load(this.stl, this.loadStl)

      this.addControls()

      this.onWindowResize()

      // Responsive Resize
      window.addEventListener('resize', this.onWindowResize, false)
    },
    addLights () {
      // Fog
      scene.fog = new THREE.FogExp2(0xFFFFFF, 0.005)

      // Lights
      scene.add(new THREE.HemisphereLight(0x000000, 0xffffff, 0.5))
      this.addShadowedLight(1, 1, 1.125, 0xffffff, 0.5)
      // this.addShadowedLight(0.5, 1, -1.125, 0xffffff, 0.75)
      // this.addShadowedLight(0, 1, 0, 0xffffff, 0.75)
      let pointlight = new THREE.PointLight(0xffffff, 0.9, 100)
      pointlight.position.set(-5, 15, 0)
      scene.add(pointlight)
    },
    addControls () {
      // Grid & Axis Helpers
      let size = 1000
      let divisions = 1000
      this.grid = new THREE.GridHelper(size, divisions, 0x777777, 0x777777)
      this.axis = new THREE.AxesHelper(1200)
      scene.add(this.grid)
      scene.add(this.axis)

      // Controls
      this.controls = new OrbitControls(camera, renderer.domElement)
      this.controls.enableDamping = true // an animation loop is required when either damping or auto-rotation are enabled
      this.controls.dampingFactor = 0.5
      this.controls.enableZoom = false
      this.controls.enablePan = false
      this.controls.screenSpacePanning = false
      this.controls.minDistance = 15
      this.controls.maxDistance = 100
    },
    loadStl (geometry) {
      this.setMaterial()
      this.mesh = new THREE.Mesh(geometry, this.meshMaterial)
      this.mesh.name = 'meshObj'

      this.mesh.position.set(0, 0, 0)
      this.mesh.rotation.set(0, 0, 0)

      this.mesh.scale.set(1, 1, 1)

      this.mesh.castShadow = true
      this.mesh.receiveShadow = true
      this.mesh.colorsNeedUpdate = true

      scene.add(this.mesh)
    },
    removeStl (callback) {
      let m = scene.getObjectByName('meshObj')
      m.geometry.dispose()
      m.material.dispose()
      scene.remove(m)
      callback()
    },
    reloadStl () {
      this.setMaterial()
      this.loader.load(this.stl, this.loadStl)
    },
    setMaterial () {
      this.meshMaterial = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        specular: 0x111111,
        shininess: 10,
        flatShading: true,
        side: THREE.DoubleSide
      })

      // this.meshMaterial.color.setHex(this.hexCode)
    },
    addManager () {
      // Loading Manager
      this.spinner = document.getElementById('spinner')

      this.manager = new THREE.LoadingManager()
      this.manager.onStart = function () {
        // eslint-disable-next-line
        spinner.style.display = 'block'
      }

      this.manager.onLoad = function () {
        // eslint-disable-next-line
        spinner.style.display = 'none'
      }
    },
    addRenderer (width, height) {
      // Renderer
      renderer.setPixelRatio(window.devicePixelRatio)
      renderer.setSize(width, height)

      renderer.gammaFactor = 1.25
      renderer.gammaInput = true
      renderer.gammaOutput = true
      renderer.shadowMap.enabled = true
    },
    addShadowedLight (x, y, z, color, intensity) {
      let directionalLight = new THREE.DirectionalLight(color, intensity)
      directionalLight.position.set(x, y, z)
      scene.add(directionalLight)

      directionalLight.castShadow = true

      let d = 1
      directionalLight.shadow.camera.left = -d
      directionalLight.shadow.camera.right = d
      directionalLight.shadow.camera.top = d
      directionalLight.shadow.camera.bottom = -d

      directionalLight.shadow.camera.near = 1
      directionalLight.shadow.camera.far = 4

      directionalLight.shadow.mapSize.width = 1024
      directionalLight.shadow.mapSize.height = 1024

      directionalLight.shadow.bias = -0.3
    },
    onWindowResize () {
      this.viewportWidth = window.innerWidth
      this.viewportHeight = window.innerHeight

      this.resetView()

      if (this.viewportHeight < this.mobileMinHeight) {
        this.toolHeight = this.viewportHeight - 120
      } else {
        this.toolHeight = this.viewportHeight - this.mobileMinHeightDifference
      }

      camera.aspect = this.viewportWidth / this.toolHeight
      camera.updateProjectionMatrix()

      renderer.setSize(this.viewportWidth, this.toolHeight)
    },
    zoomIn () {
      camera.zoom += 0.25
    },
    zoomOut () {
      camera.zoom -= 0.25
    },
    resetView () {
      camera.position.set(-10, 15, 40)
      if (this.viewportHeight < this.mobileMinHeight || this.viewportWidth < this.mobileMinWidth) {
        camera.zoom = this.cameraZoomMobile
      } else {
        camera.zoom = this.cameraZoomDefault
      }
    },
    render () {
      this.meshMaterial.needsUpdate = true
      renderer.render(scene, camera)
    },
    animate () {
      camera.updateProjectionMatrix()
      requestAnimationFrame(this.animate)

      this.controls.update()
      this.render()
    },
    createPDF () {
      let pdfTitle = 'PDF-NAME-HERE'
      let pdfName = pdfTitle + '.pdf'
      // eslint-disable-next-line
      let doc = new jsPDF('p', 'mm', 'letter')

      // Get ScreenCap of 3D
      let canvas = document.getElementById('tool')
      let canvasWidth = canvas.clientWidth
      let canvasHeight = canvas.clientHeight
      let strMime = 'image/jpeg'
      let cap = renderer.domElement.toDataURL(strMime)
      let capWidth, capHeight
      if (canvasWidth > canvasHeight) {
        capWidth = 177
        capHeight = (canvasHeight / canvasWidth) * capWidth
      } else {
        capHeight = 195
        capWidth = (canvasWidth / canvasHeight) * capHeight
      }
      console.log(capWidth + ' x ' + capHeight)

      doc.setFont('helvetica')
      doc.setFontSize(12)
      doc.setFontStyle('bold')
      doc.text(20, 35, pdfTitle)
      doc.addImage(cap, 'JPEG', 20, 45, capWidth, capHeight)
      // Creates PDF on Event 'Click'
      doc.save(pdfName)
      // Success
      this.success('Success!')
    },
    saveAsImage () {
      let imgData
      try {
        let strMime = 'image/jpeg'
        let file = '3D-Image-Capture.jpg'
        imgData = renderer.domElement.toDataURL(strMime)

        this.saveFile(imgData.replace(strMime, this.strDownloadMime), file)
      } catch (e) {
        console.log(e)
      }
      // Success
      this.success('Success!')
    },
    saveFile (strData, filename) {
      let link = document.createElement('a')
      if (typeof link.download === 'string') {
        document.body.appendChild(link) // Firefox requires the link to be in the body
        link.download = filename
        link.href = strData
        link.click()
        document.body.removeChild(link) // remove the link when done
      } else {
        // eslint-disable-next-line
        location.replace(uri)
      }
    },
    capitalizeFirstLetter (string) {
      return string.charAt(0).toUpperCase() + string.slice(1)
    },
    getBase64Image: function (img) {
      let canvas = document.createElement('canvas')

      canvas.width = img.width
      canvas.height = img.height
      let ctx = canvas.getContext('2d')

      ctx.drawImage(img, 0, 0)

      let dataURL = canvas.toDataURL('image/jpeg')

      return dataURL.replace(/^data:image\/(png|jpg);base64,/, '')
    },
    getUrlParameters: function (parameter, defaultvalue) {
      let urlparameter = defaultvalue
      if (window.location.href.indexOf(parameter) > -1) {
        urlparameter = this.getUrlVars()[parameter]
      }
      return urlparameter
    },
    getUrlVars: function () {
      let vars = {}
      // eslint-disable-next-line
      let parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
        vars[key] = value
      })
      return vars
    },
    copyShareLink: function () {
      try {
        clipboard.writeText(this.shareLink)
        this.success('Link Copied to Clipboard!')
      } catch (err) {
        this.error('An error occured, please try again.')
      }
    },
    error (msg) {
      this.$buefy.toast.open({
        message: msg,
        type: 'is-danger'
      })
    },
    success (msg) {
      this.$buefy.toast.open({
        message: msg,
        type: 'is-success'
      })
    },
    warning (msg) {
      this.$buefy.toast.open({
        message: msg,
        type: 'is-warning'
      })
    }
  },
  mounted () {
    this.init()
    this.animate()
  },
  created () {

  }
}
</script>

<style lang="scss">
  #tool {
    position: relative;
    margin-bottom: 25px;
  canvas {
    &:hover {
      cursor: move;
    }
  }
  }
  #ui-controls {
    position: absolute;
    top: 20px;
    right: 20px;
  }
  a.controls {
    border-width: 1px;
    background: transparent;
    color: #fff;
    cursor: pointer;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    text-align: center;
    white-space: nowrap;
    display: block;
    margin: 20px 0;
    &:hover, .is-hovered, &:active, .is-active, &:focus, .is-focused {
      border-color: transparent;
      color: #343434;
    }
  }
  #spinner {
    display: none;
    position: absolute;
    color: #fff;
    font-size: rem-calc(40px);
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
</style>
