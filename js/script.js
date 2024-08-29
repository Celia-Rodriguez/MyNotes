/*
Crear, editar y borrar tarjetas de tareas
poder ver el tiempo de hoy en la eregión del ordenador??
clasificar las tareas por hacer en ello y hechas
al situar el raton sobre la tarejta de la carta que aprecan las opciones de edicion y que se pueda interactuar con ellas (ref google keeps)
al pinchar sobre la tarjeta se abre un  poopup con la taerjeta mas grande y las opciones d dicion
anclar notas o recordatorio al inicio?
estilo de las notas editables?
dos tipos de tarjetas notas y recordartorios esto tienen una hora y fecha editable.
*/
//cargar si hay card guardadas
const card_saved= localStorage.getItem('todolist');
    content = new Array();
if(card_saved){
     content=JSON.parse(card_saved);
     content.forEach(element => {createCard(element.text)});
}

const btn_add = document.getElementById("btnadd");
btn_add.addEventListener("click", (ev)=>{
    ev.preventDefault();
//añadir card a el html
    const input_add = document.getElementById("addNotesText");

    var valTitle ="Tarjeta Guardada en el Storage";
    var valText= input_add.value;

    //card no vacias gracias
    if (valText.trim() === "") {
        console.warn('No se puede agregar una tarjeta vacía');
        return;
    }

    createCard(input_add.value);

//guardar en el ssesionStorage
    var new_card ={
        title: valTitle,
        text: valText
    };
    console.log(new_card);
    console.log(content);
    content.push(new_card);
    localStorage.setItem('todolist', JSON.stringify(content))

//deja como estaba el input add note
    input_add.value="";
});


function createCard(valorInput){
    var card=document.createElement("div");
    card.setAttribute("class", "card-note");
    var card_title = document.createElement("h3");
    card_title.setAttribute("class", "title-note");
    card_title.textContent ="Tarjeta de prueba creada";
    var card_text =document.createElement("p");
    card_text.setAttribute("class","text-note");
    card_text.textContent = valorInput;
    card.appendChild(card_title);
    card.appendChild(card_text);
    const container = document.getElementById('card_container');
    container.appendChild(card);
}
  /*input_add.addEventListener("click", (ev)=>{
    ev.preventDefault();
    var title= document.createElement('input');
    title.setAttribute('type','text');
    title.setAttribute('placeholder','Título...');
    title.setAttribute('class','add-notes-input');

    var text= document.createElement('input');
    text.setAttribute('type','text');
    text.setAttribute('placeholder','Añade una nota...');
    text.setAttribute('class','add-notes-input');

    const container = document.getElementById("container_inputs");
    container.appendChild(title);
    container.appendChild(text);

    input_add.remove();  
    
});*/
