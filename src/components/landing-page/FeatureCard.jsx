const FeatureCard = ({ icon, title, description }) => (
  <div className="flex flex-col items-start text-left space-y-2 md:space-y-4 p-4">
    {/* Icon */}
    <div className="flex items-center justify-center">
      {icon}
    </div>
    
    {/* Title(s) */}
    {Array.isArray(title) ? (
      title.map((line, i) => (
        <h3 key={i} className="text-xl sm:text-2xl md:text-3xl font-semibold leading-tight">
          {line}
        </h3>
      ))
    ) : (
      <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold leading-tight">
        {title}
      </h3>
    )}
    
    {/* Description */}
    <p className="text-base md:text-lg text-gray-300">
      {description}
    </p>
  </div>
);

export default FeatureCard;