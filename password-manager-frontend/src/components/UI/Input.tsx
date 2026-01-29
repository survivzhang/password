import React from 'react';

interface InputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: 'text' | 'password' | 'email' | 'date';
  placeholder?: string;
  disabled?: boolean
}

const Input: React.FC<InputProps> = ({
  value,
  onChange,
  type = 'text',
  placeholder,
  disabled =false
}) => {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled = {disabled}
      className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  );
};

export default Input;