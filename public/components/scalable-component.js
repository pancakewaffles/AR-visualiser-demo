AFRAME.registerComponent('scalable',{
  init:function(){
    let el = this.el;
    let docbody = document.querySelector('body');
		this.marker = document.querySelector('a-marker');
		this.markerVisible = false;
    
    let sceneEl = document.querySelector('a-scene');
    
    var hammertime = new Hammer(docbody);
    
    hammertime.get('pinch').set({ enable: true }); 
    var lastScale;
    var scaleFactor;
    var MINSCALE = 1, MAXSCALE = 2.0;
    hammertime.on("pinch", (ev) => {
      if(!this.markerVisible || sceneEl.systems['master-controller'].get_meshes_info_list().length ==0){return;}
       let scale = {x:Math.max(MINSCALE,Math.min(lastScale.x*ev.scale,MAXSCALE)), 
                    y:Math.max(MINSCALE,Math.min(lastScale.y*ev.scale,MAXSCALE)), 
                    z:Math.max(MINSCALE,Math.min(lastScale.z*ev.scale,MAXSCALE))};
       sceneEl.systems['master-controller'].update_scale(el.getAttribute('id'),scale);

        });
    hammertime.on("pinchstart", (ev) => {
        if(!this.markerVisible || sceneEl.systems['master-controller'].get_meshes_info_list().length ==0){return;} 
        lastScale = el.getAttribute("scale");
        });
    hammertime.on("pinchend", (ev) => {
        if(!this.markerVisible || sceneEl.systems['master-controller'].get_meshes_info_list().length ==0){return;} 
         lastScale = {x:Math.max(MINSCALE,Math.min(lastScale.x*ev.scale,MAXSCALE)), 
                      y:Math.max(MINSCALE,Math.min(lastScale.y*ev.scale,MAXSCALE)), 
                      z:Math.max(MINSCALE,Math.min(lastScale.z*ev.scale,MAXSCALE))};
          });



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