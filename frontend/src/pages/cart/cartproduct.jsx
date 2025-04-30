import React from "react";
import { AiFillDelete } from "react-icons/ai";
import { TbPlus, TbMinus } from "react-icons/tb";
import {
  deleteCartItem,
  decreaseCartItemQuantity,
} from "../../services/redux/productSlice";
import { useDispatch } from "react-redux";

const CartProduct = ({ id, images, categories, qty, title, price, total }) => {
  const dispatch = useDispatch();

  return (
    <div
      className="bg-blue-100 p-2 sm:p-4 flex flex-col items-center gap-2 sm:gap-4 rounded-lg border hover:shadow-lg drop-shadow-lg border-slate-300 w-full max-w-md mx-auto h-auto"
    >
      <div className="flex justify-end w-full">
        <div
          className="cursor-pointer text-blue-900 hover:text-red-500 py-2 px-2"
          onClick={() => dispatch(deleteCartItem(id))}
        >
          <AiFillDelete size={24} />
        </div>
      </div>
      <div className="flex flex-col gap-1 w-full h-full items-center">
        <h3 className="text-xl sm:text-2xl md:text-3xl font-sans text-gray-800 text-center font-medium mb-2 capitalize -mt-2 px-2 line-clamp-2">
          {title}
        </h3>
        <div className="flex justify-center w-full">
          <div className="p-2 bg-blue-100 rounded overflow-hidden w-full max-w-xs h-40 sm:h-52 flex justify-center items-center">
            <img src={images[0]} className="h-full w-auto object-contain rounded" alt={title} />
          </div>
        </div>
        <p className="text-slate-500 font-medium text-lg sm:text-xl md:text-2xl mt-1 sm:mt-2 text-center">
          {categories}
        </p>
        <hr className="w-3/4 border-blue-900 my-2 sm:my-4" />
        <p className="font-bold text-xl md:text-2xl">
          <span className="text-red-500">Rs.</span>
          <span>{price}</span>
        </p>
        <hr className="w-3/4 border-blue-900 my-2 sm:my-4" />
        <div className="flex gap-3 items-center">
          <button
            onClick={() => dispatch(decreaseCartItemQuantity(id, qty + 1))}
            className="bg-slate-300 py-1 mt-1 rounded hover:bg-slate-400 p-1 sm:p-2"
          >
            <TbPlus />
          </button>
          <p className="font-semibold p-1 sm:p-2 mt-1">{qty}</p>
          <button
            onClick={() => dispatch(decreaseCartItemQuantity(id, qty - 1))}
            className="bg-slate-300 py-1 mt-1 rounded hover:bg-slate-400 p-1 sm:p-2"
          >
            <TbMinus />
          </button>
        </div>
        <div className="flex items-center gap-2 text-slate-700 font-bold text-xl md:text-2xl mt-1 sm:mt-2">
          <p>Total :</p>
          <p>
            <span className="text-red-500">Rs.</span>
            {total}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CartProduct;