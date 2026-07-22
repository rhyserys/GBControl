// ==========================
// PCS
// ==========================


function crearOrdenadores(){


    const zona = document.getElementById("ordenadores");


    zona.innerHTML = "";



    for(let i=1;i<=12;i++){



        if(!ordenadores[i]){


            ordenadores[i]={

                segundos:0,
                intervalo:null,
                encendido:false

            };


        }




        zona.innerHTML += `


        <div class="pc-card" id="pc${i}">


            <h2>
                🖥️ PC-${String(i).padStart(2,"0")}
            </h2>



            <p
            id="estadoPC${i}"
            class="offline">

            🔴 Apagado

            </p>



            <p id="tiempo${i}">

            Sin sesión

            </p>



            <div class="grupo-botones">


                <button onclick="encenderPC(${i})">

                🔵 Encender PC

                </button>



                <button onclick="apagarPC(${i})">

                🔴 Apagar PC

                </button>


            </div>



            <hr>


            <div class="grupo-botones">


                <button onclick="iniciarTiempo(${i},1800)">

                30 min

                </button>



                <button onclick="iniciarTiempo(${i},3600)">

                1 hora

                </button>



                <button onclick="iniciarTiempo(${i},5400)">

                1 h 30

                </button>



                <button onclick="iniciarTiempo(${i},7200)">

                2 horas

                </button>


            </div>



            <div class="grupo-botones">


                <button onclick="sumarTiempo(${i})">

                +30 min

                </button>



                <button onclick="restarTiempo(${i})">

                -30 min

                </button>


            </div>



            <div class="grupo-botones sesion">


                <button onclick="abrirSesion(${i})">

                🟢 Abrir sesión

                </button>


                <button onclick="cerrarSesion(${i})">

                🔒 Cerrar sesión

                </button>


            </div>



        </div>


        `;


    }



}







// ==========================
// ENCENDER
// ==========================


function encenderPC(pc){


    socket.emit(
        "encenderPC",
        {
            pc:pc
        }
    );


    encenderVisual(pc);


}







// ==========================
// ENCENDER VISUAL
// ==========================


function encenderVisual(pc){


    if(!ordenadores[pc]) return;


    ordenadores[pc].encendido=true;


    const estado=document.getElementById(
        "estadoPC"+pc
    );


    if(!estado) return;



    estado.innerHTML="🟢 Encendido";

    estado.className="libre";


    actualizarDashboard();


}







// ==========================
// APAGAR
// ==========================


function apagarPC(pc){


    if(!ordenadores[pc]) return;



    clearInterval(
        ordenadores[pc].intervalo
    );


    ordenadores[pc].encendido=false;

    ordenadores[pc].segundos=0;



    socket.emit(
        "apagarPC",
        {
            pc:pc
        }
    );



    document.getElementById(
        "estadoPC"+pc
    ).innerHTML="🔴 Apagado";


    document.getElementById(
        "estadoPC"+pc
    ).className="offline";



    document.getElementById(
        "tiempo"+pc
    ).innerHTML="Sin sesión";



    actualizarDashboard();


}








// ==========================
// ABRIR SESION
// ==========================


function abrirSesion(pc){


    socket.emit(
        "abrirSesion",
        {
            pc:pc
        }
    );


}







// ==========================
// CERRAR SESION
// ==========================


function cerrarSesion(pc){


    socket.emit(
        "cerrarSesion",
        {
            pc:pc
        }
    );


}








// ==========================
// CAMBIAR ESTADO
// ==========================


function cambiarEstado(pc,texto,clase){


    const estado=document.getElementById(
        "estadoPC"+pc
    );


    if(!estado) return;


    estado.innerHTML=texto;

    estado.className=clase;


}








// ==========================
// RESET
// ==========================


function resetearPC(pc){


    if(!ordenadores[pc]) return;


    clearInterval(
        ordenadores[pc].intervalo
    );


    ordenadores[pc].segundos=0;

    ordenadores[pc].encendido=false;



    cambiarEstado(
        pc,
        "🔴 Apagado",
        "offline"
    );



    document.getElementById(
        "tiempo"+pc
    ).innerHTML="Sin sesión";



    actualizarDashboard();


}