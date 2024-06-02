import React from 'react';

const Input = ({ label, id, name, value, type, onChange, error, disabled = false}) => {
  return (
    <>
      {label && <label className="form-label" htmlFor={id}>{label}:</label>}
      <input
        className={"form-input" + (error ? " border-rose-500" : "")}
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
      {error && <span className='text-rose-600 dark:text-rose-500 text-sm'>{error}</span>}
    </>
  );
};

export default Input;
