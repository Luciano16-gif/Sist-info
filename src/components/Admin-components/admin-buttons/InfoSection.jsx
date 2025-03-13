const RelevantInfoS = ({ number, description, descriptionFontSize = 'text-base', numberFontSize = 'text-6xl' }) => {
    return (
      <div className="flex flex-col relative w-[172px] h-[215px] bg-[#C3D8B4] rounded-[20px] items-center justify-center content-center text-center shadow-[4px_4px_15px_0px_#000] flex-shrink-0">
        <h1 className={`${numberFontSize} font-bold p-5 break-words text-black`}>{number}</h1>
        <hr className="border-1 border-black sm:w-10 md:w-20" />
        <h2 className={`text-md p-1 ${descriptionFontSize} text-black`}>{description}</h2>
      </div>
    );
  };
  
  export default RelevantInfoS;