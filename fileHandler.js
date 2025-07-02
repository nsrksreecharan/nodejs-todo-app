const fs=require("fs");
const fsp=fs.promises;
const path=require("path");

const filePath=path.join(__dirname,"./notes.json");

const readNotes=()=>{
    if (!fs.existsSync(filePath)) {
        return []; 
    }
    const notes=fs.readFileSync(filePath,"utf-8") || "";
    if (!notes) {
        return []; // return empty array if file is empty
    }

    try {
        return JSON.parse(notes);
    } catch (err) {
        console.error("Invalid JSON format in notes.json:", err.message);
        return [];
    }
}

const writeNotes=(notes)=>{
    fs.writeFileSync(filePath,JSON.stringify(notes,null,2));
}

const readNotesAsync=async()=>{
    try{
        await fsp.access(filePath);
        const notes=await fsp.readFile(filePath,"utf-8")||"";
        if(!notes) return [];

        return JSON.parse(notes);
    } catch (err){
        console.error("Error with async file reading",err)
        return [];
    }
}

const writeNotesAsync=async(notes)=>{
    try{
        await fsp.writeFile(notes);
    } catch(err){
        console.log("Can't write file error",err);
    }
};

module.exports={readNotes,writeNotes,readNotesAsync,writeNotesAsync};
