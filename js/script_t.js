
/*
 editar y restaurar las tarjetas borradas. Boton para vaciar la papelera
    --> a la hora de crear las tarjetas de necesita un id idstintivo para luego poder moverlas o borrarlas.
    --> se necesita un evento onclick en el icono de trash para poder borrarlas.
poder ver el tiempo de hoy en la eregión del ordenador??
clasificar las tareas por hacer en ello y hechas
al situar el raton sobre la tarejta de la carta que aprecan las opciones de edicion y que se pueda interactuar con ellas (ref google keeps)
al pinchar sobre la tarjeta se abre un  poopup con la taerjeta mas grande y las opciones d dicion
anclar notas o recordatorio al inicio?
estilo de las notas editables?
dos tipos de tarjetas notas y recordartorios esto tienen una hora y fecha editable.
*/
//cargar si hay card guardadas
const card_saved= localStorage.getItem('trashNotes');
    content = new Array();
    note_id = new Array();
if(card_saved){
     content=JSON.parse(card_saved);
     content.forEach(element => {createCard(element.text, element.id)});
     note_id =  content.map(element=> element.id);
}
if(content.length===0){
    const container = document.getElementById('empty-trash-container');
    container.style.display="flex";
}

//funcion para crear las card
function createCard(valorInput, valorId){

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
    card_title.textContent ="Not title yet";

    var card_text =document.createElement("p");
    card_text.setAttribute("class","text-note");
    card_text.textContent = valorInput;

    card.appendChild(card_title);
    card.appendChild(card_text);
    card.appendChild(divIcons);

    const container = document.getElementById('card_container');
    container.appendChild(card);
}

//funcion para borrar las cards
function deleteCard(element){
    //console.log(element);
    Swal.fire({
        title: 'Delete note',
        text: 'It will be permanently deleted, \n do you really want to delete the note?',
        icon: 'warning',
        showCancelButton: true, 
        confirmButtonColor: '#3085d6', 
        cancelButtonColor: '#d33', 
        cancelButtonText: 'Cancel', 
        confirmButtonText: 'Delete' 

    }).then(result =>{

        if(result.isConfirmed){
            const cardNote = element.closest('.card-note');
            const idNote= cardNote.id;
            cardNote.remove();

            //eliminar del localStorage
            let trashNotes = JSON.parse(localStorage.getItem('trashNotes')) || [];

            trashNotes= trashNotes.filter(card=> card.id !== idNote);

            localStorage.setItem('trashNotes',JSON.stringify(trashNotes));

            if(trashNotes.length  === 0){
                const container = document.getElementById('empty-trash-container');
                container.style.display="flex";
            }

            Swal.fire(
                'Deleted forever!!!',
                'Note has been permanently deleted',
                'success'
            );
        }
    });
    
}

function restoreCard(element){
    Swal.fire({
        title: 'Restore note?',
        icon: 'info',
        showCancelButton: true, 
        confirmButtonColor: '#3085d6', 
        cancelButtonColor: '#d33', 
        cancelButtonText: 'No', 
        confirmButtonText: 'Yes' 

    }).then(result =>{

        if(result.isConfirmed){
            const cardNote = element.closest('.card-note');
            const idNote= cardNote.id;
            cardNote.remove();

            //eliminar del localStorage
            let trashNotes = JSON.parse(localStorage.getItem('trashNotes')) || [];
            let notes_restored = JSON.parse(localStorage.getItem('todolist')) || [];

            const indexNota = trashNotes.findIndex(card => card.id === idNote);

          if(indexNota !==-1){
            const [restoreNote]= trashNotes.splice(indexNota,1);
         notes_restored.push(restoreNote);

            localStorage.setItem('todolist',JSON.stringify (notes_restored));
            localStorage.setItem('trashNotes', JSON.stringify(trashNotes));
          }
          
          
          
            trashNotes= trashNotes.filter(card=> card.id !== idNote);

            localStorage.setItem('trashNotes',JSON.stringify(trashNotes));

            if(trashNotes.length  === 0){
                const container = document.getElementById('empty-trash-container');
                container.style.display="flex";
            }
        }
    });
}
