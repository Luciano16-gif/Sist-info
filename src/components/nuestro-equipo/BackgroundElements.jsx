export const BackgroundCircle = ({ size, top, left,bottom, opacity }) => (
  <div 
    className="absolute rounded-full blur-sm pointer-events-none"
    style={{
      width: size,
      height: size,
      top: top,
      left: left,
      bottom: bottom,
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
  
      {/* Circle 1 */}
      <BackgroundCircle size="30vw" top="5vh" right="-15vw" opacity={0.6} />
  
      {/* Circle 2 */}
      <BackgroundCircle size="45vw" top="40vh" left="40%" opacity={0.6} />
  
      {/* Circle 3 */}
      <BackgroundCircle size="35vw" bottom="-20vh" left="55vw" opacity={0.7} />
  
      {/* Circle 4 */}
      <BackgroundCircle size="40vw" bottom="35vh" right="-40vw" opacity={0.6} />
    </div>
  );