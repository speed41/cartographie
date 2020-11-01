const express = require('express');
const path = require('path');
var formidable = require('formidable');  
var fs = require('fs');
var fs1 = require('fs');
const { parse } = require('path');
//var fse = require('fs-extra');  
var app = express();

var routeprincipale = express.Router();

routeprincipale.get('/debug', function (req, res, next) {
    res.sendFile(path.resolve(".") + '/src/public/html/debug.html');
});

routeprincipale.get('/carto', function (req, res, next) {
    res.sendFile(path.resolve(".") + '/src/public/html/aide.html');
});

routeprincipale.get('/banqueImages', function (req, res, next) {
    res.sendFile(path.resolve(".") + '/src/public/html/image.html');
});

routeprincipale.get('/pages', function (req, res, next) {
    res.sendFile(path.resolve(".") + '/src/public/html/pages.html');
});

routeprincipale.get('/Administration', function (req, res, next) {
    res.sendFile(path.resolve(".") + '/src/public/html/administration.html');
});

routeprincipale.get('/ping', function (req, res, next) {
    res.sendFile(path.resolve(".") + '/src/public/html/envoyerping.html');
});

/*############################################################################
  ############################################################################
                               C O M P T E S
  ############################################################################
  ############################################################################*/
  /*----------------------------------------------------------------------------
                            Création du fichier comptes
  ----------------------------------------------------------------------------*/  
  function creationComptes(){
    var liste = {
                "comptes": [
                                {
                            "Nom": "Administrateur",
                            "MotDePasse": "admin",
                            "Pages": "defaut",
                            "Etat": "creation",
                            "Admin": true
                            },
                            {
                            "Nom": "Utilisateur",
                            "MotDePasse": "user",
                            "Pages": "defaut",
                            "Etat": "creation",
                            "Admin": false
                            }
                        ]
                };
    sauveDonnee(liste, "comptes");
}

/*----------------------------------------------------------------------------
                            récupère les comptes
  ----------------------------------------------------------------------------*/
  routeprincipale.get('/getListeComptes', function (req, res, next) {
    var comptes  = getListeComptes();
    res.send(comptes);
});

function getListeComptes(){
    let lesComptes = fs.readFileSync(path.resolve(".") +'/src/public/informations/comptes.json');
    var liste = JSON.parse(lesComptes);
    return liste;
}
/*----------------------------------------------------------------------------
                            identification réussie ?
  ----------------------------------------------------------------------------*/
  routeprincipale.get('/getIdentifie', function (req, res, next) {      
    var login = req.query.login;
    var mdp = req.query.motDePasse;
    var conforme = getIdentifie(login, mdp);
    res.send(conforme);
});

function getIdentifie(login, mdp){
    let lesComptes;
    try{
        lesComptes = fs.readFileSync(path.resolve(".") +'/src/public/informations/comptes.json');
    }
    catch {
        creationComptes();
    }
    var liste = JSON.parse(lesComptes);
    var reponse = {
                "reponse": false,
                "login": "",
                "pages": "",
                "admin": false,
                "etat": "creation"
            };
    var liste =liste.comptes.filter( c => c.Nom === login);
    if (liste.length>0){
        console.log("Login connu");
        if (liste[0].MotDePasse==mdp) { 
            reponse.reponse = true;
            reponse.login = liste[0].Nom;
            reponse.pages = liste[0].Pages;
            reponse.admin = liste[0].Admin;
            reponse.etat = liste[0].Etat;
            console.log("Mot de passe bon");
        }
        else { 
            console.log("Mot de passe faut");
        }
    }
    else { 
        console.log("Login inconnu");
    }
    return reponse;
}

/*----------------------------------------------------------------------------
                            Infos Compte
  ----------------------------------------------------------------------------*/
  routeprincipale.get('/getInfosCompte', function (req, res, next) {      
    var login = req.query.login;
    var reponse = getInfosCompte(login);
    res.send(reponse);
});

function getInfosCompte(login){
    let lesComptes;
    try{
        lesComptes = fs.readFileSync(path.resolve(".") +'/src/public/informations/comptes.json');
    }
    catch {
        creationComptes();
    }
    var liste = JSON.parse(lesComptes);
    var reponse = {
                "login": "",
                "pages": "",
                "admin": false,
                "etat": "creation"
            };
    var liste =liste.comptes.filter( c => c.Nom === login);
    if (liste.length>0){
        console.log("Login connu");
        reponse.login = liste[0].Nom;
        reponse.pages = liste[0].Pages;
        reponse.admin = liste[0].Admin;
        reponse.etat = liste[0].Etat;
    }
    else { 
        console.log("Login inconnu");
    }
    return reponse;
}

