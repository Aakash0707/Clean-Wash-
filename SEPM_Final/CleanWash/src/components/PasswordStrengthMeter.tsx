
import React, { useEffect, useState } from 'react';

interface PasswordStrengthMeterProps {
  password: string;
}

const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({ password }) => {
  const [strength, setStrength] = useState(0);
  const [label, setLabel] = useState('');

  useEffect(() => {
    calculateStrength(password);
  }, [password]);

  const calculateStrength = (password: string) => {
    let strengthValue = 0;
    
    if (password.length === 0) {
      setStrength(0);
      setLabel('');
      return;
    }
    
    // Length check
    if (password.length >= 8) strengthValue += 1;
    if (password.length >= 12) strengthValue += 1;
    
    // Character variety checks
    if (/[A-Z]/.test(password)) strengthValue += 1;
    if (/[a-z]/.test(password)) strengthValue += 1;
    if (/[0-9]/.test(password)) strengthValue += 1;
    if (/[^A-Za-z0-9]/.test(password)) strengthValue += 1;

    let newLabel = '';
    if (strengthValue <= 2) newLabel = 'Weak';
    else if (strengthValue <= 4) newLabel = 'Medium';
    else newLabel = 'Strong';

    setStrength(Math.min(strengthValue, 6));
    setLabel(newLabel);
  };

  const getColor = () => {
    if (strength <= 2) return 'bg-red-500';
    if (strength <= 4) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  if (!password) return null;

  return (
    <div className="space-y-1 mt-1">
      <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={`h-full ${getColor()} transition-all duration-300`} 
          style={{ width: `${(strength / 6) * 100}%` }}
        />
      </div>
      {label && (
        <p className={`text-xs 
          ${strength <= 2 ? 'text-red-500' : ''} 
          ${strength > 2 && strength <= 4 ? 'text-yellow-500' : ''} 
          ${strength > 4 ? 'text-green-500' : ''}
        `}>
          {label}
        </p>
      )}
    </div>
  );
};

export default PasswordStrengthMeter;
