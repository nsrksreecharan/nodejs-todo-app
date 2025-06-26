const http=require('http');
const url=require('url');

const {readNotes, writeNotes}= require('./fileHandler');
const { randomUUID } = require('crypto');

const server=http.createServer((req,res)=>{
    const parseUrl=url.parse(req.url,true);
    const path= parseUrl.pathname;
    const method=req.method;

    if(method==="GET" && path==="/notes"){
        const notes= readNotes();
        res.writeHead(200,{'Content-Type':'application/json'});
        res.end(JSON.stringify(notes));
    }
    else if(method ==="POST" && path==="/notes"){
        let body="";
        req.on('data',chunk=> (body +=chunk));
        req.on('end',()=>{
            const note=JSON.parse(body);
            const notes=readNotes();
            const newNote={id:randomUUID(),...note};
            notes.push(newNote);
            writeNotes(notes);
            res.writeHead(201,{'Content-Type':'application.json'});
            res.end(JSON.stringify({message:"Note added",note:newNote}));
        });
    }
    else if(method==="DELETE" && path.startsWith("/notes/")){
        const id = path.split('/')[2];
        if(!id){
            res.writeHead(400);
            return res.end("Note ID required");
        }

        const notes=readNotes();
        const filtered=notes.filter(note=> note.id!=id);
        writeNotes(filtered);
        res.writeHead(200,{'Content-Type': 'application/json'});
        res.end(JSON.stringify({message:"Notes delted",notes,filtered,id}));
    }
    else{
        res.writeHead(404,{'Content-Type':'text/plain'});
        res.end(`Route not found,${method}${path}`);
    }
});

server.listen(3000,()=>{
    console.log("Server running at http://localhost:3000");
});