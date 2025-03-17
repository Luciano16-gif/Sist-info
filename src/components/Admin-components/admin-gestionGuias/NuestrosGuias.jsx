// NuestrosGuias.js
import GuiaCard from "../admin-buttons/GuiaCard";
import blank from "../../../assets/images/AdminLandingPage/profile_blank.webp";

const NuestrosGuias = () => {

    const Messages = [
        { name: "Carlos Fernández", stars: 4, number: 21, status: 3, solicitudes: 5 },
        { name: "Andrea Claderón", stars: 4, number: 21, status: 3, solicitudes: 5 },
        { name: "Omaira Roa", stars: 4, number: 21, status: 3, solicitudes: 5 },
        { name: "Santiago Zabala", stars: 4, number: 21, status: 3, solicitudes: 5 },
        { name: "Valery Villas", stars: 4, number: 21, status: 3, solicitudes: 5 },
        { name: "Daniela Pereira", stars: 4, number: 21, status: 3, solicitudes: 5 },
        { name: "Someone random", stars: 4, number: 21, status: 3, solicitudes: 5 },
    ]
//gap-y-8 gap-x-12 overflow-x-auto rounded-lg bg-[#121F0A] text-gray-300 p-6  w-full h-full
    return (
        <div className="grid grid-flow-col grid-rows-3 auto-cols-max gap-y-36 gap-x-6 overflow-x-auto max-w-full h-full
    bg-[#121F0A] text-gray-300 p-6rounded-lg"> {/* Moved rounded-lg here */}
                {Messages.map((message, index) => (
                    <GuiaCard key={index} img={blank} name={message.name} stars={message.stars}
                        number={message.number} status={message.status} solicitudes={message.solicitudes}
                    />
                ))}
            </div>
    );
}

export default NuestrosGuias;