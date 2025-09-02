import React, { useContext } from "react";
import "./Cart.css";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { cartItems, food_list, addToCart, removeFromCart, getTotalCartAmount, url } =
    useContext(StoreContext);

  const navigate = useNavigate();
  const hasItemsInCart = Object.values(cartItems).some((qty) => qty > 0);

  return (
    <div className="cart">
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Item</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <br />
        <hr />

        {hasItemsInCart ? (
          food_list.map((item) => {
            if (cartItems[item._id] > 0) {
              return (
                <div key={item._id}>
                  <div className="cart-items-title cart-items-item">
                    <img src={url + "/images/" + item.image} alt={item.name} />
                    <p>{item.name}</p>
                    <p>₦{item.price}</p>

                    {/* Quantity control buttons */}
                    <div className="quantity-control">
                      <button
                        className="qty-btn"
                        onClick={() => removeFromCart(item._id)}
                      >
                        −
                      </button>
                      <span>{cartItems[item._id]}</span>
                      <button
                        className="qty-btn"
                        onClick={() => addToCart(item._id)}
                      >
                        +
                      </button>
                    </div>

                    <p>₦{item.price * cartItems[item._id]}</p>
                    <p
                      onClick={() => removeFromCart(item._id)}
                      className="cross"
                    >
                      X
                    </p>
                  </div>
                  <hr />
                </div>
              );
            }
            return null;
          })
        ) : (
          <div className="empty-cart">
            <p>Your cart is empty 🛒</p>
            <button onClick={() => navigate("/")}>Browse Food Menu</button>
          </div>
        )}
      </div>

      {hasItemsInCart && (
        <div className="cart-bottom">
          <div className="cart-total">
            <h2>Cart Total</h2>
            <div>
              <div className="cart-total-details">
                <p>Subtotal</p>
                <p>₦{getTotalCartAmount()}</p>
              </div>
              <div className="cart-total-details">
                <p>Delivery Fee</p>
                <p>₦{getTotalCartAmount() === 0 ? 0 : 2}</p>
              </div>
              <hr />
              <div className="cart-total-details">
                <b>Total</b>
                <b>
                  ₦
                  {getTotalCartAmount() === 0
                    ? 0
                    : getTotalCartAmount() + 2}
                </b>
              </div>
            </div>
            <button onClick={() => navigate("/order")}>
              PROCEED TO CHECKOUT
            </button>
          </div>

          <div className="cart-promocode">
            <div>
              <p>If you have a promo code, Enter here!</p>
              <div className="cart-promocode-input">
                <input type="text" placeholder="Promo code..." />
                <button>Submit</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;

