const RelevantInfoS = ({ number, description, descriptionFontSize = 'text-base', numberFontSize = 'text-5xl' }) => {
  return (
    <div className="flex flex-col relative w-[7.6rem] h-40 bg-[#cbf2d0] rounded-[10%] items-center justify-center content-center text-center">
      <h1 className={`${numberFontSize} font-bold p-5 break-words text-black`}>{number}</h1> {/* text-black here */}
      <hr className="border-1 border-black sm:w-10 md:w-20" />
      <h2 className={`text-md p-1 ${descriptionFontSize} text-black`}>{description}</h2> {/* text-black here */}
    </div>
  );
};

export default RelevantInfoS;