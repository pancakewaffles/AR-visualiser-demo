AFRAME.registerComponent('multiroom-mode',{
  init: function(){
    let el = this.el;
    let params = this.getUrlParams();
    if(params.room === "" || !params.room){
      params.room = "ath101";
    }
    let networked = "app:myApp;room:"+params.room+";onConnect: onARConnect;adapter:wseasyrtc;debug:true"
    console.log("I am in room: "+params.room);
    el.setAttribute('networked-scene',networked);
  },
  getUrlParams: function () {
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
  return urlParams;
}
})
