const RelevantInfoS = ({ number, description, descriptionFontSize = 'text-base', numberFontSize = 'text-6xl' }) => {
  return (
    <div className="flex flex-col relative w-full xs:w-32 sm:w-36 md:w-36 lg:w-36 xl:w-40 h-auto min-h-[160px] sm:min-h-[180px] md:min-h-[200px] bg-[#C3D8B4] rounded-[20px] items-center justify-center content-center text-center shadow-[4px_4px_15px_0px_#000] flex-shrink-0 p-2 sm:p-3">
      <h1 className={`${numberFontSize} xs:text-4xl sm:text-5xl md:text-5xl lg:text-5xl xl:text-6xl font-bold px-1 py-2 break-words text-black`}>{number}</h1>
      <hr className="border-1 border-black w-8 sm:w-10 md:w-12 lg:w-16" />
      <h2 className={`text-xs xs:text-xs sm:text-sm md:text-sm lg:text-base p-1 text-black`}>{description}</h2>
    </div>
  );
};

export default RelevantInfoS;