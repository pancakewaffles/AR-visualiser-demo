AFRAME.registerComponent('mobile-optimisation',{
  init: function(){
    let isMobile = AFRAME.utils.device.isMobile();

    if(isMobile){
      let str = 'sourceType:webcam; detectionMode: mono; maxDetectionRate:30; canvasWidth: 240; canvasHeight: 180;debugUIEnabled: false;';
      this.el.setAttribute('arjs',str);
      document.querySelector('#scene-scaler').object3D.scale.set(0.3,0.3,0.3);
    }else{
      let str = 'sourceType:webcam; detectionMode: mono; maxDetectionRate:30; canvasWidth: 1920; canvasHeight: 1440;debugUIEnabled: false;';
      this.el.setAttribute('arjs',str);
    }
  }
})
