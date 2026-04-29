import React from 'react';

const ElectricBorder = ({
  children,
  color = "#7df9ff",
  speed = 1,
  chaos = 0.12,
  thickness = 2,
  style = {},
  className = ""
}) => {
  return (
    <div
      className={`electric-border-wrapper ${className}`}
      style={{
        position: 'relative',
        borderRadius: style.borderRadius || '16px',
        ...style
      }}
    >
      {/* Animated Border */}
      <div
        className="electric-border-animation"
        style={{
          position: 'absolute',
          inset: -thickness,
          borderRadius: 'inherit',
          padding: thickness,
          background: `linear-gradient(
            135deg,
            ${color},
            ${color}99,
            ${color}44,
            ${color}99,
            ${color}
          )`,
          backgroundSize: '200% 200%',
          opacity: chaos,
          transition: 'opacity 0.3s ease',
          zIndex: 0
        }}
      />
      
      {/* Hover Effect */}
      <div
        className="electric-border-hover"
        style={{
          position: 'absolute',
          inset: -thickness,
          borderRadius: 'inherit',
          padding: thickness,
          background: `linear-gradient(
            135deg,
            ${color},
            ${color}cc,
            ${color}66,
            ${color}cc,
            ${color}
          )`,
          backgroundSize: '200% 200%',
          opacity: 0,
          transition: 'opacity 0.3s ease',
          zIndex: 0
        }}
      />
      
      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>

      {/* Styles */}
      <style jsx>{`
        .electric-border-wrapper {
          position: relative;
          overflow: hidden;
        }
        
        .electric-border-animation {
          animation: gradientShift ${3 / speed}s ease infinite;
          pointer-events: none;
        }
        
        .electric-border-wrapper:hover .electric-border-hover {
          opacity: 0.3;
        }
        
        @keyframes gradientShift {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
      `}</style>
    </div>
  );
};

export default ElectricBorder;