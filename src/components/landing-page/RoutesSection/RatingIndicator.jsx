// RatingIndicator component for showing dots
export const RatingIndicator = ({ value, max = 5 }) => {
    return (
      <div className="flex">
        {Array.from({ length: max }).map((_, i) => (
          <div
            key={i}
            className={`w-2.5 h-2.5 rounded-full mx-0.5 ${i < value ? 'bg-white' : 'bg-white bg-opacity-30'}`}
          />
        ))}
      </div>
    );
  };