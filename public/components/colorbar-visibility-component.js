AFRAME.registerComponent('colorbar-visibility',{
  tick:function(){
    if(document.querySelector('a-scene').systems['master-controller'].is_something_visible){
      if(!this.el.object3D.visible){
        this.el.object3D.visible = true;
      }
    }else{
      this.el.object3D.visible=false;
    }

  }
});