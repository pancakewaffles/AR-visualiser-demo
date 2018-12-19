// A collection of functions that will be used in various manners.

// loads mesh
function load_mesh(url,el){
  let loader = new THREE.PRWMLoader();
  loader.load(url, function(bufferGeometry){
    let midpt_typed_array = bufferGeometry.getAttribute('midpt').array;
    let midpt = [midpt_typed_array[0],midpt_typed_array[1],midpt_typed_array[2]];
    document.querySelector('a-scene').systems['master-controller']
           .add_mid_pts_dict( el.getAttribute('id'),midpt[0] );
    let material = new THREE.MeshBasicMaterial( {
          side: THREE.DoubleSide,
          vertexColors: THREE.VertexColors
        });
    let mesh	= new THREE.Mesh( bufferGeometry, material );
    el.setObject3D('mesh',mesh);
    el.object3D.position.set(midpt[0],0,0);
    // TODO: Figure out a way to reposition meshes side by side.
    document.querySelector('a-scene').systems['master-controller']
           .recalculate_position();
    load_color_bar();
    
  },
    //onProgress
    function(xhr){
      console.log((xhr.loaded/xhr.total*100) + '% loaded');
  },
    //onError
    function(err){
      console.log("An error happened.");
  }
             )
};

// Loads inventory_list from URL params
function load_inventory_list(){
  var match;
  var pl = /\+/g;  // Regex for replacing addition symbol with a space
  var search = /([^&=]+)=?([^&]*)/g;
  var decode = function (s) { return decodeURIComponent(s.replace(pl, ' ')); };
  var query = window.location.search.substring(1);
  var urlParams = {};

  match = search.exec(query);
  while (match) {
    urlParams[decode(match[1])] = decode(match[2]);
    match = search.exec(query);
  }
  var inv_list = document.querySelector('a-scene').systems['master-controller'].get_inventory_list();
  if(!urlParams.inventory_list && (!Array.isArray(inv_list) || !inv_list.length) ){
    console.log('inventory list not provided in URL.');
    alert("No data loaded, try loading the AR Visualiser through dbslice.");
    //document.querySelector('a-scene').systems['master-controller'].set_inventory_list(sample_data);
    return;
  }
  let inv = JSON.parse(decodeURI(window.atob(urlParams.inventory_list)));
  console.log(inv);
  document.querySelector('a-scene').systems['master-controller'].set_inventory_list(inv);
}

// Creates Meshes Menu
function create_meshes_menu(){
  // Dropdown Trigger
  let dropdownContainer = document.createElement('div');
  let dropdownTrigger = document.createElement('a');
  let dropdownIcon = document.createElement('i');
  dropdownIcon.className = 'large material-icons blue-text text-accent-4';
  dropdownIcon.innerHTML = 'apps';
  dropdownTrigger.className = 'waves-dark waves-effect dropdown-trigger btn-floating white';
  dropdownTrigger.setAttribute('data-target','dropdown_meshes_selection');
  
  // Dropdown Structure
  let ul = document.createElement('ul');
  ul.className = 'dropdown-content';
  ul.setAttribute('id','dropdown_meshes_selection');
  dropdownTrigger.appendChild(dropdownIcon);
  dropdownContainer.appendChild(dropdownTrigger);
  dropdownContainer.appendChild(ul);
  dropdownContainer.id = 'meshes_menu_container';
  
  document.body.appendChild(dropdownContainer);
  
  M.Dropdown.init(dropdownTrigger,{coverTrigger:false,container:document.querySelector('#meshes_menu_container'),constrainWidth:false, closeOnClick:false});
  
};

// Updates Meshes Menu
function populate_meshes_menu(menuData){
  let ul = document.querySelector('#dropdown_meshes_selection');
  ul.innerHTML = '';
  Object.keys(menuData.meshes).forEach(function(mesh_id){ 
     let lineElement = document.createElement('li');
     let lineElement_a = document.createElement('a');
     lineElement_a.innerHTML = mesh_id;
     lineElement_a.setAttribute('data-name',mesh_id);
     lineElement.appendChild(lineElement_a);
     ul.appendChild(lineElement);
     lineElement.addEventListener('click', function(ev){
       if(document.querySelector('#'+mesh_id) != null){
        document.querySelector('a-scene').systems['master-controller']
           .toggle_entity(mesh_id);
        document.querySelector('a-scene').systems['master-controller']
           .update_network_on_toggle_entity(mesh_id);
       }
       else{
         document.querySelector('a-scene').systems['master-controller']
           .create_entity(menuData.task_id,
                          mesh_id,
                          menuData.meshes[mesh_id]);

         document.querySelector('a-scene').systems['master-controller']
           .update_network_on_creating_entity(menuData.task_id,
                          mesh_id,
                          menuData.meshes[mesh_id]);
         }
       })
    let divider = document.createElement('li');
    divider.className = "divider";
    ul.appendChild(divider);
     });
  M.Dropdown.getInstance(document.querySelector('.dropdown-trigger')).recalculateDimensions();
}