/*----------------------------------------------------------------------------
                      Nouveau mot de passe pour passer Actif
  ----------------------------------------------------------------------------*/
  routeprincipale.get('/getNouveauMDP', function (req, res, next) {      
    var login = req.query.login;
    var mdp = req.query.motDePasse;
    var newMdp = req.query.nouveau;
    var conforme = getNouveauMDP(login, mdp, newMdp);
    res.send(conforme);
});

function getNouveauMDP(login, mdp, newMdp){
    var conforme = getIdentifie(login, mdp);
    if (conforme.reponse)
    {
        let lesComptes;
        try{
            lesComptes = fs.readFileSync(path.resolve(".") +'/src/public/informations/comptes.json');
        }
        catch {
            creationComptes();
        }
        var liste = JSON.parse(lesComptes);
        for (var n in liste.comptes)
        {
            if (liste.comptes[n].Nom == login)
            {
                liste.comptes[n].MotDePasse = newMdp;
                liste.comptes[n].Etat = "actif";
                sauveDonnee(liste,"comptes");
                return true;
            }
        }
    }
}
/*----------------------------------------------------------------------------
                            Le compte existe ?
  ----------------------------------------------------------------------------*/
  routeprincipale.get('/getCompteExist', function (req, res, next) {      
    var login = req.query.login;
    var conforme = getExist(login);
    res.send(conforme);
});

function getExist(login){
    let lesComptes;
    try{
        lesComptes = fs.readFileSync(path.resolve(".") +'/src/public/informations/comptes.json');
    }
    catch {
        creationComptes();
    }
    var liste = JSON.parse(lesComptes);
    var reponse = false;
    var liste =liste.comptes.filter( c => c.Nom === login);
    if (liste.length>0){
            reponse = true;
            return reponse;
    }
    return reponse;
}
/*----------------------------------------------------------------------------
                            Supprime le compte
  ----------------------------------------------------------------------------*/
  routeprincipale.get('/getSupprimeCompte', function (req, res, next) {      
    var compte = req.query.compte;
    var conforme = getSupprimeCompte(compte);
    res.send(conforme);
});

function getSupprimeCompte(compte){
    let lesComptes;
    try{
        lesComptes = fs.readFileSync(path.resolve(".") +'/src/public/informations/comptes.json');
    }
    catch {
        creationComptes();
    }
    var liste = JSON.parse(lesComptes);
    for (var n in liste.comptes){
        if (liste.comptes[n].Nom == compte){
            liste.comptes.splice(n,1);
            sauveDonnee(liste,"comptes");
            return true;
        }
    }
    return false;
}

/*----------------------------------------------------------------------------
                            corrige le compte
  ----------------------------------------------------------------------------*/
  routeprincipale.get('/getCorrectionCompte', function (req, res, next) {      
    var newLogin = req.query.newLogin;
    var login = req.query.login;
    var mdp = req.query.mdp;
    var admin = req.query.admin;
    var pages = req.query.pages;
    var reponse = getCorrectionCompte(newLogin, login, mdp, admin, pages);
    res.send(reponse);
});

function getCorrectionCompte(newLogin, login, mdp, admin, pages){
    let lesComptes;
        try{
            lesComptes = fs.readFileSync(path.resolve(".") +'/src/public/informations/comptes.json');
        }
        catch {
            creationComptes();
        }
        var liste = JSON.parse(lesComptes);
        for (var n in liste.comptes)
        {
            if (liste.comptes[n].Nom == login)
            {                
                if (mdp!=""){ liste.comptes[n].MotDePasse = mdp; }
                liste.comptes[n].Login = newLogin;
                liste.comptes[n].Admin = admin;
                liste.comptes[n].Pages = pages;
                sauveDonnee(liste,"comptes");
                return true;
            }
        }
}
/*----------------------------------------------------------------------------
                            Nouveau compte
  ----------------------------------------------------------------------------*/
  routeprincipale.get('/getNouveauCompte', function (req, res, next) {
    var login = req.query.login;
    var mdp = req.query.mdp;
    var admin = req.query.admin;
    var pages = req.query.pages;
    var reponse = getNouveauCompte(login, mdp, admin, pages);
    res.send(reponse);
});

function getNouveauCompte(login, mdp, admin, pages){
    let lesComptes;
    try{
        lesComptes = fs.readFileSync(path.resolve(".") +'/src/public/informations/comptes.json');
    }
    catch {
        creationComptes();
    }
    var listeJson = JSON.parse(lesComptes);
    var liste = {
                    "Nom": login,
                    "MotDePasse": mdp,
                    "Pages": pages,
                    "Etat": "actif",
                    "Admin": admin
                };
    listeJson.comptes.push(liste);
    sauveDonnee(listeJson,"comptes");
    return true;
}
/*############################################################################
  ############################################################################
                            C O N F I G U R A T I O N
  ############################################################################                            
  ############################################################################*/
