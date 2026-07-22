const express = require("express");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");
const fs = require("fs");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = 3000;


console.log("🔥 SERVER GBControl ACTIVO");



// ==========================
// ARCHIVO ESTADO
// ==========================

const archivoEstado =
path.join(__dirname,"estado.json");


let ordenadores = {};
let agentes = {};
let estadoAgentes = {};
let ultimoHeartbeat = {};
let datosServidor = {};


const archivoServidor =
path.join(__dirname,"servidor.json");



function cargarServidor(){


    if(fs.existsSync(archivoServidor)){


        datosServidor = JSON.parse(

            fs.readFileSync(
                archivoServidor,
                "utf8"
            )

        );


        console.log(
            "🆔 ID SERVIDOR:",
            datosServidor.idServidor
        );


    }else{


        console.log(
            "❌ No existe ID servidor"
        );


    }


}


cargarServidor();

// ==========================
// CARGAR ESTADO
// ==========================

function cargarEstado(){


    if(fs.existsSync(archivoEstado)){


        ordenadores = JSON.parse(

            fs.readFileSync(
                archivoEstado,
                "utf8"
            )

        );


        console.log("💾 Estado cargado");


    }else{


        for(let i=1;i<=12;i++){


            ordenadores[i]={

                encendido:false,

                finSesion:null

            };


        }


        guardarEstado();


        console.log("🆕 Estado creado");


    }


}




// ==========================
// GUARDAR ESTADO
// ==========================

function guardarEstado(){


    fs.writeFileSync(

        archivoEstado,

        JSON.stringify(
            ordenadores,
            null,
            2
        )

    );


}



cargarEstado();





// ==========================
// WEB
// ==========================


app.use(

    express.static(

        path.join(__dirname,"../dashboard")

    )

);



app.get("/",(req,res)=>{


    res.sendFile(

        path.join(__dirname,"../dashboard/index.html")

    );


});







// ==========================
// OBTENER ESTADO
// ==========================


function obtenerEstado(){


    let estado={};



    for(let pc in ordenadores){



        let segundos=0;



        if(ordenadores[pc].finSesion){



            segundos=Math.floor(

                (ordenadores[pc].finSesion - Date.now()) / 1000

            );



            if(segundos<=0){


                segundos=0;

                ordenadores[pc].finSesion=null;


            }


        }



        estado[pc]={


            encendido:
            ordenadores[pc].encendido,


            segundos:segundos


        };



    }



    return estado;


}









// ==========================
// SOCKET
// ==========================


