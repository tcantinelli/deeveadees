var listeDeFilms = [];

$(document).ready(function () {
    //Recuperation de la liste de film et affichage
    $.ajax({
        type: "GET",
        url: "https://fierce-peak-88942.herokuapp.com/films",
        dataType: "json",
        async: false,

        success: function (data) {
            listeDeFilms = data;
        },
        error: function (param1, param2) {
            alert("erreur dans la récupération des films");
        }
    });
    showTable()
});

//Affichage table
function showTable() {

    //Efface la precedente liste
    $("#ligne").empty();

    for (var i = 0; i < listeDeFilms.length; i++) {

        $("#ligne").append(
            $("<tr>")
                .append($("<td>").html(listeDeFilms[i].id))
                .append($("<td>").html(listeDeFilms[i].titre))
                .append($("<td>")
                    .attr("width", "190")
                    .append($("<button>")
                        .attr("type", "button")
                        .addClass("btn btn-info btn-sm petitBouton")
                        .attr("onclick", "editMovie(" + listeDeFilms[i].id + ");")
                        .html("Editer"))
                    .append($("<button>")
                        .attr("type", "button")
                        .addClass("btn btn-danger btn-sm petitBouton")
                        .attr("onclick", "deleteMovie(" + listeDeFilms[i].id + ");")
                        .html("Supprimer"))
                )
        );
    }
}


function editMovie(id) {

    for (var i = 0; i < listeDeFilms.length; i++) {
        if (listeDeFilms[i].id === id) {
            //Rempli les inputs

            $("#index").val(listeDeFilms[i].id);
            $("#titre").val(listeDeFilms[i].titre);
            $("#genre").val(listeDeFilms[i].genre);
            $("#annee").val(listeDeFilms[i].annee);
            $("#synopsis").val(listeDeFilms[i].synopsis);
            $("#filmID").val(listeDeFilms[i].id);
            $("#acteurs").val(listeDeFilms[i].acteurs);
            $("#realisateur").val(listeDeFilms[i].realisateur);
            $("#affiche").val(listeDeFilms[i].image);
            $("#trailer").val(listeDeFilms[i].trailer);

            //Ajoute la fonction saveMovie au boutton de sauvegarde

            $("#saveButt").attr("onclick", "saveMovie(" + id + ");")
        }
    }
}

//SAUVEGARDER LES MODIFICATIONS
function saveMovie(idUp) {

    var titre = $("#titre").val();
    var annee = $("#annee").val();
    var genre = $("#genre").val();
    var synopsis = $("#synopsis").val();
    var acteurs = $("#acteurs").val();
    var realisateur = $("#realisateur").val();
    var image = $("#affiche").val();
    var trailer = $("#trailer").val();

    var filmUp = {
                id: 0,
                titre: titre,
                genre: genre,
                annee: annee,
                realisateur: realisateur,
                image: image,
                acteurs: acteurs,
                synopsis: synopsis,
                trailer: trailer
        }
        
    $.ajax({
        type:"POST",
        url:"https://fierce-peak-88942.herokuapp.com/films/up/" + idUp,
        data: filmUp,
        
        success : function(data) {
            //Reaffiche la table
            listeDeFilms = data;
            showTable();
        },
        error : function(param1,param2) {
            alert("erreur");
        }
    });
}

//SUPPRIMER UN FILM
function deleteMovie(idDel) {
        
    $.ajax({
        type:"POST",
        url:"https://fierce-peak-88942.herokuapp.com/films/del/" + idDel,
        
        success : function(data) {
            //Reaffiche la table
            listeDeFilms = data;
            showTable();
        },
        error : function(param1,param2) {
            alert("erreur");
        }
    });
}
