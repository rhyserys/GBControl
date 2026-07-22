// ==========================
// RELOJ
// ==========================

function actualizarReloj(){

    const ahora = new Date();

    // Día de la semana
    const dias = [
        "DOMINGO",
        "LUNES",
        "MARTES",
        "MIÉRCOLES",
        "JUEVES",
        "VIERNES",
        "SÁBADO"
    ];

    const dia = dias[ahora.getDay()];

    // Fecha
    const diaMes = String(ahora.getDate()).padStart(2,"0");
    const mes = String(ahora.getMonth()+1).padStart(2,"0");
    const año = ahora.getFullYear();

    const fecha =
    `${dia} · ${diaMes}/${mes}/${año}`;

    // Hora
    const hora =
    ahora.toLocaleTimeString(
        "es-ES",
        {
            hour12:false
        }
    );

    // Mostrar fecha
    const fechaElemento =
    document.getElementById("fecha");

    if(fechaElemento){

        fechaElemento.innerHTML = fecha;

    }

    // Mostrar hora
    const horaElemento =
    document.getElementById("hora");

    if(horaElemento){

        horaElemento.innerHTML = hora;

    }

}



// ==========================
// INICIAR RELOJ
// ==========================

function iniciarReloj(){

    actualizarReloj();

    setInterval(
        actualizarReloj,
        1000
    );

}