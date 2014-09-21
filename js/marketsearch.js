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
    $(".container").addClass("searchBox")
    search.searchMarket()
  })
  $("ul").on("click", "span", function(){
    search.getDetails(this)
  })
})


function MarketSearchView(){}
MarketSearchView.prototype = {
  bindEvents: function(){

  },
  addMarkets: function(){

  },
  removeMarkets: function(){

  },
  addOrRemoveDetails: function(market, details){
    var address = details.Address,
    googleLink = details.GoogleLink,
    googleQuery = googleLink.substr(googleLink.indexOf('?') + 1),
    products = details.Products,
    schedule = details.Schedule,
    api_key = 'AIzaSyCyRtY733lg5p6a1ZOJeY8hS3xbBXhEfOE';
    if($(market).siblings().length === 0){
    $(market).after("<ul class='list-unstyled'><li class='active'>" + schedule + "<br>" + address + "<br>" + products + "<br><iframe src='https://www.google.com/maps/embed/v1/place?key=" + api_key + "&" + googleQuery + "'></iframe></li></ul>")
    } else{
      $(market).siblings().remove();
    }
  },
  removeDetails: function(){

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
      $(data.results).each(function(){
        var market = this.marketname
        var marketname = market.substr(market.indexOf(' ')+1);
        var miles = market.substr(0,market.indexOf(' '));
        $(".markets").append("<li><span id='" + this.id + "'>" + miles + " miles: " + marketname + "</span></li>")
      })
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