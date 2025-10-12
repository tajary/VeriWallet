export default function ProgressBar({ progress, size = 'md' }) {
    const sizeClasses = {
      sm: 'h-2',
      md: 'h-3',
      lg: 'h-4'
    };
  
    return (
      <div className={`bg-dark-700 rounded-full ${sizeClasses[size]} w-full overflow-hidden`}>
        <div
          className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full h-full transition-all duration-500 ease-out progress-glow"
          style={{ width: `${progress}%` }}
        />
      </div>
    );
  }