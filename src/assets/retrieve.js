// function retrieve()
// {
//     document.getElementById("products").innerHTML = "";
//     var total = 0.0;
//     for(var i = 0; i < localStorage.length; i++){
//         var item = localStorage.getItem(localStorage.key(i));
//         item = item.replace('{', '');
//         item = item.replace('}', '');
//         item = item.replace(/"/g, '');
//         const myArray = item.split(',');
//         var name = myArray[0];
//         var price = myArray[1];
//         name = name.split(':')[1];
//         price = price.replace(/[^0-9.]/g, '');
//         document.getElementById("products").innerHTML += 
//         `<div class="product">
//         <p class="checkout">${name}</p>
//         <p>$${price}</p>
//         </div>`;        
//         total += parseFloat(price);
//     }
//     const formatter = new Intl.NumberFormat('en-US', {
//         style: 'currency',
//         currency: 'USD'
//     });
//     document.getElementById("total").innerText = formatter.format(total);
// }