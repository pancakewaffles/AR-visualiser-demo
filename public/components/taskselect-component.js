AFRAME.registerComponent('taskselect',{
  init:function(){
    let el = this.el;
    el.addEventListener('mousedown',function(evt){
      load_new_task(el);
    });
    
 
  }
});