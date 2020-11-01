$(document).ready(function () {
    var socket = io();
    $('form').submit(function(e){
      e.preventDefault(); // prevents page reloading
      socket.emit('cartographie', $('#m').val());
      $('#m').val('');
      return false;
    });
 
    socket.on('cartographie', function (msg) {
        var objMsg = JSON.parse(msg);
        var ou;
        try {
            ou = document.getElementById(objMsg.client);
            ou.title = objMsg.client;
        } catch {
            var papa = document.createElement("div");
            papa.style.height = "200px";
            papa.innerText = objMsg.client;
            papa.style.textAlign = "center";
            papa.style.color = "#0000FF";
            papa.style.fontSize = "14pt";
            papa.style.border = "1px solid #000000";
            papa.style.backgroundColor = "#ffffa5"
                ou = document.createElement("div");
                ou.id = objMsg.client;
                ou.style.backgroundColor = "#a0ffae"
                ou.style.overflow = "auto";
                ou.className = "client";
                ou.style.height = "90%";
                ou.style.width = "100%";
                ou.style.color = "#000000";
                ou.style.fontSize = "10pt";
                papa.appendChild(ou);
            document.getElementById("row").appendChild(papa);

        }
        var label = document.createElement("div");
        label.style.width = "100%";
        label.style.textAlign = "left"

        switch (objMsg.action) {
            case "Charge_page" : label.innerText = heureNow() + "\tcharge la page : " + objMsg.message;
                                 label.style.color = "#000000"
                        break;
            case "Masque" : label.innerText = heureNow() + "\tMasque : " + objMsg.message;
                            label.style.color = "#FF0000"
                        break;
            case "Administration" : label.innerText = heureNow() + "\tADMIN : " + objMsg.message;
                                    label.style.color = "#FF0000";
                        break;
            case "Ouverture" : while (ou.firstChild) { ou.removeChild(ou.firstChild); }
                               label.innerText = dateNow() + "\n" + heureNow() + "\t" + objMsg.message + " Démarre";
                               label.style.color = "#FF0000";
                        break;
            default : label.innerText = heureNow() + "\t" + objMsg.action + " : " + objMsg.message;
                      label.style.color = "#00F000"
                        break;
        }        

        ou.appendChild(label);
    });

    window.onload = function () {
        $('#messages').append($('<li>').text("Départ de l'enregistrement du débuggage le : \t" + dateNow() + "\tà\t" + heureNow()));
    };



  function dateNow() {
        var date = new Date;
        return zero(date.getDate(),2) + "/" + zero((date.getMonth()+1),2) + "/" + date.getFullYear()
    }

    function heureNow() {
        var date = new Date;
        return zero(date.getHours(),2) + ":" + zero(date.getMinutes(),2) + ":" + zero(date.getUTCSeconds(),2)
    }

    function zero(v, n){
        v= "00000" + v.toString();

        return v.substring(v.length- (n));
    }

});