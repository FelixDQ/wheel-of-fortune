// -----wheel-spin-js------
function chargeButton() {
  var start = new Date();

  function release() {
    // spin
    var end = new Date();

    end - start;
  }
}

var padding = { top: 0, right: 0, bottom: 0, left: 0 },
  w = 400 - padding.left - padding.right,
  h = 400 - padding.top - padding.bottom,
  r = Math.min(w, h) / 2,
  rotation = 0,
  oldrotation = 0,
  picked = 100000,
  oldpick = [],
  color = d3.scale.category20();

var data = [
  { label: "0.5L Draught Beer", value: 1, xp: "2", href: "https://qvist.dev/beer.png" },
  { label: "1x Long Island", value: 1, xp: "4", href: "https://qvist.dev/longisland.png" },
  {
    label: "10x Sour shots",
    value: 1,
    xp: "1",
    href: "https://qvist.dev/shots.png"
  },
  { label: "A glass of water", value: 1, xp: "5", href: "https://qvist.dev/water.png" },
  { label: "1x Pitcher", value: 1, xp: "3", href: "https://qvist.dev/pitcher.png" },
  { label: "A high five", value: 1, xp: "7", href: "https://qvist.dev/highfive.png" },
  { label: "1x cider", value: 1, xp: "6" },
  { label: "2 Ferne shots", value: 1, xp: "9" },
  { label: "2 Ferne shots", value: 1, xp: "9" },
  { label: "5 tequila shots", value: 1, xp: "10" }
];
var svg = d3
  .select("#spinwheel")
  .append("svg")
  .data([data])
  .attr("xmlns", "http://www.w3.org/2000/svg")
  .attr("viewBox", "0 0 " + w + " " + w + "")
  .attr("width", w)
  .attr("height", h + padding.top + padding.bottom);
var container = svg
  .append("g")
  .attr("class", "chartholder")
  .attr(
    "transform",
    "translate(" + (w / 2 + padding.left) + "," + (h / 2 + padding.top) + ")"
  );
var vis = container.append("g");

var pie = d3.layout.pie().value(function (d) {
  return 1;
});
// declare an arc generator function
var arc = d3.svg.arc().outerRadius(r);
// select paths, use arc generator to draw
var arcs = vis
  .selectAll("g.slice")
  .data(pie)
  .enter()
  .append("g")
  .attr("class", "slice");

arcs
  .append("path")
  .attr("fill", function (d, i) {
    return color(i);
  })
  .attr("d", function (d) {
    return arc(d);
  });
// add the text
arcs
  .append("text")
  .attr("transform", function (d) {
    d.innerRadius = 0;
    d.outerRadius = r;
    d.angle = (d.startAngle + d.endAngle) / 2;
    return (
      "rotate(" +
      ((d.angle * 180) / Math.PI - 90) +
      ")translate(" +
      (d.outerRadius - 20) +
      ")"
    );
  })
  .attr("font-size", "17")
  .attr("fill", "#ffffff")
  .attr("text-anchor", "end")
  .text(function (d, i) {
    if (data[i].href) {
      return;
    }
    return data[i].label;
  });
arcs
  .append("image")
  .attr("width", "60")
  .attr("height", "60")
  .attr("preserveAspectRatio", "xMidYMid meet")
  .attr("href", function (d) {
    return d.data.href;
  })
  .attr("transform", function (d) {
    d.innerRadius = 0;
    d.outerRadius = r;
    d.angle = (d.startAngle + d.endAngle) / 2;
    return (
      "rotate(" +
      ((d.angle * 180) / Math.PI - 90) +
      ")translate(" +
      (d.outerRadius - 80) +
      " " +
      "-30" +
      ")"
    );
  });

var spinning = false;

$("#spin").on("click", () => spin(5));

$(document).on("keypress", function (e) {
  if (e.which == 13) {
    spin(4);
  }
});

function spin(charge) {
  if (spinning) {
    return;
  }
  spinning = true;

  $("#spin").on("click", null);
  //all slices have been seen, all done

  var ps = 360 / data.length,
    rng = randomInteger(0, 359),
    random_offset = randomInteger(1, ps - 1);

  rotation = rng + Math.round(charge) * 360 + random_offset;

  if (rotation % ps == 0) {
    rotation += 3;
  }

  picked =
    (data.length - Math.round(((rotation + 180 + ps / 2) % 360) / ps)) %
    data.length;
  //console.log(picked);

  //picked = picked >= data.length ? (picked % data.length) : picked;
  //      if(oldpick.indexOf(picked) !== -1){
  //          d3.select(this).call(spin);
  //          return;
  //      } else {
  //          oldpick.push(picked);
  //     }

  var interval = setInterval(function () {
    $(".wheeldots").addClass("active-dots");
    setTimeout(function () {
      $(".wheeldots").removeClass("active-dots");
    }, 500);
  }, 1000);
  vis
    .transition()
    .duration(15000)
    .attrTween("transform", rotTween)
    .each("end", function () {
      setTimeout(() => {
        spinning = false;
        
      }, 1000 * 5)  
      clearInterval(interval);
      oldrotation = rotation;

      //populate question

      celebrate();
      //      alert(data[picked].xp);

      //container.on("click", spin);
    });
}
//draw spin circle
container
  .append("circle")
  .attr("cx", 0)
  .attr("cy", 0)
  .attr("r", 10)
  .style({ fill: "#ffffff" });

