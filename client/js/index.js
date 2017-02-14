$(document).ready(function(){
    var host = window.location.origin.replace(/^http/, 'ws');
    var ws = new WebSocket(host);
    ws.onmessage = function(e){
        document.querySelector('h1').innerHTML = e.data;
    };
});
