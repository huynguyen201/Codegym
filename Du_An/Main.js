
document.addEventListener("DOMContentLoaded", function () {
    var productItems = document.querySelectorAll(".card");
    var btnLoadMore = document.querySelector(".btn-load-more");
   
    var itemsToShow = 6; // Số lượng sản phẩm muốn hiển thị mỗi lần nhấp vào nút "Xem thêm sản phẩm"
    var visibleItems = 0; // Số lượng sản phẩm đã hiển thị
   
    // Ẩn tất cả sản phẩm
    for (var i = 0; i < productItems.length; i++) {
        productItems[i].style.display = "none";
    }
   
    // Hiển thị số lượng sản phẩm ban đầu
    for (var i = 0; i < itemsToShow; i++) {
        if (productItems[i]) {
            productItems[i].style.display = "block";
            visibleItems++;
        }
    }
   
    // Xử lý sự kiện nhấp vào nút "Xem thêm sản phẩm"
    btnLoadMore.addEventListener("click", function () {
        var hiddenItems = document.querySelectorAll(".card:not([style*='display: block'])");
        var itemsToDisplay = Math.min(hiddenItems.length, itemsToShow);
   
        for (var i = 0; i < itemsToDisplay; i++) {
            hiddenItems[i].style.display = "block";
            visibleItems++;
        }
   
        if (visibleItems >= hiddenItems.length) {
            btnLoadMore.style.display = "none";
        }
    });
   });
   
   // Để js giỏ hàng ở dưới đây
   let cartIcon = document.querySelector("#cart-icon");
   let cart = document.querySelector(".cart-1");
   let closeCart = document.querySelector("#close-cart");
   
   // Thay đổi tên class từ "add-cart" thành "buy-now"
   var buyNowButtons = document.getElementsByClassName("buy-now");
   
   
   
   cartIcon.onclick = () => {
       cart.classList.toggle("active");
   };
   
   closeCart.onclick = () => {
       cart.classList.remove("active"); 
   };
   
   if (document.readyState == "loading") {
       document.addEventListener('DOMContentLoaded', ready);
   } else {
       ready();
   }
   
   function ready() {
       var addCart = document.getElementsByClassName("add-cart");
       for (var i = 0; i < addCart.length; i++) {
           var button = addCart[i];
           button.addEventListener("click", addCartClicked);
       }
   
       document
           .getElementsByClassName("btn-buy")[0]
           .addEventListener("click", buyButtonClicked);
   }
   
   function buyButtonClicked() {
       alert('Đơn hàng của bạn đã được đặt. Cảm ơn bạn đã đặt hàng vui lòng thanh toán khi nhận hàng!');
       var cartContent = document.getElementsByClassName("cart-content")[0];
       while (cartContent.hasChildNodes()) {
           cartContent.removeChild(cartContent.firstChild);
       }
       updatetotal();
       localStorage.removeItem("cartItems"); // Xóa danh sách sản phẩm trong Local Storage
   }
   
   function addCartClicked(event) {
       var button = event.target;
       var shopProduct = button.closest(".card");
       var title = shopProduct.getElementsByClassName("card-title")[0].innerText;
       var price = shopProduct.getElementsByClassName("card-text")[0].innerText;
       var productImg = shopProduct.getElementsByClassName("card-img-top")[0].src;
       addProductToCart(title, price, productImg);
       updatetotal();
   }
   
   function addProductToCart(title, price, productImg) {
       var cartShopBox = document.createElement("div");
       cartShopBox.classList.add("cart-box");
   
       var cartBoxContent = `
           <img src="${productImg}" alt="" class="cart-img">
           <div class="detail-box">
               <div class="cart-product-title">${title}</div>
               <div class="cart-price">${price}</div>
               <input type="number" value="1" class="cart-quantity">
           </div>
           <i class='bx bxs-trash-alt cart-remove'></i>`;
   
       cartShopBox.innerHTML = cartBoxContent;
       var cartItems = document.getElementsByClassName("cart-content")[0];
       cartItems.appendChild(cartShopBox);
   
       cartShopBox
           .getElementsByClassName("cart-remove")[0]
           .addEventListener("click", removeCartItem);
   
       cartShopBox
           .getElementsByClassName("cart-quantity")[0]
           .addEventListener("change", quantityChanged);
   
       // Lưu trữ sản phẩm vào Local Storage
       var product = {
           title: title,
           price: price,
           productImg: productImg
       };
       var cartItems = localStorage.getItem("cartItems");
       if (cartItems === null) {
           cartItems = [];
       } else {
           cartItems = JSON.parse(cartItems);
       }
       cartItems.push(product);
       localStorage.setItem("cartItems", JSON.stringify(cartItems));
   }
   
   function removeCartItem(event) {
       var buttonClicked = event.target;
       buttonClicked.parentElement.remove();
       updatetotal();
       updateLocalStorage();
   }
   
   function quantityChanged(event) {
       var input = event.target;
       if (isNaN(input.value) || input.value <= 0) {
           input.value = 1;
       }
       updatetotal();
       updateLocalStorage();
   }
   
   function updatetotal() {
       var cartContent = document.getElementsByClassName("cart-content")[0];
       var cartBoxes = cartContent.getElementsByClassName("cart-box");
       var total = 0;
       for (var i = 0; i < cartBoxes.length; i++) {
           var cartBox = cartBoxes[i];
           var priceElement = cartBox.getElementsByClassName("cart-price")[0];
           var quantityElement = cartBox.getElementsByClassName("cart-quantity")[0];
           var price = parseFloat(priceElement.innerText.replace(".", "").replace("đ", ""));
           var quantity = parseInt(quantityElement.value);
           total += price * quantity;
       }
       total = Math.round(total * 100) / 100;
   
       var formatter = new Intl.NumberFormat("vi-VN", {
           style: "currency",
           currency: "VND"
       });
       var formattedTotal = formatter.format(total);
   
       document.getElementsByClassName("total-price")[0].innerText = formattedTotal;
   }