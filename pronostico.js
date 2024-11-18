var pCiudadlatitud;
var pCiudadlongitud;
var divImagenSeleccionado = 0;  // Índice del divimagen seleccionado por defecto
var divDiaActual; 
var datosjson; // Agrega esta variable para almacenar los datos
let divDiaInformacion;
var precipitacionsum;
var lluviamax;
var vientomax;
var sumariodatos;
var panel;
var temperaturapanelpanel;
var lluviamaxpanel;
var vientomaxpanel;




async function ObtenerCiudades() {
    let datospoblacion = await fetch("http://www.alpati.net/DWEC/cities/");

    if (!datospoblacion.ok) {
        throw new Error("No se han obtenido los datos de la poblacion");
    }

    datosjson = await datospoblacion.json(); // Almacena los datos en la variable global
    console.log(datosjson);

    return datosjson;
}

async function FiltrarCiudades() {
    let datos = await ObtenerCiudades();

    let usuarioescribe = document.getElementById("pueblos");
    let resultadosdiv = document.getElementById("resultados");

    usuarioescribe.addEventListener("input", () => {
        const filtro = usuarioescribe.value.trim().toLowerCase();

        if (filtro === "") {
            resultadosdiv.innerHTML = "";
            return;
        }

        let ciudadesFiltradas = datos.filter(function(ciudad) {
            return ciudad[5] === "ES" && ciudad[1].toLowerCase().startsWith(filtro);
        });

        resultadosdiv.textContent = "";

        ciudadesFiltradas.forEach(function(ciudad) {
            let pCiudad = document.createElement("p");
            pCiudad.textContent = ciudad[1];

            resultadosdiv.appendChild(pCiudad);
            pCiudad.onclick = function(){
                usuarioescribe.value = ciudad[1];
                pCiudadlatitud = ciudad[3];
                pCiudadlongitud = ciudad[4];
                resultadosdiv.textContent = "";
            }
        });
    });
}

