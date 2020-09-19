var name; 
var connectedUser;
var localVideo = document.querySelector('#localVideo'); 

navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(function(mediaStream) {
    localVideo.srcObject = mediaStream;
    localVideo.onloadedmetadata = function(e) {
        localVideo.play();
    };
    
})


