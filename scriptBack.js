//Recuperation liste genres en francais sur TMDB au chargement de la page
var listeGenres = [];

$(document).ready(function () {
    $.ajax({
        type: "GET",
        url: "https://api.themoviedb.org/3/genre/movie/list?language=fr-FR&api_key=7dca21fe02caa7ab3342dcfecd943c8e",
        dataType: "json",
        async: false,

        success: function (data) {
            listeGenres = data.genres;
        },
        error: function (param1, param2) {
            alert("erreur");
        }
    });
});

//Fonction renvoyant le genre en string
function recupGenre(index) {

    var genreString = "";

    for (var i = 0; i < listeGenres.length; i++) {
        if (listeGenres[i].id === index) {
            genreString = listeGenres[i].name;
        }
    }

    return genreString;
}


//RECHERCHE DE FILMS
var choix = []; //Liste des resultats

function searchFilm() {

    //Efface la precedente liste affichee
    $("#resultFilms").empty();

    //Recup du titre du film à rechercher
    var requete = $("#recherche").val();

    //Requete sur TMDB

    $.ajax({
        type: "GET",
        url: "https://api.themoviedb.org/3/search/movie?api_key=7dca21fe02caa7ab3342dcfecd943c8e&language=fr-FR&query=" + requete + "&page=1&include_adult=false",
        dataType: "json",
        async: false,    //Le requete est synchrone pour attendre le retour de la liste des acteurs avant de continuer

        success: function (data) {
            choix = data.results;
        },
        error: function (param1, param2) {
            alert("erreur");
        }
    });

    showResults(); //Affichage des resultats
}

function showResults() {

    //Limitation du nombre de résultats à 6
    var taille = choix.length;

    if (taille > 6) {
        taille = 6;
    }

    //Affichage des resultats
    for (var i = 0; i < taille; i++) {

        //Recup des infos
        var titre = choix[i].original_title;
        var image = choix[i].poster_path;
        var annee = choix[i].release_date;
        var genre = choix[i].genre_ids[0];


        //Clone de la div        
        var newFilm = $("#resultat").clone(true);

        $(newFilm)
            .appendTo($("#resultFilms")) //Ajout à la liste des resultats
            .removeClass("hidden")  //Suppression de la classe hidden
            .removeAttr("id");    //Suppression de l'Id

        //Modification de la card
        var firstDiv = $(newFilm).first();

        //Ajout de l'image
        if (image === null) {
            firstDiv.find("img").attr("src", "./sources/unavailable.png");
        } else {
            firstDiv.find("img").attr("src", "https://image.tmdb.org/t/p/w500" + image);
        }

        //Ajout du alt
        firstDiv.find("img").attr("alt", titre);

        //Ajout fonction onClick
        firstDiv.find("img").attr("onClick", "selectMovie(" + i + ")");

        //Modif du card-body
        var cardBody = firstDiv.find("div");

        //DIV avec titre et smalls genre et année
        cardBody.find("h4").html(titre);
        cardBody.find("div").find("small")[0].innerHTML = recupGenre(genre);
        cardBody.find("div").find("small")[1].innerHTML = annee.substring(0, 4);
    }
}

//SELECTION FILM ET AFFICHAGE DES DATAS DANS CHAMPS TEXT

function selectMovie(id) {

    $("#titre").val(choix[id].original_title);
    $("#genre").val(recupGenre(choix[id].genre_ids[0]));
    $("#annee").val(choix[id].release_date.substring(0, 4));
    $("#synopsis").val(choix[id].overview);
    if (choix[id].poster_path !== null) {
        $("#image").val("https://image.tmdb.org/t/p/w500" + choix[id].poster_path);
    }

    //Recup acteurs et realisateur
    var listeActeurs = []; //cast dans le resultat
    var listeEquipe = []; //crew dans le resultat

    //Requete sur TMDB
    $.ajax({
        type: "GET",
        url: "https://api.themoviedb.org/3/movie/" + choix[id].id + "/credits?api_key=7dca21fe02caa7ab3342dcfecd943c8e",
        dataType: "json",
        async: false,    //Le requete est synchrone pour attendre le retour de la liste des acteurs avant de continuer

        success: function (data) {
            listeActeurs = data.cast;
            listeEquipe = data.crew;
        },
        error: function (param1, param2) {
            alert("erreur");
        }
    });

    //Affichage des 4 premiers acteurs dans l'input

    var longueur = 0;
    if (listeActeurs.length > 4) {
        longueur = 4;
    } else {
        longueur = listeActeurs.length;
    }

    var listeNames = "";
    for (var i = 0; i < longueur; i++) {
        if (i === (longueur - 1)) {
            listeNames += listeActeurs[i].name;
        } else {
            listeNames += listeActeurs[i].name + ", ";
        }
    }

    $("#acteurs").val(listeNames);

    //Recup Realisateur

    for (var i = 0; i < listeEquipe.length; i++) {
        if (listeEquipe[i].job === 'Director') {
            $("#realisateur").val(listeEquipe[i].name);
            break;
        }
    }

    //Recup adresse Youtube Trailer

    $.ajax({
        type: "GET",
        url: "https://api.themoviedb.org/3/movie/" + choix[id].id + "/videos?api_key=7dca21fe02caa7ab3342dcfecd943c8e&language=fr-FR",
        dataType: "json",
        async: false,    //Le requete est synchrone pour attendre le retour de la liste des acteurs avant de continuer

        success: function (data) {
            for (var i = 0; i < data.results.length; i++) {
                if (data.results[i].type === 'Trailer') {
                    $("#trailer").val("https://www.youtube.com/embed/" + data.results[i].key);
                    break;
                }
            }
        },
        error: function (param1, param2) {
            alert("erreur");
        }
    });

}

//AJOUT FILM AU FICHIER JSON
function addFilm() {

    var titre = $("#titre").val();
    var annee = $("#annee").val();
    var genre = $("#genre").val();
    var synopsis = $("#synopsis").val();
    var acteurs = $("#acteurs").val();
    var realisateur = $("#realisateur").val();
    var image = $("#image").val();
    var trailer = $("#trailer").val();

    //Creation du nouveau film en JSON
    var newFilm = {
        id: 0,   //ID provisoire, le nouvel ID est déterminé dans le script node.js
        titre: titre,
        genre: genre,
        annee: annee,
        realisateur: realisateur,
        image: image,
        acteurs: acteurs,
        synopsis: synopsis,
        trailer: trailer
    }

    //Requete pour ajouter
    $.ajax({
        type: "POST",
        url: "https://fierce-peak-88942.herokuapp.com/films/",
        data: newFilm,

        success: function (data) {
            console.log("film ajoute");
        },
        error: function (param1, param2) {
            alert("erreur");
        }
    });

}
