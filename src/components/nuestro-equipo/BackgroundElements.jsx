export const BackgroundCircle = ({ size, top, left, opacity }) => (
    <div 
      className="absolute rounded-full blur-sm pointer-events-none"
      style={{
        width: size,
        height: size,
        top: top,
        left: left,
        opacity: opacity,
        backgroundColor: 'rgba(44,59,35,0.4)',
        zIndex: -1
      }}
    />
  );
  
  export const BackgroundCircles = ({ size, top, left, opacity }) => (
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
  
 
  export const OurTeamCircles = () => (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      {/* Circle 1: Large circle in top-left */}
      <BackgroundCircle size="40vw" top="-10vh" left="-10vw" opacity={0.5} />
      
      {/* Circle 2: Medium circle in top-right */}
      <BackgroundCircle size="35vw" top="-5vh" right="-5vw" opacity={0.6} />
      
      {/* Circle 3: Large circle in middle-left */}
      <BackgroundCircle size="45vw" top="30vh" left="-15vw" opacity={0.6} />
      
      {/* Circle 4: Small circle in middle-right */}
      <BackgroundCircle size="15vw" top="40vh" right="20vw" opacity={0.7} />
      
      {/* Circle 5: Small circle in bottom-left */}
      <BackgroundCircle size="20vw" top="75vh" left="15vw" opacity={0.7} />
      
      {/* Circle 6: Large circle in bottom-right */}
      <BackgroundCircle size="50vw" top="60vh" right="-15vw" opacity={0.6} />
    </div>
  );