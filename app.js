// ==========================
// GBControl v2
// Archivo principal
// ==========================



// Socket principal
const socket = io();
console.log("SOCKET:", socket.id);


// Variables globales
let ordenadores = {};

let estadoPendiente = null;



// ==========================
// LOGIN
// ==========================

function login(){

    const clave =
    document.getElementById("password").value;


    if(clave !== "137924680"){

        document.getElementById("error").innerHTML =
        "❌ Contraseña incorrecta";

        return;

    }


    document.getElementById("login").style.display =
    "none";


    document.getElementById("panel").style.display =
    "block";


    crearOrdenadores();

    iniciarReloj();

    actualizarDashboard();


    if(estadoPendiente){

        cargarEstado(estadoPendiente);

    }

}




// ==========================
// INICIO
// ==========================

window.onload = ()=>{

    console.log("🎮 GBControl iniciado");

};

// ==========================
// PANEL CONEXIONES
// ==========================

function crearPanelConexion(){

    const lista =
    document.getElementById("listaConexion");

    lista.innerHTML="";

    for(let i=1;i<=12;i++){

        lista.innerHTML += `

        <div class="pc-online">

            <div
                id="bolita${i}"
                class="bolita">
            </div>

            <span>
                PC-${String(i).padStart(2,"0")}
            </span>

        </div>

        `;

    }

}