io.on("connection",(socket)=>{


console.log("🟢 Panel conectado");

socket.emit("estadoInicial",{
    pcs: obtenerEstado(),
    agentes: estadoAgentes
});


// ==========================
// RECIBIR HEARTBEAT
// ==========================

socket.on("heartbeat",(data)=>{

    if(socket.idPC){

        ultimoHeartbeat[data.id] = Date.now();

    }

});

// ==========================
// REGISTRAR AGENTE
// ==========================

socket.on("registrarAgente",(data)=>{


console.log(
"📡 REGISTRO AGENTE:",
data
);


if(data.servidor !== datosServidor.idServidor){


    console.log(
    "❌ Servidor incorrecto"
    );


    socket.emit(
        "conexionRechazada",
        {
            motivo:"ID servidor incorrecto"
        }
    );


    return;


}

    console.log("📡 REGISTRO DE AGENTE RECIBIDO:", data);

    socket.idPC = data.id;

    agentes[data.id] = socket;
    estadoAgentes[data.id] = true;
    ultimoHeartbeat[data.id] = Date.now();

    io.emit("estadoAgentes", estadoAgentes);

    // Marcar PC como encendido al conectar agente

const numeroPC = data.id.replace("PC-","");

if(ordenadores[numeroPC]){

    ordenadores[numeroPC].encendido = true;

    guardarEstado();

}

    console.log("🖥️ AGENTE CONECTADO:", data.id);

    console.log("📋 Agentes conectados:");
    console.log(Object.keys(agentes));

    io.emit("estadoAgente",{
        id:data.id,
        online:true
    });

    io.emit("actualizarPC",{
        pc:Number(numeroPC),
        encendido:true
    });

});



// ==========================
// ENCENDER PC
// ==========================

socket.on("encenderPC",(data)=>{

    console.log("📩 ORDEN RECIBIDA: ENCENDER PC", data.pc);

    ordenadores[data.pc].encendido = true;

    guardarEstado();

    const idAgente = "PC-" + String(data.pc).padStart(2,"0");
    const agente = agentes[idAgente];

    if(agente){

        console.log("📤 ENVIANDO A", idAgente);

        agente.emit("encenderPC", {
    id:idAgente
});

    }else{

        console.log("❌ AGENTE", idAgente, "NO CONECTADO");

    }

    io.emit("encenderPC", data);

});







// ==========================
// APAGAR PC
// ==========================

socket.on("apagarPC",(data)=>{

    console.log(
        "🔴 APAGANDO PC-"+data.pc
    );

    ordenadores[data.pc].encendido = false;
    ordenadores[data.pc].finSesion = null;

    guardarEstado();

    const agente = agentes["PC-" + String(data.pc).padStart(2,"0")];

    if(agente){

        agente.emit(
    "apagarPC",
    {
        id:"PC-" + String(data.pc).padStart(2,"0")
    }
);

    }

    io.emit(
        "apagarPC",
        data
    );

});


// ==========================
// INICIAR TIEMPO
// ==========================

socket.on("iniciarTiempo",(data)=>{

    ordenadores[data.pc].encendido = true;

    ordenadores[data.pc].finSesion =
        Date.now() + data.segundos * 1000;

    guardarEstado();

    console.log(
        "⏱ PC-"+data.pc+" "+data.segundos+" segundos"
    );

    const agente = agentes["PC-" + String(data.pc).padStart(2,"0")];

    if(agente){

        agente.emit(
    "iniciarTiempo",
    {
        id:"PC-" + String(data.pc).padStart(2,"0"),
        segundos:data.segundos
    }
);

    }

    io.emit(
        "iniciarTiempo",
        data
    );

});






    // ==========================
    // SUMAR 30 MIN
    // ==========================


    socket.on("sumarTiempo",(data)=>{


        console.log(
            "➕ SUMAR RECIBIDO",
            data
        );



        if(!ordenadores[data.pc].finSesion){


            ordenadores[data.pc].finSesion =
            Date.now();


        }



        ordenadores[data.pc].finSesion +=

        data.segundos * 1000;



        guardarEstado();




        const segundos = Math.floor(

            (ordenadores[data.pc].finSesion - Date.now()) / 1000

        );



        io.emit(

            "actualizarTiempo",

            {

                pc:data.pc,

                segundos:segundos

            }

        );


    });









    // ==========================
    // RESTAR 30 MIN
    // ==========================


    socket.on("restarTiempo",(data)=>{


        console.log(

            "➖ RESTAR RECIBIDO",

            data

        );



        if(!ordenadores[data.pc].finSesion){

            return;

        }



        ordenadores[data.pc].finSesion -=

        data.segundos * 1000;



        if(

            ordenadores[data.pc].finSesion < Date.now()

        ){


            ordenadores[data.pc].finSesion = Date.now();


        }



        guardarEstado();




        const segundos = Math.floor(

            (ordenadores[data.pc].finSesion - Date.now()) / 1000

        );



        io.emit(

            "actualizarTiempo",

            {

                pc:data.pc,

                segundos:segundos

            }

        );


    });









// ==========================
// CERRAR SESION
// ==========================

socket.on("cerrarSesion",(data)=>{

    console.log(
        "🔒 CERRAR SESION RECIBIDO PC-"+data.pc
    );

    ordenadores[data.pc].finSesion = null;

    guardarEstado();

    const agente = agentes["PC-" + String(data.pc).padStart(2,"0")];

    if(agente){

        agente.emit(
    "cerrarSesion",
    {
        id:"PC-" + String(data.pc).padStart(2,"0")
    }
);

    }

    io.emit(
        "cerrarSesion",
        data
    );

});

// ==========================
// ABRIR SESION
// ==========================

socket.on("abrirSesion",(data)=>{

    console.log("🔥 EVENTO ABRIR SESION LLEGÓ AL SERVER");
    console.log(data);

    console.log(
        "🟢 ABRIR SESION RECIBIDO PC-"+data.pc
    );


    const agente = agentes[
        "PC-" + String(data.pc).padStart(2,"0")
    ];


    if(agente){


        agente.emit(
            "abrirSesion",
            {
                id:
                "PC-" + String(data.pc).padStart(2,"0")
            }
        );


        console.log(
            "📤 ENVIANDO ABRIR SESION A PC-"+data.pc
        );


    }else{


        console.log(
            "❌ AGENTE NO CONECTADO PC-"+data.pc
        );


    }


});







    // ==========================
    // DESCONEXION
    // ==========================


    socket.on("disconnect",()=>{

    if(socket.idPC){

        delete agentes[socket.idPC];

        estadoAgentes[socket.idPC] = false;

        io.emit("estadoAgentes", estadoAgentes);

        console.log(
            "❌ AGENTE DESCONECTADO:",
            socket.idPC
        );

        io.emit(

            "estadoAgente",

            {

                id:socket.idPC,

                online:false

            }

        );

    }else{

        console.log(
            "🔴 Panel desconectado"
        );

    }

});



});





// ==========================
// COMPROBAR HEARTBEAT
// ==========================

setInterval(()=>{

    const ahora = Date.now();


    for(let pc in ultimoHeartbeat){


        if(ahora - ultimoHeartbeat[pc] > 15000){


            console.log(
                "🔴",
                pc,
                "SIN CONEXIÓN"
            );


            const numeroPC = pc.replace("PC-","");


            if(ordenadores[numeroPC]){


                ordenadores[numeroPC].encendido = false;

                guardarEstado();


                 io.emit("estadoAgente",{
                        id: pc,
                        online: false
                    });

                    estadoAgentes[pc] = false;

                    io.emit("estadoAgentes", estadoAgentes);

                    io.emit("actualizarPC",{
                        pc: Number(numeroPC),
                        encendido: false
                    });
            }


            delete ultimoHeartbeat[pc];


        }


    }


},5000);



server.listen(PORT,()=>{


    console.log(

        "🚀 GBControl iniciado en http://localhost:"+PORT

    );


});