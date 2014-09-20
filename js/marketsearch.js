(function(){
  var app = angular.module("FarmersMarkets", ['ngRoute'])

  app.controller("MarketSearchController", function(){
    this.searchMarket = function(zipcode){
      var zip = parseInt(zipcode)
      $.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: "http://search.ams.usda.gov/farmersmarkets/v1/data.svc/zipSearch?zip=" + zip,
        dataType: 'jsonp',
        jsonpCallback: 'searchResultsHandler'
      }).done(function(){
        debugger
      });
    }
  });

});