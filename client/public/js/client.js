var name; 
var connectedUser;
var localVideo = document.querySelector('#localVideo'); 

navigator.mediaDevices.getUserMedia({ video: true, audio: true }, function (myStream) { 
    console.log('here')
    //displaying local video stream on the page 
    localVideo.srcObject = myStream;
    localVideo.onloadedmetadata = function(e) {
        localVideo.play();
    };
})

