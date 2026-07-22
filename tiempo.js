// ==========================
// TIEMPO GBControl
// ==========================


// ==========================
// INICIAR TIEMPO
// ==========================

function iniciarTiempo(pc, segundos){


    console.log(
        "⏱ BOTON TIEMPO PULSADO",
        pc,
        segundos
    );


    if(!ordenadores[pc]) return;


    socket.emit(
        "iniciarTiempo",
        {
            pc: pc,
            segundos: segundos
        }
    );


}





// ==========================
// INICIAR CUENTA ATRÁS
// ==========================

function iniciarCuenta(pc, segundos){


    if(!ordenadores[pc]) return;



    clearInterval(
        ordenadores[pc].intervalo
    );



    ordenadores[pc].segundos = segundos;



    cambiarEstado(
        pc,
        "🟡 En uso",
        "usando"
    );



    mostrarTiempo(pc);



    ordenadores[pc].intervalo = setInterval(()=>{


        ordenadores[pc].segundos--;



        if(ordenadores[pc].segundos <= 0){


            ordenadores[pc].segundos = 0;


            clearInterval(
                ordenadores[pc].intervalo
            );


            cerrarSesion(pc);


            return;

        }



        mostrarTiempo(pc);


        actualizarDashboard();



    },1000);



    actualizarDashboard();


}






// ==========================
// MOSTRAR TIEMPO
// ==========================

function mostrarTiempo(pc){


    if(!ordenadores[pc]) return;



    let total =
    ordenadores[pc].segundos;



    let horas =
    Math.floor(total / 3600);



    let minutos =
    Math.floor((total % 3600) / 60);



    let segundos =
    total % 60;



    let texto = "";



    if(horas > 0){

        texto +=
        String(horas).padStart(2,"0")+":";

    }



    texto +=
    String(minutos).padStart(2,"0")+":"+
    String(segundos).padStart(2,"0");



    const elemento =
    document.getElementById(
        "tiempo"+pc
    );



    if(elemento){

        elemento.innerHTML =
        "Tiempo restante: " + texto;

    }


}






// ==========================
// SUMAR 30 MIN
// ==========================

function sumarTiempo(pc){


    console.log(
        "➕ SUMAR 30 MIN PC",
        pc
    );



    socket.emit(
        "sumarTiempo",
        {
            pc:pc,
            segundos:1800
        }
    );


}






// ==========================
// RESTAR 30 MIN
// ==========================

function restarTiempo(pc){


    console.log(
        "➖ RESTAR 30 MIN PC",
        pc
    );



    socket.emit(
        "restarTiempo",
        {
            pc:pc,
            segundos:1800
        }
    );


}






// ==========================
// CERRAR SESIÓN
// ==========================

function cerrarSesion(pc){


    console.log(
        "🔒 CERRAR SESION PC",
        pc
    );



    if(!ordenadores[pc]) return;



    clearInterval(
        ordenadores[pc].intervalo
    );



    ordenadores[pc].segundos = 0;



    cambiarEstado(
        pc,
        "🟢 Libre",
        "libre"
    );



    const tiempo =
    document.getElementById(
        "tiempo"+pc
    );



    if(tiempo){

        tiempo.innerHTML =
        "Sin sesión";

    }



    actualizarDashboard();



    socket.emit(
        "cerrarSesion",
        {
            pc:pc
        }
    );


}