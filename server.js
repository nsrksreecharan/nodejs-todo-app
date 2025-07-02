const http=require("http");
const url=require("url");

const {readNotes,writeNotes,writeNotesAsync,readNotesAsync}=require("./fileHandler");
const {randomUUID}=require("crypto");

const server=http.createServer(async(req,res)=>{
    const parseUrl=url.parse(req.url,true);
    const path=parseUrl.pathname;
    const method=req.method;

    if(method==="GET" && path==="/notes"){
        const notes=await readNotesAsync();
        res.writeHead(200,{'Content-type':"application.json"});
        res.end(JSON.stringify(notes));
    }else if(method==="POST" && path==="/notes"){
        let body="";
        req.on("data",chunk=> (body+=chunk));
        req.on("end",async()=>{
            const note=JSON.parse(body);
            const notes=await readNotesAsync();
            const newNote={id:randomUUID(),...note};
            notes.push(newNote);
            await writeNotesAsync(notes);
            res.writeHead(201,{'Content-Type':"application.json"});
            res.end(JSON.stringify({message:"Notes added",note:newNote}));
        })

    }else if(method==="PUT" && path.startsWith("/notes/")){
        const id=path.split("/")[2];
        if(!id){
            res.writeHead(400);
            return res.end("Note ID required");
        }
        const note=JSON.parse(body);
        const notes=await readNotesAsync();
        const newNote={id:randomUUID(),...note};
        const currentNoteIndex=notes?.findIndex((eachNote)=>eachNote?.id===id);
        if(currentNoteIndex===-1){
            res.writeHead(400);
            return res.end("Notes not Found");
        }

        notes[currentNoteIndex]=newNote;
        await writeNotesAsync(notes);
        res.writeHead(200);
        res.end(JSON.stringify({message:"Notes Updated Successfully"}));
        

    }else if(method==="DELETE" && path.startsWith("/notes/")){
        const id=path.split("/")[2];
        if(!id){
            res.writeHead(400);
            res.end(JSON.stringify({message:"ID Required"}));
        }
        const notes=await readNotesAsync();
        const notesIndex=notes.findIndex((eachNotes)=>eachNotes?.id===id);
        if(notesIndex===-1){
            res.writeHead(400);
            return res.end("Notes Not Found");
        }

        delete notes[notesIndex];
        await writeNotesAsync(notes);
        res.writeHead(200);
        res.end(JSON.stringify({message:"Note Deleted Successfully"}));
    }else{
        res.writeHead(404,{'Content-Type':"text/plain"});
        res.end(`Route Not Found, ${method}${path}`);
    }
});

server.listen(5000,()=>{
    console.log("Server running at http://localhost:5000");
})
