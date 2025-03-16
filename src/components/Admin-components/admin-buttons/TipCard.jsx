// TipCard.jsx
import React from 'react';

const TipCard = ({ imageSrc, title, description }) => {
    return (
        <div className="bg-[#556052] w-[311px] h-[480px] text-white p-6 rounded-xl flex items-center justify-center">
            <div className="bg-[#556052] w-[271.261px] h-[444.167px] text-white rounded-xl flex flex-col items-center border-2 border-solid">
                {/* Parte superior de la carta */}
                <div className="flex flex-col p-12 items-center justify-center">
                    <img src={imageSrc} className="w-[133.432px] h-auto" />
                </div>

                {/* Divisor */}
                <hr className="border-t border-white-600 w-full" />

                {/* Parte inferior de la carta */}
                <h2 className="text-[26px] font-bold text-center mt-2 leading-7">{title}</h2>
                <p className="text-center text-[15px] p-5 leading-5">{description}</p>
            </div>
        </div>
    );
};

export default TipCard;