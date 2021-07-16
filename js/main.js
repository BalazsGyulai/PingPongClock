var date = new Date();
var time = date.getHours();
var body = document.getElementsByTagName("body")[0];
var h1 = document.getElementsByTagName("h1");
var box = document.getElementsByClassName("box");
var select = document.getElementsByTagName("select");

if(time>19 && time<6){
  body.style.background = "#333333";
  for(var x = 0; x < h1.length; x++){
    h1[x].style.color = "#e7e7e7"
  }

  for(var x = 0; x < box.length; x++){
    box[x].style.background = "#414141";
    box[x].style.border = "1px solid #1d1d1d";
    box[x].style.boxShadow = "4px 4px 8px #1d1d1d";
  }

  for(var x = 0; x < select.length; x++){
    select[x].style.color = "#e7e7e7";
    select[x].style.background = "#414141";
    select[x].style.border = "1px solid #1d1d1d";
  }
} else{
  body.style.background = "#fff";
  for(var x = 0; x < h1.length; x++){
    h1[x].style.color = "#000"
  }

  for(var x = 0; x < box.length; x++){
    box[x].style.background = "#fff";
    box[x].style.border = "1px solid #d1d1d1";
    box[x].style.boxShadow = "4px 4px 8px #d1d1d1";
  }

  for(var x = 0; x < select.length; x++){
    select[x].style.color = "#000";
    select[x].style.background = "#fff";
    select[x].style.border = "1px solid #d1d1d1";
  }
}

$("#sendBrightness").click(function () {
  var brightnessOption = $("#bright").val();
  var brightnessValue = $("#brightness").val();

  $.get("http://192.168.0.102/", {
    opt: brightnessOption,
    val: brightnessValue
  });
});

$("#sendColor").click(function () {
  var colorOption = $("#col").val();
  var color = $("#color").val();

  $.get("http://192.168.0.102/", {
    opt: colorOption,
    val: color
  });
});

$("#sendshow").click(function () {
  var showOption = $("#show").val();

  $.get("http://192.168.0.102/", {
    opt: showOption,
    val: 123
  });
});
