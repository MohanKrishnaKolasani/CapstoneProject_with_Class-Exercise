import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchProducts, updateProduct } from "./productSlice";

const Challenge8 = () => {
  const dispatch = useDispatch();
  const { items, status } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  return (
    <div className="container mt-4">
      <h2>Challenge 8 - Redux Toolkit</h2>

      {status === "loading" && <p>Loading...</p>}

      {items.map((product) => (
        <div key={product.id} className="card p-3 mb-2 shadow">
          <h5>{product.name}</h5>
          <p>Price: ₹{product.price}</p>
          <button
            className="btn btn-primary"
            onClick={() =>
              dispatch(updateProduct({ id: product.id, price: product.price + 1000 }))
            }
          >
            Increase Price
          </button>
        </div>
      ))}
    </div>
  );
};

export default Challenge8;