// GLOBAL VARIABLES
var search = "";
var excluded = "";
var healthVegan = "";
var healthVeggie = "";
var nutFree = "";
var searchInput = $("#main");
var checkVegan = $("#vegan");
var checkVeggie = $("#vegetarian")
var checkNut = $("#nutFree");
var checkExcl = $("#exclude");
var favArr = JSON.parse(localStorage.getItem("favArr")) || [];

renderFavList();

function renderFavList() {
    // empty the list before populating to avoid 
    $("#saved-recipes").empty();
    // 'for of' loop to create favourites list
    for (const favourite of favArr) {
        console.log(favArr.length);
        var favAnc = $("<a>").text(favourite.recipeName).attr("href", favourite.url);
        var favItem = $("<li>").append(favAnc)
        $("#saved-recipes").prepend(favItem);
        // conditional statement to limit the array length to 9
        if (favArr.length > 9) {
            favArr.shift();
        };
    };

}

// ONCLICK for start page
$("#strtBtn").on("click", function (event) {
    event.preventDefault();
    startPg();
})
//START BUTTON TO NEXT PAGE
function startPg() {
    $("#strtPg").addClass("hide");
    $("#userForm").removeClass("hide");
    // return false;
};

// ONCLICK for search
$("#srchBtn").on("click", function (event) {
    event.preventDefault();
    $("#userForm").addClass("hide");
    $("#ingredientList").removeClass("hide");
    $("#drinkBtn").removeClass("hide");
    callAPI();
});

function callAPI() {
    // getting values from the search input
    search = searchInput.val().trim();
    excluded = checkExcl.val().trim();
    // conditional statements to check for 'checked' boxes
    if (checkVegan.is(":checked")) {
        healthVegan = "&health=vegan"
    }
    if (checkVeggie.is(":checked")) {
        healthVeggie = "&health=vegetarian"
    }
    if (checkNut.is(":checked")) {
        nutFree = "&health=peanut-free&health=tree-nut-free"
    }

    var apiID = "271242ec";
    var apiKEY = "f01212876eaf371a9693f1c0ee6b6dc0";
    var queryURL = "https://api.edamam.com/search?app_id=" + apiID + "&app_key=" + apiKEY + "&q=" + search + healthVegan + healthVeggie + nutFree + "&excluded=" + excluded;

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        if (response.hits.length == 0) {
            // console.log("search fail");
            $("#valid-search").removeClass("hide");
        }
        else {
            // console.log(response);
            // console.log(queryURL);
            // local variables
            var listNum = 0;
            var headers = response.hits;
            // for loop to create content into the html containers
            for (var i = 0; i < headers.length; i++) {
                $("#header" + listNum).text(headers[i].recipe.label);
                $("#recipe" + listNum).text(headers[i].recipe.ingredientLines);
                $("#image" + listNum).attr("src", headers[i].recipe.image);
                $("#link" + listNum).attr("href", headers[i].recipe.url);
                listNum++;
                // console.log(headers[i].recipe.label)
            }
        }
        // onclick to change the 'favorite' icon
        $(".favourite").on("click", function () {
            // find the recipe name and url
            var storeHeader = $(this).parent().find("span").text();
            var storeURL = $(this).parent().siblings().find("a").attr("href");
            console.log(storeURL);
            // populates object with favourited name and url
            var emptyObj = {
                recipeName: "",
                url: ""
            }
            emptyObj.recipeName = storeHeader;
            emptyObj.url = storeURL;
            // pushes to favArr
            favArr.push(emptyObj);
            // call function to create favourite list
            renderFavList();
            // console.log(storeHeader);
            // turns the border heart icon into a filled one
            $(this).text("favorite");
            // console.log(favArr);
            // saves favArr to local storage
            localStorage.setItem("favArr", JSON.stringify(favArr));
        })

    });

}



//checking age is over 18

$("#over18").click(function () {
    findDrinks(search);
});

//ajax call for drinks pairing
function findDrinks(search) {
    search = searchInput.val().trim();
    var baseURL = "https://api.punkapi.com/v2/beers";

    var drinksURL = `${baseURL}?food=${search}`

    $.ajax({
        url: drinksURL,
        method: "GET"
    }).then(function (response) {
        var beers = response;
        console.log(beers);
        processBeerList(beers);
    });
}

//display drinks pairing
function processBeerList(beers) {
    var beerList = $("#drinks-list");
    beerList.empty();

    $.each(beers, function (index, beer) {

        if (index <= 4) {

            beerList.append('<li>' + beer.name + "<br>" + '<img class="beer-image" src="' + beer.image_url + '"/></li>');
            $(".beer-image").height("10%")
            $(".beer-image").width("10%")
            console.log(beer.name);
        }
        else {

        }


    });
}