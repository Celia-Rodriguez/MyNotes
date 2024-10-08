
/*
editar y archivar tarjetas de tareas
    --> a la hora de crear las tarjetas de necesita un id idstintivo para luego poder moverlas o borrarlas.
    --> se necesita un evento onclick en el icono de trash para poder borrarlas.
poder ver el tiempo de hoy en la eregión del ordenador??
clasificar las tareas por hacer en ello y hechas
al situar el raton sobre la tarejta de la carta que aprecan las opciones de edicion y que se pueda interactuar con ellas (ref google keeps)
al pinchar sobre la tarjeta se abre un  poopup con la taerjeta mas grande y las opciones d dicion
anclar notas o recordatorio al inicio?
estilo de las notas editables?
dos tipos de tarjetas notas y recordartorios esto tienen una hora y fecha editable.
añadir tooltips a los botones (i)
*/
//cargar si hay card guardadas
const card_saved= localStorage.getItem('todolist');
    content = new Array();
    note_id = new Array();
if(card_saved){
     content=JSON.parse(card_saved);
     content.forEach(element => {createCard(element.text, element.id)});
     note_id =  content.map(element=> element.id);
}

//Añadir cards
const btn_add = document.getElementById("btnadd");
btn_add.addEventListener("click", (ev)=>{
    ev.preventDefault();
//añadir card a el html
    const input_add = document.getElementById("addNotesText");

    var valTitle ="Sample Card on LocalStore";
    var valText= input_add.value;
    var valId= generarIdUnico();
    //console.log(valId);

    while(note_id.includes(valId)){
        valId = generarIdUnico();
    }

    //card no vacias gracias
    if (valText.trim() === "") {
        Swal.fire({
            title: 'HEY!!',
            text: 'Empty cards are not stored.',
            icon: 'warning',
            confirmButtonText: 'Ok'
        });
        return;
    }

    createCard(valText, valId);

//guardar en el ssesionStorage
    var new_card ={
        title: valTitle,
        text: valText,
        id: valId
    };
    //console.log(new_card);
    //console.log(content);
    content.push(new_card);
    localStorage.setItem('todolist', JSON.stringify(content))

//deja como estaba el input add note
    input_add.value="";
});

//funcion para crear las card
function createCard(valorInput, valorId){

    //creación iconos CRUD
    var divIcons = document.createElement("div");
    divIcons.setAttribute("class", "note-icons");

    var edit= document.createElement("i");
    edit.setAttribute("class", "fa fa-edit");

    var trash= document.createElement("i");
    trash.setAttribute("class", "fa fa-trash-o");
    trash.setAttribute("onclick", "deleteCard(this)");

    var archive= document.createElement("i");
    archive.setAttribute("class", "fa fa-folder-o");

    divIcons.appendChild(edit);
    divIcons.appendChild(archive);
    divIcons.appendChild(trash);

    //Creacion notas
    var card=document.createElement("div");
    card.setAttribute("class", "card-note");
    card.setAttribute("id", valorId);
    card.setAttribute("onclick","selectCard(this.id)");

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
    const cardNote = element.closest('.card-note');
    const idNote= cardNote.id;
    cardNote.remove();
    //eliminar del localStorage
    //console.log(idNote);
    
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

function generarIdUnico() {
    //console.log('div-' + Math.random().toString(36).substr(2, 9));
   return 'div-' + Math.random().toString(36).substr(2, 9); // Genera un ID alfanumérico
}
var idSelected= new Array();
function selectCard(id){
    const cardSelected = document.getElementById(id);
    const submenu= document.getElementById("submenu");
    const span= document.getElementById("noteSelected");
    if(cardSelected.classList.contains("card-selected")){
        cardSelected.classList.remove("card-selected");
        idSelected=idSelected.filter(element=> element !==id);
    }else{
        cardSelected.classList.add("card-selected");
        idSelected.push(id);
    }

    if(idSelected.length !==0){
        submenu.style.display="flex";
        span.textContent= idSelected.length  +" " + "selected";
        
        const cancelSelect= document.getElementById("cancelSelected");
        cancelSelect.addEventListener("click",(ev)=>{
            ev.preventDefault();
            const cardClassSelected = document.querySelectorAll('.card-selected');
            cardClassSelected.forEach(element=>{
                element.classList.remove("card-selected");
            });
            idSelected= new Array();
            submenu.style.display="none";
            span.textContent="";
        });
    }else{
        submenu.style.display="none";
        span.textContent="";
    }
}

function deleteSelected(){
    const cardClassSelected = document.querySelectorAll('.card-selected');
console.log(cardClassSelected)
    for (const element of cardClassSelected){
        console.log(element);
        element.classList.remove("card-selected");
        deleteCard(element);
    }
}
