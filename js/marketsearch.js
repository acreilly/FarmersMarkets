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
var search = new MarketSearchController()
$("form").on("submit", function(){
  search.searchMarket()
})
$("ul").on("click", "li", function(){
  search.getDetails()
})
})

function MarketSearchController(){}
MarketSearchController.prototype = {
  searchMarket: function(){
    event.preventDefault()
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
  getDetails: function(){
    var marketID = this.id;
debugger
    $.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: "http://search.ams.usda.gov/farmersmarkets/v1/data.svc/mktDetail?id=" + marketID,
        dataType: 'jsonp',
        jsonpCallback: 'detailResultHandler'
    }).done(function(data){
    });
  }
}