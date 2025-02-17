//cargar si hay card guardadas
const card_saved= localStorage.getItem('archiveNotes');
    content = new Array();
    note_id = new Array();
if(card_saved){
     content=JSON.parse(card_saved);
     content=JSON.parse(card_saved);
     content.forEach(element => {createCard(element.title, element.text, element.id)});
     note_id =  content.map(element=> element.id);
}

archiveIsEmpty(content);

function archiveIsEmpty(archiveNotes){
    if(archiveNotes.length  === 0 || archiveNotes === null){
        const container = document.getElementById('empty-archive-container');
        container.style.display="flex";
    }
}

//funcion para crear las card
function createCard(valTitle, valorInput, valorId){

    //creación iconos CRUD
    var divIcons = document.createElement("div");
    divIcons.setAttribute("class", "note-icons");

    var restore= document.createElement("i");
    restore.setAttribute("class", "fa fa-undo");
    restore.setAttribute("onclick", "restoreCard(this)");


    var trash= document.createElement("i");
    trash.setAttribute("class", "fa fa-trash-o");
    trash.setAttribute("onclick", "deleteCard(this)");

    var archive= document.createElement("i");
    archive.setAttribute("class", "fa fa-folder-o");

    divIcons.appendChild (restore);
    divIcons.appendChild(archive);
    divIcons.appendChild(trash);

    //Creacion notas
    var card=document.createElement("div");
    card.setAttribute("class", "card-note");
    card.setAttribute("id", valorId);

    var card_title = document.createElement("h3");
    card_title.setAttribute("class", "title-note");
    card_title.textContent =valTitle;

    var card_text =document.createElement("p");
    card_text.setAttribute("class","text-note");
    card_text.textContent = valorInput;

    card.appendChild(card_title);
    card.appendChild(card_text);
    card.appendChild(divIcons);

    const container = document.getElementById('card_container');
    container.appendChild(card);
}

