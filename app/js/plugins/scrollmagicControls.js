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
      scaleWrapper: ".scaleWrapper",
      scaleContainer: ".scaleContainer",
      scaleItem: ".scaleImg",
      scaleSVG: ".scaleSVG",
      opacityWrapper: ".opacityWrapper",
      opacityItem: ".opacityContainer li",
      numberWrapper: ".numberWrapper",
      numberContainer: ".numberContainer",
      numberItem: ".number",
      letterWrapper: ".letterWrapper",
      letterContainer: ".letterContainer",
      letterText: ".letterText",
      letterItem: ".letter",
      barchartWrapper: ".barchartWrapper",
      barchartContainer: ".barchart",
      barchartBars: ".barchart-bars"
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

        self.$scaleWrapper = self.$container.find(self.options.scaleWrapper);
        self.$scaleContainer = self.$container.find(self.options.scaleContainer);
        self.$scaleItem = self.$container.find(self.options.scaleItem);
        self.$scaleSVG = self.$container.find(self.options.scaleSVG);
        self.$opacityItem = self.$container.find(self.options.opacityItem);
        self.$opacityWrapper = self.$container.find(self.options.opacityWrapper);
        self.$numberItem = self.$container.find(self.options.numberItem);
        self.$numberWrapper = self.$container.find(self.options.numberWrapper);
        self.$numberContainer = self.$container.find(self.options.numberContainer);
        self.$letterItem = self.$container.find(self.options.letterItem);
        self.$letterText = self.$container.find(self.options.letterText);
        self.$letterWrapper = self.$container.find(self.options.letterWrapper);
        self.$letterContainer = self.$container.find(self.options.letterContainer);
        self.$barchartWrapper = self.$container.find(self.options.barchartWrapper);
        self.$barchartContainer = self.$container.find(self.options.barchartContainer);
        self.$barchartBars = self.$container.find(self.options.barchartBars);
        self.controller = new ScrollMagic.Controller();
        self.controller2 = new ScrollMagic.Controller();

    },
    triggerScrollMagic: function() {
      var self = this;

//scale scene
      for (i = 0; i < self.$scaleWrapper.length; i++ ) {
        var total = $(self.options.scaleWrapper).attr("data-total");
        var container = $(self.options.scaleContainer).eq(i);

        //first check for SVG and add them in dynamically since WP breaks them.
        var svgDiv = self.$scaleWrapper.find(self.options.scaleSVG);
        var svgPath = svgDiv.data("svg");

        if (svgPath) {
          svgDiv.remove();

          for (s = 0; s < total; s++ ) {
            container.prepend("<div class='scaleImg'>" + svgPath + "</div>")
          }
        }  else {
          svgDiv.remove();
        }

        var scaleDuration = self.$scaleWrapper.height() * 2;

        var scaleTimeline = new TimelineMax();

        var scaleItem;
        if (svgPath) {
          var scaleItem = $(self.options.scaleItem).find("svg");
        } else {
          var scaleItem = $(self.options.scaleItem);
        }

        //size is the amount of items to be filled in
        var size = $(self.options.scaleWrapper).attr("data-size");
        var activeColor = $(self.options.scaleWrapper).attr("data-activeColor");
        var inactiveColor = $(self.options.scaleWrapper).attr("data-inactiveColor");

        for (c = 0; c < scaleItem.length; c++ ) {

          var curItem;
          if (svgPath) {
            var curItem = $(self.options.scaleItem).eq(c).find("svg");
          } else {
            var curItem = $(self.options.scaleItem).eq(c);
          }

          if (c < size) {
            curItem.css("fill", activeColor);
          } else {
            curItem.css("fill", inactiveColor);
          }
        }

        var opacityhook;

        if ( $(window).width > 600) {
          opacityhook = 0.9;
        } else {
          opacityhook = 0.8;
        }

        scaleTimeline.staggerFrom(
          scaleItem,
          1,
          {
            scale: 0,
            fill: inactiveColor
          },
          0.25
        );

        var scaleScene = new ScrollMagic.Scene({
          triggerElement: ".scaleTrigger",
          triggerHook: opacityhook,
          duration: scaleDuration
        })
        .setTween(scaleTimeline)
        .addIndicators({name: "scale scene", colorStart: "#FF0000", colorEnd: "#FF0000", colorTrigger: "#FF0000"})
        .addTo(self.controller);
      }
//scale scene


//opacity scene
      for (i = 0; i < self.$opacityWrapper.length; i++ ) {
        var opacityDuration = $(self.options.opacityWrapper).height();

        var opacitytl = new TimelineMax();
        var opacityItem = self.$opacityItem;
        var hook;

        if ( $(window).width > 600) {
          hook = 0.9;
        } else {
          hook = 0.9;
        }

        opacitytl.staggerFrom(
          opacityItem,
          0.5,
          {
            opacity:0
          },
          0.5
        );

        var opacityScene = new ScrollMagic.Scene({
          triggerElement: ".opacityTrigger",
          tweenChanges: true,
          duration: opacityDuration,
          reverse: true,
          triggerHook: hook
        })
        .setTween(opacitytl)
        .addIndicators({name: "opacity scene", colorStart: "#0000FF", colorEnd: "#0000FF", colorTrigger: "#0000FF"})
        .addTo(self.controller);
      }
//opacity scene


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

//barchart scene
      for (u = 0; u < self.$barchartWrapper.length; u++ ) {
        var barchartWrapper = $(self.options.barchartWrapper).eq(u);
        var barchartTrigger = barchartWrapper.find(".barcharttrigger");
        var barchartDuration = self.$barchartWrapper.height();
        var barchartTimeline = new TimelineMax();
        var barchartItem = $(self.options.barchartBars).find("li");

        for (f = 0; f < barchartItem.length; f++ ) {
          var curItem = barchartItem.eq(f);

          //size is a percentage of the height of the y scale (10 = 100%)
          var size = curItem.attr("data-size");
          var color = curItem.attr("data-color");

          curItem.css({
            "background-color": color,
            "height": size
          });
        }

        // var barcharthook;
        //
        // if ( $(window).width > 600) {
        //   barcharthook = 0.9;
        // } else {
        //   barcharthook = 0.7;
        // }

        barchartTimeline.staggerFrom(
          barchartItem,
          1,
          {
            scale: 0
          },
          0.25
        );

        var barchartScene = new ScrollMagic.Scene({
          triggerElement: barchartTrigger,
          triggerHook: 0.7,
          duration: barchartDuration
        })
        .setTween(barchartTimeline)
        .addIndicators({name: "barchart scene", colorStart: "#FF0000", colorEnd: "#FF0000", colorTrigger: "#FF0000"})
        .addTo(self.controller2);
      }
//barchart scene

    }
  };


}( $ ) );

(function init () {
  $(document).ready(function() {
    $(".infographic").scrollmagicControls();
  });

})();
