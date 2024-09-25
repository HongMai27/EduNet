import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement> | React.FormEvent<HTMLFormElement>) => void; // Chấp nhận sự kiện với tham số
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  className = '',
  type = 'button',
  disabled = false,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 leading-normal rounded transition duration-200 uppercase shadow-[0_4px_9px_-4px_#3b71ca] ${className} ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      {children}
    </button>
  );
};

export default Button;
