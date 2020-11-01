$(document).ready(function () {
    var config
    /* ------------------------------------------------------------------------------------------
                                    Au chargement de la page
    ------------------------------------------------------------------------------------------*/
    window.onload = function () {
        $.get('/getConfig', function (configuration, status) {
            config = configuration;
            var c = "url('/static/img/Fonds_Ecran/" + config.BackgroundImage + "')"
            document.body.style.backgroundImage = c;
            document. body.style.color = "#" + config.PoliceCouleur;
            
            var modalBody = document.getElementsByClassName("noir");
            for (var i=0; i<modalBody.length; i++) {
                document.getElementsByClassName("noir")[i].style.backgroundImage = null;
                document.getElementsByClassName("noir")[i].style.color = "#000000";
            }            
            chargeLesImages();
        });
    }

    /* ------------------------------------------------------------------------------------------
                                            Rafraichit
    ------------------------------------------------------------------------------------------*/
    $('#rafraichit').click(function () {
        chargeLesImages()
    });

    function chargeLesImages(){
        var f = document.getElementsByClassName("fondDiv");
        for (var i=0 ; i<f.length ; i++){
            f[i].style.backgroundColor = "#" + config.Couleur;
            f[i].style.border = "#000000 outset 1px"
        }

        effaceLesImages();

        $.get('/getListeFichiers?dossier=' + "static\\Informations\\images\\fondPages\\", function (fichiers, status) {
            placeLesImages(fichiers, document.getElementById("imagesFonds"), 'static\\Informations\\images\\fondPages\\', "fondImage", "fondSupprime");

            $.get('/getListeFichiers?dossier=' + "static\\Informations\\images\\objets\\", function (fichiers, status) {
                placeLesImages(fichiers, document.getElementById("imagesObjets"), 'static\\Informations\\images\\objets\\', "objetImage", "objetSupprime");

                $.get('/getListeFichiers?dossier=' + "static\\Informations\\images\\indicateurs\\", function (fichiers, status) {
                    placeLesImages(fichiers, document.getElementById("imagesIndicateurs"), 'static\\Informations\\images\\indicateurs\\', "indicateurImage", "indicateurSupprime");

                    $.get('/getListeFichiers?dossier=' + "static\\img\\Fonds_Ecran\\", function (fichiers, status) {
                        placeLesImages(fichiers, document.getElementById("imagesFondsEcran"), 'static\\img\\Fonds_Ecran\\', "imagesImage", "fondEcranSupprime");

                        $.get('/getListeFichiers?dossier=' + "static\\Informations\\images\\fondmoyens", function (fichiers, status) {
                            placeLesImages(fichiers, document.getElementById("imagesFondsMoyens"), 'static\\Informations\\images\\fondmoyens\\', "imagesMoyen", "fondMoyenSupprime");

                            $.get('/getListeFichiers?dossier=' + "static\\Informations\\images\\logos", function (fichiers, status) {
                                placeLesImages(fichiers, document.getElementById("imagesLogos"), 'static\\Informations\\images\\logos\\', "logoImage", "logoSupprime");
                            });
                        });
                    });
                });
            });
        });
    }

    /* ------------------------------------------------------------------------------------------
                                    Supprime toutes les petites images
    ------------------------------------------------------------------------------------------*/
    function effaceLesImages(){
    var p = document.getElementsByClassName("ImageBanque");
        for(var i = p.length - 1; 0 <= i; i--) {
            p[i].remove();
        }
        document.getElementById("fondImage").alt ="";
        document.getElementById("fondImage").title ="";
        document.getElementById("fondImage").src ="";

        document.getElementById("objetImage").alt ="";
        document.getElementById("objetImage").title ="";
        document.getElementById("objetImage").src ="";

        document.getElementById("indicateurImage").alt ="";
        document.getElementById("indicateurImage").title ="";
        document.getElementById("indicateurImage").src ="";

        document.getElementById("imagesImage").alt ="";
        document.getElementById("imagesImage").title ="";
        document.getElementById("imagesImage").src ="";

        document.getElementById("imagesMoyen").alt ="";
        document.getElementById("imagesMoyen").title ="";
        document.getElementById("imagesMoyen").src ="";
        
        document.getElementById("logoImage").alt ="";
        document.getElementById("logoImage").title ="";
        document.getElementById("logoImage").src ="";        
    }
    /* ------------------------------------------------------------------------------------------
                                    Place les images dans le parent
    ------------------------------------------------------------------------------------------*/
    function placeLesImages(fichiers, papa, chemin, destination, supprime){
        for (var n=0; n<fichiers.length; n++){
            var im = document.createElement('img');
            im.name = "ImageBanque";
            var f = fichiers[n].split('>')[0];
            im.id = f;
            im.title = f;
            im.alt = f;
            im.src = chemin + f;
            im.className = "ImageBanque";
            if (chemin.indexOf("logo") > -1) {
                im.style.width = "100px";
                im.style.height = "40px"
            }
            im.onclick = function() {onclickBanqueImages(this, destination, chemin, supprime); }
            papa.appendChild(im);
            var br = document.createElement("br");
            br.className = "ImageBanque";
            papa.appendChild(br)
        }
        papa.style.height = 2 * (document.getElementById("corps").offsetHeight - document.getElementById("lesImages").offsetTop - 25)/4 +"px"
        document.getElementById(supprime).style.display = "none";
    }
    /* ------------------------------------------------------------------------------------------
                                On clique sur une image de la banque
    ------------------------------------------------------------------------------------------*/
    function onclickBanqueImages(image, ou, chemin, supprime){
        var i = document.getElementById(image.id);
        document.getElementById(ou).src = chemin + i.id;
        document.getElementById(ou).title = i.title;
        document.getElementById(ou).alt = i.alt;
        document.getElementById(supprime).style.display = "block";
    }
/* ##############################################################################################################################
################################################################################################################################# 
                                               F O N D S   D E S   C A R T E S
#################################################################################################################################
##############################################################################################################################*/
    /* ------------------------------------------------------------------------------------------
                                On importe une image dans le dossier
    ------------------------------------------------------------------------------------------*/
    $(":submit[name='carteOk']").on("click", function() {
        $('#carteSauve').ajaxSubmit({
        
            error: function(xhr) {
        status('Error: ' + xhr.status);
        console.log("erreur fichier");
            },

            success: function(response) {
                console.log("fichier transferé");
                console.log(response);
                chargeLesImages();
            }

        });
        $('#carteSauve').modal('hide');
        return false;
    });
    /* ------------------------------------------------------------------------------------------
                            On ouvre la fenetre modal pour les images de fond
    ------------------------------------------------------------------------------------------*/
    $('#fondImporte').click(function () {
        $('#carteSauve').modal('show');
    });
    /* ------------------------------------------------------------------------------------------
                            ferme la fenetre modal pour les images de fond
    ------------------------------------------------------------------------------------------*/
    $('#carteAnnuler').click(function () {
        $('#carteSauve').modal('hide');
    });
    /* ------------------------------------------------------------------------------------------
                                    Supprime l'image de fond
    ------------------------------------------------------------------------------------------*/
    $('#fondSupprime').click(function () {
        $.get('/getSupprimeFichiers?fichier=' + "static\\Informations\\images\\fondPages\\" + 
                document.getElementById("fondImage").alt, function (fichiers, status) {
                    document.getElementById("fondImage").alt ="";
                    document.getElementById("fondImage").title ="";
                    document.getElementById("fondImage").src ="";
                    chargeLesImages();
        })
    });
/* ##############################################################################################################################
################################################################################################################################# 
                                                    O B J E T S
#################################################################################################################################
##############################################################################################################################*/
    /* ------------------------------------------------------------------------------------------
                                On importe une image dans le dossier
    ------------------------------------------------------------------------------------------*/
    $(":submit[name='objetOk']").on("click", function() {
        $('#objetSauve').ajaxSubmit({
        
            error: function(xhr) {
        status('Error: ' + xhr.status);
        console.log("erreur fichier");
            },

            success: function(response) {
                console.log("fichier transferé");
                console.log(response);
                chargeLesImages();
            }

        });
        $('#objetSauve').modal('hide');
        return false;
    });
    /* ------------------------------------------------------------------------------------------
                            On ouvre la fenetre modal pour les images de fond
    ------------------------------------------------------------------------------------------*/
    $('#objetImporte').click(function () {
        $('#objetSauve').modal('show');
    });
    /* ------------------------------------------------------------------------------------------
                            ferme la fenetre modal pour les images de fond
    ------------------------------------------------------------------------------------------*/
    $('#objetAnnuler').click(function () {
        $('#objetSauve').modal('hide');
    });
    /* ------------------------------------------------------------------------------------------
                                        Supprime l'objet
    ------------------------------------------------------------------------------------------*/
    $('#objetSupprime').click(function () {
        $.get('/getSupprimeFichiers?fichier=' + "static\\Informations\\images\\objets\\" + 
                document.getElementById("objetImage").alt, function (fichiers, status) {
                    document.getElementById("objetImage").alt ="";
                    document.getElementById("objetImage").title ="";
                    document.getElementById("objetImage").src ="";
                    chargeLesImages();
        })
    });
/* ##############################################################################################################################
################################################################################################################################# 
                                               I N D I C A T E U R S
#################################################################################################################################
##############################################################################################################################*/
    /* ------------------------------------------------------------------------------------------
                                On importe une image dans le dossier
    ------------------------------------------------------------------------------------------*/
    $(":submit[name='indicateurOk']").on("click", function() {
        $('#indicateurSauve').ajaxSubmit({
        
            error: function(xhr) {
        status('Error: ' + xhr.status);
        console.log("erreur fichier");
            },

            success: function(response) {
                console.log("fichier transferé");
                console.log(response);
                chargeLesImages();
            }

        });
        $('#indicateurSauve').modal('hide');
        return false;
    });
    /* ------------------------------------------------------------------------------------------
                            On ouvre la fenetre modal pour les indicateurs
    ------------------------------------------------------------------------------------------*/
    $('#indicateursImporte').click(function () {
        $('#indicateurSauve').modal('show');
    });
    /* ------------------------------------------------------------------------------------------
                            ferme la fenetre modal pour les indicateurs
    ------------------------------------------------------------------------------------------*/
    $('#indicateurAnnuler').click(function () {
        $('#indicateursSauve').modal('hide');
    });
    /* ------------------------------------------------------------------------------------------
                                    Supprime l'indicateur
    ------------------------------------------------------------------------------------------*/
    $('#indicateurSupprime').click(function () {
        $.get('/getSupprimeFichiers?fichier=' + "static\\Informations\\images\\indicateurs\\" + 
                document.getElementById("indicateurImage").alt, function (fichiers, status) {
                    document.getElementById("indicateurImage").alt ="";
                    document.getElementById("indicateurImage").title ="";
                    document.getElementById("indicateurImage").src ="";
                    chargeLesImages();
        })
    });
    /* ##############################################################################################################################
    ################################################################################################################################# 
                                                        F O N D   D ' E C R A N
    #################################################################################################################################
    ##############################################################################################################################*/
    /* ------------------------------------------------------------------------------------------
                                On importe une image dans le dossier
    ------------------------------------------------------------------------------------------*/
    $(":submit[name='ecranOk']").on("click", function() {
        $('#ecranSauve').ajaxSubmit({
        
            error: function(xhr) {
        status('Error: ' + xhr.status);
        console.log("erreur fichier");
            },

            success: function(response) {
                console.log("fichier transferé");
                console.log(response);
                chargeLesImages();
            }
        });
        $('#ecranSauve').modal('hide');
        return false;
    });
    /* ------------------------------------------------------------------------------------------
                            On ouvre la fenetre modal pour les indicateurs
    ------------------------------------------------------------------------------------------*/
    $('#fondEcranImporte').click(function () {
        $('#ecranSauve').modal('show');
    });
    /* ------------------------------------------------------------------------------------------
                            ferme la fenetre modal pour les indicateurs
    ------------------------------------------------------------------------------------------*/
    $('#ecranAnnuler').click(function () {
        $('#ecranSauve').modal('hide');
    });
    /* ------------------------------------------------------------------------------------------
                                        Supprime le fond d'écran
    ------------------------------------------------------------------------------------------*/
    $('#fondEcranSupprime').click(function () {
        $.get('/getSupprimeFichiers?fichier=' + "static\\img\\Fonds_Ecran\\" + 
                document.getElementById("imagesImage").alt, function (fichiers, status) {
                    document.getElementById("imagesImage").alt ="";
                    document.getElementById("imagesImage").title ="";
                    document.getElementById("imagesImage").src ="";
                    chargeLesImages();
        })
    });


    $('#fondEcranApplique').click(function () {
        if (document.getElementById("imagesImage").alt != "") {
            config.BackgroundImage = document.getElementById("imagesImage").alt;            
            $.get('/getSauveConfig?config=' + JSON.stringify(config), function (reponse, status) {
                var c = "url('/static/img/Fonds_Ecran/" + document.getElementById("imagesImage").alt + "')"// + document.getElementById("imagesImage").alt;
                document.body.style.backgroundImage = c;
            });
        }
    });
    /* ##############################################################################################################################
################################################################################################################################# 
                                               F O N D   M O Y E N S
#################################################################################################################################
##############################################################################################################################*/
    /* ------------------------------------------------------------------------------------------
                                On importe une image dans le dossier
    ------------------------------------------------------------------------------------------*/
    $(":submit[name='moyenOk']").on("click", function() {
        $('#moyenSauve').ajaxSubmit({
        
            error: function(xhr) {
        status('Error: ' + xhr.status);
        console.log("erreur fichier");
            },

            success: function(response) {
                console.log("fichier transferé");
                console.log(response);
                chargeLesImages();
            }
        });
        $('#moyenSauve').modal('hide');
        return false;
    });
    /* ------------------------------------------------------------------------------------------
                            On ouvre la fenetre modal pour les indicateurs
    ------------------------------------------------------------------------------------------*/
    $('#fondMoyenImporte').click(function () {
        $('#moyenSauve').modal('show');
    });
    /* ------------------------------------------------------------------------------------------
                            ferme la fenetre modal pour les indicateurs
    ------------------------------------------------------------------------------------------*/
    $('#moyenAnnuler').click(function () {
        $('#moyenSauve').modal('hide');
    });
    /* ------------------------------------------------------------------------------------------
                                    Supprime l'indicateur
    ------------------------------------------------------------------------------------------*/
    $('#fondMoyenSupprime').click(function () {
        $.get('/getSupprimeFichiers?fichier=' + "static\\Informations\\images\\fondmoyens\\" + 
                document.getElementById("imagesMoyen").alt, function (fichiers, status) {
                    document.getElementById("imagesMoyen").alt ="";
                    document.getElementById("imagesMoyen").title ="";
                    document.getElementById("imagesMoyen").src ="";
                    chargeLesImages();
        })
    });
    /* ##############################################################################################################################
################################################################################################################################# 
                                               L O G O
#################################################################################################################################
##############################################################################################################################*/
    /* ------------------------------------------------------------------------------------------
                                On importe une image dans le dossier
    ------------------------------------------------------------------------------------------*/
    $(":submit[name='logoOk']").on("click", function() {
        $('#logoSauve').ajaxSubmit({
        
            error: function(xhr) {
        status('Error: ' + xhr.status);
        console.log("erreur fichier");
            },

            success: function(response) {
                console.log("fichier transferé");
                console.log(response);
                chargeLesImages();
            }
        });
        $('#logoSauve').modal('hide');
        return false;
    });
    /* ------------------------------------------------------------------------------------------
                            On ouvre la fenetre modal pour les indicateurs
    ------------------------------------------------------------------------------------------*/
    $('#logoImporte').click(function () {
        $('#logoSauve').modal('show');
    });
    /* ------------------------------------------------------------------------------------------
                            ferme la fenetre modal pour les indicateurs
    ------------------------------------------------------------------------------------------*/
    $('#logoAnnuler').click(function () {
        $('#logoSauve').modal('hide');
    });
    /* ------------------------------------------------------------------------------------------
                                    Supprime l'indicateur
    ------------------------------------------------------------------------------------------*/
    $('#logoSupprime').click(function () {
        $.get('/getSupprimeFichiers?fichier=' + "static\\Informations\\images\\logos\\" + 
                document.getElementById("logoImage").alt, function (fichiers, status) {
                    document.getElementById("logoImage").alt ="";
                    document.getElementById("logoImage").title ="";
                    document.getElementById("logoImage").src ="";
                    chargeLesImages();
        })
    });



});