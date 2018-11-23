AFRAME.registerComponent('renderer-modified', { // fix for logarithmic depth buffer
    init: function () {
        var antialias = this.el.getAttribute('antialias') === 'true';
        this.el.renderer = new THREE.WebGLRenderer({ canvas: this.el.canvas, antialias: antialias || window.hasNativeWebVRImplementation, logarithmicDepthBuffer: true, alpha: true, preserveDrawingBuffer: true });
        this.el.renderer.setPixelRatio(window.devicePixelRatio);
        this.el.renderer.sortObjects = true;
    },
    remove: function () {
        var antialias = this.el.getAttribute('antialias') === 'true';
        this.el.renderer = new THREE.WebGLRenderer({ canvas: this.el.canvas, antialias: antialias || window.hasNativeWebVRImplementation, logarithmicDepthBuffer: true, alpha: true, preserveDrawingBuffer: false });
    }
});