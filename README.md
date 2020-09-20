#Witty Lingo

<h5>Who we are:</h5> 
<p>
Teaching virtually holds challenges, but we can often fail to look at the potential benefits of such a learning environment. We aim to highlight this through this web application allowing students to video call each other and practice their foreign language vocab words in a fun video integrated game. Players can see everyone's words except their own and must work collaboratively to work through the words.
</p>


![Alt text](/screenshots/demo1.png "Client Web App")
<p>
As you could see, everyone except the host(one person appeared twice but under two sockets). Has a word over their head from a wordbank. The objective in this example
is for students to describe the object and for the student with the object over their head to name it. This game in particular helps with vocab learning. However, as
we build this platform to be dynammic, it is possible to implament many other games.
</p>

<p> In an age of online learning where students have limited interaction, this game is great! It allows students to laugh, see eachother, as well as enjoy the 
language class that they are taking
<p>

![Alt text](/screenshots/demo2.png "Service Admin Portal")
<p>
Launched by one member of the teach, this portal allows you to see various status such as players connected. This portal allows launching/restarting games as can be seen. When the `name game` button is pressed, new words will apear on students heads.


<h5> How to Run and Instasll <h5>
1. Install node
2. Install packages using `npm install`
3. start both node istances
4. For establishing connections from outside local network, I recommend ngrok to proxy the server/index.js. Then put that url into the `Server URI` input from client and click connect