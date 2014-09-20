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
    search.searchMarket()
  })
  $("ul").on("click", "li", function(){
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
  addDetails: function(market, details){
    var address = details.Address,
    googleLink = details.GoogleLink,
    products = details.Products,
    schedule = details.Schedule;
    if(market.childNodes.length <= 1){
    $(market).append("<ul class='list-unstyled'><li class='active'>" + schedule + "<br>" + address + "<br>" + googleLink + "<br>" + products + "</li></ul>")
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
        $(".markets").append("<li id='" + this.id + "'>" + miles + " miles: " + marketname + "</li>")
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
      this.view.addDetails(this.market, details)
    }.bind(this));
  }
}