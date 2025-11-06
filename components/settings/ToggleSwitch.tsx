interface ToggleSwitchProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  disabled?: boolean;
  size?: 'sm' | 'default' | 'lg';
}


const ToggleSwitch = ({ enabled, onChange, disabled = false, size = 'default' }: ToggleSwitchProps) => {
  const sizeClasses = {
    sm: 'w-8 h-4',
    default: 'w-10 h-5',
    lg: 'w-12 h-6'
  };

  const thumbSizeClasses = {
    sm: 'w-3 h-3',
    default: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  const translateClasses = {
    sm: enabled ? 'translate-x-4' : 'translate-x-0.5',
    default: enabled ? 'translate-x-5' : 'translate-x-0.5',
    lg: enabled ? 'translate-x-6' : 'translate-x-0.5'
  };

  return (
    <button
      type="button"
      className={`
        relative inline-flex items-center ${sizeClasses?.[size]} rounded-full 
        transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 
        focus:ring-primary focus:ring-offset-2 focus:ring-offset-background
        ${enabled ? 'bg-primary' : 'bg-muted'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
      onClick={() => !disabled && onChange(!enabled)}
      disabled={disabled}
    >
      <span
        className={`
          ${thumbSizeClasses?.[size]} bg-white rounded-full shadow-sm transform transition-transform 
          duration-200 ease-in-out ${translateClasses?.[size]}
        `}
      />
    </button>
  );
};

export default ToggleSwitch;