// This really just sets everything up when you first load the page.
window.onload = function(){
  create_settings();
  create_meshes_menu();
  load_inventory_list();
  load_new_task(null);
}