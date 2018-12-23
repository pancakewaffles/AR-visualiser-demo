// Deals with requests. Communicates with master-controller. When network controllers receives data, sends it to master-controller.
AFRAME.registerSystem('network-controller',{
  init:function(){
    this.startup_synced = false;
    this.connected_clients_list = [];
    NAF.connection.subscribeToDataChannel('instruction_channel',(senderId,dataType,data,targetId) => {
      
      switch(data['instruction']){
        case 'rotate':
          this.el.systems['master-controller'].set_rotation(data['entity_id'],data['rotationObject']);
          console.log("received instruction "+data['instruction'] +"to act on "+data['entity_id'] + "Details: " + data['rotationObject']);
          break;
        case 'scale':
          this.el.systems['master-controller'].set_scale(data['entity_id'],data['scale']);
          console.log("received instruction "+data['instruction'] +"to act on "+data['entity_id'] + "Details: " + data['scale']);
          break;
        case 'create':
          this.el.systems['master-controller'].create_entity(data['task_id'],data['entity_id'],data['mesh_url']);
          console.log("received instruction "+data['instruction'] +"to act on "+data['entity_id'] + "Details: " + data['task_id'] + " " + data['mesh_url']);
          break;
        case 'remove':
          this.el.systems['master-controller'].remove_entity(data['entity_id']);
          console.log("received instruction "+data['instruction'] +"to act on "+data['entity_id']);
          break;
        case 'toggle':
          this.el.systems['master-controller'].toggle_entity(data['entity_id']);
          console.log("received instruction "+data['instruction'] +"to act on "+data['entity_id']);
          break;
        default:
          break;
                                };
                                

        
    });
    
    NAF.connection.subscribeToDataChannel('info_lists_channel',(senderId,dataType,data,targetId) => {
      for(let i = 0;i<data[0].length;i++){ //meshes_info_list
        let entity_info = data[0][i];
        let entity_id = entity_info['entity_id'];
        let task_id = entity_info['task_id'];
        let mesh_url = entity_info['mesh_url'];
        let rotation = entity_info['rotation'];
        let scale = entity_info['scale'];
        let visible = entity_info['visible'];
        this.el.systems['master-controller'].create_entity(task_id,entity_id,mesh_url);
        this.el.systems['master-controller'].set_rotation(task_id,rotation);
        this.el.systems['master-controller'].set_scale(task_id,scale);
        this.el.systems['master-controller'].set_visibility(entity_id,visible);
      }
      //inventory_list
      this.el.systems['master-controller'].set_inventory_list(data[1]);
      console.log('received.');
    });
    
    NAF.connection.subscribeToDataChannel('requests',(senderId,dataType,data,targetId) => {
    });
    
    document.body.addEventListener('clientConnected', function (evt) {
        document.querySelector('a-scene').systems['network-controller'].onclientConnected(evt);
    });
    
    document.body.addEventListener('clientDisconnected', function (evt) {
        document.querySelector('a-scene').systems['network-controller'].onclientDisconnected(evt);
    });
    },
    send_instruction:function(targetId,data){
      if(targetId === 'all'){
        NAF.connection.broadcastDataGuaranteed('instruction_channel',data);
      }else{
        NAF.connection.sendDataGuaranteed(targetId,'instruction_channel',data);
      }
    },
    send_info_lists:function(targetId,data){
      if(targetId === 'all'){
        NAF.connection.broadcastDataGuaranteed('info_lists_channel',data);
      }else{
        NAF.connection.sendData(targetId,'info_lists_channel',data);
      }
      console.log('sent.');
    },
    onclientConnected:function(evt){
      console.log('clientConnected event. clientId =', evt.detail.clientId);
      create_notification('Client '+evt.detail.clientId+' has connected to you.');
      this.connected_clients_list.push(evt.detail.clientId);
      if(!has_inv_list_in_url() &&
         this.startup_synced === false){
          console.log('just joined, getting info from '+evt.detail.clientId);
          this.startup_synced = true;
      }else{
          console.log('sending stuff to ' + evt.detail.clientId);
          let meshes_info_list = this.el.systems['master-controller'].get_meshes_info_list();
          let inventory_list = this.el.systems['master-controller'].get_inventory_list();
          // only send if you have something in your inventory list.
          if(inventory_list.length > 0){
            this.send_info_lists(evt.detail.clientId,[meshes_info_list , inventory_list]);
          }
          
      }
    },
    onclientDisconnected:function(evt){
      console.log('clientDisconnected event. clientId =', evt.detail.clientId);
      create_notification('Client '+evt.detail.clientId+' has disconnected from you.');
      this.connected_clients_list = this.connected_clients_list.filter(e=> e!==evt.detail.clientId);

    },
  get_connected_clients_list:function(){
    return this.connected_clients_list;
  },
  is_connected:function(){
    return NAF.connection.isConnected();
  },
  resync:function(){
    create_notification('Resyncing to network.');
  }
  })