/*----------------------------------------------------------------------------
                            Création du fichier config.
  ----------------------------------------------------------------------------*/  
  function creationConfig(){
    var liste ={
                "Titre": 
                    {
                        "Nom": "{Nom}<br>({Secteur})",
                        "Bulle": "Nom : {Nom}<br>Secteur : {Secteur}"
                    },
                "PC": 
                    {
                        "Nom": "{Nom}",
                        "Bulle": "Hostname = {Nom}<br>Détail : {Détail}"
                    }
            };
      sauveDonnee(liste,"config");
}
/*----------------------------------------------------------------------------
                            Charge config
  ----------------------------------------------------------------------------*/
  routeprincipale.get('/getConfig', function (req, res, next) {
    var liste = getConfig();
    res.send(liste);
});

function getConfig(){
    let conf;
    try{
        conf = fs.readFileSync(path.resolve(".") +'/src/public/informations/config.json');
    }
    catch {
        creationConfig();
    }
    var liste = JSON.parse(conf);
    return liste;
}
/*----------------------------------------------------------------------------
                            Charge Information du secteur
  ----------------------------------------------------------------------------*/
  routeprincipale.get('/getInfosSecteur', function (req, res, next) {     
    var dossier = req.query.Dossier;
    var secteur = req.query.Secteur;
    var moyen = req.query.Moyen;
    var liste = getInfosSecteur(dossier, secteur, moyen);
    res.send(liste);
});

function getInfosSecteur(dossier, secteur, moyen){
    try{
        const fs = require('fs');
        return fs.readFileSync(dossier + "\\" + secteur + "\\" + moyen + ".txt");
    }
    catch {
        return null
    }
}
/*############################################################################
  ############################################################################
                                    P A G E S
  ############################################################################
  ############################################################################*/
/*----------------------------------------------------------------------------
                            Création du fichier pages
  ----------------------------------------------------------------------------*/  
  function creationPages(){
    var liste = {
                "pages": [
                    {
                        "Nom": "defaut",
                        "Image": "defaut.jpg",
                        "Détail": "Page par défaut"
                    }
                ]
      };
      sauveDonnee(liste,"pages");
}
/*----------------------------------------------------------------------------
                            Création du fichier pages
  ----------------------------------------------------------------------------*/  
  function creationPageVierge(fichier){
    var liste = {
                "objet": [
                    {
                        "Nom": "DLGRHQLQ",
                        "Secteur": "SMI",
                        "Détail": "PC développement",
                        "type": "simple",
                        "FormatObjet": "Ordinateur",
                        "x": "86.66666666666667",
                        "y": "69.52380952380952"
                    },
                    {
                        "Nom": "Banc d'essai",
                        "Secteur": "SMI",
                        "type": "combine",
                        "Détail": "Baie développement",
                        "couleur": "rgb(192,192,192)",
                        "x0": 50.00,
                        "y0": 50.00,
                        "x1": 100.00,
                        "y1": 75.00,
                        "objets": [
                                    {
                                        "Nom": "DLGRHQLQ2",
                                        "FormatObjet": "Ordinateur",
                                        "Secteur": "SMI",
                                        "Détail": "PC développement",
                                        "x": 50.345777,
                                        "y": 25.67788
                                    }
                                ]
                    }
                ]
      };
      sauveDonnee(liste,"/pages/" + fichier);
}
/*----------------------------------------------------------------------------
                            corrige la page
  ----------------------------------------------------------------------------*/
  routeprincipale.get('/getCorrectionPage', function (req, res, next) {      
    var newNom = req.query.newNom;
    var nom = req.query.nom;
    var detail = req.query.detail;
    var image = req.query.image;
    var reponse = getCorrectionPage(newNom, nom, detail, image);
    res.send(reponse);
});

function getCorrectionPage(newNom, nom, detail, image){
    let lesPages;
        try{
            lesPages = fs.readFileSync(path.resolve(".") +'/src/public/informations/pages.json');
        }
        catch {
            creationPages();      console.log("????????????????????????????????????")
        }
        var liste = JSON.parse(lesPages);

        for (var n in liste.pages)
        {
            if (liste.pages[n].Nom == nom)
            {                
                liste.pages[n].Nom = newNom;
                liste.pages[n].Détail = detail;
                liste.pages[n].Image = image;
                sauveDonnee(liste,"pages");
                var fsa = require('fs');
                console.log("je vais renommer le fichier json de la page");
                fsa.rename(path.resolve(".") +'/src/public/informations/pages/' + nom + '.json', 
                           path.resolve(".") +'/src/public/informations/pages/' + newNom + '.json', function(err) {
                    if ( err ) console.log('ERROR: ' + err);
                });
                return true;
            }
        }
    return false;
}
/*----------------------------------------------------------------------------
                            Supprime la page
  ----------------------------------------------------------------------------*/
  routeprincipale.get('/getSupprimePage', function (req, res, next) {      
    var page = req.query.page;
    var conforme = getSupprimePage(page);
    res.send(conforme);
});