function rotTween(to) {
  //console.log("oldrotation: " + oldrotation);
  //console.log("rotation: " + rotation);
  var i = d3.interpolate(oldrotation % 360, rotation);
  return function (t) {
    return "rotate(" + i(t) + ")";
  };
}

function randomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function celebrate() {
  var end = Date.now() + 1 * 1000; // celebrate for 15 seconds

  var colors = ["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"];

  (function frame() {
    confetti({
      particleCount: 5,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.8 },
      colors: colors
    });
    confetti({
      particleCount: 5,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.8 },
      colors: colors
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
}

if (true) {
  tsParticles.load("tsparticles", {
    autoPlay: true,
    background: {
      color: { value: "#000" },
      image: "",
      position: "50% 50%",
      repeat: "no-repeat",
      size: "cover",
      opacity: 1
    },
    backgroundMask: {
      composite: "destination-out",
      cover: { color: { value: "#fff" }, opacity: 1 },
      enable: false
    },
    fullScreen: { enable: true, zIndex: 1 },
    detectRetina: true,
    fpsLimit: 30,
    interactivity: {
      detectsOn: "canvas",
      events: {
        resize: true
      }
    },
    manualParticles: [],
    particles: {
      color: {
        value: "#ffffff",
        animation: {
          h: { count: 0, enable: false, offset: 0, speed: 1, sync: true },
          s: { count: 0, enable: false, offset: 0, speed: 1, sync: true },
          l: { count: 0, enable: false, offset: 0, speed: 1, sync: true }
        }
      },
      groups: {},
      life: {
        count: 0,
        delay: {
          random: { enable: false, minimumValue: 0 },
          value: 0,
          sync: false
        },
        duration: {
          random: { enable: false, minimumValue: 0.0001 },
          value: 0,
          sync: false
        }
      },
      move: {
        angle: { offset: 0, value: 90 },
        decay: 1,
        distance: {},
        direction: "none",
        drift: 0,
        enable: true,
        random: false,
        size: false,
        speed: 0.5,
        straight: false,
        trail: { enable: false, length: 10, fillColor: { value: "#000000" } },
        vibrate: false,
        warp: false
      },
      number: {
        density: { enable: true, area: 800, factor: 1000 },
        limit: 0,
        value: 80
      },
      opacity: {
        random: { enable: false, minimumValue: 0.1 },
        value: { min: 0.1, max: 0.5 },
        animation: {
          count: 0,
          enable: true,
          speed: 1,
          sync: false,
          destroy: "none",
          minimumValue: 0.1,
          startValue: "random"
        }
      },
      reduceDuplicates: false,
      shape: {
        options: {
          character: [
            {
              fill: true,
              font: "Font Awesome 5 Free",
              style: "",
              value: ["", "", "", ""],
              weight: "900"
            }
          ],
          polygon: { sides: 5 },
          star: { sides: 5 },
          image: {
            height: 100,
            replaceColor: true,
            src: "https://particles.js.org/images/github.svg",
            width: 100
          },
          images: {
            height: 100,
            replaceColor: true,
            src: "https://particles.js.org/images/github.svg",
            width: 100
          }
        },
        type: "char"
      },
      size: {
        random: { enable: false, minimumValue: 1 },
        value: 16,
        animation: {
          count: 0,
          enable: true,
          speed: 10,
          sync: false,
          destroy: "none",
          minimumValue: 10,
          startValue: "random"
        }
      },
      stroke: {
        width: 1,
        color: {
          value: "#ffffff",
          animation: {
            h: { count: 0, enable: false, offset: 0, speed: 1, sync: true },
            s: { count: 0, enable: false, offset: 0, speed: 1, sync: true },
            l: { count: 0, enable: false, offset: 0, speed: 1, sync: true }
          }
        }
      },
    },
    pauseOnBlur: false,
    pauseOnOutsideViewport: false,
    responsive: [],
    themes: []
  });
}
