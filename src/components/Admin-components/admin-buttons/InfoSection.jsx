const RelevantInfoS = ({ number , description }) => {

    return (
        <div className="
        flex flex-col relative w-[7.6rem] h-40
         bg-[#cbf2d0] rounded-[10%] items-center justify-center content-center
         text-center
        ">
            <h1 className="flex text-5xl font-bold p-5">{number}</h1>
            <hr className="border-1 border-black sm:w-10 md:w-20" />
            <h2 className="flex text-md p-1">{description}</h2>
        </div>
    );
};

export default RelevantInfoS;