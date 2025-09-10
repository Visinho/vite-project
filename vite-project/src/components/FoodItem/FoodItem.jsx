import React, { useContext } from "react";
import "./FoodItem.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../context/StoreContext";
import { toast } from "react-toastify";

const FoodItem = ({
  id,
  name,
  price,
  description,
  image,
  availableFrom,
  availableTo,
}) => {
  const { cartItems, addToCart, removeFromCart, url } =
    useContext(StoreContext);

  const currentTime = new Date();
  const formattedTime = currentTime.toTimeString().slice(0, 5);

  const isAvailable =
    formattedTime >= availableFrom && formattedTime <= availableTo;

  return (
    <div className={`food-item ${!isAvailable ? "food-item-unavailable" : ""}`}>
      <div className="food-item-img-container">
        <img
          className="food-item-image"
          src={url + "/images/" + image}
          alt={name}
        />

        {!cartItems[id] ? (
          <img
            className={`add ${!isAvailable ? "disabled" : ""}`}
            onClick={() => {
              if (!isAvailable) {
                toast.warning(`${name} is not available right now`);
                return;
              }
              addToCart(id);
              toast.success(`${name} added to cart!`);
            }}
            src={assets.add_icon_white}
            alt="Add"
          />
        ) : (
          <div className="food-item-counter">
            <img
              onClick={() => {
                removeFromCart(id);
                toast.info(`${name} removed from cart!`);
              }}
              src={assets.remove_icon_red}
              alt="Remove"
            />
            <p>{cartItems[id]}</p>
            <img
              onClick={() => addToCart(id)}
              src={assets.add_icon_green}
              alt="Add More"
            />
          </div>
        )}
      </div>

      <div className="food-item-info">
        <div className="food-item-name-rating">
          <p className="food-item-name">{name}</p>
          <img src={assets.rating_starts} alt="Rating" />
        </div>
        <p className="food-item-desc">{description}</p>
        <p className="food-item-price">₦{price}</p>

        <p className={`food-item-time ${!isAvailable ? "unavailable" : ""}`}>
          {isAvailable
            ? `Available: ${availableFrom} - ${availableTo}`
            : `Unavailable: ${availableFrom} - ${availableTo}`}
        </p>
      </div>
    </div>
  );
};

export default FoodItem;
