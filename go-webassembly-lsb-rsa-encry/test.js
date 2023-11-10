function draw() {
    var ctx = document.getElementById("canvas").getContext("2d");
    var img = new Image();
    img.onload = function () {
      ctx.drawImage(img, 0, 0, 1279, 1706,0,0,319.75,426.5);
    //   ctx.beginPath(); 295 413
    //   ctx.moveTo(30, 96);
    //   ctx.lineTo(70, 66);
    //   ctx.lineTo(103, 76);
    //   ctx.lineTo(170, 15);
    //   ctx.stroke();
    };
    img.src = "ss.jpg";
  }

  setTimeout(() => {
    draw()
  }, 300);
  