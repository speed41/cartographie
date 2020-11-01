$(document).ready(function () {
    var socket = io();

    window.onload = function () {
        socket.emit('cartographie', '{"ping":"' + 'pc' + '"}');
        setTimeout(ferme, 500)    
    };

    function ferme(){
        document.close();
    }

});