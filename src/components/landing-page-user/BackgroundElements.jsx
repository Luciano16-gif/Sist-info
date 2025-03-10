export const BackgroundCircle = ({ size, top, left, opacity }) => (
    <div 
      className="absolute rounded-full blur-sm pointer-events-none"
      style={{
        width: size,
        height: size,
        top: top,
        left: left,
        opacity: opacity,
        backgroundColor: 'rgba(44,59,35,255)',
        zIndex: 10
      }}
    />
  );


  export const BackgroundCircles = () => (
    <div className="absolute inset-0 w-full h-full">
      {/* Main large circle on the left, vertically centered */}
      <div className="hidden sm:block">
        <BackgroundCircle size="70vw" top="calc(50% - 35vw)" left="-40vw" opacity={1} />
        {/* Smaller circle on the right */}
        <BackgroundCircle size="35vw" top="45%" left="70%" opacity={1} />
      </div>
      
      {/* Mobile optimized circles */}
      <div className="sm:hidden">
        <BackgroundCircle size="100vw" top="-5vh" left="-50vw" opacity={0.7} />
        <BackgroundCircle size="70vw" top="100vh" left="50vw" opacity={0.7} />
      </div>
    </div>
  );
