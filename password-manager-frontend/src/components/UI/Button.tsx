import React from 'react';

// Props 接口（定义组件接收的参数）
interface ButtonProps {
  children: React.ReactNode;  // 按钮内容（文字、图标等）
  isLoading?: boolean;
  onClick?: () => void;       // 点击事件（可选）
  variant?: 'primary' | 'danger' | 'secondary';  // 样式变体
  disabled?: boolean;         // 是否禁用
  type?: 'button' | 'submit' | 'reset'; // 按钮类型
}

// 组件函数
const Button: React.FC<ButtonProps> = ({ 
  children,
  isLoading = false,
  onClick,
  variant = 'primary',  // 默认值
  disabled = false,
  type = 'button'
}) => {
  const baseStyles = 'px-4 py-2 rounded font-medium transition-colors';
  const variantStyle = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    secondary:'bg-gray-600 text-white hover:bg-gray-700'
  };
  const isDisabled = disabled || isLoading
  const disabledStyles = isDisabled ? 'opacity-50 cursor-not-allowed' : '';
  const className = `${baseStyles} ${variantStyle[variant]} ${disabledStyles}`;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className= {className} // TailwindCSS 类名
    >
      {isLoading ? 'Loading...' : children}
    </button>
  );
};

export default Button;