// Deletes Meshes Menu
function delete_meshes_menu(){
  document.querySelector('#meshes_menu_container').remove();
}
// Creates Settings Button that includes share-button and general information (e.g. what's your client id, who is connected to you, room name.)
function create_settings(){
    if(document.querySelector('#settings-button')){
    document.querySelector('#settings-button').remove();
  }
  // Floating Action Button
  let buttonContainer = document.createElement('div');
  let buttonElement = document.createElement('a');
  let buttonIcon = document.createElement('i');
  buttonIcon.className = 'large material-icons blue-text text-accent-4';
  buttonIcon.innerHTML = 'info';
  buttonElement.className = 'waves-dark waves-effect btn-floating white modal-trigger';
  buttonElement.setAttribute('data-target','modal_info');
  buttonContainer.id = 'settings-button';
  buttonElement.appendChild(buttonIcon);
  buttonContainer.appendChild(buttonElement);
  document.body.appendChild(buttonContainer);
  
  // Modal Structure for li_info
  let modalContainer = document.createElement('div');
  modalContainer.className = 'modal';
  modalContainer.setAttribute('id','modal_info');
  
  // Modal Content
  let modalContent = document.createElement('div');
  modalContent.className = 'modal-content';
  
  let content = document.createElement('div');
  
  let content_section_connection = document.createElement('div');
  content_section_connection.className = 'section content_connection';
  content.appendChild(content_section_connection);
  
  let divider = document.createElement('div');
  divider.className = 'divider';
  content.appendChild(divider);
  
  let content_section_naf = document.createElement('div');
  content_section_naf.className = 'section content_naf';
  content.appendChild(content_section_naf);
  
  divider = document.createElement('div');
  divider.className = 'divider';
  content.appendChild(divider);
  
  let content_section_scene_scaler = document.createElement('div');
  content_section_scene_scaler.className = 'section row content_scene_scaler';
  content_section_scene_scaler.innerHTML = `<h5>Scene scaler</h5>
                                            <p>Change your scene size to fit your device screen.</p>
                                            `;
  let scene_scaler_small_button_div = document.createElement('div');
  scene_scaler_small_button_div.className = 'col s4 center-align';
  let scene_scaler_small_button_a = document.createElement('a');
  scene_scaler_small_button_a.className = 'waves-effect waves-light btn';
  scene_scaler_small_button_a.innerHTML = 'Small';
  scene_scaler_small_button_a.addEventListener('click',function(evt){
    document.querySelector('a-scene').systems['master-controller'].update_scale('scene-scaler',{x:0.3,y:0.3,z:0.3});
  });
  scene_scaler_small_button_div.appendChild(scene_scaler_small_button_a);
  content_section_scene_scaler.appendChild(scene_scaler_small_button_div);
  
  let scene_scaler_med_button_div = document.createElement('div');
  scene_scaler_med_button_div.className = 'col s4 center-align';
  let scene_scaler_med_button_a = document.createElement('a');
  scene_scaler_med_button_a.className = 'waves-effect waves-light btn';
  scene_scaler_med_button_a.innerHTML = 'Medium';
  scene_scaler_med_button_a.addEventListener('click',function(evt){
    document.querySelector('a-scene').systems['master-controller'].update_scale('scene-scaler',{x:0.6,y:0.6,z:0.6});
  });
  scene_scaler_med_button_div.appendChild(scene_scaler_med_button_a);
  content_section_scene_scaler.appendChild(scene_scaler_med_button_div);
  
  let scene_scaler_large_button_div = document.createElement('div');
  scene_scaler_large_button_div.className = 'col s4 center-align';
  let scene_scaler_large_button_a = document.createElement('a');
  scene_scaler_large_button_a.className = 'waves-effect waves-light btn';
  scene_scaler_large_button_a.innerHTML = 'Large';
  scene_scaler_large_button_a.addEventListener('click',function(evt){
    document.querySelector('a-scene').systems['master-controller'].update_scale('scene-scaler',{x:1.0,y:1.0,z:1.0});
  });
  scene_scaler_large_button_div.appendChild(scene_scaler_large_button_a);
  content_section_scene_scaler.appendChild(scene_scaler_large_button_div);
  
  content.appendChild(content_section_scene_scaler);
  
  divider = document.createElement('div');
  divider.className = 'divider';
  content.appendChild(divider);
  
  
  // Modal Footer
  let modalFooter = document.createElement('div');
  modalFooter.className = 'modal-footer';
  let copy_info = document.createElement('p');
  copy_info.innerHTML = "Copy the link below to share it with others.";
  copy_info.setAttribute('align','center');
  let modalFooter_copyButton_container = document.createElement('div');
  modalFooter_copyButton_container.className = 'center-align';
  let modalFooter_copyButton = document.createElement('a');
  modalFooter_copyButton.className = 'waves-effect btn';
  modalFooter_copyButton.innerHTML = 'Copy';
  modalFooter_copyButton.addEventListener('click',function(evt){
    copyLink();
    modalFooter_copyButton.innerHTML = 'Copied!';
  });
  modalFooter_copyButton_container.appendChild(modalFooter_copyButton);
  

  modalContent.appendChild(content);
  modalFooter.appendChild(copy_info);
  modalFooter.appendChild(modalFooter_copyButton_container);
  modalContainer.appendChild(modalContent);
  modalContainer.appendChild(modalFooter);
  document.body.appendChild(modalContainer);
  
  M.Modal.init(modalContainer, {});
}

