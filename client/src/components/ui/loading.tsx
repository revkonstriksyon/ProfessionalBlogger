import { FC } from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingProps {
  size?: 'small' | 'medium' | 'large';
  text?: string;
  className?: string;
}

const Loading: FC<LoadingProps> = ({ 
  size = 'medium', 
  text, 
  className = '' 
}) => {
  const sizeMap = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  return (
    <div className={`flex flex-col items-center justify-center p-4 ${className}`}>
      <Loader2 className={`animate-spin text-[#00209F] ${sizeMap[size]}`} />
      {text && <p className="mt-2 text-sm text-gray-600">{text}</p>}
    </div>
  );
};

export const FullPageLoading: FC<{ text?: string }> = ({ text }) => {
  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <Loading size="large" text={text} />
    </div>
  );
};

export default Loading;
