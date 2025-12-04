import './Button.css';

export const Button = ({ children, onClick, variant = 'primary', type = 'button' }) => {
  return (
    <button
      className={`btn btn-${variant}`}
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  );
};
