// This handles active meshes and changes the colour of the buttons in the meshes menu list appropriately. 
AFRAME.registerComponent('meshesmenu-handler',{
  tick:function(){
    let master_controller = document.querySelector('a-scene').systems['master-controller'];
    if(master_controller.is_something_visible){
      let meshes_info_list = master_controller.get_meshes_info_list();
      for(let i=0;i<meshes_info_list.length;i++){
        if(master_controller.get_visibility(meshes_info_list[i]['entity_id'])){
            let t = document.querySelector('[data-name='+meshes_info_list[i]['entity_id']+']');
            if(!t.classList.contains('mesh_active')){
              t.classList.add('mesh_active');
            }
        }else{
            let t = document.querySelector('[data-name='+meshes_info_list[i]['entity_id']+']');
            if(t.classList.contains('mesh_active')){
              t.classList.remove('mesh_active');
            }
        }
      }
    }

  }
});