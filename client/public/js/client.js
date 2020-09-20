const peerConnections = {}; // socket id to socket object
var localPeerConnection;
var witty_lingo_words = []

const video = document.getElementById('localVideo')
const videoR1 = document.getElementById('remoteVideo1')
const videoR2 = document.getElementById('remoteVideo2')
const videoR3 = document.getElementById('remoteVideo3')

video.muted = true;

var videoList = [video, videoR1, videoR2, videoR3]
const slots = {} // id to videoList index
const videoIds = {}
var currentIndex = 0 //TODO: Handle 

const config = {
    "iceServers": [{ "url": "stun:stun2.1.google.com:19302" }]
};

var socket//io('ws://localhost:4001'); https://33c755acbc30.ngrok.io
/*
$("#server-url").focusout(function () {
    socket = io($("#server-url").val())
})*/

$("#connect").click(function () {
    
    let socket_url = $("#server-url").val()
    
    if (socket_url.length == 0 || socket_url === undefined)
        return
    
    socket = io(socket_url)

    socket.on("watcher", id => { //

        console.log('recieve watcher from ', id)
        peerConnection = new RTCPeerConnection(config);
        peerConnections[id] = peerConnection;

        let stream = video.srcObject;
        stream.getTracks().forEach(track => peerConnections[id].addTrack(track, stream));

        peerConnections[id].onicecandidate = event => {
            if (event.candidate) {
                socket.emit("candidate", id, event.candidate);
            }
        };

        peerConnections[id].ontrack = event => {
            addStreamToPage(event.streams[0], id);
            // videoR.srcObject = event.streams[0]; // connecting to remote streams 
        };

        peerConnections[id]
            .createOffer()
            .then(sdp => peerConnections[id].setLocalDescription(sdp))
            .then(() => {
                socket.emit("offer", id, peerConnections[id].localDescription);
            });
    });

    socket.on("answer", (id, description) => {
        console.log('recieve answer from ', id)
        peerConnections[id].setRemoteDescription(description);
    });

    socket.on("candidate", (id, candidate) => {

        console.log('recieve candidate from ', id)

        peerConnections[id]
            .addIceCandidate(new RTCIceCandidate(candidate))
            .catch(e => console.error(e))

        peerConnections[id].addIceCandidate(new RTCIceCandidate(candidate));
    });

    socket.on("disconnectPeer", id => {
        console.log("Disconnected peer with id: ", id);
        peerConnections[id].close();
        delete peerConnections[id];
    });

    socket.on("offer", (id, description) => { //
        console.log('recieve offer from ', id)

        peerConnection = new RTCPeerConnection(config);
        peerConnections[id] = peerConnection

        let stream = video.srcObject;
        stream.getTracks().forEach(track => peerConnections[id].addTrack(track, stream));

        peerConnections[id]
            .setRemoteDescription(description)
            .then(() => peerConnections[id].createAnswer())
            .then(sdp => peerConnections[id].setLocalDescription(sdp))
            .then(() => {
                socket.emit("answer", id, peerConnections[id].localDescription);
            });
        peerConnections[id].ontrack = event => {
            addStreamToPage(event.streams[0], id);
            // videoR.srcObject = event.streams[0];
        };
        peerConnections[id].onicecandidate = event => {
            if (event.candidate) {
                socket.emit("candidate", id, event.candidate);
            }
        };
    });

    socket.on("connect", () => {
        console.log("Connected to webRTC");
        socket.emit("watcher", socket.id);
    });

    socket.on("broadcaster", (id) => {
        console.log("broadcast from ", id)
        socket.emit("watcher", id);
    });

    socket.on('new-witty-lingo-game', ids => {
        witty_lingo_words = ids
    })

    window.onunload = window.onbeforeunload = () => {
        socket.close();
    };

    // close socket on closed window
    window.onunload = window.onbeforeunload = () => {
        socket.close();
    };

    function addStreamToPage(stream, id) {

        console.log('id ', id)
        //Determine if id is already in the page
        //if it is rewrite
        //if it is not, add to new slot 
        if (!(id in slots)) {
            slots[id] = getFirstFreeSlot()
        }
        videoList[slots[id]].srcObject = stream;
        videoIds[videoList[slots[id]].id] = id
    
        console.log(videoIds)
    }
    
    function getFirstFreeSlot() {
        currentIndex += 1
        return currentIndex
    }
    
    
    function startVideo() {
        navigator.mediaDevices.getUserMedia(
            {
                video: {
                    frameRate: { ideal: 12, max: 12 },
                    width: { min: 640, ideal: 640, max: 640 },
                    height: { min: 480, ideal: 480, max: 480 }
                }, audio: true,
                video: true
            }).then(
                stream => {
                    video.srcObject = stream; // local feed
                    socket.emit("broadcaster");
                }).catch(
                    err => console.error(err))
    }
    
    // startVideo();
    Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri('/static/models'),
        faceapi.nets.faceLandmark68Net.loadFromUri('/static/models'),
        faceapi.nets.faceRecognitionNet.loadFromUri('/static/models'),
        // faceapi.nets.faceExpressionNet.loadFromUri('/static/models')
    ]).then(startVideo)
    
    video.addEventListener('play', function () { updateFaceData(video); })
    videoR1.addEventListener('play', function () { updateFaceData(videoR1); })
    videoR2.addEventListener('play', function () { updateFaceData(videoR2); })
    videoR3.addEventListener('play', function () { updateFaceData(videoR3); })
    
    const anchor = { x: 200, y: 200 }
    // see DrawTextField below
    const drawOptions = {
        anchorPosition: 'TOP_RIGHT',
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    }
    //   const drawBox = new faceapi.draw.DrawTextField(text, anchor, drawOptions)
    //   drawBox.draw(document.getElementById('myCanvas'))
    
    function updateFaceData(inputVideo) {
    
        const canvas = inputVideo.nextElementSibling;
    
        const displaySize = { width: inputVideo.offsetWidth, height: inputVideo.offsetHeight }
        faceapi.matchDimensions(canvas, displaySize)
        setInterval(async () => {
    
            const detections = await faceapi.detectSingleFace(inputVideo, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks()
    
            let text = ''
    
            if (witty_lingo_words[videoIds[inputVideo.id]] !== undefined)
                text = witty_lingo_words[videoIds[inputVideo.id]]
    
            if (detections != undefined) {
    
                const resizedDetections = faceapi.resizeResults(detections, displaySize)
                const leftEyeBrow = resizedDetections.landmarks.getLeftEyeBrow()
                const rightEyeBrow = resizedDetections.landmarks.getRightEyeBrow()
                const nose = resizedDetections.landmarks.getNose()
                for (var i = 0; i < 5; i++) {
                    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
                    anchor["x"] = rightEyeBrow[i]["x"];
                    anchor["y"] = 1 * (leftEyeBrow[i]["y"] - nose[i]["y"]) + leftEyeBrow[i]["y"];
                    const drawBox = new faceapi.draw.DrawTextField([text], anchor, drawOptions)
                    drawBox.draw(canvas)
                }
    
            }
        }, 83)
    }
})


