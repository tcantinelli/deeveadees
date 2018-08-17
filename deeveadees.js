//Liaison entre la directive ng-app et la couche métier
var deeveadeesModule = angular.module("deeveadees",[]);

deeveadeesModule.controller("listeDefilms", function ($scope,$http){
    
    $scope.films = [];
    $scope.film ={
            id: 0,
            titre: "",
            genre: "",
            annee: "",
            realisateur: "",
            acteurs: "",
            synopsis: "",
            trailer: ""
    };
    
    $http.get("https://fierce-peak-88942.herokuapp.com/films").then(function (response) {
        $scope.films = response.data;
    });

    
});

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
});

//Declaration du controlleur de notre modèle. Arguments: nom + fonction qui se declenche
//deeveadeesModule.controller("listeDefilms", function ($scope){ //$scope permet de lier nos variables avec angular
//
//
//   $scope.films = [
//    {
//            id: 1,
//            titre: "Abyss",
//            genre: "Science-fiction",
//            annee: "1998",
//            realisateur: "James Cameron",
//            acteurs: "Ed Harris, Mary Elizabeth Mastrantonio, Michael Biehn",
//            synopsis: "Un commando de la Marine américaine débarque à bord de la station de forage sous-marine DeepCore, afin de porter secours à un sous-marin échoué dans les profondeurs. L'équipe de Bud Brigman accueille ces nouveaux arrivants, ainsi que Lindsey, future ex-femme de Bud. Alors que les travaux de récupération commencent autour du submersible naufragé, l'équipage de DeepCore doit faire face à des phénomènes inexpliqués. Et s'ils n'étaient pas seuls, dans les abysses ?",
//            trailer: "https://www.youtube.com/embed/4zbpL3LeW7k"
//    },
//    {
//            id: 2,
//            titre: "Avengers: Infinity War",
//            genre: "Action",
//            annee: "2018",
//            realisateur: "Joe Russo, Anthony Russo",
//            acteurs: "Robert Downey Jr., Chris Hemsworth, Mark Ruffalo",
//            synopsis: "Les Avengers et leurs alliés devront être prêts à tout sacrifier pour neutraliser le redoutable Thanos avant que son attaque éclair ne conduise à la destruction complète de l’univers.",
//            trailer: "https://www.youtube.com/embed/QwievZ1Tx-8"
//    }
//   ];
   
//Affiche les infos du film dans les champs

//$scope.detail = function(id){
//    
//    $scope.titreFilm = 'hello world';
//
//    for(var i = 0 ; i < $scope.films.length ; i++){
//
//        if($scope.films.id === id){{
//       
//    }
//            //$scope.firstname = $scope.films[i].titre;
//        }
//    }
//};


//deeveadeesModule.component('listeDefilms', {
//    templateUrl: 'https://fierce-peak-88942.herokuapp.com/films',
//    controller: function DeeveadeesController($http) {
//      var self = this;
//      self.orderProp = 'id';
//
//      $http.get('phones/phones.json').then(function(response) {
//        self.phones = response.data;
//      });
//    }
//  });


