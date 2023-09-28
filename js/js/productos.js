//Traigo los elementos del HTML
const cards = document.getElementById('cards')
const items = document.getElementById('items')
const footer = document.getElementById('footer')
const templateCard = document.getElementById('template-card').content
const templateFooter = document.getElementById('template-footer').content
const templateCarrito = document.getElementById('template-carrito').content
const fragment = document.createDocumentFragment()
let carrito = {}
//El evento DOMContentLoaded se activa cuando el documento HTML inicial se ha cargado y analizado por completo
document.addEventListener('DOMContentLoaded', () => {
    fetchData()
    if (localStorage.getItem('carrito')) {
        carrito = JSON.parse(localStorage.getItem('carrito'))
        mostrarCarrito();
    }
})
//Inicializacion del canvas
var offcanvasRight = document.getElementById('offcanvasRight')
var bsOffcanvas = new bootstrap.Offcanvas(offcanvasRight)
//Evento de agregar al carrito
cards.addEventListener('click', e => {
    agregarAlCarrito(e)

})

    //Escucha el evento de aumentar y disminuir
items.addEventListener('click', e => {
    btnAccion(e)
    
});
    //Traigo informacion del data.json
const fetchData = async () => {
    try {
        const res = await fetch('/data.json')
        const data = await res.json()
        generarCards(data)
    } catch (error) {
    }
}
    //Cards
const generarCards = data => {
    data.forEach(producto => {
        templateCard.querySelector('h5').textContent = producto.titulo
        templateCard.querySelector('p').textContent = producto.precio
        templateCard.querySelector('h6').textContent = producto.descripcion
        templateCard.querySelector('img').setAttribute("src", producto.imagen)
        templateCard.querySelector('.btn-dark').dataset.id = producto.id
        //Clonamos la card
        const clone = templateCard.cloneNode(true)
        //Se guarda en el fragmento
        fragment.appendChild(clone)
    })
    cards.appendChild(fragment)
}
    //Agregar al carrito
const agregarAlCarrito = e => {
    //Pregunta si tiene la clase
    if (e.target.classList.contains('btn-dark')) {
        setCarrito(e.target.parentElement)
    //Sweet Alert
const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
    confirmButton: 'btn btn-success',
    cancelButton: 'btn btn-danger'
    },
    buttonsStyling: false
})
    swalWithBootstrapButtons.fire({
    title: "Felicidades",
    text: 'Agregaste un producto al carrito',
    icon: "success",
    background: "#ffedcc",
    dangerMode: true,
    backdrop:true,
    showCancelButton: true,
    confirmButtonText: 'Ver mi carrito',
    cancelButtonText: 'Seguir comprando',
    reverseButtons: true
}).then((result) => {
    if (result.isConfirmed) {
        bsOffcanvas.show()
    } else if (
    result.dismiss === Swal.DismissReason.cancel) {}
})
    }

    //Detiene los eventos en cards
    e.stopPropagation()
}

const setCarrito = objeto => {
    const producto = {
        id: objeto.querySelector('.btn-dark').dataset.id,
        titulo: objeto.querySelector('h5').textContent,
        precio: objeto.querySelector('p').textContent,
        cantidad: 1
    }
    //pregunta si existe la propiedad con la key
    if (carrito.hasOwnProperty(producto.id)) {
        producto.cantidad = carrito[producto.id].cantidad + 1
    }
    //copia con spread operator
    carrito[producto.id] = { ...producto }
    mostrarCarrito()

}

const mostrarCarrito = () => {
    items.innerHTML = ''
    //El método Object.values devuelve un array con los valores correspondientes a las propiedades enumerables de un objeto. Las propiedades son devueltas en el mismo orden a como lo haría un bucle for...in 
    Object.values(carrito).forEach(producto => {
        templateCarrito.querySelector('th').textContent = producto.id
        templateCarrito.querySelectorAll('td')[0].textContent = producto.titulo
        templateCarrito.querySelectorAll('td')[1].textContent = producto.cantidad
        //botones de sumar y restar
        templateCarrito.querySelector('.btn-info').dataset.id = producto.id
        templateCarrito.querySelector('.btn-danger').dataset.id = producto.id
        templateCarrito.querySelector('span').textContent = producto.cantidad * producto.precio
        //clona el interior
        const clone = templateCarrito.cloneNode(true)
        fragment.appendChild(clone)
    })
    items.appendChild(fragment)
    mostrarFooter()
    localStorage.setItem('carrito', JSON.stringify(carrito))
}
const mostrarFooter = () => {
    footer.innerHTML = ''
    if (Object.keys(carrito).length === 0) {
        footer.innerHTML = `<th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>`
        return
    }
    //suma cantidades
    const nCantidad = Object.values(carrito).reduce((acc, { cantidad }) => acc + cantidad, 0)
    const nPrecio = Object.values(carrito).reduce((acc, { cantidad, precio }) => acc + cantidad * precio, 0)

    templateFooter.querySelectorAll('td')[0].textContent = nCantidad
    templateFooter.querySelector('span').textContent = nPrecio

    const clone = templateFooter.cloneNode(true)
    fragment.appendChild(clone)
    footer.appendChild(fragment)
    
    //vaciar carrito
    const btnVaciar = document.getElementById('vaciarCarrito')
    btnVaciar.addEventListener('click', () => {
        carrito = {}
    //sweetAlert
        swal.fire({
            title: "Vaciar Carrito",
            text: "Desea eliminar su carrito?",
            icon: "question",
            buttons: true,
            background: "#ffedcc",
            dangerMode: true,
            backdrop:true
        })
            .then((Delete) => {
                if (Delete) {
                    swal.fire({
                        icon: "success",
                        background: "#ffedcc",
                        dangerMode: true,
                        backdrop:true,
                        text: "Eliminaste tu carrito",
                        footer: "Segui comprando en Pastas Lau",
                    });
                }
                mostrarCarrito()
            });
    })

   //Finalizar compra
    const btnFinalizar = document.getElementById('finalizarCompra')
    btnFinalizar.addEventListener('click', (e) => {
        swal.fire({
            title: "Finalizar compra",
            text: "Su compra se realizó con éxito, Gracias por elegirnos!",
            icon: "success",
            buttons: true,
            background: "#ffedcc",
            dangerMode: true,
            backdrop:true
        })
        })
const btnAccion = e => {
    //boton para  aumentar
    if (e.target.classList.contains('btn-info')) {
        const producto = carrito[e.target.dataset.id]
        producto.cantidad++
        //copia con spread operator
        carrito[e.target.dataset.id] = { ...producto }
        mostrarCarrito()
    }
    //boton para disminuir
    if (e.target.classList.contains('btn-danger')) {
        const producto = carrito[e.target.dataset.id]
        producto.cantidad--
        if (producto.cantidad === 0) {
            delete carrito[e.target.dataset.id]
        }
        mostrarCarrito()
    }

    e.stopPropagation()
} }