function getSupprimePage(page){
    let lesPages;
    try{
        lesPages = fs.readFileSync(path.resolve(".") +'/src/public/informations/pages.json');
    }
    catch {
        console.log("Erreur")
        creationPages();
    }
    var liste = JSON.parse(lesPages);
    //fs.close();

    var l = { "pages": []}
    for (var n in liste.pages){
        if (liste.pages[n].Nom == page) {
//################################################################################################################################
// SUPPRIMER SON JSON ############################################################################################################
            liste.pages.splice(n,1);
// SUPPRIMER SON JSON ############################################################################################################
//################################################################################################################################
            sauveDonnee(liste,"pages");
            return true;
        } 
    }
    return false;
}
/*----------------------------------------------------------------------------
                            Liste les pages
  ----------------------------------------------------------------------------*/
  routeprincipale.get('/getlistePages', function (req, res, next) {     
    var liste = getlistePages();
    res.send(liste);
});

function getlistePages(){
    let lesPages;
    try{
        lesPages = fs.readFileSync(path.resolve(".") +'/src/public/informations/pages.json');
    }
    catch {
        creationPages();
    }
    var liste = JSON.parse(lesPages);
    var tab = new Array(); 
    for (var n in liste.pages){
        tab.push(liste.pages[n].Nom);
    }
    return tab;
}
/*----------------------------------------------------------------------------
                            Infos page
  ----------------------------------------------------------------------------*/
  routeprincipale.get('/getinfoPage', function (req, res, next) {   
    var page = req.query.page;  
    var liste = getinfoPage(page);
    res.send(liste);
});

function getinfoPage(page){
    let lesPages;
    try{
        lesPages = fs.readFileSync(path.resolve(".") +'/src/public/informations/pages.json');
    }
    catch {
        creationPages();
    }
    var liste = JSON.parse(lesPages);
    for (var n in liste.pages){
        if (liste.pages[n].Nom == page){
            return liste.pages[n];
        }
    }
    return null;
}

/*----------------------------------------------------------------------------
                            Objets de la page
  ----------------------------------------------------------------------------*/
  routeprincipale.get('/getObjetsPage', function (req, res, next) {   
    var page = req.query.page;  
    var liste = getObjetsPage(page);
    res.send(liste);
});

function getObjetsPage(page){ 
    let lesObjets;
    try{
        lesObjets = fs.readFileSync(path.resolve(".") +'/src/public/informations/pages/' + page + '.json');
    }
    catch {
        console.log(page)
      //  creationPages();
    }
    var liste = JSON.parse(lesObjets);
    return liste.objet;
}
/*----------------------------------------------------------------------------
                    Récupère toutes les images fond en stock
  ----------------------------------------------------------------------------*/
  routeprincipale.get('/getListeStockImages', function (req, res, next) { 
    const lesFichiers = new Array();
    fs.readdir(path.resolve(".") +'/src/public/Informations/images/fondPages', function(err, fichiers) {
        for (var ff in fichiers){
            lesFichiers.push(fichiers[ff]);
    }
    res.send(lesFichiers);
    });
});
/*----------------------------------------------------------------------------
                                Nouvelle Page
  ----------------------------------------------------------------------------*/
  routeprincipale.get('/getNouvellePage', function (req, res, next) { 
    getNouvellePage();
    res.send(true);
});

function getNouvellePage(){
    let lesPages;
    try{
        lesPages = fs.readFileSync(path.resolve(".") +'/src/public/informations/pages.json');
    }
    catch {
        creationPages();
    }
    var liste = JSON.parse(lesPages);
    var nouvelle = {
                    "Nom": "nouvelle page",
                    "Image": "defaut.jpg",
                    "Détail": "Nouvelle page à renseigner"
                    };
    liste.pages.push(nouvelle);
    sauveDonnee(liste,"pages");
    creationPageVierge("nouvelle page");

    return true;
}
/*----------------------------------------------------------------------------
                                La Page exist ?
  ----------------------------------------------------------------------------*/
  routeprincipale.get('/getPageExist', function (req, res, next) { 
    var page = req.query.page; 
    var existe = getPageExist(page);
    res.send(existe);
});

