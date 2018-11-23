AFRAME.registerComponent('resizable-raycaster',{
  init:function(){
    let sceneEl = document.querySelector('a-scene');
    let raycasterEl = sceneEl.querySelector('[raycaster]');
    raycasterEl.addEventListener('raycaster-intersection',function(event){
        //M.toast({html:"HIT SOMETHING"});    
      });
    document.body.addEventListener("mousedown", function(evt){ //fugly fix
      let sceneEl = document.querySelector('a-scene');
      let raycasterEl = sceneEl.querySelector('[raycaster]');
      sceneEl.removeChild(raycasterEl);
      raycasterEl = document.createElement('a-entity');
      raycasterEl.setAttribute('cursor','rayOrigin:mouse');
      raycasterEl.setAttribute('raycaster','objects:a-rounded;near:0;far:30');
      raycasterEl.addEventListener('raycaster-intersection',function(event){
        //M.toast({html:"HIT SOMETHINGc"});    
      });
      sceneEl.appendChild(raycasterEl);
    });
  }
});