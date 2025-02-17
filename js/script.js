
//cargar si hay card guardadas
const card_saved= localStorage.getItem('todolist');
    let content = new Array();
    let note_id = new Array();
if(card_saved){
     content=JSON.parse(card_saved);
     content.forEach(element => {createCard(element.title, element.text, element.id)});
     note_id =  content.map(element=> element.id);
}

// Transformar el botón en inputs
const inputadd = document.getElementById("addNote");
const inputContainer = document.getElementById("inputContainer");

inputadd.addEventListener("click", function () {
    inputadd.classList.add("hidden");

    const inputTitle = document.createElement('input');
    inputTitle.type = 'text';
    inputTitle.placeholder = 'Here goes the title';
    inputTitle.className = 'title-input';
    inputTitle.setAttribute("id", "addNotesTitle");

    const inputText = document.createElement('textarea');
    inputText.placeholder = 'Here goes the text';
    inputText.className = 'text-input';
    inputText.setAttribute("id", "addNotesText");

    inputContainer.appendChild(inputTitle);
    inputContainer.appendChild(inputText);

    inputContainer.style.display = "flex";

    // Enfocar automáticamente en el título
    inputTitle.focus();

    // Cerrar inputs al hacer clic fuera
    document.addEventListener('click', function closeInputs(event) {
        if (!inputContainer.contains(event.target) && event.target !== inputadd) {
            inputadd.classList.remove('hidden');
            inputContainer.innerHTML = '';
            inputContainer.style.display = "none";
            document.removeEventListener('click', closeInputs);
        }
    });

    // Detectar Enter en los inputs
    inputTitle.addEventListener("keydown", handleEnter);
    inputText.addEventListener("keydown", handleEnter);
});

// Función para manejar Enter y crear una tarjeta
function handleEnter(event) {
    if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        guardarNota();
    }
}

// Función para guardar la tarjeta
function guardarNota() {
    const inputTitle = document.getElementById("addNotesTitle");
    const inputText = document.getElementById("addNotesText");

    if (!inputText) return;

    var valTitle = inputTitle ? inputTitle.value.trim() : "Sample Card on LocalStore";
    var valText = inputText.value.trim();

    if (valText === ""  && valTitle === "") {
        Swal.fire({
            title: 'HEY!!',
            text: 'Empty cards are not stored.',
            icon: 'warning',
            confirmButtonText: 'Ok'
        });
        return;
    }

    // Generar un ID único
    var valId = generarIdUnico();
    while (note_id.includes(valId)) {
        valId = generarIdUnico();
    }

    createCard(valTitle, valText, valId);

    var new_card = {
        title: valTitle,
        text: valText,
        id: valId
    };
    content.push(new_card);
    localStorage.setItem('todolist', JSON.stringify(content));

    inputTitle.value = "";
    inputText.value = "";
    inputadd.classList.remove('hidden');
    inputContainer.innerHTML = '';
    inputContainer.style.display = "none";
}

//funcion para crear las card
function createCard(valTitle, valorInput, valorId){

    //creación iconos CRUD
    var divIcons = document.createElement("div");
    divIcons.setAttribute("class", "note-icons");

    var edit= document.createElement("i");
    edit.setAttribute("class", "fa fa-edit");
    edit.setAttribute("onclick", "editCard(this)");

    var trash= document.createElement("i");
    trash.setAttribute("class", "fa fa-trash-o");
    trash.setAttribute("onclick", "deleteCard(this)");

    var archive= document.createElement("i");
    archive.setAttribute("class", "fa fa-folder-o");
    archive.setAttribute("onclick", "archiveCard(this)");

    divIcons.appendChild(edit);
    divIcons.appendChild(archive);
    divIcons.appendChild(trash);

    //creacion notas
    var card=document.createElement("div");
    card.setAttribute("class", "card-note");
    card.setAttribute("id", valorId);
    card.setAttribute("onclick","selectCard(this.id)");

    var card_title = document.createElement("h3");
    card_title.setAttribute("class", "title-note");
    card_title.textContent = valTitle;

    var card_text =document.createElement("p");
    card_text.setAttribute("class","text-note");
    card_text.textContent = valorInput;

    card.appendChild(card_title);
    card.appendChild(card_text);
    card.appendChild(divIcons);

    const container = document.getElementById('card_container');
    container.appendChild(card);
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

    const newTitle = document.getElementById("editTitle").value.trim();
    const newText = document.getElementById("editText").value.trim();

    const cardId = currentCard.id;
    let notes = JSON.parse(localStorage.getItem('todolist')) || [];
    let noteIndex = notes.findIndex(note => note.id === cardId);

    if (noteIndex !== -1) {
        const originalTitle = notes[noteIndex].title;
        const originalText = notes[noteIndex].text;

        // mantener los valores originales
        const finalTitle = newTitle === "" ? originalTitle : newTitle;
        const finalText = newText === "" ? originalText : newText;

        currentCard.querySelector('.title-note').textContent = finalTitle;
        currentCard.querySelector('.text-note').textContent = finalText;

        notes[noteIndex].title = finalTitle;
        notes[noteIndex].text = finalText;
        localStorage.setItem('todolist', JSON.stringify(notes));

        closeModal();
    }
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
    
    let note_saved= JSON.parse(localStorage.getItem('todolist'));
    let trashNotes =localStorage.getItem('trashNotes');
    toTrash= new Array();
    if(trashNotes){
    toTrash= JSON.parse(trashNotes);
        //console.log(toTrash);
    }

    const indexNota = note_saved.findIndex(card => card.id === idNote);
    if(indexNota !== -1){

        const [deleteNote] = note_saved.splice(indexNota,1);
        toTrash.push(deleteNote);

        localStorage.setItem('todolist',JSON.stringify(note_saved));
        localStorage.setItem('trashNotes', JSON.stringify(toTrash));
    }

    Swal.fire(
        'Bye Bye!!',
        'The note has been sent to the bin.',
        'success'
    );

}

//archivar cards
function archiveCard(element){
    const cardNote = element.closest('.card-note');
    const idNote= cardNote.id;
    if (cardNote.classList.contains("card-selected")) {
        cardNote.classList.remove("card-selected");
    }
    cardNote.remove();
  
    let note_saved= JSON.parse(localStorage.getItem('todolist'));
    let archiveNotes =localStorage.getItem('archiveNotes');
    toArchive= new Array();
    if(archiveNotes){
    toArchive= JSON.parse(archiveNotes);
        //console.log(toTrash);
    }

    const indexNota = note_saved.findIndex(card => card.id === idNote);
    if(indexNota !== -1){

        const [archiveNote] = note_saved.splice(indexNota,1);
        toArchive.push(archiveNote);

        localStorage.setItem('todolist',JSON.stringify(note_saved));
        localStorage.setItem('archiveNotes', JSON.stringify(toArchive));
    }

    Swal.fire(
        'Archived!!',
        'The note has been sent to the archive folder.',
        'success'
    );
}

function generarIdUnico() {
   return 'div-' + Math.random().toString(36).substr(2, 9); // Genera un ID alfanumérico
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

    if(cardSelected === null) {return;}

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

function archiveSelected() {
    const cardClassSelected = document.querySelectorAll('.card-selected');

    for (const element of cardClassSelected) {
        element.classList.remove("card-selected");
        archiveCard(element);
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