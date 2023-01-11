const socket = io()

socket.on('products', data => {
    console.log("evento productos", data)
    loadList(data.payload)
})


function loadList(products) {
    fetch('http://localhost:8080/home.hbs')
    .then(response => response.text().then(function(text) {
        let template = Handlebars.compile(text);
        document.querySelector("#listContainer").innerHTML = template({products: products});
      }))
}

function scrollToBottom (id) {
    var div = document.getElementById(id);
    div.scrollTop = div.scrollHeight - div.clientHeight;
 }