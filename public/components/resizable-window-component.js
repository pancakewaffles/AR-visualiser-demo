AFRAME.registerComponent('resizable-window',{
  init:function(){
    window.addEventListener('resize',function(evt){
      AFRAME.scenes[0].camera.aspect = window.innerWidth / window.innerHeight;
      AFRAME.scenes[0].camera.updateProjectionMatrix();
      AFRAME.scenes[0].renderer.setSize( window.innerWidth, window.innerHeight );
    });
  }
});