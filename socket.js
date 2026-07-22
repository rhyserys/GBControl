// ==========================
// SOCKET.IO
// ==========================

let estadoConexion = {};

socket.on("connect",()=>{

    console.log("🟢 Conectado al servidor", socket.id);

});

socket.on("disconnect",()=>{

    console.log("🔴 Desconectado del servidor");

});


// ==========================
// ESTADO INICIAL
// ==========================

socket.on("estadoInicial",(datos)=>{

    estadoPendiente = datos.pcs;

    estadoConexion = datos.agentes || {};

    actualizarListaConexion();

    if(Object.keys(ordenadores).length > 0){

        cargarEstado(datos.pcs);

    }

});


// ==========================
// CARGAR ESTADO
// ==========================

function cargarEstado(datos){

    for(let pc in datos){

        pc = Number(pc);

        if(!ordenadores[pc]) continue;

        if(datos[pc].encendido){

            encenderVisual(pc);

        }

        if(datos[pc].segundos > 0){

            iniciarCuenta(
                pc,
                datos[pc].segundos
            );

        }else{

            clearInterval(
                ordenadores[pc].intervalo
            );

        }

    }

    actualizarDashboard();

}




// ==========================
// INICIAR TIEMPO
// ==========================

socket.on("iniciarTiempo",(data)=>{

    iniciarCuenta(
        data.pc,
        data.segundos
    );

});




// ==========================
// ACTUALIZAR TIEMPO
// ==========================

socket.on("actualizarTiempo",(data)=>{

    if(!ordenadores[data.pc]) return;

    ordenadores[data.pc].segundos = data.segundos;

    mostrarTiempo(data.pc);

});




// ==========================
// ENCENDER
// ==========================

socket.on("encenderPC",(data)=>{

    encenderVisual(data.pc);

});




// ==========================
// APAGAR
// ==========================

socket.on("apagarPC",(data)=>{

    resetearPC(data.pc);

});




// ==========================
// ACTUALIZAR ESTADO REAL DEL PC
// ==========================

socket.on("actualizarPC",(data)=>{

    if(!ordenadores[data.pc]) return;

    if(data.encendido){

        encenderVisual(data.pc);

    }else{

        resetearPC(data.pc);

    }

    actualizarDashboard();

});




// ==========================
// CERRAR SESIÓN
// ==========================

socket.on("cerrarSesion",(data)=>{

    if(!ordenadores[data.pc]) return;

    clearInterval(
        ordenadores[data.pc].intervalo
    );

    ordenadores[data.pc].segundos = 0;

    cambiarEstado(
        data.pc,
        "🟢 Libre",
        "libre"
    );

    document.getElementById(
        "tiempo"+data.pc
    ).innerHTML = "Sin sesión";

    actualizarDashboard();

});




// ==========================
// PEDIR ESTADO
// ==========================

function pedirEstado(){

    socket.emit("pedirEstado");

}




// ==========================
// PANEL CONEXIONES
// ==========================

function actualizarListaConexion(){

    const lista = document.getElementById("listaConexion");

    if(!lista) return;

    lista.innerHTML = "";

    for(let i=1;i<=12;i++){

        const id = "PC-" + String(i).padStart(2,"0");

        const online = estadoConexion[id] || false;

        lista.innerHTML += `
            <div class="pc-online">
                <span>PC-${i}</span>
                <div class="bolita ${online ? "online" : ""}"></div>
            </div>
        `;

    }

}




// ==========================
// ACTUALIZAR UN AGENTE
// ==========================

socket.on("estadoAgente",(data)=>{

    estadoConexion[data.id] = data.online;

    actualizarListaConexion();

});




// ==========================
// ACTUALIZAR TODOS LOS AGENTES
// ==========================

socket.on("estadoAgentes",(estados)=>{

    estadoConexion = estados;

    actualizarListaConexion();

});


socket.on("liberarTiempo",(data)=>{

    if(!ordenadores[data.pc])
    return;


    clearInterval(
        ordenadores[data.pc].intervalo
    );


    ordenadores[data.pc].segundos = 0;


    cambiarEstado(
        data.pc,
        "🟢 Libre",
        "libre"
    );


    document.getElementById(
        "tiempo"+data.pc
    ).innerHTML="Sin sesión";


    actualizarDashboard();

});
