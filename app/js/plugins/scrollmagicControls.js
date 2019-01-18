var $ = jQuery;

( function( $ ) {
  var Neu = Neu || {};

  $.fn.scrollmagicControls = function(options) {
      return this.each(function() {
          var scrollmagicControls = Object.create(Neu.scrollmagicControls);
          scrollmagicControls.init(this, options);
      });
  };

  $.fn.scrollmagicControls.options = {
      numberWrapper: ".numberWrapper",
      numberContainer: ".numberContainer",
      numberItem: ".number",
      letterWrapper: ".letterWrapper",
      letterContainer: ".letterContainer",
      letterText: ".letterText",
      letterItem: ".letter"
  };

  Neu.scrollmagicControls = {
      init: function(elem, options) {
          var self = this;
          self.$container = $(elem);
          self.options = $.extend({}, $.fn.scrollmagicControls.options, options);
          self.bindElements();

          self.triggerScrollMagic();

      },
      bindElements: function() {
        var self = this;

        self.$numberItem = self.$container.find(self.options.numberItem);
        self.$numberWrapper = self.$container.find(self.options.numberWrapper);
        self.$numberContainer = self.$container.find(self.options.numberContainer);
        self.$letterItem = self.$container.find(self.options.letterItem);
        self.$letterText = self.$container.find(self.options.letterText);
        self.$letterWrapper = self.$container.find(self.options.letterWrapper);
        self.$letterContainer = self.$container.find(self.options.letterContainer);
        self.controller = new ScrollMagic.Controller();
    },
    triggerScrollMagic: function() {
      var self = this;

//number scene
      for (i = 0; i < self.$numberWrapper.length; i++ ) {
        var wrapper = self.$numberWrapper[i],
            container = $(wrapper).find(self.options.numberContainer),
            numTrigger = $(wrapper).find(self.options.numberTrigger),
            numberDuration = $(wrapper).height();

        var numbertl = new TimelineMax();

        var numberArray = [];
        var startNum = $(wrapper).data("start");
        var endNum = $(wrapper).data("end");
        var increment = $(wrapper).data("increment");
        var isPercent = $(wrapper).data("percent");
        var unit = $(wrapper).data("unit");
        var incrementedNum;
        numberArray.push(startNum);

        for ( o = startNum; o <= endNum; o++ ) {

          if (increment) {

            if (o < endNum && (o === startNum || o === incrementedNum) ) {
              incrementedNum = (o + increment);
              numberArray.push(incrementedNum);
            }

          }
        }

        // container.find("p").remove();

        for (p = 0; p < numberArray.length; p++) {
          var curNum = numberArray[p];
          var percent = "%";
          // var unit = $(this);

          if (isPercent === false) {
            unit = " " + unit;
          }

          container.append("<p class='number'>" + curNum + "<span class='percent'>" + unit + "</span>" + "</p>");
        }

        var numberItem = container.find(self.options.numberItem);
        var stagger = 1/numberArray.length;

        numbertl.staggerFrom(
          numberItem,
          stagger,
          {
            opacity: "0"
          },
          stagger
        );

        var numberScene = new ScrollMagic.Scene({
          triggerElement: wrapper,
          tweenChanges: true,
          duration: 1,
          reverse: true
        })
        .setTween(numbertl)
        // .addIndicators({name: "number scene " + i, colorStart: "#0000FF", colorEnd: "#0000FF", colorTrigger: "#0000FF"})
        .addTo(self.controller);
      }
//number scene

if ($(window).width() > 600) {
  //letter scene
  for (i = 0; i < self.$letterWrapper.length; i++ ) {
    var wrapper = self.$letterWrapper[i],
    container = $(wrapper).find(self.options.letterContainer),
    numTrigger = $(wrapper).find(self.options.letterTrigger),
    letterDuration = $(wrapper).height();

    var lettertl = new TimelineMax();

    var letterArray = [];
    var textString = $(self.options.letterText).text();

    container.find("p").html("");

    for ( o = 0; o < textString.length; o++ ) {
      letter = textString[o];
      container.find("p").append("<span class='letter'>" + letter + "</span>");
    }

    var letterItem = container.find(self.options.letterItem);
    var stagger = 1/textString.length;

    lettertl.staggerFrom(
      letterItem,
      stagger,
      {
        display: "none",
        cycle: {
          x: ["10", "0"]
        }
      },
      stagger
    );

    var letterScene = new ScrollMagic.Scene({
      triggerElement: wrapper,
      tweenChanges: true,
      duration: letterDuration,
      reverse: true
    })
    .setTween(lettertl)
    // .addIndicators({name: "letter scene " + i, colorStart: "#00FF00", colorEnd: "#00FF00", colorTrigger: "#00FF00"})
    .addTo(self.controller);

    var fadeTween = TweenMax.fromTo( container, 1, {opacity: 0}, {opacity: 1});

    var fadeScene = new ScrollMagic.Scene({
      triggerElement: wrapper,
      duration: "15%"
    })
    .setTween(fadeTween)
    .addTo(self.controller);
  }
  //letter scene

}


    }
  };


}( $ ) );

(function init () {
  $(document).ready(function() {
    $(".infographic").scrollmagicControls();
  });

})();
