(function () {

  let DB
  let idCliente
  // Input's
  const nombreInput = document.querySelector('#nombre')
  const emailInput = document.querySelector('#email')
  const telefonoInput = document.querySelector('#telefono')
  const empresaInput = document.querySelector('#empresa')

  const formulario = document.querySelector('#formulario')

  document.addEventListener('DOMContentLoaded', () => {

    formulario.addEventListener('submit', actualizarCiente)

    conectarDB()

    // Verificar el ID de la URL
    const paramsURL = new URLSearchParams(window.location.search)
    idCliente = paramsURL.get('id')
    if (idCliente) {
      setTimeout(() => {
        obtenerCliente(idCliente)
      }, 100);
    }
  })

  function actualizarCiente(e) {
    e.preventDefault()

    if (nombreInput.value === '' || emailInput.value === '' || telefonoInput.value === '' || empresaInput.value === '') {
      imprimirAlerta('Todos los campos son obligatorios', 'error')

      return
    }

    const clienteActualizado = {
      nombre: nombreInput.value,
      telefono: telefonoInput.value,
      email: emailInput.value,
      empresa: empresaInput.value,
      id: Number(idCliente)
    }

    const transaction = DB.transaction(['crm'], 'readwrite')
    const objectStore = transaction.objectStore('crm')

    objectStore.put(clienteActualizado)

    transaction.oncomplete = function () {
      imprimirAlerta('Cliente Actualizado');
    }

    transaction.onerror = function () {
      imprimirAlerta('Hubo un error', 'error')
    }
  }


  function obtenerCliente(id) {
    const transaction = DB.transaction(['crm'])
    const objectStore = transaction.objectStore('crm')

    const cliente = objectStore.openCursor()
    cliente.onsuccess = function (e) {
      const cursor = e.target.result

      if (cursor) {
        if (cursor.value.id === Number(id)) {
          llenarFormulario(cursor.value)
        }
        cursor.continue()
      }
    }
  }

  function llenarFormulario(datosCliente) {
    const { nombre, telefono, email, empresa } = datosCliente

    nombreInput.value = nombre
    telefonoInput.value = telefono
    emailInput.value = email
    empresaInput.value = empresa
  }

  function conectarDB() {
    const abrirConexión = window.indexedDB.open('crm', 1)

    abrirConexión.onerror = function () {
      console.log('Hubo un error');
    }

    abrirConexión.onsuccess = function () {
      DB = abrirConexión.result
    }
  }
})()