AFRAME.registerComponent('wireframey',{ 
  dependencies:['material'],
  init:function(){
    this.el.components.material.material.wireframe = true;
  },
  tick:function(){
    // TODO: recalculate bounding box when adding new meshes.
    this.el.components.material.material.wireframe = true;
  }
});