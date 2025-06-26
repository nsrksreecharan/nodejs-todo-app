const fs=require('fs');
const path=require('path');

const filePath=path.join(__dirname,'./notes.json');

function readNotes(){
    console.log(filePath);
    const data=fs.readFileSync(filePath,'utf-8') || "";
    return JSON.parse(data);
}

function writeNotes(notes){
    fs.writeFileSync(filePath,JSON.stringify(notes,null,2));
}

module.exports ={readNotes,writeNotes};