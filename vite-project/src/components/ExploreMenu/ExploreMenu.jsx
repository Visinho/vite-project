import React, { useEffect, useState } from "react";
import "./ExploreMenu.css";
import axios from "axios";

const ExploreMenu = ({ category, setCategory }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/category/list");
        if (response.data.success) {
          setCategories(response.data.data);
        }
      } catch (error) {
        console.log("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="explore-menu" id="explore-menu">
      <h1>Explore our menu</h1>
      <p className="explore-menu-text">
        From savory bites to sweet delights — discover something for every craving.
      </p>
      <div className="explore-menu-list">
        {categories.map((item, index) => (
          <div
            key={index}
            onClick={() =>
              setCategory(prev => prev === item.name ? "All" : item.name)
            }
            className="explore-menu-list-item"
          >
            <img
              className={category === item.name ? "active" : ""}
              src={`http://localhost:4000/images/${item.image}`}
              alt={item.name}
            />
            <p>{item.name}</p>
          </div>
        ))}
      </div>
      <hr />
    </div>
  );
};

export default ExploreMenu;

