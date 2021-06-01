
var $ = require("jquery");
function UserNameAndCursorDivsSetup(socket,Username) {

    var TempSpan = document.createElement("span");
    var TempCursor = document.createElement("div")

    TempSpan.id = socket.id + "-span";
    TempCursor.id = socket.id + "-cursor";
    document.getElementById("container").appendChild(TempSpan)
    document.getElementById("container").appendChild(TempCursor)
    var tempcursorImage = document.createElement("img")
    var tempcursorImage_2 = document.createElement("img")
    TempCursor.appendChild(tempcursorImage)
    TempCursor.appendChild(tempcursorImage_2)
    tempcursorImage.src = "Cursor.png"
    tempcursorImage.id = "Image_1";
    tempcursorImage_2.id = "Image_2";
    document.getElementById(socket.id + "-span").innerHTML = Username
    document.getElementById("LoadingSpan").innerText = "Pick A Name:"
    $("#NameBtn").css("pointer-events", "auto")
    $("#NameBtn").css("filter", "brightness(100%)")
    document.querySelector("#NameBox").addEventListener("keydown", event => {
        if (event.key !== "Enter") return;
        document.querySelector("#NameBtn").click();
        event.preventDefault();
    });
}
function PushColors(allColors){
  allColors.push('#000000');
  allColors.push('#FFFFFF');
  allColors.push('#999900');
  allColors.push('#4C9900');
  allColors.push('#009900');
  allColors.push('#00994C');
  allColors.push('#009999');
  allColors.push('#004C99');
  allColors.push('#000099');
  allColors.push('#4C0099');
  allColors.push('#990099');
  allColors.push('#99004C')

  allColors.push('#FF0000');
  allColors.push('#FF8000');
  allColors.push('#FFFF00');
  allColors.push('#80FF00');
  allColors.push('#00FF00');
  allColors.push('#00FF80');
  allColors.push('#00FFFF');
  allColors.push('#0080FF');
  allColors.push('#0000FF');
  allColors.push('#7F00FF');
  allColors.push('#FF00FF');
  allColors.push('#58906F');
  allColors.push('#FF007F');
  //

  allColors.push('#FF9999');
  allColors.push('#FFCC99');
  allColors.push('#FFFF99');
  allColors.push('#CCFF99');
  allColors.push('#99FF99');
  allColors.push('#99FFCC');
  allColors.push('#99FFFF');
  allColors.push('#99CCFF');
  allColors.push('#9999FF');
  allColors.push('#CC99FF');
  allColors.push('#FF99FF');
  allColors.push('#FF99CC');
  ////////////////////////////////////////
  allColors.push('#663CE6');
  allColors.push('#1413ED');
  allColors.push('#1B46D6');
  allColors.push('#2986F0');
  allColors.push('#12A6E3'); /////
  allColors.push('#2027E3');
  allColors.push('#5D37F0');
  allColors.push('#7729D6');
  allColors.push('#AF21ED');
  allColors.push('#DC0099');
  allColors.push('#DC49E6'); ///////////////
  allColors.push('#C72DE3')

  allColors.push('#F046D3');
  allColors.push('#D63574');
  allColors.push('#D62F8B');
  allColors.push('#D62F3B');
  allColors.push('#E66250');
  allColors.push('#E612C3');
  allColors.push('#F03C7D');
  allColors.push('#D6332D');
  allColors.push('#D64A2D');
  allColors.push('#E67D4E');
  allColors.push('#E64B07');
  allColors.push('#9F475F');
  allColors.push('#F07D22');
  //

  allColors.push('#D68715');
  allColors.push('#D69815');
  allColors.push('#E6BE35');
  allColors.push('#E6C412');
  allColors.push('#F0E216');
  allColors.push('#BFD60B');
  allColors.push('#7BD60B');
  allColors.push('#52E629');
  allColors.push('#0EE612');
  allColors.push('#1AF045');
  allColors.push('#FD99FD');
  allColors.push('#10D65B');
  allColors.push('#E6456C');
}

function RandomizeChatIcon(BackgroundIcon_1,BackgroundIcon_2,BackgroundIcon_3,BackgroundIcon_4,BackgroundIcon_5,BackgroundIcon_6
    ,SaveIcon_1,SaveIcon_2,SaveIcon_3,SaveIcon_4){
    var IconRandomNum=Math.floor(Math.random() * (600 - 1 + 1) + 1)
    if(IconRandomNum<100){$("#chatArea").css("background-image",`url(${BackgroundIcon_6})`)}else
    if(IconRandomNum<200){$("#chatArea").css("background-image",`url(${BackgroundIcon_5})`)}else
    if(IconRandomNum<300){$("#chatArea").css("background-image",`url(${BackgroundIcon_4})`)}else
    if(IconRandomNum<400){$("#chatArea").css("background-image",`url(${BackgroundIcon_3})`)}else
    if(IconRandomNum<500){$("#chatArea").css("background-image",`url(${BackgroundIcon_2})`)}
    else{$("#chatArea").css("background-image",`url(${BackgroundIcon_1})`)}


     IconRandomNum=Math.floor(Math.random() * (400 - 1 + 1) + 1)
    if(IconRandomNum<100){$("#SaveBtn").attr("src",SaveIcon_1)}else
    if(IconRandomNum<200){$("#SaveBtn").attr("src",SaveIcon_2)}else
    if(IconRandomNum<300){$("#SaveBtn").attr("src",SaveIcon_3)}else
    if(IconRandomNum<400){$("#SaveBtn").attr("src",SaveIcon_4)}
   
  }
module.exports = {

    UserNameAndCursorDivsSetup,PushColors,RandomizeChatIcon
}