import React from "react";

const Reloading: React.FC = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="relative h-5 w-5 animate-[spin_2s_linear_infinite]">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute inset-0 flex items-center justify-start"
            style={{ transform: `rotate(${i * 45}deg)` }}
          >
            <div
              className="h-[25%] w-[25%] rounded-full bg-[#053bae] opacity-50 animate-[pulse0112_0.9s_ease-in-out_infinite]"
              style={{
                animationDelay: `${-0.875 + i * 0.125}s`,
                // Adding a slight glow to make it look "cleaner"
                filter: "drop-shadow(0 0 2px currentColor)",
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reloading;