function getPageExist(page){
    let lesPages;
    try{
        lesPages = fs.readFileSync(path.resolve(".") +'/src/public/informations/pages.json');
    }
    catch {
        creationPages();
    }
    var liste = JSON.parse(lesPages);
    var reponse = false;
    var liste =liste.pages.filter( c => c.Nom === page);
    if (liste.length>0){
            reponse = true;
            return reponse;
    }
    return reponse;
}


/*############################################################################
  ############################################################################
                                 M O Y E N   /    P . C .
  ############################################################################
  ############################################################################*/
/*----------------------------------------------------------------------------
                                Charge la liste des objets (PC)
  ----------------------------------------------------------------------------*/
  routeprincipale.get('/getListeObjets', function (req, res, next) { 
    var objets = getListeObjets();
    res.send(objets);
});

function getListeObjets(){
    let lesObjets;
    try{ lesObjets = fs.readFileSync(path.resolve(".") +'/src/public/informations/objets.json'); }
    catch { }
    var objets = JSON.parse(lesObjets);
    return objets;
}
/*----------------------------------------------------------------------------
                                Nouveau Moyen
  ----------------------------------------------------------------------------*/
  routeprincipale.get('/getNouveauMoyen', function (req, res, next) { 
    var page = req.query.page; 
    var nom = req.query.nom; 
    var detail = req.query.detail; 
    var secteur = req.query.secteur; 
    var couleur = req.query.couleur; 
    var image = req.query.image; 
    var lesPC = req.query.lesPC;
    var pasDeTitre = req.query.pasTitre;
    var afficheInfos = req.query.afficheInfos;
    var x0 = req.query.x0; 
    var y0 = req.query.y0;
    var x1 = req.query.x1;
    var y1 = req.query.y1;
    var id = req.query.id; 
    getNouveauMoyen(     page, nom, detail, secteur, couleur, lesPC, x0, y0, x1, y1, id, image, pasDeTitre, afficheInfos);
    res.send(true);
});

function getNouveauMoyen(page, nom, detail, secteur, couleur, pcs, x0, y0, x1, y1, id, image, pasDeTitre, afficheInfos){
    let laPage;
    try{
        laPage = fs.readFileSync(path.resolve(".") +'/src/public/informations/pages/' + page + '.json');
    }
    catch {
        ///////////creationPages();
    }
    var objets = JSON.parse(laPage);
    var listeObjets = pcs.split('\\');
    const lesObjets = new Array();
    for (var o=0; o<listeObjets.length; o++){
        var v = listeObjets[o].split("@");
        if (v[0]!=""){
            var obj = {
                "Nom": v[0],
                "FormatObjet": "Ordinateur",
                "Secteur": secteur,
                "Détail": v[1],
                "x": 1968,
                "y": 1968
            }
            lesObjets.push(obj);
        }
    }

    var nouvelle = {
                    "Nom": nom,                    
                    "Détail": detail,
                    "Secteur": secteur,
                    "type": "combine",
                    "couleur": couleur,
                    "image": image,
                    "pasDeTitre": pasDeTitre,
                    "afficheInfos": afficheInfos,
                    "x0": x0,
                    "y0": y0,
                    "x1": x1,
                    "y1": y1,
                    "objets": lesObjets
                    };
    if (id == -1){
        objets.objet.push(nouvelle);
    } else {
        objets.objet[id] = nouvelle;
    }
    console.log(nouvelle);
    sauveDonnee(objets, "pages/" + page);
}
/*----------------------------------------------------------------------------
                                Supprime PC ou moyen
  ----------------------------------------------------------------------------*/
  routeprincipale.get('/getSupprimePCOuMoyen', function (req, res, next) { 
    var page = req.query.page;
    var id = req.query.id;
    getSupprimePCOuMoyen(page, id);
    res.send(true);
});

function getSupprimePCOuMoyen(page, id){
    let laPage;
    try{ laPage = fs.readFileSync(path.resolve(".") +'/src/public/informations/pages/' + page + '.json'); }
    catch { }
    var donnees = JSON.parse(laPage);
    donnees.objet.splice(id, 1);
    sauveDonnee(donnees,'/pages/' + page);

    return true;
}
/*----------------------------------------------------------------------------
                                Nouveau PC
  ----------------------------------------------------------------------------*/
  routeprincipale.get('/getNouveauPC', function (req, res, next) { 
    var page = req.query.page; 
    var hostname = req.query.hostname;
    var x = req.query.x; 
    var y = req.query.y;
    var id = req.query.id;
    var secteur = req.query.secteur;
    var format = req.query.format;
    var detail = req.query.detail;
    getNouveauPC(page, hostname, x, y, id, secteur, format, detail);
    res.send(true);
});

