AFRAME.registerComponent('rotatable',{
  init:function(){
    let el = this.el;
    let docbody = document.querySelector('body');
		this.marker = document.querySelector('a-marker');
		this.markerVisible = false;
    
    let sceneEl = document.querySelector('a-scene');
    
    var hammertime = new Hammer(docbody);

    hammertime.on('pan', (ev) => {
      if(!this.markerVisible || sceneEl.systems['master-controller'].get_meshes_info_list().length ==0){return;}
      var axisX = new THREE.Vector3(1,0,0);
      var axisY = new THREE.Vector3(0,1,0);
      var axisZ = new THREE.Vector3(0,0,1);
      var rotateSpeed = 8;
      var rotationObject;
      switch(ev.direction) {
        /* 2 - left, 4 - right, 8 - up, 16 - down */
        case 2:
          rotationObject = {'axis':axisZ,'amount':rotateSpeed*Math.PI/180};
          sceneEl.systems['master-controller'].update_rotation(el.getAttribute('id'),rotationObject);
          break;
        case 4:
          rotationObject = {'axis':axisZ,'amount':-1*rotateSpeed*Math.PI/180};
          sceneEl.systems['master-controller'].update_rotation(el.getAttribute('id'),rotationObject);
          break;
        case 8:
          rotationObject = {'axis':axisX,'amount':-1*rotateSpeed*Math.PI/180};
          sceneEl.systems['master-controller'].update_rotation(el.getAttribute('id'),rotationObject);
          break;
        case 16:
          rotationObject = {'axis':axisX,'amount':rotateSpeed*Math.PI/180};
          sceneEl.systems['master-controller'].update_rotation(el.getAttribute('id'),rotationObject);
          break;
        default:
          break;
      }
      
    })
  },
  tick: function() {
        if (this.marker && this.marker.object3D.visible == true) {
          this.markerVisible = true
          //console.log(this.markerVisible)
        } else {
          this.markerVisible = false
      }

    }
  
});