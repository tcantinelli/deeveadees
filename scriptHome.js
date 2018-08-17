var listInfos = []; //Var qui recevra les infos du film

//Recuperation de la liste de film et affichage
$(document).ready(function () {
    $.ajax({
        type: "GET",
        url: "https://fierce-peak-88942.herokuapp.com/films",
        dataType: "json",

        success: function (data) {
            showMovies(data);
        },
        error: function (param1, param2) {
            alert("erreur");
        }
    });
});

function showMovies(listeDeFilms) {

    for (var i = 0; i < listeDeFilms.length; i++) {

        //Clone de la div

        var newDiv = $("#movie").clone(true);

        $(newDiv)
            .appendTo($("#listeFilms"))
            .removeClass("hidden")
            .removeAttr("id");

        var firstDiv = $(newDiv).first();

        //Affichage image
        var poster = "";

        if (listeDeFilms[i].image === "") {
            poster = "./sources/unavailable.png";
        } else {
            poster = listeDeFilms[i].image;
        }

        firstDiv.find("a")
            .attr("data-productid", listeDeFilms[i].id)
            .find("img").attr("src", poster);

        var cardBody = firstDiv.find("div");

        //DIV avec titre et smalls genre et année
        cardBody.find("h4").html(listeDeFilms[i].titre);
        cardBody.find("div").find("small")[0].innerHTML = listeDeFilms[i].genre;
        cardBody.find("div").find("small")[1].innerHTML = listeDeFilms[i].annee;

    }
}

//FUNCTION GETFilm qui recupere les infos d'un film pour affichage dans modal

function getFilm(id) {
    $.ajax({
        type: "GET",
        url: "https://fierce-peak-88942.herokuapp.com/films/" + id,
        async: false,

        success: function (data) {
            listInfos = data;
        },
        error: function (param1, param2) {
            alert("erreur");
        }
    });
};

//AFFICHAGE MODAL

$(document).ready(function () {
    $('#myModal').on('show.bs.modal', function (event) { // id of the modal with event
        var imageA = $(event.relatedTarget) // Image that triggered the modal
        var productid = imageA.data('productid') // Extract info from data-* attributes


        //Recup des infos du film ciblé
        getFilm(productid);

        var title = listInfos.titre;
        var synopsis = listInfos.synopsis;
        var realisateur = listInfos.realisateur;
        var acteurs = listInfos.acteurs;
        var trailer = listInfos.trailer;

        // Update the modal's content.
        var modal = $(this)
        modal.find('.modal-title').text(title)
        modal.find('.body-real').text(realisateur)
        modal.find('.body-acteurs').text(acteurs)
        modal.find('.body-syno').text(synopsis)

        //Suppression du trailer si existant
        modal.find('.modal-footer').text("")

        //Ajout du trailer si dispo
        if (trailer !== "") {
            modal.find('.modal-footer').append('<iframe width="560" height="315" src=' + trailer + ' frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>')
        }
    })
})