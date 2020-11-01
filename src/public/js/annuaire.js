$(document).ready(function () {
    /* ------------------------------------------------------------------------------------------
                                    Au chargement de la page
    ------------------------------------------------------------------------------------------*/
    window.onload = function () {
        $.get('/getConfig', function (config, status) {
            var c = "url('/static/img/Fonds_Ecran/" + config.BackgroundImage + "')"
            document.body.style.backgroundImage = c;
            document. body.style.color = "#" + config.PoliceCouleur;

            var modalBody = document.getElementsByClassName("noir");
            for (var i=0; i<modalBody.length; i++) {
                document.getElementsByClassName("noir")[i].style.backgroundImage = null;
                document.getElementsByClassName("noir")[i].style.color = "#000000";
            }
        });
    }

})