function onARConnect () {
    console.log('AR Client Connected');
    console.log("My CONNECTION IS "+ NAF.connection.isConnected());
    
};

function copyLink(){
  let copiedurl = window.location.href.split("&inventory_list=")[0];
  clipboard.writeText(copiedurl);
  M.toast({html: 'Copied link '+copiedurl+'. Invite others using it.', displayLength:1500});
}

function load_new_task(el){
    menuData = {
      meshes: {},
      task_id: ''
    };
    let task_id = "task1";//el.getAttribute('data-for');
    let meshes = {};
    let controller = document.querySelector('a-scene').systems['master-controller'];
    let inventory_list = controller.get_inventory_list();
    for(let i=0;i<inventory_list.length;i++){
      if(inventory_list[i]['task_id'] === task_id){
        meshes[inventory_list[i]['entity_id']] = inventory_list[i]['mesh_url'];
      }
    }
    menuData.meshes = meshes;
    menuData.task_id = task_id;

    populate_meshes_menu(menuData);

};

function load_default_mesh(){ // DO NOT USE YET, has issues with synchronisation
  var match;
  var pl = /\+/g;  // Regex for replacing addition symbol with a space
  var search = /([^&=]+)=?([^&]*)/g;
  var decode = function (s) { return decodeURIComponent(s.replace(pl, ' ')); };
  var query = window.location.search.substring(1);
  var urlParams = {};

  match = search.exec(query);
  while (match) {
    urlParams[decode(match[1])] = decode(match[2]);
    match = search.exec(query);
  }
  if(urlParams.inventory_list){
    let controller = document.querySelector('a-scene').systems['master-controller'];
    let network_controller = document.querySelector('a-scene').systems['network-controller'];
    let inventory_list = controller.get_inventory_list();
    let connected_clients_list = network_controller.get_connected_clients_list();
    document.querySelector('[data-name='+inventory_list[0]['entity_id']+']').click();
  }
  
}

function create_notification(msg){
  M.toast({html: msg, displayLength:1500});    
};

// TODO: load color bar for each task.
function load_color_bar(){
  let VMIN = -0.5 , VMAX = 0.5;
  if(!document.querySelector('a-entity#colorbar').hasChildNodes()){
    create_color_bar(VMIN,VMAX);
  }
}

function create_color_bar(vMin,vMax){
    let fake_data = Array(20).fill(0)
    let colorscale = d3.scaleSequential(d3.interpolateSpectral);
	        colorscale.domain([0,fake_data.length]);
    let scene = d3.select("a-entity#colorbar");      
    let cubes = scene.selectAll("a-box.bar").data(fake_data)
    .enter()
    .append("a-box")
    .classed("bar",true)
    .attr("position", function(d,i){
      let radius = 10;
      let theta =  ( (2*Math.PI)/fake_data.length )*i;
      let x = i/5;
      let y = 0;
      let z = 0;
      return x + " " + y + " " + z;
    })
    .attr("height",function(d,i){
      return 1;
    })
    .attr("scale","0.2 0.2 0.2")
    .attr("rotation",function(d,i){
      let x = -90;
      let y = 0;
      let z = 0;
      return x + " " + y + " " + z;
    })
    .attr("material", function(d,i){
      return "color:"+colorscale(i);
    })
    .attr("depth", 0.1);

    let ticks = scene.selectAll("a-text.ticks").data(fake_data)
    .enter()
    .append("a-text")
    .classed("ticks",true)
    .attr("position", function(d,i){
      let radius = 10;
      let theta =  ( (2*Math.PI)/fake_data.length )*i;
      let x = i/5;
      let y = 0;
      let z = 0.3;
      return x + " " + y + " " + z;
    })
    .attr("rotation",function(d,i){
      let x = -90;
      let y = 0;
      let z = 0;
      return x + " " + y + " " + z;
    })
    .attr("height",4)
    .attr("width",4)
    .attr("color","white")
    .attr("align","center")
    .attr("value",function(d,i){
      let unit =  ( vMax - vMin ) / (fake_data.length-1);
      let v = vMin + i* unit;
      if(i===0 || i===fake_data.length-1){
        return v;
      }else{
        return "";
      }
    })
}