function getNouveauPC(page, hostname, x, y, id, secteur, format, detail){
    let laPage;
    try{ laPage = fs.readFileSync(path.resolve(".") +'/src/public/informations/pages/' + page + '.json'); }
    catch { }
    var donnees = JSON.parse(laPage);
    
    var nouveau = {
        "Nom": hostname,
        "type": "simple",
        "Secteur": secteur,
        "FormatObjet": format,
        "Détail": detail,
        "x": x,
        "y": y
        };

    if (id==-1) {
        donnees.objet.push(nouveau);
    } else {
        donnees.objet[id]=nouveau;
    }
    sauveDonnee(donnees,'/pages/' + page);

    return true;
}
/*----------------------------------------------------------------------------
                                Sauve les objets
  ----------------------------------------------------------------------------*/   
  routeprincipale.get('/getSauveObjet', function (req, res, next) { 
    console.log("#################################################################");
    console.log("#                         SAUVE LES OBJETS                      #");
    console.log("#################################################################");
    var obj = JSON.parse(req.query.objets);

    var F = path.resolve(".") +'/src/public/informations/objets.json';
    fs.writeFile(F, JSON.stringify(obj, null, 4), (err) => {  
        if (err) throw err;
        console.log('#    Données sauvées dans\objets.json');
        console.log("#################################################################");
    });

    res.send('Données sauvées dans\tobjets.json');

});


/*############################################################################
  ############################################################################ 
                             I N D I C A T E U R S
  ############################################################################
  ############################################################################*/
   /*----------------------------------------------------------------------------
                                Sauve les indicateurs
  ----------------------------------------------------------------------------*/   
    routeprincipale.get('/getSauveIndicateur', function (req, res, next) { 
        console.log("#################################################################");
        console.log("#                      SAUVE LES INDICATEURS                    #");
        console.log("#################################################################");
        var indic = JSON.parse(req.query.indicateurs);

        var F = path.resolve(".") +'/src/public/informations/indicateurs.json';
        fs.writeFile(F, JSON.stringify(indic, null, 4), (err) => {  
            if (err) throw err;
            console.log('#    Données sauvées dans\tindicateurs.json');
            console.log("#################################################################");
        });

        res.send('Données sauvées dans\tindicateurs.json');

    });
  /*----------------------------------------------------------------------------
                        Demande de récupération des indicateurs
  ----------------------------------------------------------------------------*/
  routeprincipale.get('/getIndicateurs', function (req, res, next) { 
    //var hostname = req.query.hostname;
    res.send(getIndicateurs());
});

function getIndicateurs(){
    let laPage;
    try{ laPage = fs.readFileSync(path.resolve(".") +'/src/public/informations/indicateurs.json'); }
    catch { }
    return JSON.parse(laPage);
}
/*----------------------------------------------------------------------------
                        Demande de récupération des infos dess indicateurs
  ----------------------------------------------------------------------------*/
  routeprincipale.get('/getIndicateursInfos', function (req, res, next) { 
    res.send(getIndicateursInfos());
});

function getIndicateursInfos(){
    let laPage;
    try{ laPage = fs.readFileSync(path.resolve(".") +'/src/public/informations/indicateursInfos.json'); }
    catch { }
    return JSON.parse(laPage);
}

/*----------------------------------------------------------------------------
                                Sauve la config
  ----------------------------------------------------------------------------*/   
  routeprincipale.get('/getSauveConfig', function (req, res, next) { 
    console.log("#################################################################");
    console.log("#                      SAUVE LA CONFIGURATION                   #");
    console.log("#################################################################");    
    var conf = JSON.parse(req.query.config);

    var F = path.resolve(".") +'/src/public/informations/config.json';
    fs.writeFile(F, JSON.stringify(conf, null, 4), (err) => {  
        if (err) throw err;
        console.log('#    Données sauvées dans\tconfig.json');
        console.log("#################################################################");
    });
    res.send('Données sauvées dans\tconfig.json');
});
/*----------------------------------------------------------------------------
                                Sauve les secteurs
  ----------------------------------------------------------------------------*/   
  routeprincipale.get('/getSauveSecteurs', function (req, res, next) { 
    console.log("#################################################################");
    console.log("#                        SAUVE LES SECTEURS                     #");
    console.log("#################################################################");    
    var secteurs = JSON.parse(req.query.secteurs);

    var F = path.resolve(".") +'/src/public/informations/secteurs.json';
    fs.writeFile(F, JSON.stringify(secteurs, null, 4), (err) => {  
        if (err) throw err;
        console.log('#    Données sauvées dans\tSecteurs.json');
        console.log("#################################################################");
    });
    res.send('Données sauvées dans\tSecteurs.json');
});
/*----------------------------------------------------------------------------
                            Liste les fichiers d'un dossiers
  ----------------------------------------------------------------------------*/
  routeprincipale.get('/getListeFichiers', function (req, res, next) { 
        var dossier = req.query.dossier;
        dossier = dossier.replace("static",path.resolve(".") + '/src/public');
        const lesFichiers = new Array();

        fs.readdir(dossier, function(err, fichiers) {
                for (var ff in fichiers){                
                    var dat = dateFichier(dossier, fichiers[ff])
                    lesFichiers.push(fichiers[ff] + ">" + dat);
            }
            res.send(lesFichiers);
        });
    });

