import * as React from 'react';

interface ButtonProps {
  text?: string;
}

const Button: React.FC<ButtonProps> = ({ text = 'Remote Button' }) => {
  return <button>{text}</button>;
};

export default Button;
