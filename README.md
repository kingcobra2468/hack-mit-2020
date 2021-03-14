# Witty Lingo

## Our Mission
Teaching virtually holds challenges, but we can often fail to look at the potential benefits of online learning. Our goal in this hackathon was to highlight this through a web application that allows students to video call each other. This gives students the ability to practice their foreign language skills in a fun video integrated game based on the popular game "heads up". Players can see everybody's words except their own and must work collaboratively to work through the word set.

![Alt text](/screenshots/demo1-v1.1.png "Client Web App")
As you could see, everyone except the host(one person appeared twice but under two sockets) has a word over their head from the word bank. The objective in this example is for students to describe the object and for the student with the object over their head to name it. This game in particular helps with vocab learning. However, as we build this platform to be dynamic, it is possible to implement many other games.

In an age of online learning where students have limited interaction, this game is great! It allows students to laugh, see and communicate with each other, as well as enjoy the language class that they are taking.

---
## Runtime Enviornment
Launched by one member, this portal allows you to see various statuses such as players connected. Likewise, other administrator logistics can be handled via this page.

![Alt text](/screenshots/demo2.png "Service Admin Portal")

 This portal allows launching/restarting games as can be seen. When the `New Game` button is pressed, new words will appear on the heads of the students.

---
## Installation Steps 
1. Install node on your local system
2. Install npm packages using `npm install`
3. Start both node instances by running `node index.js` in both the `/client` and `/server` folders.
4. Put that url into the `Server URI` input from the client and click connect
5. (Optional) To establish connections from outside the local network, I recommend ngrok as a proxy for `server/index.js`.

---
## Sources
* https://gabrieltanner.org/blog/webrtc-video-broadcast (for figuring out WebRTC protocol)
* https://github.com/justadudewhohacks/face-api.js/ (for client based computer vision for text attachment to forehead)