function dateFichier(dossier,f){
    var data = fs.statSync(dossier + "\\" + f)
    var mtime = data.mtime;
    month = mtime.getMonth() + 1;
    day = mtime.getDate();
    year = mtime.getFullYear();
    return day+'/'+month+'/'+year
}
/*############################################################################
  ############################################################################
                                F I C H I E R S
  ############################################################################
  ############################################################################*/
  /*----------------------------------------------------------------------------
                            Création dossier
  ----------------------------------------------------------------------------*/
  routeprincipale.get('/getCreerDossier', function (req, res, next) { 
    var rep = req.query.dossier;
    while (rep.indexOf("/")>-1) {rep=rep.replace("/","\\")}
    rep = rep.replace("static",path.resolve(".") + '/src/public');

    var reponse = true;
    var filessystem = require("fs");
    if (!filessystem.existsSync(rep)){
        filessystem.mkdirSync(rep);
    } else {
        reponse = false;
    }
    res.send(reponse);
});
  /*----------------------------------------------------------------------------
                        Demande de récupération des indicateurs
  ----------------------------------------------------------------------------*/
  routeprincipale.get('/getLectureFichier', function (req, res, next) { 
    var f = req.query.fichier;
    res.send(getLectureFichier(f));
});

function getLectureFichier(f){
    let fichier;
    try{ fichier = fs.readFileSync(path.resolve(".") +'/src/public/informations/' + f + '.json'); }
    catch { }
    return JSON.parse(fichier);
}
/*----------------------------------------------------------------------------
                            Supprime un fichier
  ----------------------------------------------------------------------------*/
  routeprincipale.get('/getSupprimeFichiers', function (req, res, next) { 
    var f = req.query.fichier;
    f = f.replace("static",path.resolve(".") + '/src/public');
    res.send(getSupprimeFichiers(f));
});

function getSupprimeFichiers(f) {
    var fs = require('fs');
    var filePath = f;
    fs.unlinkSync(filePath);
}
/*----------------------------------------------------------------------------
                        Lit le fichier type texte
  ----------------------------------------------------------------------------*/
  routeprincipale.get('/getLireLignesFichier', function (req, res, next) { 
    var f = req.query.fichier;
    res.send(getLireLignesFichier(f));
});

function getLireLignesFichier(fichier){    
    const fs = require('fs');
    return fs.readFileSync(fichier);
}
/*############################################################################*/
/*----------------------------------------------------------------------------
                                    PING
  ----------------------------------------------------------------------------*/
  routeprincipale.get('/getPing', function (req, res, next) { 
    var hostname = req.query.hostname;
    var host = hostname.split('@')[1];

    console.log("ping " + host);
    //require('child_process').exec("C:\\Windows\\System32\\cmd.exe",{ cwd  : 'ping localhost' }, function() {})
    
    var ping = require('ping');
    ping.sys.probe(host, function(isAlive){
        var msg = isAlive ? hostname + '\tok' : hostname + '\tnon ok';
   //     console.log(msg);
        res.send(msg);
    });
});

