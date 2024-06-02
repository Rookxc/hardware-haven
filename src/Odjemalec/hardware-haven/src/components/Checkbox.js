import React from 'react';

const Checkbox = ({ label, id, name, checked = false, onChange, error, disabled }) => {
  return (
    <>
      <div className="flex items-center mb-4">
        {label && <label className="form-label" htmlFor={id}>{label}:</label>}
        <input
          className={"form-checkbox mb-2 ml-2 h-4 w-4 text-blue-600 transition duration-150 ease-in-out" + (error ? " border-rose-500" : "")}
          type="checkbox"
          id={id}
          name={name}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
        />
      </div>
      {error && <span className='text-rose-600 dark:text-rose-500 text-sm'>{error}</span>}
    </>
  );
};

export default Checkbox;