async function MostrarDatos() {
    let fechainicial = document.getElementById("FechaPronostico1").value;
    let fechafinal = document.getElementById("FechaPronostico2").value;

    try {
        let datospoblacion = await fetch("https://api.open-meteo.com/v1/forecast?latitude=" + pCiudadlatitud + "&longitude=" + pCiudadlongitud + "&hourly=temperature_2m&daily=weather_code,rain_sum,wind_speed_10m_max,temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto&start_date=" + fechainicial + "&end_date=" + fechafinal + "");

        if (!datospoblacion.ok) {
            throw new Error("No se han obtenido los datos de la poblacion");
        }

        datosjson = await datospoblacion.json(); // Almacena los datos en la variable global
        console.log(datosjson);

        let divprincipaldiario = document.getElementById("diario");
        divprincipaldiario.classList.add('divprincipaldiario');

        var diasSemana = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
        primerDia = obtenerDiaSemana();

        for (let i = 0; i < datosjson.daily.weather_code.length; i++) {

            let dia = datosjson.daily.weather_code[i];

            // Crear div para imagen
            let divimagen = document.createElement('div');
            divimagen.classList.add('divimagen');
            let imagen = document.createElement('img');
            imagen.classList.add('imagendias');

            // Asignar la clase seleccionada al primer divimagen por defecto
            if (i === divImagenSeleccionado) {
                divimagen.classList.add('seleccionado');
                divDiaActual = divimagen;
            }

            // Asignar la ruta de la imagen según el código del tiempo
            switch (dia) {
                case 0:
                    imagen.setAttribute("src","./clear sky.png");
                    break;
                case 1: case 2: case 3:
                    imagen.setAttribute("src","./mainly clear.png");
                    break;
                // Agrega más casos según sea necesario
                case 45: case 48:
                    imagen.setAttribute("src","./fog.png");
                    break;
                case 51: case 53: case 55:
                    imagen.setAttribute("src","./llovizna.png");
                    break;
                case 56: case 57:
                    imagen.setAttribute("src","./lluvia y nieve.png");
                    break;
                case 61: case 63: case 65:
                    imagen.setAttribute("src","./rain.png");
                    break;
                case 66: case 67:
                    imagen.setAttribute("src","./lluvia y nieve.png");
                    break;
                case 71: case 73: case 75:
                    imagen.setAttribute("src","./nieve leve.png");
                    break;
                case 77:
                    imagen.setAttribute("src","./granizo.png");
                    break;
                case 80: case 81: case 82:
                    imagen.setAttribute("src","./lluvia violenta.png");
                    break;
                case 85: case 86:
                    imagen.setAttribute("src","./nieve intensa.png");
                    break;
                case 95:
                    imagen.setAttribute("src","./tormenta.png");
                    break;
                case 96: case 99:
                    imagen.setAttribute("src","./tormenta intensa.png");
                    break;
            }

            obtenerDiaSemana();

            let divdia = document.createElement('div');
            let nombredia = document.createElement('p');
            nombredia.classList.add('nombredia');
            nombredia.textContent = diasSemana[(i+primerDia)%7];

            divimagen.appendChild(imagen);

            // Asignar el evento onclick al divimagen
            divimagen.onclick = function() {
                cambiarDatos(i);
            };

            let divtdedia = document.createElement('div');
            divtdedia.classList.add('divtdedia');


            divdia.appendChild(nombredia);
            divtdedia.appendChild(divdia);

            divtdedia.appendChild(divimagen);

            // Crear div para temperatura máxima
            let divtemperaturamaxima = document.createElement('div');
            let ptemperaturamaximaminima = document.createElement('p');
            ptemperaturamaximaminima.textContent = datosjson.daily.temperature_2m_max[i] + "°" + " " + datosjson.daily.temperature_2m_min[i] + "°" ;
            divtemperaturamaxima.appendChild(ptemperaturamaximaminima);

           // Crear div para temperatura mínima
          
            let divtemperaturas = document.createElement('div');
            divtemperaturas.appendChild(divtemperaturamaxima);

            divtdedia.appendChild(divtemperaturas);
           divprincipaldiario.appendChild(divtdedia);

            divtemperaturas.classList.add('divtemperaturas');
        }
    } catch (error) {
        console.error("Error al obtener la ciudad:", error.message);
    }
}

function obtenerDiaSemana() {
    var fechaInput = document.getElementById('FechaPronostico1').value;
    var fechaInput2 = document.getElementById('FechaPronostico2').value;
    var fecha = new Date(fechaInput);
    var fecha2 = new Date(fechaInput2);
    var diaSemana1 = fecha.getDay();
    var diaDelMes = fecha.getDate();
    console.log(diaDelMes);
    return diaSemana1;
}


