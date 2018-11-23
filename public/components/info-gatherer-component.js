AFRAME.registerComponent('info-gatherer',{
  tick:function(){
    if(document.querySelector('.content_connection')){
      if(document.querySelector('a-scene').systems['network-controller'].is_connected()){
        document.querySelector('.content_connection').innerHTML='<h5>Your Connection</h5>'
                              +'<span class="new badge green" style="float:left" data-badge-caption="Connected!"></span><p>&nbspand you are in room '
                              +document.querySelector('a-scene').getAttribute('networked-scene').room;
                              +'</p>';
      }
      else{
        document.querySelector('.content_connection').innerHTML='<h5>Your Connection</h5>'
                              +'<span class="new badge red" data-badge-caption="Not Connected!"></span><br />';
      }
    }
    if(document.querySelector('.content_naf')){
      if(document.querySelector('a-scene').systems['network-controller'].get_connected_clients_list().length === 0){
        document.querySelector('.content_naf').innerHTML='<h5>You are connected to</h5>'
                                    +'<p>No one! Try inviting others using the link below.</p>';
      }
      else{
        document.querySelector('.content_naf').innerHTML='<h5>You are connected to</h5>'
                                    +'<p>'+document.querySelector('a-scene').systems['network-controller'].get_connected_clients_list()+'</p>';
      }
    }

  }
});