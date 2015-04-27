$(document).ready(function(){
  var view = new MarketSearchView()
  var search = new MarketSearchController(view)
  search.initialize()
})


function MarketSearchView(){}
MarketSearchView.prototype = {
  addMarkets: function(data){
    $(data).each(function(){
      var market = this.marketname,
      marketname = market.substr(market.indexOf(' ')+1),
      miles = market.substr(0,market.indexOf(' '));

      $(".markets").append(
        "<li><span id='" + this.id + "'>"+ miles +
        " miles: " + marketname + "</span></li>"
        )
    })
  },
  removeMarkets: function(){
    $(".container").addClass("searchBox")
  },
  addOrRemoveDetails: function(market, details){
    var address = details.Address,
    googleLink = details.GoogleLink,
    googleArray = googleLink.split("("),
      googleCenter = googleArray[0].substr(googleLink.indexOf('?') + 1),
      googleQuery = googleLink.substr(googleLink.indexOf('?') + 1),
      products = details.Products,
      schedule = details.Schedule,
      api_key = 'AIzaSyBCGODBdUo-Un5kp_JQDmsoh3V9OzI0YXA';

      if($(market).siblings().length === 0){

        $(market).after(
          "<ul class='info'><li><strong> Schedule: </strong>" +
          schedule + "</li><li><strong>Address: </strong>" +
          address + "</li><li><strong>Products: </strong>" +
          products + "</li><li><iframe src='https://www.google.com/maps/embed/v1/place?key=" +
          api_key + "&" + googleCenter + "'></iframe></li></ul>"
          )

        $(market).addClass("active")
      } else {
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
    initialize: function(){
      var self = this;
      $("form").on("submit", function(){
        self.view.removeMarkets()
        self.searchMarket()
      })
      $("ul").on("click", "span", function(){
        self.getDetails(this)
      })
    },
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

          $(".markets").append(
            "<li><strong>" + data.results[0].marketname + "</strong></li>"
            );

        } else {
          this.view.addMarkets(data.results)
        }
      }.bind(this));
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
        this.view.addOrRemoveDetails(this.market, details);
      }.bind(this));
    }
  }