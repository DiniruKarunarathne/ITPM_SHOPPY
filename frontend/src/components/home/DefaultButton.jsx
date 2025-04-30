<<<<<<< HEAD
import React from 'react'

function DefaultButton({title, onClick}) {
  return (
    <a onClick={onClick} className="bg-primary border border-primary text-white px-8 py-3 font-medium 
                rounded-md hover:bg-transparent hover:text-primary">{title}</a>
  )
}

export default DefaultButton
=======
import React from 'react';

function DefaultButton({ title, onClick }) {
  return (
    <button onClick={onClick} className="bg-primary border-primary text-white px-8 py-3 font-medium 
                rounded-md hover:bg-blue-800 hover:text-white cursor-grab">
      {title}
    </button>
  );
}

export default DefaultButton;
>>>>>>> b730af62a49f8f4bd0fee3310cc3a538cbd39c75
