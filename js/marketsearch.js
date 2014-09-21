// (function(){
//   var app = angular.module("FarmersMarkets", ['ngRoute'])

//   app.controller("MarketSearchController", function(){
    // this.searchMarket = function(zipcode){
    //   var zip = parseInt(zipcode)
    //   $.ajax({
    //     type: "GET",
    //     contentType: "application/json; charset=utf-8",
    //     url: "http://search.ams.usda.gov/farmersmarkets/v1/data.svc/zipSearch?zip=" + zip,
    //     dataType: 'jsonp',
    //     jsonpCallback: 'searchResultsHandler'
    //   }).done(function(){
    //     debugger
    //   });
    // }
  // });

// });

$(document).ready(function(){
  var view = new MarketSearchView()
  var search = new MarketSearchController(view)
  $("form").on("submit", function(){
    search.view.removeMarkets()
    search.searchMarket()
  })
  $("ul").on("click", "span", function(){
    search.getDetails(this)
  })
})


function MarketSearchView(){}
MarketSearchView.prototype = {
  addMarkets: function(){

  },
  removeMarkets: function(){
    $(".container").addClass("searchBox")

  },
  addOrRemoveDetails: function(market, details){
    var address = details.Address,
    googleLink = details.GoogleLink,
    googleQuery = googleLink.substr(googleLink.indexOf('?') + 1),
    products = details.Products,
    schedule = details.Schedule,
    api_key = 'AIzaSyCyRtY733lg5p6a1ZOJeY8hS3xbBXhEfOE';

    if($(market).siblings().length === 0){
      $(market).after("<ul class='info'><li><strong> Schedule: </strong>" + schedule + "</li><li><strong>Address: </strong>" + address + "</li><li><strong>Products: </strong>" + products + "</li><li><iframe src='https://www.google.com/maps/embed/v1/place?key=" + api_key + "&" + googleQuery + "'></iframe></li></ul>")
      $(market).addClass("active")
    } else{
      this.removeDetails(market);
    }
  },
  removeDetails: function(market){
    $(market).siblings().remove();
    $(market).removeClass("active");
  }
}

function MarketSearchController(view){
  this.view = view;
}
MarketSearchController.prototype = {
  searchMarket: function(){
    event.preventDefault()
    $(".markets")[0].innerHTML = ""
    var zip = $("input").val()
    $.ajax({
      type: "GET",
      contentType: "application/json; charset=utf-8",
      url: "http://search.ams.usda.gov/farmersmarkets/v1/data.svc/zipSearch?zip=" + zip,
      dataType: 'jsonp',
      jsonpCallback: 'searchResultsHandler'
    }).done(function(data){
      if(data.results[0].id === "Error"){
        $(".markets").append("<li><strong>" + data.results[0].marketname + "</strong></li>");
      } else {
        $(data.results).each(function(){
          var market = this.marketname
          var marketname = market.substr(market.indexOf(' ')+1);
          var miles = market.substr(0,market.indexOf(' '));
          $(".markets").append("<li><span id='" + this.id + "'>" + miles + " miles: " + marketname + "</span></li>")

        })
      }
    });
  },
  getDetails: function(market){
    this.market = market;
    $.ajax({
      type: "GET",
      contentType: "application/json; charset=utf-8",
      url: "http://search.ams.usda.gov/farmersmarkets/v1/data.svc/mktDetail?id=" + market.id,
      dataType: 'jsonp',
      jsonpCallback: 'detailResultHandler'
    }).done(function(data){
      var details = data.marketdetails;
      this.view.addOrRemoveDetails(this.market, details)
    }.bind(this));
  }
}