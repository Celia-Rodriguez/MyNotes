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

    var edit= document.createElement("i");
    edit.setAttribute("class", "fa fa-edit");
    edit.setAttribute("onclick", "editCard(this)");

    var restore= document.createElement("i");
    restore.setAttribute("class", "fa fa-undo");
    restore.setAttribute("onclick", "restoreCard(this)");


    var trash= document.createElement("i");
    trash.setAttribute("class", "fa fa-trash-o");
    trash.setAttribute("onclick", "deleteCard(this)");

    divIcons.appendChild (restore);
    divIcons.appendChild(edit);
    divIcons.appendChild(trash);

    //Creacion notas
    var card=document.createElement("div");
    card.setAttribute("class", "card-note");
    card.setAttribute("id", valorId);
    card.setAttribute("onclick","selectCard(this.id)");

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
            let archiveNotes = JSON.parse(localStorage.getItem('archiveNotes')) || [];
            let notes_restored = JSON.parse(localStorage.getItem('archiveNotes')) || [];

            const indexNota = archiveNotes.findIndex(card => card.id === idNote);

            if(indexNota !==-1){
                const [restoreNote]= archiveNotes.splice(indexNota,1);
                notes_restored.push(restoreNote);

                localStorage.setItem('archiveNotes',JSON.stringify (notes_restored));
                localStorage.setItem('archiveNotes', JSON.stringify(archiveNotes));
            }

            archiveNotes= archiveNotes.filter(card=> card.id !== idNote);

            localStorage.setItem('archiveNotes',JSON.stringify(archiveNotes));
            //trashIsEmpty(archiveNotes);
            
        }
    });
}

//funcion para editar las cards
let currentCard = null;

function editCard(element) {
    currentCard = element.closest('.card-note');

    const title = currentCard.querySelector('.title-note').textContent;
    const text = currentCard.querySelector('.text-note').textContent;

    document.getElementById("editTitle").value = title;
    document.getElementById("editText").value = text;
    document.getElementById("editModal").style.display = "flex";
}


//guardar cambios de card editada
function saveEdit() {
    if (!currentCard) return;

    const newTitle = document.getElementById("editTitle").value;
    const newText = document.getElementById("editText").value;

    currentCard.querySelector('.title-note').textContent = newTitle;
    currentCard.querySelector('.text-note').textContent = newText;

    const cardId = currentCard.id;

    let notes = JSON.parse(localStorage.getItem('archiveNotes')) || [];
    let noteIndex = notes.findIndex(note => note.id === cardId);

    if (noteIndex !== -1) {
        notes[noteIndex].title = newTitle;
        notes[noteIndex].text = newText;
        localStorage.setItem('archiveNotes', JSON.stringify(notes));
    }

    closeModal();
}

//cerrar modal
function closeModal() {
    document.getElementById("editModal").style.display = "none";
}

//funcion para borrar las cards
function deleteCard(element){
    const cardNote = element.closest('.card-note');
    const idNote= cardNote.id;
    if (cardNote.classList.contains("card-selected")) {
        cardNote.classList.remove("card-selected");
        updateSubmenuVisibility()
    }
    cardNote.remove();
    
    let note_saved= JSON.parse(localStorage.getItem('archiveNotes'));
    let trashNotes =localStorage.getItem('trashNotes');
    toTrash= new Array();
    if(trashNotes){
    toTrash= JSON.parse(trashNotes);
    }

    const indexNota = note_saved.findIndex(card => card.id === idNote);
    if(indexNota !== -1){

        const [deleteNote] = note_saved.splice(indexNota,1);
        toTrash.push(deleteNote);

        localStorage.setItem('archiveNotes',JSON.stringify(note_saved));
        localStorage.setItem('trashNotes', JSON.stringify(toTrash));
    }

    let archivedNotes = JSON.parse(localStorage.getItem('archiveNotes')) || [];
    if(archivedNotes.length  === 0){
        const container = document.getElementById('empty-archive-container');
        container.style.display="flex";
    }

    Swal.fire(
        'Bye Bye!!',
        'The note has been sent to the bin.',
        'success'
    );

}

function selectCard(id){
    
    const cardSelected = document.getElementById(id);
    const submenu= document.getElementById("submenu");
    const span= document.getElementById("noteSelected");
    
    if(cardSelected === null){
        return;
    }else{
        if(cardSelected.classList.contains("card-selected")){
            cardSelected.classList.remove("card-selected");
        }else{
            cardSelected.classList.add("card-selected");
        }
    }


    const cardClassSelected =[... document.querySelectorAll('.card-selected')];

    if(cardClassSelected.length >0){
        submenu.style.display="flex";
        span.textContent= cardClassSelected.length  +" selected";
        
        const cancelSelect= document.getElementById("cancelSelected");
        cancelSelect.addEventListener("click",(ev)=>{
            ev.preventDefault();
            const cardClassSelected = document.querySelectorAll('.card-selected');
            cardClassSelected.forEach(element=>{
                element.classList.remove("card-selected");
            });
            submenu.style.display="none";
            span.textContent="";
        });
    }else{
        submenu.style.display="none";
        span.textContent="";
    }

    if(cardSelected=== null) {return;}

    updateSubmenuVisibility()
    
}

function deleteSelected(){
    const cardClassSelected = document.querySelectorAll('.card-selected');
    for (const element of cardClassSelected){
        element.classList.remove("card-selected");
        deleteCard(element);
    }

    const submenu = document.getElementById("submenu");
    const span = document.getElementById("noteSelected");

    submenu.style.display = "none";
    span.textContent = "";
}

function updateSubmenuVisibility() {
    const cardClassSelected = document.querySelectorAll('.card-selected');
    const submenu = document.getElementById("submenu");
    const span = document.getElementById("noteSelected");

    if (cardClassSelected.length > 0) {
        submenu.style.display = "flex";
        span.textContent = cardClassSelected.length + " selected";
    } else {
        submenu.style.display = "none";
        span.textContent = "";
    }
}