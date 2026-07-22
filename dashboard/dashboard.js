// ==========================
// DASHBOARD
// ==========================

function actualizarDashboard(){

    let libres = 0;
    let uso = 0;
    let apagadas = 0;

    for(let pc in ordenadores){

        if(!ordenadores[pc].encendido){

            apagadas++;

        }

        else if(ordenadores[pc].segundos > 0){

            uso++;

        }

        else{

            libres++;

        }

    }

    document.getElementById(
        "pcsLibres"
    ).innerHTML = libres;

    document.getElementById(
        "pcsUso"
    ).innerHTML = uso;

    document.getElementById(
        "pcsApagadas"
    ).innerHTML = apagadas;

}



// ==========================
// REFRESCAR DASHBOARD
// ==========================

function refrescarDashboard(){

    actualizarDashboard();

}