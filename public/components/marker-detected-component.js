AFRAME.registerComponent('marker-detected',{
  init:function(){
  },
  tick:function(){
    if(document.querySelector('a-marker').object3D.visible && !document.querySelector('#marker-detected') ){
      let marker_detected = document.createElement('span');
      marker_detected.setAttribute('id','marker-detected');
      marker_detected.className = 'new badge grey';
      marker_detected.setAttribute('data-badge-caption','Marker Detected');
      marker_detected.style.position = 'fixed';
      marker_detected.style.top = '24px';
      marker_detected.style.left = '24px';
      
      document.body.appendChild(marker_detected);
    }
    else{
      if(!document.querySelector('a-marker').object3D.visible && document.querySelector('#marker-detected')){
        document.body.removeChild(document.querySelector('#marker-detected'));
      }
    }
  }
});