function cambiarDatos(indice) {
  // Obtener todos los elementos con la clase 'divimagen'
  let divImagenes = document.querySelectorAll('.divimagen');

  // Limpiar la clase seleccionada de todos los divimagenes
  divImagenes.forEach(divImagen => {
    divImagen.classList.remove('seleccionado');
  });

  // Verificar que el índice sea válido
  if (indice >= 0 && indice < divImagenes.length) {
    // Obtener el nuevo divimagen y asignar la clase seleccionada
    let nuevoDivImagen = divImagenes[indice];
    nuevoDivImagen.classList.add('seleccionado');

    // Actualizar el índice del día seleccionado
    indiceDiaSeleccionado = indice;

    // Crear o actualizar el div de información del día
    let divDiaInformacion = document.getElementById('divDiaInformacion');
    let sumariodatos = document.getElementById('sumariodatos');

    // Si el div de información no existe, crear uno nuevo
    if (!divDiaInformacion) {
      divDiaInformacion = document.createElement('div');
      divDiaInformacion.id = 'divDiaInformacion';
      document.getElementById('diario').appendChild(divDiaInformacion);

    }

    // Si el sumario de datos no existe, crear uno nuevo
    if (!sumariodatos) {
      sumariodatos = document.createElement('div');
      sumariodatos.id = 'sumariodatos';
      document.getElementById('diario').appendChild(sumariodatos);
    }

    // Limpiar el contenido del div de información y sumariodatos
    divDiaInformacion.innerHTML = "";
    sumariodatos.innerHTML = "";

    // Resto del código para crear elementos y mostrar datos
    // Crear elementos para mostrar la temperatura máxima y la imagen del tiempo del día seleccionado
    let pTemperaturaActual = document.createElement('p');
    pTemperaturaActual.textContent = datosjson.daily.temperature_2m_max[indice];
    let plus = document.createElement('p');
    plus.textContent = " C° | F°";

    let imagenActual = document.createElement('img');
    imagenActual.classList.add('imagendias');

    // Asignar la ruta de la imagen según el código del tiempo del día seleccionado
    switch (datosjson.daily.weather_code[indice]) {
      case 0:
        imagenActual.setAttribute("src", "./clear sky.png");
        break;
      case 1: case 2: case 3:
        imagenActual.setAttribute("src", "./mainly clear.png");
        break;
      // Agrega más casos según sea necesario
      case 45: case 48:
        imagenActual.setAttribute("src", "./fog.png");
        break;
      case 51: case 53: case 55:
        imagenActual.setAttribute("src", "./llovizna.png");
        break;
      case 56: case 57:
        imagenActual.setAttribute("src", "./lluvia y nieve.png");
        break;
      case 61: case 63: case 65:
        imagenActual.setAttribute("src", "./rain.png");
        break;
      case 66: case 67:
        imagenActual.setAttribute("src", "./lluvia y nieve.png");
        break;
      case 71: case 73: case 75:
        imagenActual.setAttribute("src", "./nieve leve.png");
        break;
      case 77:
        imagenActual.setAttribute("src", "./granizo.png");
        break;
      case 80: case 81: case 82:
        imagenActual.setAttribute("src", "./lluvia violenta.png");
        break;
      case 85: case 86:
        imagenActual.setAttribute("src", "./nieve intensa.png");
        break;
      case 95:
        imagenActual.setAttribute("src", "./tormenta.png");
        break;
      case 96: case 99:
        imagenActual.setAttribute("src", "./tormenta intensa.png");
        break;
    }

    // Crear sumario de datos
    precipitacionsum = document.createElement('p');
    precipitacionsum.textContent = "Precipitaciones: " + datosjson.daily.precipitation_sum[indice] + " %";

    lluviamax = document.createElement('p');
    lluviamax.textContent = "LluviaMax: " + datosjson.daily.rain_sum[indice] + " %";

    vientomax = document.createElement('p');
    vientomax.textContent = "VientoMax: " +  datosjson.daily.wind_speed_10m_max[indice] + " km/h";

    // Añadir los elementos al div de información y sumariodatos
    divDiaInformacion.appendChild(imagenActual);
    divDiaInformacion.appendChild(pTemperaturaActual);
    divDiaInformacion.appendChild(plus);

    sumariodatos.appendChild(precipitacionsum);
    sumariodatos.appendChild(lluviamax);
    sumariodatos.appendChild(vientomax);

    panel = document.createElement('div');

    temperaturapanel = document.createElement('p');
    temperaturapanel.textContent = "Temperaturas";
  
    lluviamaxpanel = document.createElement('p');
    lluviamaxpanel.textContent = "Lluvias";
  
    vientomaxpanel = document.createElement('p');
    vientomaxpanel.textContent = "Viento";
  
    // Añadir los elementos al panel
    panel.appendChild(temperaturapanel);
    panel.appendChild(lluviamaxpanel);
    panel.appendChild(vientomaxpanel);
  
    // Añadir el panel al contenedor 'diario'
    document.getElementById('diario').appendChild(panel);

    panel.classList.add('panel');



    sumariodatos.classList.add('sumariodatos');

  }
}
