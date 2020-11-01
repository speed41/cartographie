/*
                            DOCUMENTATION
    promise :               https://www.youtube.com/watch?v=SSYt7C4sCbw
    Texte sous image :      https://openclassrooms.com/forum/sujet/mettre-un-texte-sous-une-image-13041
    Lisre fichier execel :  https://www.npmjs.com/package/read-excel-file
	Cookies :				https://lookmandesign.net/article-206-javascript-creer-lire-et-supprimer-un-cookie.html
	
*/

/* 
   +==========================================================+
   |      L  E S     I N S T A L L E S    A   F A I R E       |
   +==========================================================+
   | - npm install formidable                                 |
   | - npm install serialize-javascript                       |
   | - npm install ping                                       |
   + =========================================================+
*/
$(document).ready(function () {
var socket = io();
var timer;
var tempPasse = 0;
var enChargement = false;
var enAdministration = false;
var pageEnCours = "defaut";
var increment = 1;
var config;
var nouveau;
var MVT = false;
var left0 = -1;
var top0 = -1;
var left1 = -1;
var top1 = -1;
var mvtX = -1;
var mvtY = -1;
var enMVT = false;
var enRedim =false;
var width0 = -1;
var height0 = -1;
var objetsEnCours;
var idEnCours = -1;
var formatObjets;
var chrono = 5000;
var ctrl = false;
var ordinateurs = { 
    "hostname": "toto",
    "variables": []
}
var infoAdmintration = "ADMINITRATION\n(Touche alt pour mouvements)"
var qui = -1;
/* ------------------------------------------------------------------------------------------
                                    Chargement de la page
    ------------------------------------------------------------------------------------------*/
window.onload = function () {
    var allcookies = document.cookie;
    var aC = allcookies.split(";");
    for (var i in aC) {
        if (aC[i].indexOf("nb_serie") > -1){
            qui = aC[i].split("=")[1];
        }
    }
    if (qui == -1) {
        qui = Math.floor(Math.random() * Math.floor(1011968));
        var cookie = "nb_serie=" + qui + "; expires=Fri, 01 Jan 2100 00:00:00 GMT; path=/";
        document.cookie = cookie;
    }

    document.getElementById("maintenance").title = "Active / désactive la maintenance (" + qui + ")";
     envoyerInfoSocketIO("Ouverture", qui);
    chargeLaConfig();
    console.log("Page affichée :\t" + window.location.pathname)
    var f = document.getElementById("fond");
    f.onmousedown = function() {mouseDown(event); }
    f.onmouseup = function() {mouseUp(event); }
    f.onmousemove = function() {mouseMove(event); }
    var lF = document.getElementById("fond");
    lF.onmouseup = function() {mouseUp(event); }
    lF.onmousemove = function() {mouseMove(event); }
    $.get('/getListeObjets', function (objets, status) {
        formatObjets = objets;
        chargeLaConfig();
        if (enAdministration){
            afficheLogo(false)
            document.getElementById("admin").innerText = infoAdmintration = infoAdmintration;
        }   else {
            afficheLogo(true)
            document.getElementById("admin").innerText = "";
            fonctionTimer();
        }
    });
    maint(false);
    timerTempo = setTimeout(etatTempo, 500);
}

function chargeLaConfig(){
    $.get('/getConfig', function (configuration, status) {
        config = configuration;
        afficheLogo(true)
        var c = "url('/static/img/Fonds_Ecran/" + config.BackgroundImage + "')"
        document.body.style.backgroundImage = c;
        document.getElementById("entete").style.backgroundColor = "#" + config.EnTete.Couleur;
        document.getElementById("entete").style.color = "#" + config.EnTete.PoliceCouleur;
        document.getElementById("entete").style.fontSize = config.EnTete.PoliceTaille + "pt";
        document.getElementById("admin").style.fontSize = "12pt";
        document.getElementById("montre").style.color = "#ff0000"//document.getElementById("entete").style.color
        //document.getElementById("montre").style.backgroundColor = document.getElementById("entete").style.backgroundColor;
        chrono=config.Timer * 1000;
    });
}

function etatTempo() {
    if (increment == 1) {
        document.getElementById("montre").max = chrono;
        document.getElementById("montre").min = 0;
        tempPasse = tempPasse + 500;        
        document.getElementById("montre").value = tempPasse;
    }
    //setTimeout(etatTempo, 500)
}

function maint(voir) {
    var list = document.getElementsByClassName("maint");
    for(var i = list.length - 1; 0 <= i; i--)
    if(list[i] && list[i].parentElement){
        if (voir) {
            list[i].style.visibility = 'visible';
        } else {
            list[i].style.visibility = 'hidden';
        }
    }
}
function chargementPage() { 
    chargeLaConfig();

    $.get('/getListeObjets', function (objets, status) {
        formatObjets = objets;        
    });
}

window.addEventListener("keydown", function (e) {
    if (enAdministration) {
        //alert(e.key)
        if (e.key == "Alt"){
            ctrl = true;
        }
    }
});
window.addEventListener("keyup", function (e) {
    if (enAdministration) {
        if (e.key == "Alt"){
            ctrl = false;
        }
    }
});
/* ------------------------------------------------------------------------------------------
                                    On click sur la souris
    ------------------------------------------------------------------------------------------*/
function mouseDown(event) {;
    if (enAdministration & !enMVT & !enRedim) {
        MVT = true;
        left0 = event.clientX - document.getElementById("fond").offsetLeft;
        top0 = event.clientY - document.getElementById("fond").offsetTop;
        if (ctrl) {
            nouveau = document.createElement("div");
            nouveau.style.backgroundColor = "rgb(255,0,0)";
            nouveau.style.left=left0+"px";
            nouveau.style.top=top0+document.getElementById("fond").offsetTop+"px";
            nouveau.className = "poubelle";
            nouveau.style.position="absolute";
        //  nouveau.style.overflow="scroll";
            document.getElementById("leFond").appendChild(nouveau);
        }
    }
};
/* ------------------------------------------------------------------------------------------
                                    On lache la souris
    ------------------------------------------------------------------------------------------*/
function mouseUp(event) {
    if (enAdministration & ctrl) {
        if (!enMVT & !enRedim) {
            left1 = event.clientX - document.getElementById("fond").offsetLeft;
            top1 = event.clientY - document.getElementById("fond").offsetTop;
            MVT = false;        
            nouveau.remove();
            if (left1 - left0 < 10 && top1 - top0 < 10){
                document.getElementById("PCTitre").innerText = "Nouvel objet (PC)";
                document.getElementById("PCNom").value = "";
                document.getElementById("supprimerPC").style.visibility = "hidden";
                console.log("Création PC");
                miseAJourListeFormatsObjets();
                var t = -1;
                $.get('/getLectureFichier?fichier=secteurs', function (lesSecteurs, status) {                
                        var l = document.getElementById("PCMenuListeSecteurs");
                        l.length=0;
                        for (var n in lesSecteurs.Secteurs){
                            l.length = l.length + 1;
                            l.options[l.length-1].text = lesSecteurs.Secteurs[n].Nom;
                            if (idEnCours > -1){
                                if (lesSecteurs.Secteurs[n].Nom == objetsEnCours[idEnCours].Secteur){
                                    t = l.length -1;
                                }
                            }
                        }
                    l.selectedIndex = t;
                    $('#nouveauPC').modal('show');
                });       
            } else {
                nouveauMoyen();       
            }
        }
        if (enRedim){
            console.log("Fin REDIM du moyen");
            EnregistreMoyen();
        }
    }    
    idEnCours = -1;
};

function nouveauMoyen(){
    document.getElementById("machineTitre").innerText = "Nouveau moyen";
    document.getElementById("machineNom").value = "";
    document.getElementById("moyenPasTitre").checked = false;
    document.getElementById("moyenAfficheInfos").checked = false;
    
    document.getElementById("supprimerMoyen").style.display = "none";
    document.getElementById("machineCouleur").value = "#" + config.Couleur;
    renseigneNouvelleMachine();
    $('#nouvelleMachine').modal('show');
}
/* ------------------------------------------------------------------------------------------
                                    Mouvement de la souris
    ------------------------------------------------------------------------------------------*/
function mouseMove(event) {;
    if (enAdministration & ctrl) {
        if (MVT & !enMVT & !enRedim){
            var x = event.clientX - document.getElementById("fond").offsetLeft - 10;
            var y = event.clientY - document.getElementById("fond").offsetTop - 10;
            width0 = x - left0;
            height0 = y - top0;
            nouveau.style.width= width0 + "px";
            nouveau.style.height= height0 + "px";
        }                
        if (!MVT & enRedim & idEnCours > -1){
            document.getElementById(idEnCours).style.width = event.clientX - document.getElementById(idEnCours).offsetLeft;
            document.getElementById(idEnCours).style.height = event.clientY - document.getElementById(idEnCours).offsetTop;
        }
    }
};
/* ##############################################################################################################################
################################################################################################################################# 
                                               C O N N E X I O N
#################################################################################################################################
##############################################################################################################################*/
    /* ------------------------------------------------------------------------------------------
                                    On clique sur Maintenance
    ------------------------------------------------------------------------------------------*/  
    $('#maintenance').click(function () {
        if (!enAdministration){
            document.getElementById("identifiant").value = "";
            document.getElementById("motDePasse").value = "";
       //     $('#identificationModal').modal('show');
       //     return;
            timerOnOff(false);
            console.log("On passe en maintenance");
            envoyerInfoSocketIO("Administration", "ON hors login");
            document.getElementById("admin").innerText = infoAdmintration;
            afficheLogo(false)
            enAdministration = true;
            increment = 0;
            document.getElementById("pause").src = "static\\img\\play.png";
        } else {
            if (!enChargement) {
                timerOnOff(true);
                envoyerInfoSocketIO("Administration", "OFF");
                enAdministration = false;
                console.log("Arrêt de la maintenance");
                document.getElementById("admin").innerText = "";
                afficheLogo(true)
                document.getElementById("pause").src = "static\\img\\pause.png";
            }
        }
        maint(enAdministration);
    });
    /* ------------------------------------------------------------------------------------------
                                OK sur la boite de dialogue login
    ------------------------------------------------------------------------------------------*/  
    $('#ok').click(function () {
        var identifiant = $('#identifiant').val();
        var motDePasse = $('#motDePasse').val();
        console.log("Demande login");
        $('#identificationModal').modal('hide');
        $.get('/getIdentifie?login=' + identifiant + '&motDePasse=' + motDePasse, function (data, status) { 
              if (!data.reponse) {
                  alert("Identifiant inconnu ou mot de passe faut");
                  $('#identificationModal').modal('show'); 
              }
              else {
                  if (data.admin ||  data.pages.indexOf(document.getElementById("titre").innerText + "|") > -1) {
                      if (data.etat == "creation"){
                          document.getElementById("login").innerText = identifiant;
                          envoyerInfoSocketIO("IdentifiantMDPERREUR", identifiant);
                          $('#nouveauMotDePasseModal').modal('show'); 
                      } else {
                        document.getElementById("admin").innerText = infoAdmintration;
                        afficheLogo(false)
                        enAdministration = true;
                        increment = 0;
                        timerOnOff(false);
                        document.getElementById("pause").src = "static\\img\\play.png";
                        envoyerInfoSocketIO("Administration", "ON");
                        envoyerInfoSocketIO("Identifiant", identifiant);
                        maint(enAdministration);
                      }        
                  } else {                        
                          alert("Ce compte n'a pas les droits");
                          envoyerInfoSocketIO("IdentifiantERREUR", identifiant);
                          $('#identificationModal').modal('show');
                  }
              }
        })
    });
    $('#annuler').click(function () {
        envoyerInfoSocketIO("Administration", "Annulé");
        $('#identificationModal').modal('hide');
    });

/* ##############################################################################################################################
################################################################################################################################# 
                                               G E S T I O N   A F F I C H A G E
#################################################################################################################################
##############################################################################################################################*/

function afficheLogo(oui){
    if (oui & !enAdministration) {
        try {
            if (config.Logo != ""){
                var l = 'url("/static/Informations/images/logos/' + config.Logo + '")';
                document.getElementById("admin").style.backgroundImage = l;
            }
        } catch {}
    } else {
        document.getElementById("admin").style.backgroundImage = null;
    }
}
/* ------------------------------------------------------------------------------------------
                                            Page précédente
    ------------------------------------------------------------------------------------------*/
$('#recule').click(function () {
    increment = -1;
    console.log("On recule");
    enAdministration = false;
    envoyerInfoSocketIO("mvt", "recule");
    maint(enAdministration);
    fonctionTimer();
});
/* ------------------------------------------------------------------------------------------
                                            Même Page
    ------------------------------------------------------------------------------------------*/
    $('#recharge').click(function () {        
        increment = 0;
        console.log("rafraichissement page");
        envoyerInfoSocketIO("mvt", "refraiche");
        maint(enAdministration);
        fonctionTimer();
    });
/* ------------------------------------------------------------------------------------------
                                            Pause / Play
    ------------------------------------------------------------------------------------------*/  
    $('#pause').click(function () {
        if (increment != 0){
            console.log("pause");
            envoyerInfoSocketIO("mvt", "pause");
          //  timerOnOff(false);
            document.getElementById("admin").innerText = "En pause";
            document.getElementById("pause").src = "static\\img\\play.png";
            afficheLogo(false);
            increment = 0;            
        } else {
            increment = 1;
            console.log("fin de pause");
            envoyerInfoSocketIO("mvt", "pause finie");
            timerOnOff(true);
            document.getElementById("admin").innerText = "";
            document.getElementById("pause").src = "static\\img\\pause.png";
            afficheLogo(true);
            enAdministration = false;;
        }
        maint(enAdministration);
    });
/* ------------------------------------------------------------------------------------------
                                            Page suivante
    ------------------------------------------------------------------------------------------*/  
$('#avance').click(function () {
    increment = 1;
    console.log("On avance");
    enAdministration = false;
    envoyerInfoSocketIO("mvt", "avance");
    maint(enAdministration);
    fonctionTimer();
});
/* ------------------------------------------------------------------------------------------
                                        Action quand le temps est écoulé
    ------------------------------------------------------------------------------------------*/  
function fonctionTimer(){
    document.getElementById("recharge").style.visibility="hidden";
    timerOnOff(false);
    ordinateurs =   [
                    ];
    if (increment != 0){
        afficheLogo(true)
        document.getElementById("admin").innerText = "";
    }
    enChargement = true;
    var fond = document.getElementById("fond");
    console.log('Ferme la page : "' + pageEnCours + '"')
    
    $.get('/getlistePages', function (pages, status) {
        if (pages.length>1) {
            var i = -1;
            for (var n=0 ; n<pages.length; n++){
                if (pages[n]==pageEnCours){
                    i = n;
                }
            }
            i = i + increment;
            if (i >= pages.length) {
                i = 1;
            }
            if (i == 0) {
                i = pages.length -1;
            }
            if (i==1) {
                chargementPage();
            }


            var allCookies = document.cookie;
            while (allCookies.indexOf("|" + pages[i] + "|") > -1) {
                i = i + increment;
                if (i >= pages.length) {
                    i = 1;
                }
            }

            pageEnCours=pages[i];
            envoyerInfoSocketIO("Charge_page", pageEnCours);
            document.title = "CartoGraphie (" + pageEnCours + ")";
            document.getElementById("titre").innerText = pageEnCours;
            console.log('chargement de la page : "' + pageEnCours + '" (incrément : ' + increment + ', tempo : ' + chrono/1000 + 'sec)')
            $.get('/getinfoPage?page=' + pageEnCours, function (page, status) {
                fond.src = "static\\Informations\\images\\fondPages\\" + page.Image;
                taille("fond");
                $.get('/getObjetsPage?page=' + pageEnCours, function (objets, status) {
                    objetsEnCours = objets;
                    taille("fond");
                    
                    gereLesObjets(objets);

                    var ladate=new Date()
                    var date = (ladate.getHours()+":"+ladate.getMinutes()+":"+ladate.getSeconds())
                    if (increment!=0)
                    {
                        afficheLogo(true)
                        document.getElementById("admin").innerText = "";
                        document.getElementById("pause").src = "static\\img\\pause.png";
                        document.getElementById("montre").valuemax = '"' + chrono + '"';
                        tempPasse=0;
                        timerOnOff(true);
                    } else {
                        if (document.getElementById("pause").src.indexOf("pause.png")>-1)
                        {
                            afficheLogo(true)
                            document.getElementById("admin").innerText = "";
                            document.getElementById("pause").src = "static\\img\\pause.png";
                            timerOnOff(true);
                        }
                        if (document.getElementById("admin").innerText.toUpperCase().indexOf("PAUSE")) {
                            timerOnOff(true);
                            increment=0;
                        }
                    }
                    
                    placeLesIndicateurs().then();
                    if (config.ping) { lesPing(); }

                    enChargement = false;
                });
            });
        } else { alert("Aucune page à afficher"); }
        document.getElementById("recharge").style.visibility="visible";
    });
}
/* ------------------------------------------------------------------------------------------
                                    On clique sur un objet
    ------------------------------------------------------------------------------------------*/
function onAction(id) {

}
/* ------------------------------------------------------------------------------------------
                                        Timer on / off
    ------------------------------------------------------------------------------------------*/  
    function timerOnOff(onOff){
        timerOn = onOff;
        if (onOff){
            increment = 1;
            timer = setTimeout(fonctionTimer, chrono);
        } else {
            clearTimeout(timer);
        }
    }
/* ##############################################################################################################################
################################################################################################################################# 
                                              L E S   P E T I T S   O B J E T S
#################################################################################################################################
##############################################################################################################################*/
function imageExiste(im, obj){
    var image = new Image();
    image.onload = function() {
        obj.style.backgroundImage = 'url("' + im + '")';
    }
    image.onerror = function() {
        obj.style.backgroundImage = 'url("static/img/erreur404.png")';
        obj.style.backgroundColor = "#FF0000";
    }
    image.src = im;
}
/* ------------------------------------------------------------------------------------------
                                      Gére les objet supprime & affiche
    ------------------------------------------------------------------------------------------*/
function gereLesObjets(objets){
    var list = document.getElementsByClassName("poubelle");
    for(var i = list.length - 1; 0 <= i; i--)
        if(list[i] && list[i].parentElement)
            list[i].remove();

    for (var n in objets){  
        if (objets[n].type != "simple") {            
            var l = fond.offsetLeft;
            var t = fond.offsetTop;
            var obj = document.createElement('div');
            obj.id = n;            
            obj.name = n;

            obj.alt = formateTitre(config.Moyen.Nom, objets[n])
            obj.title = formateTitre(config.Moyen.Bulle, objets[n]);
            obj.className = "poubelle moyen";
            obj.style.position="absolute";
            obj.style.overflow = "auto";
            obj.style.backgroundColor = "#" + objets[n].couleur;
            obj.style.backgroundSize = "100% 100%";

            if (objets[n].image != "undefined") {
                try {
                    if (objets[n].image != null && objets[n].image != "") {
                        imageExiste("static/Informations/images/fondmoyens/" + objets[n].image, obj)
                    }
                } catch { obj.style.backgroundImage = 'url("static/img/erreur404.png")'; }
            } else { 
             //   obj.style.backgroundImage = 'url("static/img/erreur404.png")';
            }
            obj.ondblclick = function() {ondbclick(this); }
            obj.onmousedown = function() {onMouseObjDown(event, this); }
            obj.onmouseup = function() {onMouseObjUp(event, this); }
            obj.onmousemove = function() {onMouseObjMove(event, this); }

            obj.onclick = function() { onAction(this); }; //----------------------------------------------------

            var left = xEnPixel(objets[n].x0) - l;         // Math.trunc( w * parseFloat(objets[n].x0) / 100) - l;
            var top = yEnPixel(objets[n].y0) + t;          // Math.trunc(  h * parseFloat(objets[n].y0) / 100) + t;
            obj.style.left = left + "px";
            obj.style.top = top + "px";
            var width = xEnPixel(objets[n].x1) - left - l; //Math.trunc( (w * parseFloat(objets[n].x1) / 100) - left ) - l;
            var height = yEnPixel(objets[n].y1) - top + t  //Math.trunc(  (h * parseFloat(objets[n].y1) / 100)  - top ) + t;
            obj.style.width = width + "px";
            obj.style.height = height + "px";

            if (objets[n].afficheInfos == "true") {
                placeInfosMoyen(objets[n], obj)
            }

            var titre = document.createElement("div");
            titre.id = "titre " + obj.id;
            titre.innerText = obj.alt;
            titre.style.display = "block";
            if (objets[n].pasDeTitre == "true") { titre.style.display = "none"; }
            titre.style.textAlign = "center";         
            titre.style.position="absolute";
            titre.className = "poubelle titre";
            titre.style.left = left + 5 + "px";            
            top = top - 10; //(titre.style.offsetHeight / 2);
            titre.style.top = top + "px";
            titre.style.width = width - 10 + "px";
            titre.style.backgroundColor = "#" + config.Moyen.Couleur;
            titre.style.border = config.Moyen.Titre.Epaisseur + "px solid #" + config.Moyen.Titre.Couleur;
            titre.style.borderRadius = config.Moyen.Titre.Angle + "%";
            titre.style.color = "#" + config.Moyen.Titre.PoliceCouleur;
            titre.style.fontSize = config.Moyen.Titre.PoliceTaille + "pt";

            for (var m in objets[n].objets){
                placePC(objets[n].objets[m], obj, "combine", n + "_" + m);
            }   
            document.getElementById("leFond").appendChild(obj);
            document.getElementById("leFond").appendChild(titre);
            for (var m in objets[n].objets){
                placeTitrePC(objets[n].objets[m], obj, n + "_" + m, m);
            }
            /*
                      +---------------------------------------------+
                      |                                             |
                      |                                             |
                      |                                             |
                      |                                             |
                      |                                             |
                      |                                             |
                      +---------------------------------------------+
            */
           
           placeInfosSecteur(objets[n], obj);           
        }
        else {
            placePC(objets[n], document.getElementById("leFond"), "simple", n);
        }
    }
}

const placeInfosMoyen = (moyen, obj) => {
    return new Promise((resolve, reject) => {
        $.get('/getInfosSecteur?Dossier=' + config.InfosSecteurs + "&Secteur=" + moyen.Secteur + "&Moyen=infos_" + moyen.Nom, function (infoSecteur, status) {
            var lignes = infoSecteur.split('\n');
                if (lignes[0].toUpperCase().indexOf("<HTML>") > -1) {
                    obj.innerHTML = infoSecteur;
                    return;
                } else {
                    obj.innerText = infoSecteur;
                }
        });
    })
}

const placeInfosSecteur = (moyen, obj) => {
    return new Promise((resolve, reject) => {
        $.get('/getInfosSecteur?Dossier=' + config.InfosSecteurs + "&Secteur=" + moyen.Secteur + "&Moyen=" + moyen.Nom, function (infoSecteur, status) {
            if (infoSecteur != "" ){
                var divInfos = document.createElement('div');
                divInfos.id = "infosSecteur_" + obj.id;
                divInfos.className = "poubelle infoMoyen";
                divInfos.style.position="absolute";
                divInfos.style.overflow="auto";
                divInfos.style.left = obj.offsetLeft + 0;
                divInfos.style.width = obj.offsetWidth - 0;
                divInfos.style.top = obj.offsetTop + obj.offsetHeight - 0;                
                document.getElementById("leFond").appendChild(divInfos);

                var lignes = infoSecteur.split('\n');
                if (lignes[0].toUpperCase().indexOf("<HTML>") > -1) {
                    divInfos.innerHTML = infoSecteur;
                    return;
                }
                
                var texte = "";
                var titre = "";
                var couleur = "909090";
                var progresse = "";
                var bulle = "";
                
                for (var n in lignes){
                    if (lignes[n].toUpperCase().indexOf("TITRE=")>-1){
                        titre = lignes[n].substring(lignes[n].toUpperCase().indexOf("TITRE=") + 6);
                    } else {
                        if (lignes[n].toUpperCase().indexOf("COULEUR=")>-1){
                            couleur = lignes[n].substring(lignes[n].toUpperCase().indexOf("COULEUR=") + 8);
                        } else {
                            if (lignes[n].toUpperCase().indexOf("PROGRESSE=")>-1){
                                progresse = lignes[n].substring(lignes[n].toUpperCase().indexOf("PROGRESSE=") + 10);
                            } else {
                                if (lignes[n].toUpperCase().indexOf("BULLE=")>-1){
                                    bulle = lignes[n].substring(lignes[n].toUpperCase().indexOf("PROGRESSE=") + 7);
                                } else {
                                    if (texte != "") {texte = texte + '\n';}
                                    texte= texte + lignes[n];
                                }
                            }
                        }
                    }
                }
                if (bulle != "") {
                    divInfos.title = bulle;
                }
                if (titre != ""){
                    titre = titre.replace('\n',"");
                    var h = document.createElement("H5");
                    var t = document.createTextNode(titre);
                    h.style.textAlign = "center"
                    h.appendChild(t);
                    divInfos.appendChild(h);
                }
                if (progresse !="") {
                    progresse = progresse.replace('\r',"");
                    try {
                        var d = document.createElement("div")
                        d.className = "progress";
                        var dd = document.createElement("div")
                        dd.className = "progress-bar";
                        dd.role = "progressbar";
                        dd.valuemin = "0";
                        dd.valuemax = "100";
                        dd.valuenow = progresse
                        dd.style.width = progresse + "%"
                        d.appendChild(dd);
                        divInfos.appendChild(d)
                    } catch {}
                }
                if (texte != "") {
                    var label = document.createElement("label");
                    label.innerText = texte;
                    divInfos.appendChild(label);
                }
                if (couleur != "") {
                    try { divInfos.style.background = '#' + couleur } catch {}
                }

                document.getElementById("leFond").appendChild(divInfos);
            }
         });
    })
}
/* ------------------------------------------------------------------------------------------
                                    On place un objet simple
    ------------------------------------------------------------------------------------------*/
function placePC(objet, papa, type, id){        
    var picture = imageDuFormat(objet.FormatObjet);
    var image = document.createElement('img');
        image.id = id + "@" + objet.Nom;
        image.src = "static\\Informations\\images\\objets\\" + picture;
        image.alt = objet.Nom;  
        image.title = objet.Nom;
        
        image.style.width = config.Objet.Taille + "px";
        image.style.height = config.Objet.Taille + "px";

        image.alt = formateTitre(config.Objet.Nom, objet)
        image.title = formateTitre(config.Objet.Bulle, objet)

        image.className = "unPC poubelle";
        image.draggable = false;
        image.name = id;
        image.onclick = function() { onAction(this); }; //----------------------------------------------------
        papa.appendChild(image);

    if (type=="simple"){         
        image.style.position="absolute";
            var h = image.offsetHeight;
            var xx = xEnPixel(objet.x) - (image.offsetWidth / 2) - 20;    // Math.trunc( (fond.offsetWidth * parseFloat(objet.x) / 100) - image.offsetWidth / 2 );
            var yy = yEnPixel(objet.y)  + (h / 2);                   //Math.trunc(  (fond.offsetHeight * parseFloat(objet.y) / 100) + h / 2 );
            image.style.left = xx + 'px';
            image.style.top = yy + "px";  
            image.ondblclick = function() {ondbclickPC(this); }
            image.onmousedown = function() {onMouseObjDown(event, this); }
            image.onmouseup = function() {onMouseObjUp(event, this); }
            image.onmousemove = function() {onMouseObjMove(event, this); }
        var label = document.createElement("label");
            label.id = "label " + image.id;
            label.name = "label PC";
            label.innerText = formatHostname(objet.Nom);
            label.for = image.id;
            label.className = "labelPC poubelle";
            label.style.position = "absolute";
            label.style.left = xx + 'px';
            label.style.width = image.offsetWidth + 40 + 'px';
            label.style.background = "#F0F0F0";
            yy = yy + h + 18;
            label.style.top = yy + "px";
            label.style.textAlign="center";

            label.style.backgroundColor = "#" + config.Objet.Couleur;
            label.style.border = config.Objet.Hostname.Epaisseur + "px solid #" + config.Objet.Hostname.Couleur;
            label.style.borderRadius = config.Objet.Hostname.Angle + "%";
            label.style.color = "#" + config.Objet.Hostname.PoliceCouleur;
            label.style.fontSize = config.Objet.Hostname.PoliceTaille + "pt";

            papa.appendChild(label);            
    }  /* else {
        p.appendChild(image);
        papa.appendChild(p);
    }*/
    //if (estUnPC(objets[n].alt))
}
/* ------------------------------------------------------------------------------------------
                                    On place le titre de l'objet simple
    ------------------------------------------------------------------------------------------*/
    function placeTitrePC(objet, papa, id, m){
        var image = document.getElementById(id + "@" + objet.Nom);
       //     var h = image.offsetHeight;
        var label = document.createElement("label");
            label.id = "label " + image.id;
            label.name = "label PC";
            label.innerText = formatHostname(objet.Nom);
            label.className = "poubelle labelPC";
            label.style.position = "absolute";
            label.style.left = image.offsetLeft - 20 + 'px';
            label.style.width = image.offsetWidth + 40 + 'px'; 
            label.style.top = image.offsetTop + image.offsetHeight + "px";            
            label.style.textAlign="center";
            label.style.background = "#F0F0F0";
            
            label.style.backgroundColor = "#" + config.Moyen.PC.Couleur;
            label.style.border = config.Moyen.PC.Hostname.Epaisseur + "px solid #" + config.Moyen.PC.Hostname.Couleur;
            label.style.borderRadius = config.Moyen.PC.Hostname.Angle + "%";
            label.style.color = "#" + config.Moyen.PC.Hostname.PoliceCouleur;
            label.style.fontSize = config.Moyen.PC.Hostname.PoliceTaille + "pt";

            papa.appendChild(label);

            var n = label.offsetHeight + 5;
            image.style.marginBottom = n + "px";
    }
/* ------------------------------------------------------------------------------------------
                                      On double click sur un moyen
    ------------------------------------------------------------------------------------------*/
    function ondbclick(id){
        if (enAdministration){            
            idEnCours = id.name;
            console.log("double click sur objet\t" + idEnCours)
            document.getElementById("machineTitre").innerText = "Correction du moyen";
            document.getElementById("machineNom").value = objetsEnCours[id.name].Nom;
            document.getElementById("machineDetail").value = objetsEnCours[id.name].Détail;
            document.getElementById("moyenPasTitre").checked = objetsEnCours[id.name].pasDeTitre == "true";
            document.getElementById("moyenAfficheInfos").checked = objetsEnCours[id.name].afficheInfos == "true";
            
            document.getElementById("machineCouleur").value = "#" + objetsEnCours[id.name].couleur;
            document.getElementById("supprimerMoyen").style.display = "block";
            document.getElementById("aspectMoyen").style.backgroundImage = null;
            document.getElementById("aspectMoyen").style.backgroundColor = "#" + objetsEnCours[id.name].couleur;
            document.getElementById("moyenPasCouleur").checked = objetsEnCours[id.name].couleur == "";
            if (objetsEnCours[id.name].image != "" && objetsEnCours[id.name].image != "undefined") {
                document.getElementById("moyenPasImage").checked = false;
                document.getElementById("aspectMoyen").title = objetsEnCours[id.name].image;
                document.getElementById("aspectMoyen").style.backgroundImage = 'url("static/Informations/images/fondmoyens/' + objetsEnCours[id.name].image + '")';
            } else {
                document.getElementById("moyenPasImage").checked = true;
            }
            renseigneNouvelleMachine();
            var p = document.getElementsByClassName("ImageBanque");
            for(var i = p.length - 1; 0 <= i; i--) {
                p[i].remove();
            }
            $.get('/getListeFichiers?dossier=' + "static\\Informations\\images\\fondmoyens", function (fichiers, status) {
                for (var n=0; n<fichiers.length; n++){
                    var im = document.createElement('img');
                    im.name = "ImageBanque";
                    var f = fichiers[n].split('>')[0];
                    im.id = f;
                    im.title = f;
                    im.alt = f;
                    im.src = "static\\Informations\\images\\fondmoyens\\" + f;
                    im.className = "ImageBanque"
                    im.onclick = function() {onclickBanqueImages(this); }
                    listImagesMoyens.appendChild(im);                    
                }
                $('#nouvelleMachine').modal('show');
            });
        }
    }

    /* ------------------------------------------------------------------------------------------
                                ### ######  ####### #     # 
                                 #  #     # #       ##   ## 
                                 #  #     # #       # # # # 
                                 #  #     # #####   #  #  # 
                                 #  #     # #       #     # 
                                 #  #     # #       #     # 
                                ### ######  ####### #     # 
    ------------------------------------------------------------------------------------------*/
    document.getElementById("aspectMoyen").onmouseout = function() 
    {
        var idem = document.getElementsByClassName("idemmasque");
        for (var i=0; i<idem.length; i++) {
            document.getElementsByClassName("idemmasque")[i].style.display = "none";
        }
    };

    document.getElementById("aspectMoyen").onmousemove = function() {
            var idem = document.getElementsByClassName("idemmasque");
            for (var i=0; i<idem.length; i++) {
                document.getElementsByClassName("idemmasque")[i].style.display = document.getElementById("supprimerMoyen").style.display;
            }
    };    

    $('#idemHaut').click(function () {
        $('#nouvelleMachine').modal('hide');
        var m = document.getElementById(idEnCours);
        left0  = m.offsetLeft;
        left1 = m.offsetLeft + m.offsetWidth;
        top0 = m.offsetTop - m.offsetHeight - document.getElementById("entete").offsetHeight;
        top1 = m.offsetTop - document.getElementById("entete").offsetHeight;
        idEnCours = -1;
        setTimeout(nouveauMoyen, 200);
    });
    $('#idemGauche').click(function () {
        $('#nouvelleMachine').modal('hide');
        var m = document.getElementById(idEnCours);
        left0  = m.offsetLeft - m.offsetWidth;
        left1 = m.offsetLeft;
        top0 = m.offsetTop - document.getElementById("entete").offsetHeight;
        top1 = m.offsetTop + m.offsetHeight - document.getElementById("entete").offsetHeight;
        idEnCours = -1;
        setTimeout(nouveauMoyen, 200);
    });
    $('#idemDroit').click(function () {
        $('#nouvelleMachine').modal('hide');
        var m = document.getElementById(idEnCours);
        left0  = m.offsetLeft + m.offsetWidth;
        left1 = m.offsetLeft + (m.offsetWidth * 2);
        top0 = m.offsetTop - document.getElementById("entete").offsetHeight;
        top1 = m.offsetTop + m.offsetHeight - document.getElementById("entete").offsetHeight;
        idEnCours = -1;
        setTimeout(nouveauMoyen, 200);
    });
    $('#idemBas').click(function () {
        $('#nouvelleMachine').modal('hide');
        var m = document.getElementById(idEnCours);
        left0  = m.offsetLeft;
        left1 = m.offsetLeft + m.offsetWidth;
        top0 = m.offsetTop + m.offsetHeight - document.getElementById("entete").offsetHeight;
        top1 = m.offsetTop + (m.offsetHeight * 2) - document.getElementById("entete").offsetHeight;
        idEnCours = -1;
        setTimeout(nouveauMoyen, 200);
    });
/* ------------------------------------------------------------------------------------------

   ------------------------------------------------------------------------------------------ */
   function aspectMoyen() {
        if (document.getElementById("aspectMoyen").style.backgroundImage != "") {
            if (document.getElementById("moyenPasCouleur").checked) {
                document.getElementById("aspectMoyen").style.backgroundColor = null;
            } else {
                document.getElementById("aspectMoyen").style.backgroundColor = document.getElementById("machineCouleur").value;
            }
        } else {
            document.getElementById("moyenPasCouleur").checked = false;
            document.getElementById("aspectMoyen").style.backgroundColor = document.getElementById("machineCouleur").value;
        }
   }

    $('#machineCouleur').click(function () {
        document.getElementById("moyenPasCouleur").checked = false;
        aspectMoyen();
        return;
        document.getElementById("moyenPasImage").checked = true;
        document.getElementById("aspectMoyen").style.backgroundImage = null;
        document.getElementById("aspectMoyen").style.backgroundColor = document.getElementById("machineCouleur").value;
    });

    $('#moyenPasCouleur').click(function () {
        aspectMoyen();
    });

    $('#moyenPasImage').click(function () {
        if (document.getElementById("moyenPasCouleur").checked) {
            document.getElementById("aspectMoyen").style.backgroundColor = null;
        } else {
            document.getElementById("aspectMoyen").style.backgroundColor = document.getElementById("machineCouleur").value;
        }
        if (document.getElementById("moyenPasImage").checked) {
            document.getElementById("aspectMoyen").style.backgroundImage = null;
            document.getElementById("aspectMoyen").title = "";
        }
        aspectMoyen();
        return;
        
    });
    
    function onclickBanqueImages(image){
        document.getElementById("moyenPasImage").checked = false;
        document.getElementById("aspectMoyen").style.backgroundColor = document.getElementById("machineCouleur").value;
        document.getElementById("aspectMoyen").style.backgroundImage = "url(" + image.src + ")";
        document.getElementById("aspectMoyen").title = image.title;
        aspectMoyen();
    }
    

    function formatHostname(host){
        var reponse = host.toUpperCase();
        for (var n in config.hostnameReplaceParEtoile){
            var txt = config.hostnameReplaceParEtoile[n].texte.toUpperCase();
            reponse = reponse.replace(txt,'*');
        }
        return reponse
    }
/* ------------------------------------------------------------------------------------------
                                      On click sur un objet
    ------------------------------------------------------------------------------------------*/
    function onMouseObjDown(event, id) {
        if (enAdministration && ctrl){
            console.log("souris enfoncée");
            idEnCours = id.name;
            left0 = id.offsetLeft;
            top0 = id.offsetTop;
            mvtX = event.clientX;
            mvtY = event.clientY;
            var vx = left0 + (event.clientX - mvtX);
            var vy = top0 + (event.clientY - mvtY);
            if (objetsEnCours[id.name].type == "simple") {
                document.getElementById(id.id).style.cursor = "move";
                enMVT = true;
                enRedim = false;                
                left1 = vx - (id.offsetWidth /2);
                top1 = vy - (id.offsetHeight /2);
            } else {
                var mx = document.getElementById(id.id).offsetLeft + document.getElementById(id.id).offsetWidth -25;
                var my = document.getElementById(id.id).offsetTop + document.getElementById(id.id).offsetHeight -25;
                if (mvtX >= mx && mvtY >= my){
                    document.getElementById(id.id).style.cursor = "nwse-resize";
                    enMVT = false;
                    enRedim = true;
                }else{
                    document.getElementById(id.id).style.cursor = "move";
                    enMVT = true;
                    enRedim = false;
                }
            }
        }
    }
/* ------------------------------------------------------------------------------------------
                                On relache la souris du petit objet      
    ------------------------------------------------------------------------------------------*/
    function onMouseObjUp(event, id) {
        console.log("sourie lachée")
        if (enAdministration) {            
            if (idEnCours==id.name) {
                if (enMVT) {
                    if (objetsEnCours[id.name].type == "simple"){
                        left1 = left1 + document.getElementById(id.id).offsetWidth / 1;
                        top1 = top1 - document.getElementById(id.id).offsetHeight / 2
                        miseAJourPC(idEnCours, false);
                    } else {
                        EnregistreMoyen();
                    }
                }
                if (enRedim & objetsEnCours[id.name].type != "simple"){
                    console.log("Fin REDIM du moyen");
                    EnregistreMoyen();
                }
            }
        }
        enMVT = false;  
        enRedim = false;      
        idEnCours = -1;
        document.getElementById(id.id).style.cursor ="auto";
    }
/* ------------------------------------------------------------------------------------------
                                On déplace la souris sur un petit objet
    ------------------------------------------------------------------------------------------*/
    function onMouseObjMove(event, id) {
        if (enAdministration){
            if (idEnCours == id.name) {
                if (enMVT){
                    var vx = left0 + (event.clientX - mvtX);
                    var vy = top0 + (event.clientY - mvtY);
                    if (objetsEnCours[id.name].type == "simple"){
                        vx = vx - (id.offsetWidth /2);
                        vy = vy - (id.offsetHeight /2);
                        // déplacer le texte + indicateurs <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
                    } else {
                        // déplacer le titre    <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
                    }
                    id.style.left = vx;
                    left1 = vx;
                    id.style.top = vy;
                    top1 = vy;
                }
                if (enRedim){
                    document.getElementById(id.id).style.width = event.clientX - document.getElementById(id.id).offsetLeft;
                    document.getElementById(id.id).style.height = event.clientY - document.getElementById(id.id).offsetTop;
                }
            }
            if (!enMVT & !enRedim) {
                document.getElementById(id.id).style.cursor = "grab";
                var mx = document.getElementById(id.id).offsetLeft + document.getElementById(id.id).offsetWidth -25;
                var my = document.getElementById(id.id).offsetTop + document.getElementById(id.id).offsetHeight -25;
                if (event.clientX >= mx && event.clientY >= my  & objetsEnCours[id.name].type != "simple"){
                    document.getElementById(id.id).style.cursor = "se-resize";
                }
            }
        }
    }
/* ------------------------------------------------------------------------------------------
                                Renseigne la boite de dialogue "moyen"
    ------------------------------------------------------------------------------------------*/
    function renseigneNouvelleMachine(){
        var t = -1;
        $.get('/getLectureFichier?fichier=secteurs', function (lesSecteurs, status) {                
            var l = document.getElementById("menuListeSecteurs");
            l.length=0;
            for (var n in lesSecteurs.Secteurs){
                l.length = l.length + 1;
                l.options[l.length-1].text = lesSecteurs.Secteurs[n].Nom;
                if (idEnCours > -1){
                    if (lesSecteurs.Secteurs[n].Nom == objetsEnCours[idEnCours].Secteur){
                        t = l.length -1;
                    }
                }
            }
            if (t == -1 ) { l.selectedIndex = 0; } else { l.selectedIndex = t; }

            var ordi = document.getElementById("menuListePC");
            ordi.length = 0;
            if (idEnCours > -1){
                for (var m in objetsEnCours[idEnCours].objets){
                    ordi.length = ordi.length + 1;
                    ordi.options[ordi.length -1].text = objetsEnCours[idEnCours].objets[m].Nom + "@" + objetsEnCours[idEnCours].objets[m].Détail;
                } 
            }
        });
    }
/* ------------------------------------------------------------------------------------------
                                On ajoute un PC au moyen
    ------------------------------------------------------------------------------------------*/
    $('#ajoutePCAuMoyen').click(function () {
        console.log("ajoute un PC au moyen");
        if (document.getElementById("Hostname").value == ""){ 
            return;
        }
        var ordi = document.getElementById("menuListePC");
        for (var n=0 ; n<ordi.length; n++){
            if (ordi.options[n].text.indexOf(document.getElementById("Hostname").value + "@") ==0) {
                return;
            }
        }
        ordi.length = ordi.length + 1;
        ordi.options[ordi.length -1].text = document.getElementById("Hostname").value + "@" + document.getElementById("Detail").value;
        document.getElementById("Hostname").value = "";
        document.getElementById("Detail").value = "";
    })
/* ------------------------------------------------------------------------------------------
                                On supprime un PC au moyen
    ------------------------------------------------------------------------------------------*/
    $('#supprimePCAuMoyen').click(function () {
        console.log("supprime un PC au moyen");
        var ordi = document.getElementById("menuListePC");
        var n = ordi.selectedIndex;
        var h = ordi.options[n].text.substring(0,ordi.options[n].text.indexOf("@"));
        var d = ordi.options[n].text.substring(ordi.options[n].text.indexOf("@") + 3);
        document.getElementById("Hostname").value = h;
        document.getElementById("Detail").value = d;
        ordi.options[n].remove();
    })
/* ------------------------------------------------------------------------------------------
                            On efface les champs du PC pour le moyen
    ------------------------------------------------------------------------------------------*/
    $('#effacePCPourMoyen').click(function () {
        console.log("on efface les données du PC qui est destiné à un moyen")
        document.getElementById("Hostname").value = "";
        document.getElementById("Detail").value = "";
    });
/* ------------------------------------------------------------------------------------------
                            On monte un PC dans le liste du moyen
    ------------------------------------------------------------------------------------------*/
    $('#montePCDuMoyen').click(function () {
        console.log("On monte un PC dans le liste du moyen");
        var ordi = document.getElementById("menuListePC");
        var n = ordi.selectedIndex;
        if (n>0){
            var a = ordi.options[n].text;
            ordi.options[n].text = ordi.options[n-1].text;
            ordi.options[n-1].text=a;
            ordi.selectedIndex = n -1;
        }
    });
/* ------------------------------------------------------------------------------------------
                            On descend un PC dans le liste du moyen
    ------------------------------------------------------------------------------------------*/
    $('#descendPCDuMoyen').click(function () {
        console.log("On descend un PC dans le liste du moyen");
        var ordi = document.getElementById("menuListePC");
        var n = ordi.selectedIndex;
        if (n<ordi.length-1 && n>-1){
            var a = ordi.options[n].text;
            ordi.options[n].text = ordi.options[n+1].text;
            ordi.options[n+1].text=a;
            ordi.selectedIndex = n +1;
        }
    });
/* ------------------------------------------------------------------------------------------
                            On efface les champs du PC pour le moyen
    ------------------------------------------------------------------------------------------*/
    $('#annulerNouvelleMachine').click(function () {
        console.log("on annule le nouveau ou la correction de moyen");
        $('#nouvelleMachine').modal('hide');
    });
/* ------------------------------------------------------------------------------------------
                                On affiche correction PC
    ------------------------------------------------------------------------------------------*/
    function ondbclickPC(id){
        if (enAdministration){
            idEnCours = id.name;
            console.log("Création ou corretion PC\tID=" + idEnCours)
            document.getElementById("PCTitre").innerText = "Correction de l'objet (PC)";
            document.getElementById("PCNom").value = objetsEnCours[id.name].Nom;
            document.getElementById("PCDetail").value = objetsEnCours[id.name].Détail;
            document.getElementById("supprimerPC").style.visibility="visible";

            document.getElementById("menuListeObjets").selectedIndex = miseAJourListeFormatsObjets(objetsEnCours[idEnCours].FormatObjet);
            objetChange();
            //console.log(objetsEnCours[idEnCours].FormatObjet)
            var t = -1;
            $.get('/getLectureFichier?fichier=secteurs', function (lesSecteurs, status) {                
                    var l = document.getElementById("PCMenuListeSecteurs");
                    l.length=0;
                    for (var n in lesSecteurs.Secteurs){
                        l.length = l.length + 1;
                        l.options[l.length-1].text = lesSecteurs.Secteurs[n].Nom;
                        if (idEnCours > -1){
                            if (lesSecteurs.Secteurs[n].Nom == objetsEnCours[idEnCours].Secteur){
                                t = l.length -1;
                            }
                        }
                    }
                l.selectedIndex = t;
                $('#nouveauPC').modal('show');
            });
        }
    }

    function miseAJourListeFormatsObjets(format){
        var l = document.getElementById("menuListeObjets");
            l.length=0;
            var t = -1;
            for (var n in formatObjets.lesObjets){
                l.length = l.length + 1;
                l.options[l.length-1].text = formatObjets.lesObjets[n].Nom;
                if (formatObjets.lesObjets[n].Nom == format){
                    t= l.length -1;
                }
            }
        return t;
    }
/* ------------------------------------------------------------------------------------------
                                On annule nouveau / correction PC
    ------------------------------------------------------------------------------------------*/
    $('#annulerNouveauPC').click(function () {
        console.log("Création ou correction PC annulé")
        $('#nouveauPC').modal('hide');
    })
/* ------------------------------------------------------------------------------------------
                                        On supprime un PC
    ------------------------------------------------------------------------------------------*/
    $('#supprimerPC').click(function () {
        if (confirm("Suppression de l'objet \"" + document.getElementById("PCNom").value + "\" ?") == true) {
            console.log("Suppression d'un PC")
            $('#nouveauPC').modal('hide');
            $.get('/getSupprimePCOuMoyen?page=' + document.getElementById("titre").innerText +
                                       '&id=' + idEnCours, function (page, status) {
                                increment = 0;
                                console.log("rafraichissement page après changement");
                                fonctionTimer();
                            });
        }
    });
/* ------------------------------------------------------------------------------------------
                            On enregistre le nouveau ou la correction du PC
    ------------------------------------------------------------------------------------------*/
    $('#okNouveauPC').click(function () {
        if (document.getElementById("PCNom").value != "") {
            console.log("Corretion ou nouveau PC renseigné")
            $('#nouveauPC').modal('hide');
            console.log("Mise à jour ID=" + idEnCours)
            miseAJourPC(idEnCours, true);
        }
    });

    $('#menuListeObjets').change(function () {
        objetChange()
    });

    function objetChange() {
        var quoi = document.getElementById("menuListeObjets").options[document.getElementById("menuListeObjets").selectedIndex].value;
        for (var i=0 ; i<formatObjets.lesObjets.length ; i++) {
            if (formatObjets.lesObjets[i].Nom == quoi) {
                document.getElementById("aspectPC").style.backgroundImage = 'url("static/Informations/images/objets/' + formatObjets.lesObjets[i].Image;
                return;
            }
        }        
    };
    

    function miseAJourPC(id, corrige){
        console.log("Mise à jour ID=>" + id)
        var host;
        var sect;
        var form;
        var detai;
        
        if (id == -1 || corrige){
            host = document.getElementById("PCNom").value;
            sect = document.getElementById("PCNom").value;
            form = document.getElementById("menuListeObjets").value;
            detai = document.getElementById("PCDetail").value;
        } else {
            obj = objetsEnCours[id];
            host = obj.Nom;
            sect = obj.Secteur;
            form = obj.FormatObjet;
            detai = obj.Détail;
        }
        $.get('/getNouveauPC?page=' + document.getElementById("titre").innerText +
                           '&hostname=' + host +
                           '&x=' + xPourCent(left1) +
                           '&y=' + yPourCent(top1) +
                           '&id=' + id +                           
                           '&secteur=' + sect +
                           '&format=' + form +
                           '&detail=' + detai, function (page, status) {
        });
        increment = 0;
        console.log("rafraichissement page après changement");
        fonctionTimer();
    };
/* ------------------------------------------------------------------------------------------
                                        On supprime un Moyen
    ------------------------------------------------------------------------------------------*/
    $('#supprimerMoyen').click(function () {
        console.log("supprime un moyen");
        if (confirm("Suppression de l'objet \"" + document.getElementById("machineNom").value + "\" ?") == true) {
            $('#nouvelleMachine').modal('hide');
            $.get('/getSupprimePCOuMoyen?page=' + document.getElementById("titre").innerText +
                                       '&id=' + idEnCours, function (page, status) {
                                increment = 0;
                                fonctionTimer();
                            });
        }
    });
/* ------------------------------------------------------------------------------------------
                            On enregistre le nouveau ou la correction du moyen
    ------------------------------------------------------------------------------------------*/
    $('#okNouvelleMachine').click(function () {
        if (document.getElementById("menuListeSecteurs").selectedIndex > -1) {
            if (document.getElementById("machineNom").value != "" ) {
                $('#nouvelleMachine').modal('hide');
                var lesPC = "";
                for (var n=0; n<menuListePC.length; n++){
                    if (lesPC != ""){
                        lesPC = lesPC + "\\";
                    }
                    lesPC = lesPC + menuListePC.options[n].text;
                }
                var couleur = document.getElementById("machineCouleur").value.replace("#","");
                if (document.getElementById("moyenPasCouleur").checked) {couleur = "";}
                var sect = document.getElementById("menuListeSecteurs").options[document.getElementById("menuListeSecteurs").selectedIndex].text;
                sauveMoyen(document.getElementById("machineNom").value,
                           document.getElementById("machineDetail").value,
                           sect,
                           couleur,
                           lesPC,
                           document.getElementById("aspectMoyen").title,
                           document.getElementById("moyenPasTitre").checked,
                           document.getElementById("moyenAfficheInfos").checked
                           );
                increment = 0;
                console.log("rafraichissement page après changement");
                fonctionTimer();
            }
        } else { alert("Secteur et nom à renseigner"); }
    })
/* ------------------------------------------------------------------------------------------
                        On enregistre la correction du moyen suite MVT ou redim
    ------------------------------------------------------------------------------------------*/
    function EnregistreMoyen() {
        var lesPC = "";
        enRedim = false;
        enMVT = false;
        for (var n=0; n<objetsEnCours[idEnCours].objets.length; n++){
            if (lesPC != ""){
                lesPC = lesPC + "\\";
            }
            lesPC = lesPC + objetsEnCours[idEnCours].objets[n].Nom + "@" + objetsEnCours[idEnCours].objets[n].Détail;
        }
        sauveMoyen(objetsEnCours[idEnCours].Nom,
                   objetsEnCours[idEnCours].Détail,
                   objetsEnCours[idEnCours].Secteur,
                   objetsEnCours[idEnCours].couleur,
                   lesPC);
    }
/* ------------------------------------------------------------------------------------------
                                     Sauve les données du moyen
    ------------------------------------------------------------------------------------------*/
    function sauveMoyen(nom, detail,sect, couleur, lesPC, image, pasDeTitre, afficheInfos){
        console.log("ajoute ou correction moyen");
        var x0;
        var y0;
        var x1;
        var y1;
        if (idEnCours>-1){
            x0 = xPourCent(document.getElementById(idEnCours).offsetLeft)
            y0 = yPourCent(document.getElementById(idEnCours).offsetTop - document.getElementById("entete").offsetHeight)
            x1 = xPourCent(document.getElementById(idEnCours).offsetLeft + document.getElementById(idEnCours).offsetWidth)
            y1 = yPourCent(document.getElementById(idEnCours).offsetTop + document.getElementById(idEnCours).offsetHeight - document.getElementById("entete").offsetHeight)
        } else {
            x0 = xPourCent(left0)
            y0 = yPourCent(top0)
            x1 = xPourCent(left1)
            y1 = yPourCent(top1)
        }
        $.get('/getNouveauMoyen?page=' + document.getElementById("titre").innerText +
                              '&nom=' + nom +
                              '&detail=' + detail + 
                              '&secteur=' + sect +
                              '&couleur=' + couleur +
                              '&image=' + image +
                              '&x0=' + x0 +
                              '&y0=' + y0 +
                              '&x1=' + x1 +
                              '&y1=' + y1 +
                              '&lesPC=' + lesPC +
                              '&pasTitre=' + pasDeTitre +
                              '&afficheInfos=' + afficheInfos +
                              '&id=' + idEnCours, function (page, status) {
        });
    };
/* ##############################################################################################################################
################################################################################################################################# 
                                               L E S      P I N G S
#################################################################################################################################
##############################################################################################################################*/


function lesPing(){
    var listePC = document.getElementsByClassName("unPC");
    for (var n=0; n<listePC.length; n++){
        if (estUnPC(listePC[n].alt)){
            ping(listePC[n].id).then((d) => {
                var d = d.split('\t');
            if (d[1] == "ok") {
                document.getElementById("label " + d[0]).style.background = "#00FF00"
            } else {
                document.getElementById("label " + d[0]).style.background = "#FF9090"
            }
              });
        }
    }
}

const ping = (id) => {
    return new Promise((resolve, reject) => {
        $.get('/getPing?hostname=' + id, function (reponsePing, status) {
            resolve(reponsePing);
            /*
            var d = reponsePing.split('\t');
            if (d[1] == "ok") {
                document.getElementById("label " + d[0]).style.background = "#00FF00"
                resolve(true)
            } else {
                document.getElementById("label " + d[0]).style.background = "#FF9090"
                reject('Ping "' + id.split('@')[1] + '" sans réponse')
            }
            */
        });
    })
}


/* ##############################################################################################################################
################################################################################################################################# 
                           ###                               
                            #  #    # #####  #  ####    ##   ##### ###### #    # #####   ####  
                            #  ##   # #    # # #    #  #  #    #   #      #    # #    # #     
                            #  # #  # #    # # #      #    #   #   #####  #    # #    #  #### 
                            #  #  # # #    # # #      ######   #   #      #    # #####       # 
                            #  #   ## #    # # #    # #    #   #   #      #    # #   #  #    # 
                           ### #    # #####  #  ####  #    #   #   ######  ####  #    #  ####  
#################################################################################################################################
##############################################################################################################################*/
    /* ------------------------------------------------------------------------------------------
                            Création de la variable ordinateur pour un PC
    ------------------------------------------------------------------------------------------*/
    function creationVariable(hostname) {
        var v = { 
            "hostname": hostname,
            "variable": []
        }
        ordinateurs.push(v);
    }
    /* ------------------------------------------------------------------------------------------
                                Savoir si on cherche le hostname ou une variable
    ------------------------------------------------------------------------------------------*/
    function quoiQui(flag, pc, nb){
        try {
            if (flag.HostnameOuVariable == "~hostname~") {
                return pc.alt.toUpperCase();
            } else {
                for (var ii in ordinateurs[nb].variable) {
                    if (flag.HostnameOuVariable == ordinateurs[nb].variable[ii].nom) {
                        return ordinateurs[nb].variable[ii].valeur;
                    }
                }
            }
            return pc.alt.toUpperCase();
        } catch {
            return null;
        }
    }
/*
                         ____________
                         \          /
                          \        /
                           \      /
                            \    /
                             \  /
                              \/
        */
                                /*  MMMMWNKOkkkkO0XWWMMMMMMMMMMMMMMMMMMMMMMM
                                    MMWKxoccccccccld0NMMMMMMMMMMMMMMMMMMMMMM
                                    MXkl:cokO000kdc:cdKWMMMMMMMMMMMMMMMMMMMM
                                    Nkc:lkNWMMMMWN0occdXWMMMMMMMMMMMMMMMMMMM
                                    Ko:cxNMMMMMMMMWOl:lOWWMMMMMMMMMMMMMMMMMM
                                    0l:cOWMMMMMMMMM0l:cONWMMMMMMMMMMMMMMMMMM
                                    0l:cOWMMMMMMMMM0l:cONWMMMMMMMMMMMMMMMMMM
                                    Ko:lOWMMMMMMMMM0l:cONWMMMMMMMMMMMMMMMMMM
                                    WKO0NMMMMMMMMMM0l:cONWMMMMMMMMMMMMMMMMMM
                                    MMMMMMMMMMMMMNXkl:cx00KKKKKKKKKKKKKKXNWM
                                    MMMMMMMMMMMW0dlc::ccccccccccccccccccloON
                                    MMMMMMMMMMMXd:::::::::::::::::::::::::oK
                                    MMMMMMMMMMMXd::::::::::ccool::::::::::l0
                                    MMMMMMMMMMMXd::::::::::ckXNOl:::::::::l0
                                    MMMMMMMMMMMXd::::::::::cdKXkl:::::::::l0
                                    MMMMMMMMMMMXo:::::::::::ckOl::c:::::::l0
                                    MMMMMMMMMMMXd:::::::::::cddc:::::::c::l0
                                    MMMMMMMMMMMXdc::::::::::::c:::::::::::l0
                                    MMMMMMMMMMMNkc:::::::::::::::::::::::cdX
                                    MMMMMMMMMMMMXxlc:::::::::cc:::::::::cdKW */
    /* ------------------------------------------------------------------------------------------
                                    Boucle pour places les indicateurs
    ------------------------------------------------------------------------------------------*/
    const placeLesIndicateurs = () => {
        return new Promise((resolve, reject) => {
            $.get('/getIndicateurs', function (indicateurs, status) {
                for (var iindice in indicateurs.Variables){
                    actionTypeCalcul(iindice, indicateurs.Variables[iindice], false);
                }
                for (var iindice in indicateurs.Flags) {
                    actionTypeCalcul(iindice, indicateurs.Flags[iindice], true);
                }
                resolve(true);
            });
        })
    }
    /* ------------------------------------------------------------------------------------------
                                    
    ------------------------------------------------------------------------------------------*/
    const actionTypeCalcul = (iindice, flag, indic) => {
        return new Promise((resolve, reject) => {
            /* ################################################################
                        ###### #  ####  #    # # ###### #####  
                        #      # #      #    # # #      #    # 
                        #####  # #      ###### # #####  #    # 
                        #      # #      #    # # #      #####  
                        #      # #      #    # # #      #   #  
                        #      #  ####  #    # # ###### #    # */
            if (flag.Type.toUpperCase() == "FICHIERPRESENT"){ fichierPresentResultatVariableIndicateur(iindice, flag, indic).then(); }
            /* ################################################################
                                 ####### #     # ####### 
                                    #     #   #     #    
                                    #      # #      #    
                                    #       #       #    
                                    #      # #      #    
                                    #     #   #     #    
                                    #    #     #    #    */
            if (flag.Type.toUpperCase().indexOf("DANSFICHIERTXT") > -1){ fichierTxtResultatVariableIndicateur(iindice, flag, indic).then(); }
            /* ################################################################
                                    #     # #        #####  
                                     #   #  #       #     # 
                                      # #   #       #       
                                       #    #        #####  
                                      # #   #             # 
                                     #   #  #       #     # 
                                    #     # #######  #####  */
            if (flag.Type.toUpperCase().indexOf("DANSFICHIERXLS") > -1){ recupereResultatVariableIndicateur(iindice, flag, indic).then(); }
            // ################################################################
        })
    }
    /*                           ####### #     # ####### 
                                    #     #   #     #    
                                    #      # #      #    
                                    #       #       #    
                                    #      # #      #    
                                    #     #   #     #    
                                    #    #     #    #    */
    /* ------------------------------------------------------------------------------------------
                                    Récupére la donnée dans un fichier
    ------------------------------------------------------------------------------------------*/
    const fichierTxtResultatVariableIndicateur = (iindice, flag, indic) => {
        return new Promise((resolve, reject) => {
            var listePC = document.getElementsByClassName("unPC");
            var fichier = flag.Chemin + "/" + flag.Fichier;
            while (fichier.indexOf("\\")>-1){ fichier = fichier.replace("\\", "/"); }
            
            $.get('/getLireLignesFichier?fichier=' + fichier, function (lesLignes, status) {
                for (var n=0; n<listePC.length; n++) {                         // ......................  PC après PC
                    if (estUnPC(listePC[n].alt)){
                        var reponse = -1968;
                        if (!indic) { creationVariable(listePC[n].alt); }

                        var quiQuoi = quoiQui(flag, listePC[n], n);
                        if (quiQuoi != null) {
                            var lignes = lesLignes.split('\n');                            
                            var totalOccurences = 0;
                            var reponse = 1011968;
                            for (var ff=0; ff<lignes.length; ff++){            // ...................... lecture lire par ligne
                                if (lignes[ff].toUpperCase().indexOf(quiQuoi) > -1 ) { // >>>>>>>>>      oui c'est le bon !!
                                    totalOccurences++;
                                    var sep = flag.Texte.Separateur;
                                    if (sep.toUpperCase() == "TAB") { sep = "\t"; }
                                    var valeur = lignes[ff].toUpperCase().split(sep)[flag.Calcul.ColonneResultat - 1];
                                    try {
                                        valeur.replace('\r','');
                                        valeur.replace('\n','');
                                    } catch {}
                                    
                                    reponse = traitementCalcul(flag, reponse, valeur, totalOccurences);
                                }
                            }
                            traitementFinCalcul(indic, iindice, flag, listePC[n], reponse);
                        }
                    }
                }                
            });
            resolve();
        })
    }
    /*                  ###### #  ####  #    # # ###### #####  
                        #      # #      #    # # #      #    # 
                        #####  # #      ###### # #####  #    # 
                        #      # #      #    # # #      #####  
                        #      # #      #    # # #      #   #  
                        #      #  ####  #    # # ###### #    # */
    /* ------------------------------------------------------------------------------------------
                                    Récupére la présence d'un fichier
    ------------------------------------------------------------------------------------------*/
    const fichierPresentResultatVariableIndicateur = (iindice, flag, indic) => {
        return new Promise((resolve, reject) => {
            var extention = flag.Fichier.replace('*','').toUpperCase();
            var listePC = document.getElementsByClassName("unPC");
            var dossier = flag.Chemin;
            while (dossier.indexOf("\\")>-1){ dossier = dossier.replace("\\", "/"); }
            
            $.get('/getListeFichiers?dossier=' + dossier, function (lesFichiers, status) { 
                for (var n=0; n<listePC.length; n++) {                         // ......................  PC après PC
                    if (estUnPC(listePC[n].alt)){
                        if (!indic) { creationVariable(listePC[n].alt); }
                        var quiQuoi = quoiQui(flag, listePC[n], n);
                        var reponse = 1011968;
                        var totalOccurences = 0;
                        for (var ff=0; ff<lesFichiers.length; ff++){            // ...................... lecture lire par ligne
                            if (lesFichiers[ff].toUpperCase().indexOf(quiQuoi) > -1 ) {
                                var fichier = lesFichiers[ff].split('>')[0];
                                var date = lesFichiers[ff].split('>')[1];
                                var ext = fichier.substring(fichier.length - extention.length).toUpperCase();
                                if (ext == extention) {                        // >>>>>>>>>      oui c'est le bon !!
                                    totalOccurences++;

                                    reponse = traitementCalcul(flag, reponse, date, totalOccurences);
                                }
                            }
                        }
                        traitementFinCalcul(indic, iindice, flag, listePC[n], reponse);
                    }
                }
            });
            resolve();
        })
    }
    /* ########################################################################################################################
                                 ####    ##   #       ####  #    # #       ####  
                                #       #  #  #      #      #    # #      #      
                                #      #    # #      #      #    # #       ####  
                                #      ###### #      #      #    # #           # 
                                #      #    # #      #      #    # #      #    # 
                                 ####  #    # ######  ####   ####  ######  ####  
        ####################################################################################################################### */

    function traitementCalcul(flag, reponse, valeur, totalOccurences) {
        switch (flag.Calcul.TypeCalcul) {
            case "Valeur" : return valeur;
                            break
            case "Contient" : return valeur;
                            break
            case "EcartAnnee" : var rep = ecartAnnee(valeur);
                                if (rep < reponse) {return rep; }
                            break
            case "EcartMois" : var rep = ecartMois(valeur);
                               if (rep < reponse) {return rep; }
                            break
            case "EcartJours" : var rep = ecartJour(valeur);
                                if (rep < reponse) {return rep; }
                            break
            case "Occurences" : return totalOccurences;
                            break
        }
    }

    function traitementFinCalcul(indic, iindice, flag, PC, reponse){
        if (!indic) {                                             // >>>>>>>>>>>>>>>>>>>>>>>  C'est une Variable <<<<<<<<<<<<<
            var v = { "nom": flag.Titre, "valeur": reponse }
            ordinateurs[ordinateurs.length-1].variable.push(v);
        } else {                                                  // >>>>>>>>>>>>>>>>>>>>>>>  C'est un Indicateur <<<<<<<<<<<<<
            var fond = document.getElementById("leFond");
            if (PC.name.indexOf("_") != -1) { fond = PC.parentNode; }  
            switch (flag.Calcul.TypeCalcul) {
                case "Valeur" : if (reponse != 1011968) {   // l'erreur c'est que si pas trouvé pas traité
                                        placeIndicateur(PC, "Deconchat.Herve", fond, parseInt(iindice)+1, flag, reponse);
                                    }
                                break
                case "Contient" : if (reponse != 1011968) {   // l'erreur c'est que si pas trouvé pas traité
                                        contient(reponse, flag, PC, fond, iindice);
                                    }
                                break
                case "Occurences" : if (reponse != 1011968) {   // l'erreur c'est que si pas trouvé pas traité
                                        placeIndicateur(PC, "Deconchat.Herve", fond, parseInt(iindice)+1, flag, reponse);
                                    }
                                break
                default: CalculIndicateur(reponse, iindice, PC, flag, reponse != 1011968);
            }                                
        }
    }    
    /* ------------------------------------------------------------------------------------------
                                    Traitement du calcul "Contient"
    ------------------------------------------------------------------------------------------*/
    const contient = (donnee, indic, pc, fond, i) => {
        return new Promise((resolve, reject) => {
            donnee = donnee.toString().toUpperCase();
            donnee = donnee.replace("\n","");
            donnee = donnee.replace("\r","");
            donnee = donnee.toUpperCase();
            const listeElements = indic.Calcul.Contient.split("/");
            for (let element=0; element < listeElements.length; element++){
                //console.log('donnee = "' + donnee + '" element : ' +listeElements[element] + " calcul=" + listeElements[element].toString().toUpperCase().indexOf(donnee))
                if (listeElements[element].toString().toUpperCase().indexOf(donnee) > -1){
                    placeIndicateur(pc, listeElements[element], fond, parseInt(i)+1, indic, donnee);
                    resolve(donnee);
                    return
                }
            }
            reject('"' + donnee + '" recherché et pas trouvé')
        })
    }
    /* ------------------------------------------------------------------------------------------
                                    Calcul de lindicateur fonction des valeurs
    ------------------------------------------------------------------------------------------*/
    function CalculIndicateur(ecart, i, pc, indic, vu){
        var fond = document.getElementById("leFond");
        if (pc.name.indexOf("_") != -1) { fond = pc.parentNode; }   
        if (ecart != 1011968) { 
           /* if (ecart == 0) {
                    console.log(i + "\tEcart=0")
                    placeIndicateur(pc, indic.Vu, fond, parseInt(i)+1, indic, ecart);
                }*/
            if (vu & ecart <= indic.Calcul.ValeurA) {
            //    console.log(i + "\tEcart=1")
                placeIndicateur(pc, indic.Calcul.ImageEgaleA, fond, parseInt(i)+1, indic, ecart);
                return;
            }
            if (vu & ecart <= indic.Calcul.ValeurB) {
            //    console.log(i + "\tEcart=2")
                placeIndicateur(pc, indic.Calcul.ImageEgaleB, fond, parseInt(i)+1, indic, ecart);
                return;
            }
            if (vu & ecart > indic.Calcul.ValeurC) {
            //    console.log(i + "\tEcart=2")
                placeIndicateur(pc, indic.Calcul.ImageSuperieurC, fond, parseInt(i)+1, indic, ">"+indic.Calcul.ValeurC);
            }
        } else {
            if (vu) {
                //    console.log(i + "\tEcart=0, vu")
                    placeIndicateur(pc, indic.Vu, fond, parseInt(i)+1, indic, "Vu");
                } else {
                //    console.log(i + "\t!vu")
                    placeIndicateur(pc, indic.PasVu, fond, parseInt(i)+1, indic, "abs");
                }
        }
    }
                                        /*  MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM
                                        MMMMMMMMMMMMMMMWNK00000KXWWMMMMMMMMMMMMM
                                        MMMMMMMMMMMMWXOdocccccccldkXWMMMMMMMMMMM
                                        MMMMMMMMMMMNOoccldxkOkkdlcclkNMMMMMMMMMM
                                        MMMMMMMMMMWOl:cxKNWMMMMWXkl:cxNMMMMMMMMM
                                        MMMMMMMMMMKo:cxXMMMMMMMMMNkc:l0WMMMMMMMM
                                        MMMMMMMMMM0l:ckWMMMMMMMMMM0l:cOWMMMMMMMM
                                        MMMMMMMMMW0l:ckWMMMMMMMMMW0l:ckWMMMMMMMM
                                        MMMMMMMWXOdc:cokOOOOOkkOOkdc:cdOKWMMMMMM
                                        MMMMMMWOlc:::::::::::::::::::::clkNMMMMM
                                        MMMMMMXd::::::::::::c::::::::::::l0MMMMM
                                        MMMMMMXd:::::::::cldxxoc:::::::::l0MMMMM
                                        MMMMMMXd:::::::::ckNWW0l:::::::::l0MMMMM
                                        MMMMMMXd:::::::::co0NKdc:::::::::l0MMMMM
                                        MMMMMMNxc:::::::::ckXOl::::::::::dXMMMMM
                                        MMMMMMWKoc::::::::codoc:::::::::lOWMMMMM
                                        MMMMMMMWKdc:::::::::::::::::::co0WMMMMMM
                                        MMMMMMMMMN0xolc::::::::::::clx0NWMMMMMMM
                                        MMMMMMMMMMMWNK0OOOOOOOOOOO0KNWMMMMMMMMMM
                                        MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM */

    function ecartAnnee(valeur){
        var dateDuJour = new Date();
        var aj = dateDuJour.getFullYear();
        var af = valeur.split('/')[2];
        if (af<1968) {af = parseInt(af) + 2000}
        var ecart = aj - af;
        return ecart;
    }
    function ecartMois(valeur){
        var dateDuJour = new Date();
        var aj = dateDuJour.getFullYear();
        var af = valeur.split('/')[2];
        if (af<1968) {af = parseInt(af) + 2000}
        var ecart = aj - af;
        return ecart;
    }
    function ecartJour(valeur){
        var d = valeur.split("/");
        var jourf = new Date (d[1]+"/"+d[0]+"/"+d[2])
        var ecart = parseInt((dateDuJour.getTime() - jourf.getTime()) / 86400000);
        return ecart;
    }
    /* ------------------------------------------------------------------------------------------
                                    Indique si c'est un PC ou non
    ------------------------------------------------------------------------------------------*/
    function estUnPC(nom){
        for (var o in objetsEnCours){
            if (objetsEnCours[o].type == "simple"){
                if (objetsEnCours[o].Nom == nom) {
                    for (var f in formatObjets.lesObjets){
                        if (formatObjets.lesObjets[f].Nom == objetsEnCours[o].FormatObjet){
                            return formatObjets.lesObjets[f].PC;
                        }
                    }
                    return false;
                }
            } else {
                for (var oo in objetsEnCours[o].objets){
                    if (objetsEnCours[o].objets[oo].Nom == nom) {                        
                        //console.log(nom+"\ttrue")
                        return true;
                    }   
                }
            }
        }
        return false;
    }
   /* ------------------------------------------------------------------------------------------
                                    Place un indicateur
    ------------------------------------------------------------------------------------------*/
    function placeIndicateur(pc, picture, papa, i, indic, alt){
        //console.log(alt+" i=" + i + "\t'" + picture + "'\t" + pc.id + "\t" + papa.id);
        var image
        if (picture!="Deconchat.Herve"){
            image = document.createElement('img');
            image.src = "static\\Informations\\images\\indicateurs\\" + picture;
            image.alt = alt;//indic.Titre + "\n" + indic.Détail;
        } else {
            image = document.createElement('label');
            image.innerText = alt;
            try {
                var nb = Number(alt);
                var a = indic.Calcul.CouleurInfEgaleA.replace("#","");
                var b = indic.Calcul.CouleurInfEgaleB.replace("#","");
                var c = indic.Calcul.CouleurSuperieurC.replace("#","");
                if (nb<= indic.Calcul.ValeurA) {image.style.background = "#" + a} else {
                    if (nb<= indic.Calcul.ValeurB) {image.style.background = "#" + b} else {
                        if (nb> indic.Calcul.ValeurC) {image.style.background = "#" + c}
                    }
                }
            } catch {
                image.style.background="#909090"
            }
            image.style.textAlign = "center";
        }
        image.id = "indicateur " + i + " de " + pc.id;
        image.title = indic.Titre + "\n" + indic.Détail + "\n=>" + alt;
        image.className = "indicateur poubelle";
        image.draggable = false;
        image.name = pc.alt + " " + indic.Titre;
        papa.appendChild(image);
        
        var nbEnHauteur = (pc.offsetHeight  / image.offsetHeight) + 1;
        var nbEnLargeur = (pc.offsetWidth / image.offsetWidth);
        
        xx = pc.offsetLeft - image.offsetWidth;
        yy = pc.offsetTop + pc.offsetHeight - image.offsetHeight * i;
        if (i > nbEnHauteur){
            xx = pc.offsetLeft - image.offsetWidth + image.offsetWidth * (i - nbEnHauteur);
            yy = pc.offsetTop + pc.offsetHeight - image.offsetHeight * nbEnHauteur;
            //console.log(pc.alt + "\t" + xx + "," + yy + "\t" + i)
            if (i > (nbEnHauteur + nbEnLargeur)){
                xx = pc.offsetLeft - image.offsetWidth *2 + image.offsetWidth * nbEnHauteur;
                var ii = i - nbEnHauteur - nbEnLargeur;
                yy = pc.offsetTop / 1 + pc.offsetHeight - image.offsetHeight * (nbEnHauteur - ii + 0 );
                //console.log(pc.alt + "\t" + xx + "," + yy + "\t" + i)
                if (i > ((2 * nbEnHauteur) + nbEnLargeur)){
                    image.remove();
                    //console.log(pc.alt + "\tdétruit " + i)
                }
            }
        }
        
        image.style.left = xx + 'px';
        image.style.top = yy + "px";  
    }
      /*
                              /\
                             /  \
                            /    \
                           /      \
                          /        \
                         /          \
                         ------------
        */
/* ##############################################################################################################################
################################################################################################################################# 
                                               F O N C T I O N S
#################################################################################################################################
##############################################################################################################################*/
/* ------------------------------------------------------------------------------------------
                                      Nouveau mot de passe
    ------------------------------------------------------------------------------------------*/
    $('#okNouveauMotDePasse').click(function () {
        $('#nouveauMotDePasseModal').modal('hide'); 
        var login = document.getElementById('login').innerText;  
        var nouvMdp0 = $('#nouvMdp0').val();
        var nouvMdp1 = $('#nouvMdp1').val();
        var nouvMdp2 = $('#nouvMdp2').val(); 
        if (nouvMdp1!=nouvMdp2) 
        {  
            alert("Attention les mots de passes doivent correspondre");
            document.getElementById("nouvMdp1").value="";
            document.getElementById("nouvMdp2").value=""; 
            $('#nouveauMotDePasseModal').modal('show'); 
        } else {
            if (nouvMdp1=="") 
            {
                alert("Attention les mots de passes doivent vide");
                document.getElementById("nouvMdp1").value="";
                document.getElementById("nouvMdp2").value=""; 
                $('#nouveauMotDePasseModal').modal('show'); 
            } else {
                $.get('/getNouveauMDP?login=' + login + '&motDePasse=' + nouvMdp0 + '&nouveau=' + nouvMdp1, function (data, status) { })
            }
        }
      });
 /* ------------------------------------------------------------------------------------------
                                    On calcul la taille de l'image de fond
    ------------------------------------------------------------------------------------------*/
    function taille(id){
        var debug = false;

        var obj = document.getElementById(id);

        var tmp_img = new Image();
        tmp_img.src = obj.src;
        var real_width = tmp_img.width;
        var real_height = tmp_img.height;
        
        if (real_width==0 && real_height==0) {
            tmp_img = new Image();
            tmp_img.src = obj.src;
            real_width = tmp_img.width;
            real_height = tmp_img.height;
        }

        var h = document.getElementById("body").offsetHeight - document.getElementById("entete").offsetHeight;
        var l = document.getElementById("body").offsetWidth;

        if (debug) { console.log("H="+h+"\tL="+l + "\tIH=" +real_height+"\tIL="+real_width) }
        if (real_height > real_width){ // image mode portrait
                if (h>l) { // fond mode portrait
                    if (debug) { console.log("image portrait / fond portrait") }
                    obj.style.height = h + "px";
                    obj.style.width = obj.offsetHeight * (real_width / real_height) + "px";
                } else { // fond mode paysage
                    if (debug) { console.log("image portrait / fond paysage") }
                    obj.style.height = h + "px";
                    obj.style.width = obj.offsetHeight * (real_width / real_height) + "px";
                }            
        } else { // image mode paysage
                if (h>l) { // fond mode portrait
                    if (debug) { console.log("image paysage / fond portrait") }
                    obj.style.width = l + "px";
                    obj.style.height = obj.offsetWidth * (real_height / real_width) + "px";
                } else { // fond mode paysage        
                    if (debug) { console.log("image paysage / fond paysage") }
                    obj.style.width = l + "px";
                    obj.style.height = obj.offsetWidth * (real_height / real_width) + "px";
                }
                if (obj.offsetWidth * (real_height / real_width) > h){
                    if (debug) { console.log("recalcul avec image portrait / fond paysage") }
                    obj.style.height = h + "px";
                    obj.style.width = obj.offsetHeight * (real_width / real_height) + "px";
                }
        }
        /*
        obj.style.width = document.getElementById("leFond").offsetWidth + "px";
        obj.style.height = document.getElementById("leFond").offsetHeight + "px" 
        */
    }
/* ------------------------------------------------------------------------------------------
                                    Format le titre
    ------------------------------------------------------------------------------------------*/
    function formateTitre(format, data){
        var reponse = format;
        while (reponse.indexOf('{') > -1 ){
            var n0 = reponse.indexOf('{');
            var n1 = reponse.indexOf('}');
            var n = reponse.substring(n0 +1, n1);
            var obj = data[n];
            reponse = reponse.substring(0, n0) + obj + reponse.substring(n1+1);            
        }

       // if (reponse.toUpperCase().indexOf("<HTML>") == 0) { return reponse; }

        while (reponse.indexOf('<br>')>-1){
            reponse = reponse.replace("<br>","\n");
        }
        while (reponse.indexOf('<BR>')>-1){
            reponse = reponse.replace("<BR>","\n");
        }
        while (reponse.indexOf('<tab>')>-1){
            reponse = reponse.replace("<tab>","\t");
        }
        while (reponse.indexOf('<TAB>')>-1){
            reponse = reponse.replace("<TAB>","\t");
        }
        return reponse;
    }
/* ------------------------------------------------------------------------------------------
                                    Trouve l'image suivant le format
    ------------------------------------------------------------------------------------------*/
    function imageDuFormat(format){
        for (var n in formatObjets.lesObjets){
            if (formatObjets.lesObjets[n].Nom == format){
                return formatObjets.lesObjets[n].Image;
            }
        }
    }
/* ------------------------------------------------------------------------------------------
                                    PC suivant le format
    ------------------------------------------------------------------------------------------*/
    function PCDuFormat(format){
        for (var n in formatObjets.lesObjets){
            if (formatObjets.lesObjets[n].Nom == format){
                return formatObjets.lesObjets[n].PC;
            }
        }
    }
/* ##############################################################################################################################
################################################################################################################################# 
                                    #####                                       
                                    #        ####   ####  #    # # ######  ####  
                                    #       #    # #    # #   #  # #      #      
                                    #       #    # #    # ####   # #####   ####  
                                    #       #    # #    # #  #   # #           # 
                                    #       #    # #    # #   #  # #      #    # 
                                    #####   ####   ####  #    # # ######  ####  
#################################################################################################################################
##############################################################################################################################*/
    $('#stopPage').click(function () {
        envoyerInfoSocketIO("Masque", document.getElementById("titre").innerText);
        document.getElementById("ampoule").style.visibility = "visible";
        var cookie = "|" + document.getElementById("titre").innerText + "|=interdit; expires=Fri, 01 Jan 2100 00:00:00 GMT; path=/";
        document.cookie = cookie;

        setTimeout(masqueAmpoule, 500);
    });

    $('#toutesLesPages').click(function () {
        envoyerInfoSocketIO("Masque", "supprime");
        document.getElementById("ampoule").style.visibility = "visible";
        var allcookies = document.cookie;
        var lesCookies = allcookies.split(";");
        for (var i=0 ; i <lesCookies.length; i++) {
            if (lesCookies[i].indexOf("|") > -1) {
                var cookie = lesCookies[i] + "; expires=Mon, 26 Oct 2020 00:00:00 GMT; path=/";
                document.cookie = cookie;
            }
        }
        setTimeout(masqueAmpoule, 500);
    });

    function masqueAmpoule() {
        document.getElementById("ampoule").style.visibility = "hidden";
    }
/* ##############################################################################################################################
################################################################################################################################# 
                                F O N C T I O N S     C O N V E R T I O N S  --   X   &    Y   --
#################################################################################################################################
##############################################################################################################################*/
/* ------------------------------------------------------------------------------------------
                                    Convertir X % en X pixel
    ------------------------------------------------------------------------------------------*/
    function xEnPixel(xPourCent){
        var fond = document.getElementById("fond");
        var largeur = fond.offsetWidth
        return Math.trunc(largeur * parseFloat(xPourCent) / 100);  
        // pixel = Largeur * x /100;
    }
/* ------------------------------------------------------------------------------------------
                                    Convertir Y % en Y pixel
    ------------------------------------------------------------------------------------------*/
    function yEnPixel(yPourCent){
        var fond = document.getElementById("fond");
        return Math.trunc(fond.offsetHeight * parseFloat(yPourCent) / 100);
    }
/* ------------------------------------------------------------------------------------------
                                    Convertir X pixel en X %
    ------------------------------------------------------------------------------------------*/
    function xPourCent(xEnPixel){
        var fond = document.getElementById("fond");
        var largeur = fond.offsetWidth
        return parseFloat(xEnPixel) / largeur * 100;
        // x% = pixel / Largeur * 100
    }
/* ------------------------------------------------------------------------------------------
                                    Convertir Y pixel en Y %
    ------------------------------------------------------------------------------------------*/
    function yPourCent(yEnPixel){
        var fond = document.getElementById("fond");
        return yEnPixel / fond.offsetHeight * 100;
    }

/* #############################################################################################
                    #####                                       ### ####### 
                   #        ####   ####  #    # ###### #####     #  #     # 
                   #       #    # #      #   #  #        #       #  #     # 
                    #####  #    # #      ####   #####    #       #  #     # 
                         # #    # #      #  #   #        #       #  #     # 
                         # #    # #      #   #  #        #       #  #     #
                    #####   ####   ####  #    # ######   #      ### ####### 
    #############################################################################################*/
    socket.on('cartographie', function (msg) {
        console.log(msg);
    });

    function envoyerInfoSocketIO(quoi, message){
        socket.emit('cartographie', '{"client":"' + qui + '", "action":"' + quoi + '", "message":"' + message + '"}');
    }


});