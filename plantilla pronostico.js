async function miFuncionAsincrona() {
  try {
    // Realizar una solicitud HTTP usando fetch
    const respuesta = await fetch('https://jsonplaceholder.typicode.com/posts/1');

    // Verificar si la solicitud fue exitosa (código de estado 200)
    if (!respuesta.ok) {
      throw new Error(`Error en la solicitud: ${respuesta.status}`);
    }

    // Obtener el cuerpo de la respuesta como JSON
    const datosJson = await respuesta.json();

    // Resto del código que depende de los datos obtenidos
    console.log(datosJson);
  } catch (error) {
    console.error('Error:', error);
  }
}

// Llamada a la función principal
miFuncionAsincrona();


 setTimeout(function () {
                    primeraImagen.style.visibility = "hidden";
                    segundaImagen.style.visibility = "hidden";
                    arrayseleccionados = [];
                    // Puedes volver a habilitar la interacción con las cartas aquí si es necesario
                }, 1000); // Ajusta el tiempo según tus necesidades



                localStorage.setItem('nombre', 'Juan');


                const nombre = localStorage.getItem('nombre');
console.log(nombre); // imprimirá 'Juan'


localStorage.removeItem('nombre');



const usuario = { nombre: 'Juan', edad: 30 };
localStorage.setItem('usuario', JSON.stringify(usuario));

const usuarioGuardado = JSON.parse(localStorage.getItem('usuario'));
console.log(usuarioGuardado); // imprimirá { nombre: 'Juan', edad: 30 }



localStorage.clear();