/*############################################################################
  ############################################################################
                        C H A R G E M E N T   I M A G E
  ############################################################################
  ############################################################################*/
  /*----------------------------------------------------------------------------
                                    Image fond de carte
  ----------------------------------------------------------------------------*/
  routeprincipale.post('/postgoImageCarte', (req, res, next) => {
    var form = new formidable.IncomingForm(); 
    var fichier;
    console.log("On importe une image (pour le fond de page) ici");
    form.parse(req);
    form.uploadDir = '\\public\\informations\\images\\fondPages\\';
    form.on('fileBegin', function (name, file) {
        file.path = __dirname + '\\public\\informations\\images\\fondPages\\' + file.name;   
        fichier = file.name;
    });  
    
    form.on('file', function (name, file) {
        console.log('Image : [' +file.name + '] Chargée');
    });  
    res.status(200).send("ok");  
});
/*----------------------------------------------------------------------------
                                    Image objet
  ----------------------------------------------------------------------------*/
  routeprincipale.post('/postgoImageObjet', (req, res, next) => {
    var form = new formidable.IncomingForm(); 
    var fichier;
    console.log("On importe une image d'objet ici");
    form.parse(req);
    form.uploadDir = '\\public\\informations\\images\\objets\\';
    form.on('fileBegin', function (name, file) {
        file.path = __dirname + '\\public\\informations\\images\\objets\\' + file.name;   
        fichier = file.name;
    });  
    
    form.on('file', function (name, file) {
        console.log('Image : [' +file.name + '] Chargée');
    });  
    res.status(200).send("ok");  
});  
/*----------------------------------------------------------------------------
                                    Image indicateur
  ----------------------------------------------------------------------------*/
  routeprincipale.post('/postgoImageIndicateur', (req, res, next) => { 
    console.log("On va importer une image ici");
    var form = new formidable.IncomingForm(); 
    var fichier;
    console.log("On importe une image ici");
    form.parse(req);
    form.uploadDir = '\\public\\informations\\images\\indicateurs\\';
    form.on('fileBegin', function (name, file) {
        file.path = __dirname + '\\public\\informations\\images\\indicateurs\\' + file.name;
        fichier = file.name;
    });
    
    form.on('file', function (name, file) {
        console.log('Image : [' +file.name + '] Chargée');
    });
    res.status(200).send("ok");
});
/*----------------------------------------------------------------------------
                                    Image fond d'écran
  ----------------------------------------------------------------------------*/
  routeprincipale.post('/postgoImageEcran', (req, res, next) => {
    var form = new formidable.IncomingForm(); 
    var fichier;
    console.log("On importe une image de fond d'écran ici");
    form.parse(req);
    form.uploadDir = '\\public\\img\\Fonds_Ecran\\';
    form.on('fileBegin', function (name, file) {
        file.path = __dirname + '\\public\\img\\Fonds_Ecran\\' + file.name;   
        fichier = file.name;
    });  
    
    form.on('file', function (name, file) {
        console.log('Image : [' +file.name + '] Chargée');
    });  
    res.status(200).send("ok");  
});
/*----------------------------------------------------------------------------
                                    Image fond de moyen
  ----------------------------------------------------------------------------*/
  routeprincipale.post('/postgoImageMoyen', (req, res, next) => {
    var form = new formidable.IncomingForm(); 
    var fichier;
    console.log("On importe une image de moyen ici");
    form.parse(req);
    form.uploadDir = '\\public\\informations\\images\\fondmoyens\\';
    form.on('fileBegin', function (name, file) {
        file.path = __dirname + '\\public\\informations\\images\\fondmoyens\\' + file.name;   
        fichier = file.name;
    });  
    
    form.on('file', function (name, file) {
        console.log('Image : [' +file.name + '] Chargée');
    });  
    res.status(200).send("ok");  
});
/*----------------------------------------------------------------------------
                                    Image logos
  ----------------------------------------------------------------------------*/
  routeprincipale.post('/postgoImageLogo', (req, res, next) => {
    var form = new formidable.IncomingForm(); 
    var fichier;
    console.log("On importe une image de moyen ici");
    form.parse(req);
    form.uploadDir = '\\public\\informations\\images\\logos\\';
    form.on('fileBegin', function (name, file) {
        file.path = __dirname + '\\public\\informations\\images\\logos\\' + file.name;   
        fichier = file.name;
    });  
    
    form.on('file', function (name, file) {
        console.log('Image : [' +file.name + '] Chargée');
    });  
    res.status(200).send("ok");  
});  
/*############################################################################
  ############################################################################
                               F O N C T I O N S
  ############################################################################
  ############################################################################*/
/*----------------------------------------------------------------------------
                            Sauve en fichier json
  ----------------------------------------------------------------------------*/
function sauveDonnee(liste, json) {
    var F = path.resolve(".") +'/src/public/informations/' + json + '.json';
    fs.writeFile(F, JSON.stringify(liste, null, 4), (err) => {  
        if (err) throw err;
        console.log('Données sauvées dans \t public/informations/' + json + '.json');
    });
}

function ajouteImageAListe(nom){
    var f = path.resolve(".") +'\\src\\public\\informations\\images\\fondPages\\imagesfond.txt';
    var fis = require('fs');
    var textByLine = fis.readFileSync(f);
    var lignes = textByLine.toString().split("\n");
    var vu = false;
    for (var n in lignes){
        if (lignes[n]==nom) { vu=true; }
    }
    if (!vu){
        textByLine = textByLine + "\n" + nom;
        fis.writeFile(f, textByLine, function(err) {
            if(err) return console.error(err);
        });
    }
}




module.exports.routeprincipale = routeprincipale;