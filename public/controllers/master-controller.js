// This is the multimesh system/controller. It controls all entities; creates entities, destroys entities. Communicates with NetworkController It does NOT control the menus.
AFRAME.registerSystem('master-controller', {
  init:function(){
    this.meshes_info_list = [];
    this.tasks_info_list = [];
    this.inventory_list = [];
    this.mid_pts_dict = {};
    this.update_all();
    this.is_something_visible = false;
  },
  is_something_visible:function(){
    return this.is_something_visible;
  },
  get_inventory_list:function(){
    return this.inventory_list;
  },
  set_inventory_list:function(list){
    this.inventory_list = [];
    for(let i =0;i<list.length;i++){
      this.inventory_list.push(list[i]);
    }
  },
  get_meshes_list:function(){
    return document.querySelectorAll('.mesh');
  },
  get_meshes_info_list:function(){
    return this.meshes_info_list;
  },
  get_entities_list:function(){
    return document.querySelectorAll('a-entity');
  },
  get_tasks_list:function(){
    return document.querySelectorAll('.task');
  },
  get_tasks_info_list:function(){
    return this.tasks_info_list;
  },
  get_mid_pts_dict:function(){
    return this.mid_pts_dict;
  },
  add_mid_pts_dict:function(entity_id,x){
    this.mid_pts_dict[entity_id] = x;
  },
  get_visibility:function(entity_id){
    return document.querySelector('#'+entity_id).object3D.visible;
  },
  set_visibility:function(entity_id,visible){
    document.querySelector('#'+entity_id).object3D.visible = visible;
  },
  get_rotation:function(entity_id){
    return {x:document.querySelector('#'+entity_id).object3D.rotation.x,
            y:document.querySelector('#'+entity_id).object3D.rotation.y,
            z:document.querySelector('#'+entity_id).object3D.rotation.z,
           }
  },
  set_rotation:function(entity_id,rotationObject){
    if(typeof rotationObject.x != 'undefined'){
      document.querySelector('#'+entity_id).object3D.rotation.x = rotationObject.x;
      document.querySelector('#'+entity_id).object3D.rotation.y = rotationObject.y;
      document.querySelector('#'+entity_id).object3D.rotation.z = rotationObject.z;
    }else{
      document.querySelector('#'+entity_id).object3D.rotateOnWorldAxis(rotationObject['axis'],rotationObject['amount']);
      
    }
  },
  update_rotation:function(entity_id,rotationObject){
    this.set_rotation(entity_id,rotationObject);
    let data = {'instruction':'rotate','entity_id':entity_id,'rotationObject':rotationObject};
    this.el.systems['network-controller'].send_instruction('all',data);
  },
  get_scale:function(entity_id){
    return document.querySelector('#'+entity_id).getAttribute('scale');
  },
  set_scale:function(entity_id,scale){
    let entity = document.querySelector('#'+entity_id);
    entity.setAttribute('scale',scale);    
  },
  update_scale:function(entity_id,scale){
    this.set_scale(entity_id,scale);
    let data = {'instruction':'scale','entity_id':entity_id,'scale':scale};
    this.el.systems['network-controller'].send_instruction('all',data);
  },
  create_entity:function(task_id, entity_id, mesh_url){
    let entity = document.createElement('a-entity');
    entity.setAttribute('id',entity_id);
    entity.classList.add('mesh');
    entity.setAttribute('data-parent',task_id);
    entity.setAttribute('data-mesh_url',mesh_url);
    document.querySelector('#'+task_id).appendChild(entity);
    this.meshes_info_list.push({
                        'entity_id':entity.getAttribute('id'),
                         'task_id':entity.getAttribute('data-parent'),
                         'mesh_url':entity.getAttribute('data-mesh_url'),
                         'rotation': this.get_rotation(task_id),
                         'scale':this.get_scale(task_id),
                         'visibility':this.get_visibility(entity.getAttribute('id'))
    });
    load_mesh(mesh_url,entity);
  },
  update_network_on_creating_entity:function(task_id, entity_id, mesh_url){
    let data = {
                'instruction':'create',
                'task_id':task_id,
                'entity_id':entity_id,
                'mesh_url':mesh_url
               };
    this.el.systems['network-controller'].send_instruction('all',data);
  },
  toggle_entity:function(entity_id){
    let entity = document.querySelector('#'+entity_id);
    entity.object3D.visible = !entity.object3D.visible;
    this.recalculate_position();
  },
  update_network_on_toggle_entity:function(entity_id){
    this.el.systems['network-controller'].send_instruction({'instruction':'toggle','entity_id':entity_id});
  },
  remove_entity:function(entity_id){
    let entity = document.querySelector('#'+entity_id);
    entity.remove();
  },
  update_network_on_removing_entity:function(entity_id){
    this.el.systems['network-controller'].send_instruction({'instruction':'remove','entity_id':entity_id});
  },
  update_all:function(){
    let something_visible = false;
    for(let i = 0;i<this.meshes_info_list.length;i++){
      let entity = this.meshes_info_list[i];
      this.meshes_info_list[i]['rotation'] = this.get_rotation(entity['task_id']);
      this.meshes_info_list[i]['scale'] = this.get_scale(entity['task_id']);
      this.meshes_info_list[i]['visible'] = this.get_visibility(entity['entity_id']);
      if(this.get_visibility(entity['entity_id'])){
        something_visible = true;
      }
    }
    this.is_something_visible = something_visible;
 
  },
  calculate_avg_mid:function(){
    let DEFAULT_OFFSET = 0.3;
    if(this.mid_pts_dict){
      let dict = this.mid_pts_dict;
      let sum = 0.0;
      let length = 0;
      Object.keys(dict).forEach(function(entity_id){
        if(document.querySelector('a-scene').systems['master-controller'].get_visibility(entity_id)){
          sum += dict[entity_id];
          length += 1;
        }
      });
      if(length===0){
        return DEFAULT_OFFSET;
      }
      return sum/length;
    }else{
      return DEFAULT_OFFSET;
    }
  },
  recalculate_position:function(){
    let xOffset = this.calculate_avg_mid();
    for(let i=0;i<this.meshes_info_list.length;i++){
      let el = document.querySelector('#'+this.meshes_info_list[i]['entity_id']);
      if(this.get_visibility(el.getAttribute('id'))){
        let old_pos_x = this.mid_pts_dict[el.getAttribute('id')];
        //console.log("original pos: " + old_pos_x);
        el.object3D.position.set(old_pos_x - xOffset , el.object3D.position.y , el.object3D.position.z);
        let new_pos = el.object3D.position;
        //console.log("new pos: " + new_pos.x);
      }
    }
  },
  tick:function(){
    this.update_all();
  }
})


                       