const peerConnections = {};
var localPeerConnection;

const config = {
    "iceServers": [{ "url": "stun:stun2.1.google.com:19302" }]
};

var socket = io('ws://localhost:4001');
const video = document.getElementById('localVideo')
const videoR = document.getElementById('remoteVideo')

function startVideo() {
    navigator.mediaDevices.getUserMedia(
        { video: {}, audio: true,
        video: true }).then(
        stream => {
            video.srcObject = stream;
            socket.emit("broadcaster");
        }).catch(
        err => console.error(err))
}

socket.on("watcher", id => {
    
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
        videoR.srcObject = event.streams[0];
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
    peerConnections[id].close();
    delete peerConnections[id];
});

socket.on("offer", (id, description) => {
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
        videoR.srcObject = event.streams[0];
    };
    peerConnections[id].onicecandidate = event => {
        if (event.candidate) {
            socket.emit("candidate", id, event.candidate);
        }
    };
});

socket.on("connect", () => {
    socket.emit("watcher", socket.id);
});

socket.on("broadcaster", (id) => {
    console.log("broadcast from ", id)
    socket.emit("watcher", id);
});

socket.on('word_bindings', ids => {
    console.log(ids)
})

window.onunload = window.onbeforeunload = () => {
    socket.close();
};

// close socket on closed window
window.onunload = window.onbeforeunload = () => {
    socket.close();
};

Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('/static/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/static/models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('/static/models'),
    faceapi.nets.faceExpressionNet.loadFromUri('/static/models')
]).then(startVideo)

video.addEventListener('play', () => {
    const canvas = faceapi.createCanvasFromMedia(video)
    document.body.append(canvas)
    const displaySize = { width: video.videoWidth, height: video.videoHeight }
    faceapi.matchDimensions(canvas, displaySize)
    setInterval(async () => {
        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
        const resizedDetections = faceapi.resizeResults(detections, displaySize)
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
        faceapi.draw.drawDetections(canvas, resizedDetections)
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
        faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
    }, 100)
})