$(document).ready(function () {
    var socket = io();
    var indicateurs;
    var indicateursInfos;
    var indicSelct;
    var backgroundImage = "";
    var logo = "";
    var listeObjets;

    /* ------------------------------------------------------------------------------------------
                                      On cache les boutons
    ------------------------------------------------------------------------------------------*/  
    window.onload = function () {        
        chargeConfig();
/*
        var list = document.getElementsByClassName("masque");
        for(var i = list.length - 1; 0 <= i; i--)
        if(list[i] && list[i].parentElement)
        list[i].style.visibility = 'hidden';
        $('#identificationModal').modal('show'); 
*/      
    }
    $('#optionsAide0').click(function () {
        document.getElementById("dossier").innerText = document.getElementById("optionsSecteurs").value;
        $('#gestionModal').modal('hide');
        $('#aide0Modal').modal('show');
    });
    $('#okAide0').click(function () {
        $('#gestionModal').modal('show');
        $('#aide0Modal').modal('hide');
    });
// =====================================
    $('#secteurs').click(function () {
        $.get('/getLectureFichier?fichier=secteurs', function (lesSecteurs, status) {
            var l = document.getElementById("secteursListe");
            l.length=0;
            for (var n in lesSecteurs.Secteurs){
                l.length++;
                l.options[l.length-1].text = lesSecteurs.Secteurs[n].Nom;
            }
        document.getElementById("secteursCorrige").style.display = "none";
        document.getElementById("secteursSupprime").style.display = "none";
        document.getElementById("secteursNom").value = "";
        $('#secteursModal').modal('show');
        });
    });

    $('#secteursListe').click(function () {
        document.getElementById("secteursCorrige").style.display = "block";
        document.getElementById("secteursSupprime").style.display = "block";
        document.getElementById("secteursNom").value = document.getElementById("secteursListe")[document.getElementById("secteursListe").selectedIndex].text;
    });
    $('#secteursCorrige').click(function () {
        document.getElementById("secteursListe")[document.getElementById("secteursListe").selectedIndex].text = document.getElementById("secteursNom").value;
        
    });
    $('#secteursNouveau').click(function () {
        var l = document.getElementById("secteursListe");
        l.length++;
        l.options[l.length-1].text = document.getElementById("secteursNom").value;
        document.getElementById("secteursListe").selectedIndex = l.length-1;
        document.getElementById("secteursCorrige").style.display = "block";
        document.getElementById("secteursSupprime").style.display = "block";
    });
    $('#secteursSupprime').click(function () {
        document.getElementById("secteursListe").remove(document.getElementById("secteursListe").selectedIndex);
        document.getElementById("secteursListe").selectedIndex = -1;
        document.getElementById("secteursCorrige").style.display = "none";
        document.getElementById("secteursSupprime").style.display = "none";
    });
    $('#annulerSecteurs').click(function () {
        $('#secteursModal').modal('hide');
    });
    $('#okSecteurs').click(function () {
        var l = document.getElementById("secteursListe");
        var liste = { "Secteurs": []}
        for (var i=0; i< l.length; i++){
            var nom={ "Nom": l[i].text }
            liste.Secteurs.push(nom);
            var d = config.InfosSecteurs+'\\'+l[i].text;
            while (d.indexOf("\\")>-1) {
                d = d.replace("\\", "/")
            }
            $.get('/getCreerDossier?dossier=' + d, function(reponse, status) {
                // création du dossier dans le répertoire config.InfosSecteurs
            })            
        }
        $.get('/getSauveSecteurs?secteurs=' + JSON.stringify(liste), function (retour, status) {

            $('#secteursModal').modal('hide');
        });
    });
/* ##############################################################################################################################
################################################################################################################################# 
                                            #                              
                                            #        ####   ####  # #    # 
                                            #       #    # #    # # ##   # 
                                            #       #    # #      # # #  # 
                                            #       #    # #  ### # #  # # 
                                            #       #    # #    # # #   ## 
                                            #######  ####   ####  # #    #                                
#################################################################################################################################
##############################################################################################################################/*
    /* ------------------------------------------------------------------------------------------
                                OK sur la boite de dialogue login
    ------------------------------------------------------------------------------------------*/  
    $('#ok').click(function () {
          var identifiant = $('#identifiant').val();
          var motDePasse = $('#motDePasse').val();
          $('#identificationModal').modal('hide');
          //console.log(identifiant + "     " + motDePasse); 
          $.get('/getIdentifie?login=' + identifiant + '&motDePasse=' + motDePasse, function (data, status) { 
                //console.log(data);
                if (!data.reponse) {
                    alert("Identifiant inconnu ou mot de passe faut");
                    $('#identificationModal').modal('show'); 
                }
                else {
                    if (data.admin) {
                        //console.log(data.etat);
                        if (data.etat == "creation"){
                            document.getElementById("login").innerText = identifiant;
                            $('#nouveauMotDePasseModal').modal('show'); 
                        } else {
                            var list = document.getElementsByClassName("masque");
                            for(var i = list.length - 1; 0 <= i; i--)
                            if(list[i] && list[i].parentElement){
                                list[i].style.visibility = 'visible';     
                            }       
                        }        
                    } else {                        
                            alert("Ce compte n'a pas les droits");
                            $('#identificationModal').modal('show');                         
                    }
                }
          })
      });
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
/* ##############################################################################################################################
################################################################################################################################# 
                                               D I A L O G U E   C O M P T E S
#################################################################################################################################
##############################################################################################################################*/
    /* ------------------------------------------------------------------------------------------
                                on ferme la boite de dialogue Comptes
    ------------------------------------------------------------------------------------------*/  
    $('#fermerComptes').click(function () {
        $('#comptesModal').modal('hide');
        //console.clear();
    });
    /* ------------------------------------------------------------------------------------------
                                     on supprime un compte
    ------------------------------------------------------------------------------------------*/
    function onSupprime(qui){
        var n = qui.replace("supprime", "");
        var nom = document.getElementById("compte" + n).innerText;
        var supprime = window.confirm("Supprimer le compte : \n                                        " + nom)
        if (supprime) {
            $.get('/getSupprimeCompte?compte=' + nom, function (data, status) {  
                document.getElementById(n).remove();
            });
        } 
    }
    /* ------------------------------------------------------------------------------------------
                                         on corrige un compte
    ------------------------------------------------------------------------------------------*/
    function onCorrige(qui){
        $('#comptesModal').modal('hide');
        var n = qui.replace("corrige", "");
        var nom = document.getElementById("compte" + n).innerText;
        document.getElementById("Corrigelogin").innerText = nom;
        document.getElementById("corrigeIdentifiant").value = nom;
        $.get('/getlistePages?pages=toutes', function (data, status) {  
            $.get('/getInfosCompte?login='+nom, function (infos, status) {
                //console.log(data);
                //console.log(infos.admin);
                if (infos.admin == "true"){
                    document.getElementById("corrigeAdmin").checked = true;
                } else {
                    document.getElementById("corrigeAdmin").checked = false;
                }
                var papa = document.getElementById("listeMots");
                if (document.getElementById("pere")) {
                    document.getElementById("pere").remove();
                }
                var pere = document.createElement("DIV");
                pere.id="pere";
                papa.appendChild(pere);
                for (const n in data) { 
                    if (infos.pages.indexOf(data[n]+"|")>-1){
                    placeUnePage(data[n], n, true);
                    } else {
                        placeUnePage(data[n], n, false);
                    } 
                }
                document.getElementById("titreCorrige").innerText = "Corrige le compte";
                $('#corrigeModal').modal('show');
            });
        });
    }

    /* ------------------------------------------------------------------------------------------
                                On enregistre la correction ou nouveau compte
    ------------------------------------------------------------------------------------------*/  
    $('#okCorrige').click(function () {
        var loginConforme = true;
        var loginExist = false;
        if (document.getElementById("corrigeIdentifiant").value!="") { 
            $.get('/getCompteExist?login=' + document.getElementById("corrigeIdentifiant").value, function (data, status) { 
                loginExist = data;
                console.log("est ce que ce compte (" + document.getElementById("corrigeIdentifiant").value + ") exist : " + loginExist);
                
                if (loginExist && document.getElementById("corrigeIdentifiant").value!=document.getElementById("Corrigelogin").innerText) { loginConforme = false; }
                console.log(loginConforme);
                if (loginConforme) {                
                    var lesPages = "";
                    var n= 0;
                    while (document.getElementById(n))
                    {
                        if (document.getElementById("input" + n).checked)
                        {
                            lesPages = lesPages + document.getElementById("page" + n).innerText + "|";
                        }
                        n++;
                    }
                    if (document.getElementById("Corrigelogin").innerText!=""){
                        if (document.getElementById("mdp0").value == document.getElementById("mdp1").value) {                
                            $.get('/getCorrectionCompte?newLogin=' + document.getElementById("corrigeIdentifiant").value +
                                                        "&login=" + document.getElementById("Corrigelogin").innerText +
                                                        "&mdp=" + document.getElementById("mdp0").value +
                                                        "&pages=" + lesPages +
                                                        "&admin=" + document.getElementById("corrigeAdmin").checked, function (data, status) { 
                            });
                            $('#corrigeModal').modal('hide');
                            $('#comptesModal').modal('show');
                        } else { alert("Les mots de passe doivent être identiques"); }
                    } else {
                        if (document.getElementById("mdp0").value !="" && document.getElementById("mdp0").value == document.getElementById("mdp1").value) {                
                            $.get('/getNouveauCompte?login=' + document.getElementById("corrigeIdentifiant").value +
                                                    "&mdp=" + document.getElementById("mdp0").value +
                                                    "&pages=" + lesPages +
                                                    "&admin=" + document.getElementById("corrigeAdmin").checked, function (data, status) { 
                            });
                            $('#corrigeModal').modal('hide');
                            $('#comptesModal').modal('show');
                        } else { alert("Les mots de passe doivent être identiques et non vide"); }
                    }
                } else {
                    alert("L'identifiant n'est pas conforme ou exist déjà");
                }
            });
        }
    });

    /* ------------------------------------------------------------------------------------------
                                      Nouveau compte
    ------------------------------------------------------------------------------------------*/
    $('#nouveauCompte').click(function () {
        $.get('/getlistePages?pages=toutes', function (data, status) {  
            document.getElementById("corrigeIdentifiant").value = "";
            document.getElementById("Corrigelogin").innerText = "";
            document.getElementById("mdp0").value ="";
            document.getElementById("corrigeAdmin").checked = false;
            var papa = document.getElementById("listeMots");
            if (document.getElementById("pere")) {
                document.getElementById("pere").remove();
            }
            var pere = document.createElement("DIV");
            pere.id="pere";
            papa.appendChild(pere);
            for (const n in data) {
                    placeUnePage(data[n], n, false);
                }
            document.getElementById("titreCorrige").innerText = "Nouveau compte";
            $('#comptesModal').modal('hide');
            $('#corrigeModal').modal('show');
        });
    });
    /* ------------------------------------------------------------------------------------------
                                On place une page dans la liste à cocher
    ------------------------------------------------------------------------------------------*/
    function placeUnePage(liste, nb, check) {
        var papa = document.getElementById("listeMots");        
        var pere = document.getElementById("pere");
        
        var li = document.createElement("LI");
        var input = document.createElement("INPUT");
        var label = document.createElement("LABEL");        
        li.className = "tmp";
        li.id = nb;
        input.id = "input" + nb;        
        input.type = "checkbox";
        input.className = "largerCheckbox";
        input.tabindex = nb;
        input.checked = false;
        if (check)
        {
            input.checked = true;
        }
        label.innerText = liste;
        label.id = "page" + nb;
        li.appendChild(input);
        li.appendChild(label);
        pere.appendChild(li);
        papa.appendChild(pere);
    };
/* ##############################################################################################################################
################################################################################################################################# 
                                    ######                             
                                    #     #  ####  #    # #####  ####  #    #  ####  
                                    #     # #    # #    #   #   #    # ##   # #      
                                    ######  #    # #    #   #   #    # # #  #  ####  
                                    #     # #    # #    #   #   #    # #  # #      # 
                                    #     # #    # #    #   #   #    # #   ## #    # 
                                    ######   ####   ####    #    ####  #    #  ####  
#################################################################################################################################
##############################################################################################################################*/
    /* ------------------------------------------------------------------------------------------
                                    On clique sur connexion
    ------------------------------------------------------------------------------------------*/  
    $('#connexion').click(function () {
        var list = document.getElementsByClassName("masque");
        for(var i = list.length - 1; 0 <= i; i--)
        if(list[i] && list[i].parentElement)
            list[i].style.visibility = 'hidden';
        document.getElementById("identifiant").value="";
        document.getElementById("motDePasse").value="";
        $('#identificationModal').modal('show'); 
    })
    /* ------------------------------------------------------------------------------------------
                                    On clique sur comptes
    ------------------------------------------------------------------------------------------*/
    $('#comptes').click(function () {
        $('#comptesModal').modal('show');

        var d = document.getElementById("tableauComptes");
        var list = document.getElementsByClassName("aEffacer");
        for(var i = list.length - 1; 0 <= i; i--)
        if(list[i] && list[i].parentElement)
        list[i].parentElement.removeChild(list[i]);
        
        $.get('/getListeComptes?comptes=tous', function (data, status) { 
            var comptes = data['comptes'];

            for(var i=0; i < comptes.length ; i++)
                {
                    //console.log(i + "]      " + comptes[i]['Nom']);
                    
                    var tr = document.createElement('tr');
                    tr.className = "aEffacer";
                    tr.id = i;
                    d.appendChild(tr);                    
                    
                    var td0 = document.createElement('td');
                    td0.className = "aEffacer";
                    tr.appendChild(td0);
                    var div0 = document.createElement('div');
                    div0.id = "compte" + i;
                    var tdText0 = document.createTextNode(comptes[i]['Nom']);                    
                    td0.appendChild(div0);
                    div0.appendChild(tdText0);

                    var td1 = document.createElement('td');
                    td1.className = "aEffacer";
                    tr.appendChild(td1);
                    var tdText1 = document.createTextNode(comptes[i]['Pages']);
                    tdText1.id = "pages" + i;
                    td1.appendChild(tdText1);

                    var imgcorrige = document.createElement('img');
                        imgcorrige.src = "static\\img\\maintenance.png";
                        imgcorrige.id = "corrige" + i;
                        imgcorrige.className = "miniatures";
                        //imgcorrige.setAttribute("onclick","onCorrigeQui('corrige" + i + "');");                        
                        imgcorrige.onclick = function() { onCorrige(this.id); };

                    var imgSupprime = document.createElement('img');
                        imgSupprime.src = "static\\img\\supprime.png";
                        imgSupprime.id = "supprime" + i;
                        imgSupprime.className = "miniatures";
                        //imgSupprime.setAttribute("onclick","onSupprime('supprime" + i + "');");
                        imgSupprime.onclick = function() { onSupprime(this.id); };

                    var imgAdmin = document.createElement('img');
                        if (comptes[i]['Admin']=="true"){
                            imgAdmin.src = "static\\img\\administrateur.png";}
                        else {
                            imgAdmin.src = "static\\img\\utilisateur.png";}
                        imgAdmin.id = "admin" + i;
                        imgAdmin.className = "miniatures";

                    var imgEtat = document.createElement('img');
                        if (comptes[i]['Etat']=="creation"){
                            imgEtat.src = "static\\img\\drapeaurouge.png";}
                        else {
                            imgEtat.src = "static\\img\\drapeauvert.png";}
                        imgEtat.id = "etat" + i;
                        imgEtat.className = "miniatures";

                    var td2 = document.createElement('td');
                    td2.className = "aEffacer";  
                    td2.appendChild(imgAdmin);
                    td2.appendChild(imgEtat);
                    td2.appendChild(imgcorrige);
                    if (i>0){
                        td2.appendChild(imgSupprime);
                    }
                    tr.appendChild(td2);
                }
        })
    });
    /* ------------------------------------------------------------------------------------------
                                    On clique sur pages
    ------------------------------------------------------------------------------------------*/
    $('#pages').click(function () {
        $.get('/getlistePages?pages=toutes', function (data, status) { 
            pagesAffiche(data);
        });
    });

    
/* ##############################################################################################################################
################################################################################################################################# 
                                        ######                              
                                        #     #   ##    ####  ######  ####  
                                        #     #  #  #  #    # #      #      
                                        ######  #    # #      #####   ####  
                                        #       ###### #  ### #           # 
                                        #       #    # #    # #      #    # 
                                        #       #    #  ####  ######  ####  
#################################################################################################################################
##############################################################################################################################*/
    /* ------------------------------------------------------------------------------------------
                                On ferme la boite de dialogue Pages
    ------------------------------------------------------------------------------------------*/
    $('#fermerPages').click(function () {
        $('#pagesModal').modal('hide');
    });
    /* ------------------------------------------------------------------------------------------
                            On enregistre les modifications de la page
    ------------------------------------------------------------------------------------------*/
    $('#enregistrerPage').click(function () {
        var nom = document.getElementById("titreTexte").innerText;
        nom = nom.substring(7);
        nom = nom.substring(0, nom.length-3);

        var nomOk = true;
        if (nom != document.getElementById("titrePage").value){
            $.get('/getPageExist?page=' + document.getElementById("titrePage").value, function (data, status) {
                nomOk = !data;
            });
        }

        if (nomOk) {    
            var d = document.getElementById("listeImagesStock");
            $.get('/getCorrectionPage?nom=' + nom +
                                    '&newNom=' + document.getElementById("titrePage").value +
                                    '&detail=' + document.getElementById("commentairePage").value +
                                    '&image=' + d.options[d.selectedIndex].text, function (data, status) {
                $.get('/getlistePages?pages=toutes', function (data, status) { 
                    pagesAffiche(data);
                });
            });
        }
        
    });
    /* ------------------------------------------------------------------------------------------
                                        On supprime la page
    ------------------------------------------------------------------------------------------*/
    $('#supprimePage').click(function () {
        var nom = document.getElementById("titreTexte").innerText;
        nom = nom.substring(7);
        nom = nom.substring(0, nom.length-3);
        var supprime = window.confirm("Supprimer la page : \n\n                                        " + nom)
        if (supprime) {
            $.get('/getSupprimePage?page=' + nom, function (data, status) { 
                $.get('/getlistePages?pages=toutes', function (data, status) { 
                    pagesAffiche(data);
                });
            });        
        }
    });
    /* ------------------------------------------------------------------------------------------
                                        On charge une image
    ------------------------------------------------------------------------------------------*/
    $("#goImage").click(function(){
    //    $.post('/image', function (data) { });
        //alert("action demandée : enregistre l'image"); //       <----
    });

    $(":submit[name='sauvImg']").on("click", function() {       
        $('#pagesModal').ajaxSubmit({
      
            error: function(xhr) {
        status('Error: ' + xhr.status);
        console.log("erreurfichier");
            },

            success: function(response) {
              console.log("fichiertransferé");
                console.log(response);
            }

        });
        listeLesImagesDeFond();
        return false;
    });
    /* ------------------------------------------------------------------------------------------
                            On clique sur un des onglet (utilisation de classe)
    ------------------------------------------------------------------------------------------*/
    $(document).on('click', '.superOnglet', function () {
        miseAJourPage(this.id);        
    });
    /* ------------------------------------------------------------------------------------------
                                On clique sur une des images de la liste
    ------------------------------------------------------------------------------------------*/
    $('#listeImagesStock').click(function () {
        var d = document.getElementById("listeImagesStock");
        var opt = d.options[d.selectedIndex].text;
        document.getElementById("imageDeFond").src = "static\\Informations\\images\\fondPages\\" + opt;
        taille("imageDeFond");
    });
     /* ------------------------------------------------------------------------------------------
                                Nouvelle Page
    ------------------------------------------------------------------------------------------*/
    $('#nouvellePage').click(function () {
        $.get('/getPageExist?page=nouvelle page', function (data, status) {
            //console.log(data);
            if (data==false){
                    $.get('/getNouvellePage', function (data, status) {
                        $.get('/getlistePages?pages=toutes', function (data, status) { 
                            pagesAffiche(data);
                        });
                    });
                } else {
                    alert("Renommer la page 'nouvelle page'");
                }
        });
    });    
    /* ------------------------------------------------------------------------------------------
                                Mise à jour fonction de l'onglet choisi
    ------------------------------------------------------------------------------------------*/
    function miseAJourPage(id){
        if (id=="defaut"){
            document.getElementById("supprimePage").style.visibility = 'hidden';
            document.getElementById("listeImagesStock").style.visibility = 'hidden';
            document.getElementById("titrePage").style.visibility = 'hidden';
            document.getElementById("titreTexte").style.visibility = 'hidden';
        } else {
            document.getElementById("supprimePage").style.visibility = 'visible';
            document.getElementById("listeImagesStock").style.visibility = 'visible';
            document.getElementById("titrePage").style.visibility = 'visible';
            document.getElementById("titreTexte").style.visibility = 'visible';
        }

        $.get('/getinfoPage?page=' + id, function (data, status) { 
            document.getElementById("titreTexte").innerText = "Titre (" + data.Nom + ") :";
            document.getElementById("titrePage").value = data.Nom;
            document.getElementById("commentairePage").value = data.Détail;
            document.getElementById("imageDeFond").src = "static\\Informations\\images\\fondPages\\" + data.Image;
            taille("imageDeFond");
            var d = document.getElementById("listeImagesStock");
            var nn = -1;
            for (var n=0 ; n<d.length; n++){
                if (d.options[n].text == data.Image){
                    nn = n;
                }
            }
            d.selectedIndex = nn;
        });
    }

    $('#goImage').click(function () {
     //   $.post('/getgoImage');
    });

    function listeLesImagesDeFond(){
        var d = document.getElementById("listeImagesStock");
        $.get('/getListeStockImages', function (data, status) {
            d.length=0;
            for(var i=0; i < data.length ; i++)
                {  
                    d.length++;
                    d.options[d.length-1].text = data[i];
                }
            });
    }
    /* ------------------------------------------------------------------------------------------
                                On affiche les onglets avec liste des images
    ------------------------------------------------------------------------------------------*/
    function pagesAffiche(data){
        //console.log(data);
        var pages = data;

        var ong = document.getElementById("ulOnglets");
        
        listeLesImagesDeFond();

        var list = document.getElementsByClassName("superOngletEffacer");
        for(var i = list.length - 1; 0 <= i; i--)
            if(list[i] && list[i].parentElement)
                list[i].remove();

        for (var n=0 ; n<pages.length; n++){
            if (n>-1){
                var li = document.createElement('li');
                li.className = "superOngletEffacer";
                var a = document.createElement('a');                    
                a.id=data[n];
                a.innerText = a.id;
                a.className = "superOnglet";
                li.appendChild(a);
                ong.appendChild(li);
            }
        }

        $('#pagesModal').modal('show');
        miseAJourPage("defaut");
    };
    /* ------------------------------------------------------------------------------------------
                                    On calcul la taille de l'image de fond
    ------------------------------------------------------------------------------------------*/
    function taille(id){
        var obj = document.getElementById(id);

        var tmp_img = new Image();
        tmp_img.src=obj.src;
        real_width = tmp_img.width;
        real_height = tmp_img.height;
        
        obj.style.width = obj.parentNode.offsetWidth * 1 / 4 + "px";
        obj.style.height = obj.offsetWidth * (real_height / real_width) + "px";
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
                                On ouvre la boite de dialogue Indicateurs
    ------------------------------------------------------------------------------------------*/
    $('#indicateurs').click(function () {
        $.get('/getIndicateurs', function (lesIndicateurs, status) {
            $.get('/getIndicateursInfos', function (lesIndicateursInfos, status) {
                indicateursInfos = lesIndicateursInfos;
                indicateurs = lesIndicateurs;
                
                listeLesIndicateurs();

                var t = document.getElementById("indicateurType");
                t.length=0;
                for(var i=0; i < indicateursInfos.Types.length ; i++)
                    {  
                        t.length++;
                        t.options[t.length-1].text = indicateursInfos.Types[i].Nom;
                    }
                var c = document.getElementById("indicateurCalcul");
                c.length=0;
                for(var i=0; i < indicateursInfos.Calculs.length ; i++)
                    {  
                        c.length++;
                        c.options[c.length-1].text = indicateursInfos.Calculs[i].Nom;
                    }

                metAJourListesImagesIndicateurs();
            
                indicateurEffaceTout();

                $('#indicateurModal').modal('show');
            });
        });
    });
    /* ------------------------------------------------------------------------------------------
                    Met à jour liste images d'indicateurs sous images sélectionnées
    ------------------------------------------------------------------------------------------*/
    function metAJourListesImagesIndicateurs(){
        $.get('/getListeFichiers?dossier=' + "static\\Informations\\images\\indicateurs\\", function (fichiers, status) {
            var vu = document.getElementById("indicateurChoixImageVu");
            var pasVu = document.getElementById("indicateurChoixImagePasVu");
            var a = document.getElementById("indicateurChoixImageA");
            var b = document.getElementById("indicateurChoixImageB");
            var c = document.getElementById("indicateurChoixImageC");
            var l = document.getElementById("indicateurAjouteImageListe");
            vu.length = 0;
            pasVu.length = 0;
            a.length = 0;
            b.length = 0;
            c.length = 0;
            l.length = 0;
            for (var i=0; i<fichiers.length; i++){
                vu.length++;
                pasVu.length++;
                a.length++;
                b.length++;
                c.length++;
                l.length++;
                vu.options[i].text = fichiers[i].split(">")[0];
                pasVu.options[i].text = fichiers[i].split(">")[0];
                a.options[i].text = fichiers[i].split(">")[0];
                b.options[i].text = fichiers[i].split(">")[0];
                c.options[i].text = fichiers[i].split(">")[0];
                l.options[i].text = fichiers[i].split(">")[0];
            }
        });
    }

    $('#indicateurListeAspect').change(function () {
        listeLesIndicateurs();
    });

    function listeLesIndicateurs(){
        var d = document.getElementById("indicateurListe");
        var dd = document.getElementById("indicateurVariableUtilisee");
            dd.length = 0;            
            d.length=0;
            if (document.getElementById("indicateurListeAspect").selectedIndex < 2) {
                for(var i=0; i < indicateurs.Variables.length ; i++)
                    {
                        d.length++;
                        d.options[d.length-1].text = "\\/ " + indicateurs.Variables[i].Titre;
                        dd.length++;
                        dd.options[dd.length-1].text = indicateurs.Variables[i].Titre;
                    }
            }
            if (document.getElementById("indicateurListeAspect").selectedIndex == 0 || document.getElementById("indicateurListeAspect").selectedIndex == 2) {
                for(var i=0; i < indicateurs.Flags.length ; i++)
                    {
                        d.length++;
                        d.options[d.length-1].text = indicateurs.Flags[i].Titre;
                    }
                }
        d.selectedIndex = -1;
        hautEtBas();
    }
    /* ------------------------------------------------------------------------------------------
                                          Clique sur efface tous les champs
    ------------------------------------------------------------------------------------------*/
    $('#indicateurEfface').click(function () {
        indicateurEffaceTout();
    });
    /* ------------------------------------------------------------------------------------------
                                          On efface tout
    ------------------------------------------------------------------------------------------*/
    $('#indicateurEfface').click(function () {
        indicateurEffaceTout();
    });
    /* ------------------------------------------------------------------------------------------
                                          
    ------------------------------------------------------------------------------------------*/
    function indicateurEffaceTout(){
        document.getElementById("indicateurNom").value = "";
        document.getElementById("indicateurDetail").value = "";
        document.getElementById("indicateurDossier").value = "";
        document.getElementById("indicateurFichier").value = "";
        document.getElementById("IndicateurHostname").checked = true;
        document.getElementById("indicateurValeurA").value = "";
        document.getElementById("indicateurValeurB").value = "";
        document.getElementById("indicateurValeurC").value = "";
        document.getElementById("indicateurChoixImageVu").selectedIndex = -1;
        document.getElementById("indicateurChoixImagePasVu").selectedIndex = -1;
        document.getElementById("indicateurChoixImageA").selectedIndex = -1;
        document.getElementById("indicateurChoixImageB").selectedIndex = -1;
        document.getElementById("indicateurChoixImageC").selectedIndex = -1;
        document.getElementById("indicateurImageVu").src = "";
        document.getElementById("indicateurImagePasVu").src = "";
        document.getElementById("indicateurImageA").src = "";
        document.getElementById("indicateurImageB").src = "";
        document.getElementById("indicateurImageC").src = "";
        document.getElementById("indicateurImageVu").alt = "";
        document.getElementById("indicateurImagePasVu").alt = "";
        document.getElementById("indicateurImageA").alt = "";
        document.getElementById("indicateurImageB").alt = "";
        document.getElementById("indicateurImageC").alt = "";
        document.getElementById("indicateurCouleurA").value = "#0000FF";
        document.getElementById("indicateurCouleurB").value = "#FFFFFF";
        document.getElementById("indicateurCouleurC").value = "#FF0000";
        document.getElementById("indicateurSeparateur").value = "";
        document.getElementById("indicateurOnglet").value = "";
        document.getElementById("indicateurNumeroHostname").value = "";
        document.getElementById("indicateurNumeroARecuperer").value = "";
        document.getElementById("IndicateurHostname").checked = true;
        

        document.getElementById("indicateurValeurs").style.display = "block";
        document.getElementById("indicateurTypeRecherche").style.display = "none";
        document.getElementById("indicateurBanqueImages").style.display = "none";
        document.getElementById("indicateurPasHostname").style.display = "none";
        document.getElementById("indicateurSupprimeImageContient").style.display = "none";

        typeChange();

        document.getElementById("indicateurListe").selectedIndex = -1;
        hautEtBas();
        etatVariableChange();
    }
    /* ------------------------------------------------------------------------------------------
                                          
    ------------------------------------------------------------------------------------------*/
    $('#IndicateurHostname').click(function () {
        if (document.getElementById("IndicateurHostname").checked) {
            document.getElementById("indicateurPasHostname").style.display = "none";
        } else {            
            var dd = document.getElementById("indicateurVariableUtilisee");
            dd.length = 0;
            for(var i=0; i < indicateurs.Variables.length ; i++)
                {  
                    dd.length++;
                    dd.options[dd.length-1].text = indicateurs.Variables[i].Titre;
                }
            document.getElementById("indicateurPasHostname").style.display = "block";
        }
    });    
    /* ------------------------------------------------------------------------------------------
                                          Onglet 1
    ------------------------------------------------------------------------------------------*/
    $('#indicateur1').click(function () {
        document.getElementById("indicateurValeurs").style.display = "block";
        document.getElementById("indicateurTypeRecherche").style.display = "none";
        document.getElementById("indicateurBanqueImages").style.display = "none";
    });
    /* ------------------------------------------------------------------------------------------
                                          Onglet 2
    ------------------------------------------------------------------------------------------*/
    $('#indicateur2').click(function () {
        document.getElementById("indicateurValeurs").style.display = "none";
        document.getElementById("indicateurTypeRecherche").style.display = "block";
        document.getElementById("indicateurBanqueImages").style.display = "none";
    });
    /* ------------------------------------------------------------------------------------------
                                    Onglet 3     Banque d'images
    ------------------------------------------------------------------------------------------*/
    $('#indicateur3').click(function () {
        document.getElementById("indicateurValeurs").style.display = "none";
        document.getElementById("indicateurTypeRecherche").style.display = "none";
        document.getElementById("indicateurBanqueImages").style.display = "block";

        listeImagesIndicateurs();
    });
    /* ------------------------------------------------------------------------------------------
                                          
    ------------------------------------------------------------------------------------------*/
    function listeImagesIndicateurs(){
        $.get('/getListeFichiers?dossier=' + "static\\Informations\\images\\indicateurs\\", function (fichiers, status) {
            var p = document.getElementsByName("indicateurImageBanque");
            for(var i = p.length - 1; 0 <= i; i--) {
                p[i].remove();
            }
            
            for (var n=0; n<fichiers.length; n++){
                var im = document.createElement('img');
                im.name = "indicateurImageBanque";
                var f = fichiers[n].split('>')[0];                
                im.id = f;
                im.title = f;
                im.alt = f;
                im.src = "static\\Informations\\images\\indicateurs\\" + f;
                im.style.width = '48px';
                im.style.height = '48px';
                im.onclick = function() {onclickIndicateurBanqueImages(this); }
                document.getElementById("indicateurListeImageBanque").appendChild(im);
            }

            document.getElementById("indicateurListeBanqueSelection").src = "";
            document.getElementById("indicateurListeBanqueSelection").title = "";
            document.getElementById("indicateurListeBanqueSelection").alt = "";
            document.getElementById("indicateurSupprimeImageBanque").style.display = "none";
        });
    }
    /* ------------------------------------------------------------------------------------------
                                        On change de type
    ------------------------------------------------------------------------------------------*/
    $('#indicateurType').change(function () {
        var calcul = document.getElementById("indicateurCalcul");
        var source = document.getElementById("indicateurType");
        
        calcul.length=0;
        for(var i=0; i < indicateursInfos.Calculs.length ; i++)
            {  
                if (indicateursInfos.Calculs[i].UtiliseAvec.indexOf(indicateursInfos.Types[source.selectedIndex].ID) > -1) {
                    calcul.length++;
                    calcul.options[calcul.length-1].text = indicateursInfos.Calculs[i].Nom;
                }
            }
        typeChange();
    });
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
                                Le type (source) d'indicateur viens de changer
    ------------------------------------------------------------------------------------------*/
    function typeChange() {
        document.getElementById("indicateurTxt").style.display = "none";
        document.getElementById("indicateurXls").style.display = "none";
        document.getElementById("indicateurTextExcel").style.display = "none";
        document.getElementById("indicateurTextConient").style.display = "none";        
        document.getElementById("aRecuperer").style.display = "none";
        document.getElementById("indicateur1").style.display = "BLOCK";
        document.getElementById("indicateurValeurs").style.display = "BLOCK";
        document.getElementById("indicateurTypeRecherche").style.display = "none";
        document.getElementById("indicateurImages").style.display = "none";
        document.getElementById("indicateurCouleurs").style.display = "none";

        var calcul = document.getElementById("indicateurCalcul");
        var source = document.getElementById("indicateurType");
        document.getElementById("indicateurTypeDetail").innerText =   detail(indicateursInfos.Types[source.selectedIndex].Détail);
        document.getElementById("indicateurCalculDetail").innerText = detail(indicateursInfos.Calculs[calcul.selectedIndex].Détail);

        switch (indicateursInfos.Types[source.selectedIndex].ID) {
            case "DansFichierTxt" : document.getElementById("indicateurTxt").style.display = "block";
                                    document.getElementById("indicateurTextExcel").style.display = "block";
                                    switch (indicateursInfos.Calculs[calcul.selectedIndex].ID){
                                        case "EcartAnnee" : document.getElementById("aRecuperer").style.display = "BLOCK";
                                                            document.getElementById("indicateurImages").style.display = "BLOCK";
                                                break;
                                        case "EcartMois" : document.getElementById("aRecuperer").style.display = "BLOCK";
                                                           document.getElementById("indicateurImages").style.display = "BLOCK";
                                                break;
                                        case "EcartJour" : document.getElementById("aRecuperer").style.display = "BLOCK";
                                                           document.getElementById("indicateurImages").style.display = "BLOCK";
                                                break;
                                        case "Valeur" : document.getElementById("indicateurCouleurs").style.display = "BLOCK";
                                                        document.getElementById("indicateurCouleurs").style.display = "BLOCK";
                                                break;
                                        case "Contient" : document.getElementById("indicateurTextConient").style.display = "BLOCK";
                                                          document.getElementById("indicateurTxt").style.display = "BLOCK";
                                                          document.getElementById("aRecuperer").style.display = "BLOCK";
                                                          document.getElementById("indicateur1").style.display = "none";
                                                          document.getElementById("indicateurValeurs").style.display = "none";
                                                          document.getElementById("indicateurTypeRecherche").style.display = "BLOCK";
                                                break;
                                        case "Occurences" : document.getElementById("indicateurCouleurs").style.display = "BLOCK";
                                                break;
                                    }
                        break;
            case "DansFichierXls" : document.getElementById("indicateurXls").style.display = "block";
                                    document.getElementById("indicateurTextExcel").style.display = "block";
                                    switch (indicateursInfos.Calculs[calcul.selectedIndex].ID){
                                        case "EcartAnnee" : document.getElementById("aRecuperer").style.display = "BLOCK";
                                                            document.getElementById("indicateurImages").style.display = "BLOCK";
                                                break;
                                        case "EcartMois" : document.getElementById("aRecuperer").style.display = "BLOCK";
                                                           document.getElementById("indicateurImages").style.display = "BLOCK";
                                                break;
                                        case "EcartJour" : document.getElementById("aRecuperer").style.display = "BLOCK";
                                                           document.getElementById("indicateurImages").style.display = "BLOCK";
                                                break;
                                        case "Valeur" : document.getElementById("aRecuperer").style.display = "BLOCK";
                                                        document.getElementById("indicateurCouleurs").style.display = "BLOCK";
                                                break;
                                        case "Contient" : document.getElementById("indicateurTextConient").style.display = "BLOCK";
                                                          document.getElementById("indicateurXls").style.display = "BLOCK";
                                                          document.getElementById("aRecuperer").style.display = "BLOCK";
                                                          document.getElementById("indicateur1").style.display = "none";
                                                          document.getElementById("indicateurValeurs").style.display = "none";
                                                          document.getElementById("indicateurTypeRecherche").style.display = "BLOCK";
                                                break;
                                        case "Occurences" : document.getElementById("indicateurCouleurs").style.display = "BLOCK";
                                                break;
                                    }
                        break;
            case "FichierPresent" : 
                                    switch (indicateursInfos.Calculs[calcul.selectedIndex].ID){
                                        case "EcartAnnee" : document.getElementById("aRecuperer").style.display = "BLOCK";
                                                            document.getElementById("indicateurImages").style.display = "BLOCK";
                                                break;
                                        case "EcartMois" : document.getElementById("aRecuperer").style.display = "BLOCK";
                                                           document.getElementById("indicateurImages").style.display = "BLOCK";
                                                break;
                                        case "EcartJour" : document.getElementById("aRecuperer").style.display = "BLOCK";
                                                           document.getElementById("indicateurImages").style.display = "BLOCK";
                                                break;
                                        case "Occurences" : document.getElementById("indicateurCouleurs").style.display = "BLOCK";
                                                break;
                                    }
                        break
        }
    };
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
    /* ------------------------------------------------------------------------------------------
                                        On change de type
    ------------------------------------------------------------------------------------------*/
    $('#indicateurCalcul').change(function () {
        typeChange();        
    });
    /* ------------------------------------------------------------------------------------------
                                       Détail reformulé
    ------------------------------------------------------------------------------------------*/
    function detail(detail){
         detail = detail.replace('~dossier~', document.getElementById("indicateurDossier").value);
         detail = detail.replace('~fichier~', document.getElementById("indicateurFichier").value);
         var ext = document.getElementById("indicateurFichier").value.split('.');
         var n = ext.length -1;
         if (ext.length>0){
         detail = detail.replace('~extention~', '*.' + ext[n]);
         }
         return detail
    }
    /* ------------------------------------------------------------------------------------------
                                        Le Dossier change
    ------------------------------------------------------------------------------------------*/
    $('#indicateurDossier').change(function () {
        typeChange();
    });
    /* ------------------------------------------------------------------------------------------
                                        Le Fichier change
    ------------------------------------------------------------------------------------------*/
    $('#indicateurFichier').change(function () {
        typeChange();
    });
    /* ------------------------------------------------------------------------------------------
                                          
    ------------------------------------------------------------------------------------------*/
    function hautEtBas(){
        var d = document.getElementById("indicateurListe");
            var nv = -1;
            var ni = -1;
            for (var m=0; m <= indicSelct; m++){
                if (d.options[m].text.indexOf("\\/ ") > -1) { nv++; } else { ni++; }
            }
        var n = document.getElementById("indicateurListe").selectedIndex;

        if (n>-1) {
                if (d.options[n].text.indexOf("\\/ ") > -1) {
                    if (nv > 0) {
                        document.getElementById("indicateurMonte").style.display = "block";
                    } else {
                        document.getElementById("indicateurMonte").style.display = "none";
                    }

                    if (nv < indicateurs.Variables.length-1 & nv > -1) {
                        document.getElementById("indicateurDescend").style.display = "block";
                    } else {
                        document.getElementById("indicateurDescend").style.display = "none";
                    }
                } else {
                    if (ni > 0) {
                        document.getElementById("indicateurMonte").style.display = "block";
                    } else {
                        document.getElementById("indicateurMonte").style.display = "none";
                    }

                    if (ni < indicateurs.Flags.length-1 & ni > -1) {
                        document.getElementById("indicateurDescend").style.display = "block";
                    } else {
                        document.getElementById("indicateurDescend").style.display = "none";
                    }
                }
            } else {
                document.getElementById("indicateurMonte").style.display = "none";
                document.getElementById("indicateurDescend").style.display = "none";
            }

        if (n > -1) {
            document.getElementById("indicateurCorrige").style.display = "block";
            document.getElementById("indicateurSupprime").style.display = "block";
            document.getElementById("indicateurDuplique").style.display = "block";
        } else {
            document.getElementById("indicateurCorrige").style.display = "none";
            document.getElementById("indicateurSupprime").style.display = "none";
            document.getElementById("indicateurDuplique").style.display = "none";
        }
        
    }
    /* ------------------------------------------------------------------------------------------
                                On clique sur un indicateur de la liste
    ------------------------------------------------------------------------------------------*/
    $('#indicateurListe').change(function () {
        indicateurAffiche(document.getElementById("indicateurListe").selectedIndex);        
        hautEtBas();
        typeChange();
    });
    /* ------------------------------------------------------------------------------------------
                                On affiche l'indicateur sélectionné
    ------------------------------------------------------------------------------------------*/
    function indicateurAffiche(n){
        indicSelct = n;
        var d = document.getElementById("indicateurListe");

        var nv = -1;
        var ni = -1;
        for (var m=0; m <= n; m++){
            if (d.options[m].text.indexOf("\\/ ") > -1) { nv++; } else { ni++; }
        }
        
        var indic;
        if (d.options[n].text.indexOf("\\/ ") > -1) {
            indic = indicateurs.Variables[nv];
            document.getElementById("IndicateurVariable").checked = true;
        } else {
            indic = indicateurs.Flags[ni];
            document.getElementById("IndicateurVariable").checked = false;
        }
        etatVariableChange();

        document.getElementById("indicateurNom").value = indic.Titre;
        document.getElementById("indicateurDetail").value = indic.Détail;
        document.getElementById("indicateurDossier").value = indic.Chemin;
        document.getElementById("indicateurFichier").value = indic.Fichier;

        document.getElementById("IndicateurHostname").checked = true;
        document.getElementById("indicateurPasHostname").style.display = "none";
        if (indic.HostnameOuVariable != null && indic.HostnameOuVariable != "~hostname~") {
                document.getElementById("IndicateurHostname").checked = false;
                document.getElementById("indicateurVariableUtilisee").value = indic.HostnameOuVariable;
                document.getElementById("indicateurPasHostname").style.display = "block";            
            }
        if (d.options[n].text.indexOf("\\/ ") == -1) {
            document.getElementById("indicateurValeurA").value = indic.Calcul.ValeurA;
            document.getElementById("indicateurValeurB").value = indic.Calcul.ValeurB;
            document.getElementById("indicateurValeurC").value = indic.Calcul.ValeurC;
        }
        try {
            if (indic.Vu != "") {
                document.getElementById("indicateurImageVu").src = "static\\Informations\\images\\indicateurs\\" + indic.Vu;
                document.getElementById("indicateurImageVu").title = indic.Vu;
            }
            if (indic.PasVu != "") {
                document.getElementById("indicateurImagePasVu").src = "static\\Informations\\images\\indicateurs\\" + indic.PasVu;
                document.getElementById("indicateurImagePasVu").title = indic.PasVu;
            }
        } catch {}
        var ivu =document.getElementById("indicateurChoixImageVu");
        ivu.selectedIndex = -1;
        document.getElementById("indicateurChoixImagePasVu").selectedIndex = -1;
        for (var i=0 ; i<ivu.options.length; i++){
            if (indic.Vu.toUpperCase() == ivu.options[i].text.toUpperCase()) {
                ivu.selectedIndex = i;
            }
            if (indic.PasVu.toUpperCase() == ivu.options[i].text.toUpperCase()) {
                document.getElementById("indicateurChoixImagePasVu").selectedIndex = i;
            }
        }
        if (d.options[n].text.indexOf("\\/ ") == -1) {
            try {
                if (indic.Calcul.ImageEgaleA != "") {
                    document.getElementById("indicateurImageA").src = "static\\Informations\\images\\indicateurs\\" + indic.Calcul.ImageEgaleA;
                    document.getElementById("indicateurImageA").title = indic.Calcul.ImageEgaleA;
                    document.getElementById("indicateurChoixImageA").selectedIndex = -1;
                    for (var i=0 ; i<ivu.options.length; i++){
                        if (indic.Calcul.ImageEgaleA.toUpperCase() == ivu.options[i].text.toUpperCase()) {
                            document.getElementById("indicateurChoixImageA").selectedIndex = i;
                        }
                    }
                }
                if (indic.Calcul.ImageEgaleB != "") {
                    document.getElementById("indicateurImageB").src = "static\\Informations\\images\\indicateurs\\" + indic.Calcul.ImageEgaleB;
                    document.getElementById("indicateurImageB").title = indic.Calcul.ImageEgaleB;
                    document.getElementById("indicateurChoixImageB").selectedIndex = -1;
                    for (var i=0 ; i<ivu.options.length; i++){
                        if (indic.Calcul.ImageEgaleB.toUpperCase() == ivu.options[i].text.toUpperCase()) {
                            document.getElementById("indicateurChoixImageB").selectedIndex = i;
                        }
                    }
                }
                if (indic.Calcul.ImageSuperieurC != "") {
                    document.getElementById("indicateurImageC").src = "static\\Informations\\images\\indicateurs\\" + indic.Calcul.ImageSuperieurC;
                    document.getElementById("indicateurImageC").title = indic.Calcul.ImageSuperieurC;
                    document.getElementById("indicateurChoixImageC").selectedIndex = -1;
                    for (var i=0 ; i<ivu.options.length; i++){
                        if (indic.Calcul.ImageSuperieurC.toUpperCase() == ivu.options[i].text.toUpperCase()) {
                            document.getElementById("indicateurChoixImageC").selectedIndex = i;
                        }
                    }
                }
            } catch {}
            try {
                var r = indic.Calcul.CouleurInfEgaleA.replace("#", "");
            document.getElementById("indicateurCouleurA").value = "#" + r;
                var g = indic.Calcul.CouleurInfEgaleB.replace("#", "");
            document.getElementById("indicateurCouleurB").value = "#" + g;
                var b = indic.Calcul.CouleurSuperieurC.replace("#", "");
            document.getElementById("indicateurCouleurC").value = "#" + b;
            } catch {}
        }

        var im = indic.Calcul.Contient.split("/");
        var o = document.getElementById("indicateurListeImagesContient");
        o.length=0;
        for(var i=0; i < im.length ; i++)
        {
            o.length++;
            o.options[o.length-1].text = im[i];
        }

        if (d.options[n].text.indexOf("\\/ ") > -1) {
            document.getElementById("indicateurValeurs").style.display = "none";
            document.getElementById("indicateur1").style.display = "none";
            document.getElementById("indicateurTypeRecherche").style.display = "block";
        } else {
            document.getElementById("indicateurValeurs").style.display = "block";
            document.getElementById("indicateur1").style.display = "block";
            document.getElementById("indicateurTypeRecherche").style.display = "none";
            document.getElementById("indicateurBanqueImages").style.display = "none";
        }

        document.getElementById("indicateurSeparateur").value = indic.Texte.Separateur;
        document.getElementById("indicateurOnglet").value = indic.Excel.Onglet;
        document.getElementById("indicateurNumeroHostname").value = indic.Excel.HostnameColonne;
        document.getElementById("indicateurNumeroARecuperer").value = indic.Calcul.ColonneResultat;

        for (var n=0; n<indicateursInfos.Types.length; n++){
            if (indicateursInfos.Types[n].ID == indic.Type) {
                document.getElementById("indicateurType").selectedIndex = n;
            }
        }

        typeChange();

        for (var m=0; m<indicateursInfos.Calculs.length; m++){
            if (indicateursInfos.Calculs[m].ID == indic.Calcul.TypeCalcul) {
                document.getElementById("indicateurCalcul").selectedIndex = m;                
            }
        }

        if (document.getElementById("indicateur1").style.display == "none") {
            document.getElementById("indicateurValeurs").style.display = "none";
            document.getElementById("indicateurTypeRecherche").style.display = "block";
        }
    }
    /* ------------------------------------------------------------------------------------------
                                On clique sur Variable
    ------------------------------------------------------------------------------------------*/
    $('#IndicateurVariable').change(function () {
        etatVariableChange();
    });

    function etatVariableChange() {
        if (document.getElementById("IndicateurVariable").checked) {
            document.getElementById("indicateurNom").style.backgroundColor = document.getElementById("IndicateurVariableBoxed").style.backgroundColor;
            document.getElementById("indicateurDetail").style.backgroundColor = document.getElementById("IndicateurVariableBoxed").style.backgroundColor;
        } else {
            document.getElementById("indicateurNom").style.backgroundColor = document.getElementById("indicateurFichier").style.backgroundColor;
            document.getElementById("indicateurDetail").style.backgroundColor = document.getElementById("indicateurFichier").style.backgroundColor;
        }
    };
    /* ------------------------------------------------------------------------------------------
                                On clique sur une image de la liste contient
    ------------------------------------------------------------------------------------------*/
    $('#indicateurListeImagesContient').click(function () {
        document.getElementById("indicateurImageListeContient").src = "static\\Informations\\images\\indicateurs\\" + document.getElementById("indicateurListeImagesContient").value;
        document.getElementById("indicateurSupprimeImageContient").style.display = "block";
    });
    /* ------------------------------------------------------------------------------------------
                                Supprime image de la liste Contient
    ------------------------------------------------------------------------------------------*/
    $('#indicateurSupprimeImageContient').click(function () {
        document.getElementById("indicateurImageListeContient").src = "";
        var o = document.getElementById("indicateurListeImagesContient");
        o.options[o.selectedIndex].remove()
    });
    /* ------------------------------------------------------------------------------------------
                                On ajoute une image dans la liste contient
    ------------------------------------------------------------------------------------------*/
    $('#indicateurAjouteImageContient').click(function () {
        l = document.getElementById("indicateurListeImagesContient");
        l.length++;
        l.options[l.length - 1].text = l = document.getElementById("indicateurAjouteImageListe").value;
    });
    /* ------------------------------------------------------------------------------------------
                                On importe une image dans le dossier
    ------------------------------------------------------------------------------------------*/
    $(":submit[name='sauvImgIndicateur']").on("click", function() {       
        $('#indicateurModal').ajaxSubmit({
        
            error: function(xhr) {
        status('Error: ' + xhr.status);
        console.log("erreur fichier");
            },

            success: function(response) {
                console.log("fichier transferé");
                console.log(response);
                listeImagesIndicateurs();
            }

        });
        metAJourListesImagesIndicateurs();
        return false;
    });
    /* ------------------------------------------------------------------------------------------
                                On clique sur une image de la banque
    ------------------------------------------------------------------------------------------*/
    function onclickIndicateurBanqueImages(image){
        var i = document.getElementById(image.id);
        document.getElementById("indicateurListeBanqueSelection").src = "static\\Informations\\images\\indicateurs\\" + i.id;
        document.getElementById("indicateurListeBanqueSelection").title = i.title;
        document.getElementById("indicateurListeBanqueSelection").alt = i.alt;
        document.getElementById("indicateurSupprimeImageBanque").style.display = "block";
    }
    /* ------------------------------------------------------------------------------------------
                                On supprime une image de la banque
    ------------------------------------------------------------------------------------------*/
    $('#indicateurSupprimeImageBanque').click(function () {
        var i = document.getElementById("indicateurListeBanqueSelection");
        $.get('/getSupprimeFichiers?fichier=' + "static\\Informations\\images\\indicateurs\\" + i.title, function (fichiers, status) {
            listeImagesIndicateurs();
            metAJourListesImagesIndicateurs();
        });
    });
    /* ------------------------------------------------------------------------------------------
                                    On choisit l'image de VU
    ------------------------------------------------------------------------------------------*/
    $('#indicateurChoixImageVu').change(function () {
        document.getElementById("indicateurImageVu").src = "static\\Informations\\images\\indicateurs\\" + document.getElementById("indicateurChoixImageVu").value;
        document.getElementById("indicateurImageVu").title = document.getElementById("indicateurChoixImageVu").value;
    });
    /* ------------------------------------------------------------------------------------------
                                    On choisit l'image de PAS VU
    ------------------------------------------------------------------------------------------*/
    $('#indicateurChoixImagePasVu').change(function () {
        document.getElementById("indicateurImagePasVu").src = "static\\Informations\\images\\indicateurs\\" + document.getElementById("indicateurChoixImagePasVu").value;
        document.getElementById("indicateurImagePasVu").title = document.getElementById("indicateurChoixImagePasVu").value;
    });
    /* ------------------------------------------------------------------------------------------
                                    On choisit l'image de VALEUR A
    ------------------------------------------------------------------------------------------*/
    $('#indicateurChoixImageA').change(function () {
        document.getElementById("indicateurImageA").src = "static\\Informations\\images\\indicateurs\\" + document.getElementById("indicateurChoixImageA").value;
        document.getElementById("indicateurImageA").title = document.getElementById("indicateurChoixImageA").value;
    });
    /* ------------------------------------------------------------------------------------------
                                    On choisit l'image de VALEUR B
    ------------------------------------------------------------------------------------------*/
    $('#indicateurChoixImageB').change(function () {
        document.getElementById("indicateurImageB").src = "static\\Informations\\images\\indicateurs\\" + document.getElementById("indicateurChoixImageB").value;
        document.getElementById("indicateurImageB").title = document.getElementById("indicateurChoixImageB").value;
    });    
    /* ------------------------------------------------------------------------------------------
                                    On choisit l'image de VALEUR C
    ------------------------------------------------------------------------------------------*/
    $('#indicateurChoixImageC').change(function () {
        document.getElementById("indicateurImageC").src = "static\\Informations\\images\\indicateurs\\" + document.getElementById("indicateurChoixImageC").value;
        document.getElementById("indicateurImageC").title = document.getElementById("indicateurChoixImageC").value;
    });
    /* ------------------------------------------------------------------------------------------
                                        Variable indicateur
    ------------------------------------------------------------------------------------------*/
    function variableIndicateur() {
        var contient = "";
        var o = document.getElementById("indicateurListeImagesContient");
        if (o.options.length > 0) {
            for(var i=0; i < o.options.length ; i++){
                if (contient != "") { contient = contient + "/"; }
                contient = contient +o.options[i].value;
            }
        }
        var type = "DansFichierTxt";
        type = indicateursInfos.Types[document.getElementById("indicateurType").selectedIndex].ID;
        
        var typeCalcul = "Contient";
        typeCalcul = indicateursInfos.Calculs[document.getElementById("indicateurCalcul").selectedIndex].ID;
        console.log(typeCalcul)
        var hostname;
        if (document.getElementById("IndicateurHostname").checked) {
            hostname = "hostname";
        } else {
            hostname = document.getElementById("indicateurVariableUtilisee").value;
        }

        var variableHostname
        if (document.getElementById("IndicateurHostname").checked) {
            variableHostname = "~hostname~";
        } else {
            variableHostname = document.getElementById("indicateurVariableUtilisee").value;
        }
        var calcul
        if (document.getElementById("IndicateurVariable").checked) {
            calcul =
                    {
                        "Contient": contient,
                        "ColonneResultat": document.getElementById("indicateurNumeroARecuperer").value,
                        "TypeCalcul": typeCalcul
                    }
        } else {
            calcul = 
            {
                "ValeurA": document.getElementById("indicateurValeurA").value,
                "ValeurB": document.getElementById("indicateurValeurB").value,
                "ValeurC": document.getElementById("indicateurValeurC").value,
                "ImageEgaleA": document.getElementById("indicateurImageA").title,
                "ImageEgaleB": document.getElementById("indicateurImageB").title,
                "ImageSuperieurC": document.getElementById("indicateurImageC").title,
                "CouleurInfEgaleA": document.getElementById("indicateurCouleurA").value.replace("#",''),
                "CouleurInfEgaleB": document.getElementById("indicateurCouleurB").value.replace("#",''),
                "CouleurSuperieurC": document.getElementById("indicateurCouleurC").value.replace("#",''),
                "Contient": contient,
                "ColonneResultat": document.getElementById("indicateurNumeroARecuperer").value,
                "TypeCalcul": typeCalcul
            }
        }

        var variable = {
                "Titre": document.getElementById("indicateurNom").value,
                "Détail": document.getElementById("indicateurDetail").value,
                "Chemin": document.getElementById("indicateurDossier").value,
                "Fichier": document.getElementById("indicateurFichier").value,
                "Vu": document.getElementById("indicateurImageVu").title,
                "HostnameOuVariable": variableHostname,
                "PasVu": document.getElementById("indicateurImagePasVu").title,
                "variable": hostname,
                "Type": type,
                "Calcul": calcul,
                "Texte": 
                    {
                        "Separateur": document.getElementById("indicateurSeparateur").value
                    },
                "Excel": 
                    {
                        "Onglet": 'document.getElementById("indicateurOnglet").value',
                        "HostnameColonne": document.getElementById("indicateurNumeroHostname").value
                    }
            };        
        return variable;
    }
    /* ------------------------------------------------------------------------------------------
                                        Nouvel indicateur
    ------------------------------------------------------------------------------------------*/
    $('#indicateurNouveau').click(function () {
        if (document.getElementById("IndicateurVariable").checked) {
            indicateurs.Variables.push(variableIndicateur());
        } else {
            indicateurs.Flags.push(variableIndicateur());
        }        
        listeLesIndicateurs();
        indicateurEffaceTout();
    });
    /* ------------------------------------------------------------------------------------------
                                        Corrige l'indicateur
    ------------------------------------------------------------------------------------------*/
    $('#indicateurCorrige').click(function () {        
        var d = document.getElementById("indicateurListe");
        var nv = -1;
        var ni = -1;
        for (var m=0; m <= indicSelct; m++){
            if (d.options[m].value.indexOf("\\/ ") > -1) { nv++; } else { ni++; }
        }
        
        if (d.options[indicSelct].text.indexOf("\\/ ") > -1) {
                if (document.getElementById("IndicateurVariable").checked){
                    indicateurs.Variables[nv] = variableIndicateur();
                } else {
                    indicateurs.Flags.push(variableIndicateur());
                    indicateurs.Variables.splice(nv,1);
                }
        } else {
                if (document.getElementById("IndicateurVariable").checked){
                    indicateurs.Variables.push(variableIndicateur());                     
                    indicateurs.Flags.splice(ni,1);
                } else {
                    indicateurs.Flags[ni] = variableIndicateur();
                }
        }
        listeLesIndicateurs();
        etatVariableChange()
    });
    /* ------------------------------------------------------------------------------------------
                                        Enregistre les indicateurs
    ------------------------------------------------------------------------------------------*/
    $('#indicateurOk').click(function () {
        var d =JSON.stringify(indicateurs);

        $.get('/getSauveIndicateur?indicateurs=' + d, function (retour, status) {
            $('#indicateurModal').modal('hide');
         });
    });
    /* ------------------------------------------------------------------------------------------
                                        Annuler les indicateurs
    ------------------------------------------------------------------------------------------*/
    $('#indicateurAnnuler').click(function () {
        $('#indicateurModal').modal('hide');
    });
    /* ------------------------------------------------------------------------------------------
                                        Monte l'indicateur
    ------------------------------------------------------------------------------------------*/
    $('#indicateurMonte').click(function () {
        var d = document.getElementById("indicateurListe");
            var nv = -1;
            var ni = -1;
            for (var m=0; m <= indicSelct; m++){
                if (d.options[m].text.indexOf("\\/ ") > -1) { nv++; } else { ni++; }
            }
        if (d.options[indicSelct].text.indexOf("\\/ ") > -1) {
            if (nv>0){
                var moins1 = indicateurs.Variables[nv-1];
                indicateurs.Variables[nv-1] = indicateurs.Variables[nv];
                indicateurs.Variables[nv] = moins1;
                listeLesIndicateurs();
            }
        } else {
            if (ni>0){
                var moins1 = indicateurs.Flags[ni-1];
                indicateurs.Flags[ni-1] = indicateurs.Flags[ni];
                indicateurs.Flags[ni] = moins1;
                listeLesIndicateurs();
            }
        }
    });
    /* ------------------------------------------------------------------------------------------
                                        Descend l'indicateur
    ------------------------------------------------------------------------------------------*/
    $('#indicateurDescend').click(function () {
        var d = document.getElementById("indicateurListe");
            var nv = -1;
            var ni = -1;
            for (var m=0; m <= indicSelct; m++){
                if (d.options[m].text.indexOf("\\/ ") > -1) { nv++; } else { ni++; }
            }
        if (d.options[indicSelct].text.indexOf("\\/ ") > -1) {
            if (indicSelct>-1) {
                var plus1 = indicateurs.Variables[nv+1];
                indicateurs.Variables[nv+1] = indicateurs.Variables[nv];
                indicateurs.Variables[nv] = plus1;
                listeLesIndicateurs();
            }
        } else {
            if (indicSelct>-1) {
                var plus1 = indicateurs.Flags[ni+1];
                indicateurs.Flags[ni+1] = indicateurs.Flags[ni];
                indicateurs.Flags[ni] = plus1;
                listeLesIndicateurs();
            }
        }
    });
    /* ------------------------------------------------------------------------------------------
                                        Duplique l'indicateur
    ------------------------------------------------------------------------------------------*/
    $('#indicateurDuplique').click(function () {
        var n = parseInt(document.getElementById("indicateurListe").selectedIndex);
        if (n>-1) {
            var d = document.getElementById("indicateurListe");
            var nv = -1;
            var ni = -1;
            for (var m=0; m < n; m++){
                if (d.options[m].text.indexOf("\\/ ") > -1) { nv++; } else { ni++; }
            }

            if (d.options[m].text.indexOf("\\/ ") > -1) {
                indicateurs.Variables.push(variableIndicateur());

                var v = parseInt(indicateurs.Variables.length) - 1;
                indicateurs.Variables[v].Titre = indicateurs.Variables[v].Titre + " copie"
            } else {
                indicateurs.Flags.push(variableIndicateur());

                var l = parseInt(indicateurs.Flags.length) - 1;
                indicateurs.Flags[l].Titre = indicateurs.Flags[l].Titre + " copie"
            }
            
            listeLesIndicateurs();
        }
    });
    /* ------------------------------------------------------------------------------------------
                                        Supprime l'indicateur
    ------------------------------------------------------------------------------------------*/
    $('#indicateurSupprime').click(function () {
        var n = parseInt(document.getElementById("indicateurListe").selectedIndex);
        if (n>-1) {
            var d = document.getElementById("indicateurListe");
            var nv = -1;
            var ni = -1;
            for (var m=0; m <= n; m++){
                if (d.options[m].text.indexOf("\\/ ") > -1) { nv++; } else { ni++; }
            }

            if (d.options[n].text.indexOf("\\/ ") > -1) {
                indicateurs.Variables.splice(nv,1);
            } else {
                indicateurs.Flags.splice(ni,1);
            }
 
            listeLesIndicateurs();
        }
    });
    /* ##############################################################################################################################
    ################################################################################################################################# 
                                        #######                              
                                        #     # #####  ##### #  ####  #    #  ####  
                                        #     # #    #   #   # #    # ##   # #      
                                        #     # #    #   #   # #    # # #  #  ####  
                                        #     # #####    #   # #    # #  # #      # 
                                        #     # #        #   # #    # #   ## #    # 
                                        ####### #        #   #  ####  #    #  ####  
    #################################################################################################################################
    ##############################################################################################################################*/
    /* ------------------------------------------------------------------------------------------
                                On ouvre la boite de dialogue Options
    ------------------------------------------------------------------------------------------*/
    $('#options').click(function () {
        console.log("Options")
        effaceLesImages();
        chargeConfig();
        onChangeAspectPage();
        $.get('/getListeFichiers?dossier=' + "static\\img\\Fonds_Ecran\\", function (fichiers, status) {
            placeLesImages(fichiers, document.getElementById("optionListeImageFond"), 'static\\img\\Fonds_Ecran\\', "fondOptions");

            $.get('/getListeFichiers?dossier=' + "static\\Informations\\images\\logos\\", function (fichiers, status) {
                placeLesImages(fichiers, document.getElementById("optionLogos"), 'static\\Informations\\images\\logos\\', 'admin');

                $('#optionsModal').modal('show');
            });
        });
    });
    /* ------------------------------------------------------------------------------------------
                                    Supprime toutes les petites images
    ------------------------------------------------------------------------------------------*/
    function effaceLesImages(){
        var p = document.getElementsByClassName("ImageBanque");
            for(var i = p.length - 1; 0 <= i; i--) {
                p[i].remove();
            }
        }
    /* ------------------------------------------------------------------------------------------
                                    Place les images dans le parent
    ------------------------------------------------------------------------------------------*/
    function placeLesImages(fichiers, papa, chemin, ou){
        for (var n=0; n<fichiers.length; n++){
            var im = document.createElement('img');
            im.name = "ImageBanque";
            var f = fichiers[n].split('>')[0];                
            im.id = f;
            im.title = f;
            im.alt = f;
            im.src = chemin + f;
            im.className = "ImageBanque"
            im.onclick = function() {onclickBanqueImages(this, chemin, ou); }
            papa.appendChild(im);
        }
        //papa.style.height = 2 * (document.getElementById("corps").offsetHeight - document.getElementById("lesImages").offsetTop - 25)/4 +"px"
        //document.getElementById(supprime).style.display = "none";
    }
    /* ------------------------------------------------------------------------------------------
                                On clique sur une image de la banque
    ------------------------------------------------------------------------------------------*/
    function onclickBanqueImages(image, chemin, ouID){
        var i = document.getElementById(image.id);
        while (chemin.indexOf("\\") >-1 ) {
            chemin = chemin.replace("\\","/");
        }
        document.getElementById(ouID).style.backgroundImage = "url('" + chemin + "/" + i.id+"')";
        document.getElementById(ouID).title = i.title;
        document.getElementById(ouID).alt = i.alt;
        if (ouID == "fondOptions") {
            backgroundImage = i.alt;
        } else {
            logo = i.alt;
            document.getElementById(ouID).style.backgroundSize = "100% 100%"
        }
    }
    /* ------------------------------------------------------------------------------------------
                                          
    ------------------------------------------------------------------------------------------*/
    function appliqueConfiguration(){
        var l = "url('/static/\Informations/images/logos/" + config.Logo + "')"
            document.getElementById("admin").style.backgroundImage = l;
        var c = "url('/static/img/Fonds_Ecran/" + config.BackgroundImage + "')"
            document.body.style.backgroundImage = c;
            
            document. body.style.color = "#" + config.PoliceCouleur;
            document.getElementById("Administration").style.color = "#" + config.PoliceCouleur;            
            document.getElementById("fondOptions").style.backgroundImage = c;
            
            document.getElementById("entete").style.backgroundColor = "#" + config.EnTete.Couleur;
            document.getElementById("entete").style.color = "#" + config.EnTete.PoliceCouleur;
            document.getElementById("entete").style.fontSize = config.EnTete.PoliceTaille + "pt";

            var modalBody = document.getElementsByClassName("noir");
            for (var i=0; i<modalBody.length; i++) {
                document.getElementsByClassName("noir")[i].style.backgroundImage = null;
                document.getElementsByClassName("noir")[i].style.color = "#000000";
            }
    }
    /* ------------------------------------------------------------------------------------------
                                          
    ------------------------------------------------------------------------------------------*/
    function chargeConfig(){
        $.get('/getConfig', function (configuration, status) {
            config = configuration;
            appliqueConfiguration();

            document.getElementById("optionsTimer").value = config.Timer;

            backgroundImage = config.BackgroundImage;

            document.getElementById("optionsPing").checked = config.ping;
            // MOYEN
            document.getElementById("optionsMoyenTitre").value = config.Moyen.Nom;
            document.getElementById("optionsMoyenBulle").value = config.Moyen.Bulle;
            document.getElementById("optionsSecteurs").value = config.InfosSecteurs;
            document.getElementById("gestionMoyenCouleur").value = '#' + config.Couleur;
            // MOYEN  TITRE
            document.getElementById("gestionMoyenTitreCouleur").value = "#" + config.Moyen.Couleur;
                document.getElementById("gestionMoyenTitreBordure").checked = config.Moyen.Titre.Transparent;
                document.getElementById("gestionMoyenTitreBordureEpaisseur").value = config.Moyen.Titre.Epaisseur;
                document.getElementById("gestionMoyenTitreBordureCouleur").value = "#" + config.Moyen.Titre.Couleur;
                document.getElementById("gestionMoyenTitreBordureArrondi").value = config.Moyen.Titre.Angle;

                document.getElementById("gestionMoyenTitrePoliceTaille").value = config.Moyen.Titre.PoliceTaille;
                document.getElementById("gestionMoyenTitrePoliceCouleur").value = "#" + config.Moyen.Titre.PoliceCouleur;
            // MOYEN  PC
            document.getElementById("gestionMoyenHostnameCouleur").value = "#" + config.Moyen.PC.Couleur;
                document.getElementById("gestionMoyenHostnameBordure").checked = config.Moyen.PC.Hostname.Transparent;
                document.getElementById("gestionMoyenHostnameBordureLargeur").value = config.Moyen.PC.Hostname.Epaisseur;
                document.getElementById("gestionMoyenHostnameBordureCouleur").value = "#" + config.Moyen.PC.Hostname.Couleur;
                document.getElementById("gestionMoyenHostnameBordureArrondi").value = config.Moyen.PC.Hostname.Angle;

                document.getElementById("gestionMoyenHostnamePoliceTaille").value = config.Moyen.PC.Hostname.PoliceTaille;
                document.getElementById("gestionMoyenHostnamePoliceCouleur").value = "#" + config.Moyen.PC.Hostname.PoliceCouleur;

            // OBJET
            document.getElementById("optionsOrdinateurTitre").value = config.Objet.Nom;
            document.getElementById("optionsOrdinateurBulle").value = config.Objet.Bulle;
            document.getElementById("gestionPCLargeur").value = config.Objet.Taille;
            // OBJET  HOSTNAME
            document.getElementById("gestionPCHostnameCouleur").value = "#" + config.Objet.Couleur;
                document.getElementById("gestionPCHostnameBordure").checked = config.Objet.Hostname.Transparent;
                document.getElementById("gestionPCHostnameBordureEpaisseur").value = config.Objet.Hostname.Epaisseur;
                document.getElementById("gestionPCHostnameBordureCouleur").value = "#" + config.Objet.Hostname.Couleur;
                document.getElementById("gestionPCHostnameBordureArrondi").value = config.Objet.Hostname.Angle;
                document.getElementById("gestionPCHostnamePoliceTaille").value = config.Objet.Hostname.PoliceTaille;
                document.getElementById("gestionPCHostnamePoliceCouleur").value = "#" + config.Objet.Hostname.PoliceCouleur;

            document.getElementById("optionEnTeteCouleur").value = "#" + config.EnTete.Couleur;
            document.getElementById("optionEnTetePoliceTaille").value = config.EnTete.PoliceTaille;
            document.getElementById("optionEnTetePoliceCouleur").value = "#" + config.EnTete.PoliceCouleur;

            document.getElementById("optionPoliceCouleur").value = "#" + config.PoliceCouleur;
            logo = config.Logo;
            var l = "url('/static/Informations/images/logos/" + config.Logo + "')"
            document.getElementById("admin").style.BackgroundImage = l;

            var asterix = config.hostnameReplaceParEtoile;
            var a = "";
            for (var n=0; n<asterix.length; n++){
                if (a != "") {a = a + ":"; }
                a = a + asterix[n].texte;
            }
            document.getElementById("optionsAsterix").value = a;
         });
        
    };
    /* ------------------------------------------------------------------------------------------
                                          
    ------------------------------------------------------------------------------------------*/
    $('#optionsAnnuler').click(function () {
        $('#optionsModal').modal('hide');
    });
    /* ------------------------------------------------------------------------------------------
                                          
    ------------------------------------------------------------------------------------------*/
    $('#optionsOk').click(function () {
        sauveLaConfig()
        $('#optionsModal').modal('hide');
        appliqueConfiguration();
    });
    /* ------------------------------------------------------------------------------------------
                                          
    ------------------------------------------------------------------------------------------*/
    function sauveLaConfig(){
        const texte = new Array();
        if (document.getElementById("optionsAsterix").value != ""){
            var a = document.getElementById("optionsAsterix").value.split(':');
            
            for (var n=0; n<a.length; n++){
                var ast = {"texte":a[n]}
                texte.push(ast);
            }
        }
        config = {
            "Timer": document.getElementById("optionsTimer").value,
            "ping": document.getElementById("optionsPing").checked,
            "InfosSecteurs": document.getElementById("optionsSecteurs").value,
            "BackgroundImage": backgroundImage,
            "Logo": logo,
            "PoliceCouleur": document.getElementById("optionPoliceCouleur").value.replace("#",""),
            "hostnameReplaceParEtoile": texte,
            "Couleur": document.getElementById("gestionMoyenCouleur").value.replace('#',''),
            "Moyen": 
                {
                    "Nom": document.getElementById("optionsMoyenTitre").value,
                    "Bulle": document.getElementById("optionsMoyenBulle").value,
                    "Couleur": document.getElementById("gestionMoyenTitreCouleur").value.replace('#',''),
                    "Titre": {
                                "Transparent": document.getElementById("gestionMoyenTitreBordure").checked,
                                "Epaisseur": document.getElementById("gestionMoyenTitreBordureEpaisseur").value,
                                "Couleur": document.getElementById("gestionMoyenTitreBordureCouleur").value.replace('#',''),
                                "Angle": document.getElementById("gestionMoyenTitreBordureArrondi").value,
                                "PoliceTaille": document.getElementById("gestionMoyenTitrePoliceTaille").value,
                                "PoliceCouleur": document.getElementById("gestionMoyenTitrePoliceCouleur").value.replace('#','')
                                },
                    "PC": 
                        {
                            "Couleur": document.getElementById("gestionMoyenHostnameCouleur").value.replace('#',''),
                            "Hostname": {
                                        "Transparent": document.getElementById("gestionMoyenHostnameBordure").checked,
                                        "Epaisseur": document.getElementById("gestionMoyenHostnameBordureLargeur").value,
                                        "Couleur": document.getElementById("gestionMoyenHostnameBordureCouleur").value.replace('#',''),
                                        "Angle": document.getElementById("gestionMoyenHostnameBordureArrondi").value,
                                        "PoliceTaille": document.getElementById("gestionMoyenHostnamePoliceTaille").value,
                                        "PoliceCouleur": document.getElementById("gestionMoyenHostnamePoliceCouleur").value.replace('#','')
                                        }
                        },
                },
            "Objet": 
                {
                    "Nom": document.getElementById("optionsOrdinateurTitre").value,
                    "Bulle": document.getElementById("optionsOrdinateurBulle").value,
                    "Taille": document.getElementById("gestionPCLargeur").value,
                    "Couleur": document.getElementById("gestionPCHostnameCouleur").value.replace('#',''),
                    "Hostname":{
                                "Transparent": document.getElementById("gestionPCHostnameBordure").checked,
                                "Epaisseur": document.getElementById("gestionPCHostnameBordureEpaisseur").value,
                                "Couleur": document.getElementById("gestionPCHostnameBordureCouleur").value.replace('#',''),
                                "Angle": document.getElementById("gestionPCHostnameBordureArrondi").value,
                                "PoliceTaille": document.getElementById("gestionPCHostnamePoliceTaille").value,
                                "PoliceCouleur": document.getElementById("gestionPCHostnamePoliceCouleur").value.replace("#","")
                                }
                },
            "EnTete" : 
                {
                    "Couleur": document.getElementById("optionEnTeteCouleur").value.replace("#",""),
                    "PoliceTaille": document.getElementById("optionEnTetePoliceTaille").value,
                    "PoliceCouleur": document.getElementById("optionEnTetePoliceCouleur").value.replace("#","")
                }
        }
        

        $.get('/getSauveConfig?config=' + JSON.stringify(config), function (reponse, status) {
        });
    };

    $('#optionEnTeteCouleur').click(function ()            { onChangeAspectPage(); });
    $('#optionEnTetePoliceCouleur').click(function ()      { onChangeAspectPage(); });
    $('#optionEnTetePoliceTaille').click(function ()       { onChangeAspectPage(); });
    $('optionPoliceCouleur').click(function ()             { onChangeAspectPage(); });
    
    function onChangeAspectPage(){
        document.getElementById("entete").style.backgroundColor = document.getElementById("optionEnTeteCouleur").value;
        document.getElementById("entete").style.color = document.getElementById("optionEnTetePoliceCouleur").value;
        document.getElementById("titre").style.fontSize = document.getElementById("optionEnTetePoliceTaille").value + "pt";
        document.getElementById("fondOptions").style.color = document.getElementById("optionPoliceCouleur").value;;
        
    }

    /* ##############################################################################################################################
    ################################################################################################################################# 
                                              G E S T I O N   O B J E T S    &   M O Y E N S
    #################################################################################################################################
    ##############################################################################################################################*/
    /* ------------------------------------------------------------------------------------------
                        On ouvre la boite de dialogue Gestion objets & moyens
    ------------------------------------------------------------------------------------------*/
    $('#objets').click(function () {
        console.log("Gestion objets & moyens");
        chargeConfig();
        onChangeAspectMoyenObjet();
        $('#gestionModal').modal('show');
    });
    /* ------------------------------------------------------------------------------------------
                        Annuler la boite de dialogue Gestion objets & moyens
    ------------------------------------------------------------------------------------------*/
    $('#gestionAnnuler').click(function () {
        $('#gestionModal').modal('hide');
    });
    /* ------------------------------------------------------------------------------------------
                        OK la boite de dialogue Gestion objets & moyens
    ------------------------------------------------------------------------------------------*/
    $('#gestionOk').click(function () {
        sauveLaConfig();
        $('#gestionModal').modal('hide');
    });
    /* ------------------------------------------------------------------------------------------
                                        On change les aspects
    ------------------------------------------------------------------------------------------*/
    $('#gestionMoyenCouleur').change(function ()                { onChangeAspectMoyenObjet(); });
    $('#gestionMoyenTitreCouleur').change(function ()           { onChangeAspectMoyenObjet(); });
    $('#gestionMoyenTitreBordureEpaisseur').change(function ()  { onChangeAspectMoyenObjet(); });
    $('#gestionMoyenTitreBordureCouleur').change(function ()    { onChangeAspectMoyenObjet(); });
    $('#gestionMoyenTitreBordureArrondi').change(function ()    { onChangeAspectMoyenObjet(); });
    $('#gestionMoyenHostnameCouleur').change(function ()        { onChangeAspectMoyenObjet(); });
    $('#gestionMoyenHostnameBordureLargeur').change(function () { onChangeAspectMoyenObjet(); });
    $('#gestionMoyenHostnameBordureCouleur').change(function () { onChangeAspectMoyenObjet(); });
    $('#gestionMoyenHostnameBordureArrondi').change(function () { onChangeAspectMoyenObjet(); });
    $('#gestionPCLargeur').change(function ()                   { onChangeAspectMoyenObjet(); });
    $('#gestionPCHostnameCouleur').change(function ()           { onChangeAspectMoyenObjet(); });
    $('#gestionPCHostnameBordureEpaisseur').change(function ()  { onChangeAspectMoyenObjet(); });
    $('#gestionPCHostnameBordureCouleur').change(function ()    { onChangeAspectMoyenObjet(); });
    $('#gestionPCHostnameBordureArrondi').change(function ()    { onChangeAspectMoyenObjet(); });
    $('#gestionPCHostnameBordure').click(function ()            { onChangeAspectMoyenObjet(); });
    $('#gestionMoyenHostnameBordure').click(function ()         { onChangeAspectMoyenObjet(); });
    $('#gestionMoyenTitreBordure').click(function ()            { onChangeAspectMoyenObjet(); });
    $('#gestionMoyenHostnamePoliceTaille').click(function ()    { onChangeAspectMoyenObjet(); });
    $('#gestionMoyenHostnamePoliceCouleur').click(function ()   { onChangeAspectMoyenObjet(); });
    $('#gestionMoyenTitrePoliceTaille').click(function ()       { onChangeAspectMoyenObjet(); });
    $('#gestionMoyenTitrePoliceCouleur').click(function ()      { onChangeAspectMoyenObjet(); });
    $('#gestionPCHostnamePoliceTaille').click(function ()       { onChangeAspectMoyenObjet(); });
    $('#gestionPCHostnamePoliceCouleur').click(function ()      { onChangeAspectMoyenObjet(); });


    function onChangeAspectMoyenObjet(){
        document.getElementById("gestionMoyen").style.backgroundColor = document.getElementById("gestionMoyenCouleur").value;
        // MOYEN  TITRE        
        document.getElementById("gestionMoyenTitre").style.color = document.getElementById("gestionMoyenTitrePoliceCouleur").value;;
        document.getElementById("gestionMoyenTitre").style.fontSize = document.getElementById("gestionMoyenTitrePoliceTaille").value + "pt";
        document.getElementById("gestionMoyenTitre").style.backgroundColor = document.getElementById("gestionMoyenTitreCouleur").value;
        if (document.getElementById("gestionMoyenTitreBordure").checked) { 
            document.getElementById("gestionMoyenTitre").style.backgroundColor = null; 
        }
            document.getElementById("gestionMoyenTitre").style.border = document.getElementById("gestionMoyenTitreBordureEpaisseur").value +
                            "px solid " + document.getElementById("gestionMoyenTitreBordureCouleur").value;
            document.getElementById("gestionMoyenTitre").style.borderRadius = document.getElementById("gestionMoyenTitreBordureArrondi").value + "%";
        // MOYEN  PC
        document.getElementById("gestionMoyenPCHostname").style.color = document.getElementById("gestionMoyenHostnamePoliceCouleur").value;;
        document.getElementById("gestionMoyenPCHostname").style.fontSize = document.getElementById("gestionMoyenHostnamePoliceTaille").value + "pt";
        document.getElementById("gestionMoyenPCHostname").style.backgroundColor = document.getElementById("gestionMoyenHostnameCouleur").value;
        if (document.getElementById("gestionMoyenHostnameBordure").checked) { 
            document.getElementById("gestionMoyenPCHostname").style.backgroundColor = null; 
        }
            document.getElementById("gestionMoyenPCHostname").style.border = document.getElementById("gestionMoyenHostnameBordureLargeur").value +
                            "px solid " + document.getElementById("gestionMoyenHostnameBordureCouleur").value;
            document.getElementById("gestionMoyenPCHostname").style.borderRadius = document.getElementById("gestionMoyenHostnameBordureArrondi").value + "%";
        // OBJET

        document.getElementById("gestionMoyenPC").style.width = document.getElementById("gestionPCLargeur").value + "px";
        document.getElementById("gestionMoyenPC").style.height = document.getElementById("gestionPCLargeur").value + "px";
        document.getElementById("gestionPC").style.width = document.getElementById("gestionPCLargeur").value + "px";
        document.getElementById("gestionPC").style.height = document.getElementById("gestionPCLargeur").value + "px";
        // OBJET  HOSTNAME
        document.getElementById("gestionPCHostname").style.color = document.getElementById("gestionPCHostnamePoliceCouleur").value;;
        document.getElementById("gestionPCHostname").style.fontSize = document.getElementById("gestionPCHostnamePoliceTaille").value + "pt";
        document.getElementById("gestionPCHostname").style.backgroundColor = document.getElementById("gestionPCHostnameCouleur").value;
        if (document.getElementById("gestionPCHostnameBordure").checked) { 
            document.getElementById("gestionPCHostname").style.backgroundColor = null; 
        }
            document.getElementById("gestionPCHostname").style.border = document.getElementById("gestionPCHostnameBordureEpaisseur").value +
                            "px solid " + document.getElementById("gestionPCHostnameBordureCouleur").value;
            document.getElementById("gestionPCHostname").style.borderRadius = document.getElementById("gestionPCHostnameBordureArrondi").value + "%";
    }
/* ##############################################################################################################################
################################################################################################################################# 
                                            C O N F I G   D E S   O B J E T S
#################################################################################################################################
##############################################################################################################################*/
    /* ------------------------------------------------------------------------------------------
                                On ouvre la boite de dialogue Objets
    ------------------------------------------------------------------------------------------*/
    $('#configObjets').click(function () {
        $.get('/getListeObjets', function (objets, status) {
            listeObjets = objets;
            var l = document.getElementById("objetsListe");
            l.length = 0;
            for (var n in objets.lesObjets){
                l.length = l.length + 1;
                l.options[l.length-1].text = objets.lesObjets[n].Nom;
            }
            $.get('/getListeFichiers?dossier=' + "static\\Informations\\images\\objets\\", function (fichiers, status) {
                var ll = document.getElementById("objetListeImages");
                ll.length = 0;
                for (var n in fichiers){
                    ll.length = ll.length + 1;
                    ll.options[ll.length-1].text = fichiers[n].split(">")[0];
                }
                objetImageChange();

                document.getElementById("objetNom").value = "";
                document.getElementById("objetDetail").value = "";
                document.getElementById("objetOrdinateur").checked = false;
                document.getElementById("objetCorrige").style.display = "none";

                $('#objetModal').modal('show');
            });
        });
    });
    /* ------------------------------------------------------------------------------------------
                                On change l'image de l'objet
    ------------------------------------------------------------------------------------------*/
    $('#objetListeImages').change(function () {
        objetImageChange();
    });

    function objetImageChange() {
        var image = 'url("static/Informations/images/objets/' + document.getElementById("objetListeImages").value + '")';
        document.getElementById("objetImage").style.backgroundImage = image;
    }
    /* ------------------------------------------------------------------------------------------
                                On clique sur un objet
    ------------------------------------------------------------------------------------------*/
    $('#objetsListe').change(function () {
        for (var i=0 ; i<listeObjets.lesObjets.length ; i++) {
            if (listeObjets.lesObjets[i].Nom == document.getElementById("objetsListe").value) {
                document.getElementById("objetNom").value = listeObjets.lesObjets[i].Nom;
                document.getElementById("objetNom").title = listeObjets.lesObjets[i].Nom;
                document.getElementById("objetDetail").value = listeObjets.lesObjets[i].Détail;
                document.getElementById("objetListeImages").value = listeObjets.lesObjets[i].Image.toLowerCase();
                document.getElementById("objetOrdinateur").checked = listeObjets.lesObjets[i].PC;
                objetImageChange();
                document.getElementById("objetCorrige").style.display = " block"
                return;
            }
        }
    });
    /* ------------------------------------------------------------------------------------------
                                On clique sur corrige l'objet
    ------------------------------------------------------------------------------------------*/
    $('#objetCorrige').click(function () {
        for (var i=0 ; i<listeObjets.lesObjets.length ; i++) {
            if (listeObjets.lesObjets[i].Nom == document.getElementById("objetNom").title) {
                var v = {
                    "Nom": document.getElementById("objetNom").value,
                    "Détail": document.getElementById("objetDetail").value,
                    "Format": "image + titre",
                    "Image": document.getElementById("objetListeImages").value,
                    "PC": document.getElementById("objetOrdinateur").checked
                }
                listeObjets.lesObjets[i] = v;
                document.getElementById("objetsListe").options[i].text = document.getElementById("objetNom").value;
                return;
            }
        }
    });
    /* ------------------------------------------------------------------------------------------
                                On clique sur nouvel objet
    ------------------------------------------------------------------------------------------*/
    $('#objetNouveau').click(function () {
        var v = {
            "Nom": document.getElementById("objetNom").value,
            "Détail": document.getElementById("objetDetail").value,
            "Format": "image + titre",
            "Image": document.getElementById("objetListeImages").value,
            "PC": document.getElementById("objetOrdinateur").checked
        }
        var l = document.getElementById("objetsListe");
        listeObjets.lesObjets.push(v);
        l.length++;
        l.options[l.length-1].text = document.getElementById("objetNom").value;
    });
    /* ------------------------------------------------------------------------------------------
                                On clique sur annuler
    ------------------------------------------------------------------------------------------*/
    $('#objetAnnuler').click(function () {
        $('#objetModal').modal('hide');
    });
    /* ------------------------------------------------------------------------------------------
                                On clique sur OK
    ------------------------------------------------------------------------------------------*/
    $('#objetOk').click(function () {
        var d =JSON.stringify(listeObjets);

        $.get('/getSauveObjet?objets=' + d, function (retour, status) {
            $('#objetModal').modal('hide');
         });
    });




/* ------------------------------------------------------------------------------------------                                
   ------------------------------------------------------------------------------------------ */
});