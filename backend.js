const server = require("http").createServer((req,res) => {

   if(req.url == "/") {
      res.writeHead(200,{"Content-Type":"text/html"});
      res.end(require("fs").readFileSync("frontend.html"));
   }

});
server.listen(require("./config.json").port,() => console.log("Ready when you are"));
const wss = new (require("ws").WebSocket).Server({ server });
wss.on("connection",ws => {
   ws.on("message",(m) => {
       const msg = m.toString();
       const name = msg.split(":")[0];
       const args = msg.split(":").slice(1);
       switch(name) {
           case "fetch": ws.send(`fetch-resp:${getProject(args[0])}`); break;
           case "push": updateProject(args[0],args[1]); break;
           case "new": newProject(args[0]); break;
           case "snap": snapProject(args[0],args[1]); break;
       }
   });
});


const fs = require("fs");


function newProject(name) {
   if(!fs.existsSync("projects")) {
       fs.mkdirSync("projects");
   }
   fs.writeFileSync(`projects/${name}.js`,"");
}
function updateProject(name, contents) {
   fs.writeFileSync(`projects/${name}.js`,contents);
}
function snapProject(name, contents) {
   // fs.writeFileSync(`projects/${name}.snap.js`,`// p6 project created at ${Date.now()}\n\n${contents}`);
}
function getProject(name, contents) {
   return fs.readFileSync(`projects/${name}.js`);
}



