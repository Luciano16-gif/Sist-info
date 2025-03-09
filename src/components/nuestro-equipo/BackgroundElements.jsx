export const BackgroundCircle = ({ size, top, left, opacity }) => (
  <div 
    className="absolute rounded-full blur-sm pointer-events-none"
    style={{
      width: size,
      height: size,
      top: top,
      left: left,
      opacity: opacity,
      backgroundColor: '#516644',
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
  );;

  export const OurTeamCircles = () => (
    <div 
      className="absolute inset-0 w-full h-full overflow-hidden"
      style={{
        background: "linear-gradient(to bottom, #3F5333, #2C3B23, #182411,#182411)", 
        zIndex: 1, 
      }}
    >
      {/* Circle 1: Large circle in top-left */}
      <BackgroundCircle size="40vw" top="-40vh" left="-40vw" opacity={0.5} />
  
      {/* Circle 2: Medium circle in top-right */}
      <BackgroundCircle size="35vw" top="-35vh" right="-35vw" opacity={0.6} />
  
      {/* Circle 3: Large circle in middle-left */}
      <BackgroundCircle size="45vw" top="15vh" left="-45vw" opacity={0.6} />
  
      {/* Circle 4: Small circle in middle-right */}
      <BackgroundCircle size="15vw" top="55vh" right="50vw" opacity={0.7} />
  
      {/* Circle 5: Small circle in bottom-left */}
      <BackgroundCircle size="20vw" top="105vh" left="-15vw" opacity={0.7} />
  
      {/* Circle 6: Large circle in bottom-right */}
      <BackgroundCircle size="50vw" top="90vh" right="-45vw" opacity={0.6} />
    </div>
  );