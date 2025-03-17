// NuestrosGuias.js
import MensajeCard from "../admin-buttons/MensajeCard";
import blank from "../../../assets/images/AdminLandingPage/profile_blank.webp";

const MensajesGrid = () => {

    const Messages = [
        { name: "Carlos Fernández", who: 'whoever', asunto: "Do whatever you want", context: 'aaaaaaaaaaaa' },
        { name: "Carlos Fernández", who: 'whoever', asunto: "Do whatever you want", context: 'aaaaaaaaaaaa' },
        { name: "Carlos Fernández", who: 'whoever', asunto: "Do whatever you want", context: 'aaaaaaaaaaaa' },
        { name: "Carlos Fernández", who: 'whoever', asunto: "Do whatever you want", context: 'aaaaaaaaaaaa' },
        { name: "Carlos Fernández", who: 'whoever', asunto: "Do whatever you want", context: 'aaaaaaaaaaaa' },
        { name: "Carlos Fernández", who: 'whoever', asunto: "Do whatever you want", context: 'aaaaaaaaaaaa' },
        { name: "Carlos Fernández", who: 'whoever', asunto: "Do whatever you want", context: 'aaaaaaaaaaaa' },
        { name: "Carlos Fernández", who: 'whoever', asunto: "Do whatever you want", context: 'aaaaaaaaaaaa' },
        { name: "Carlos Fernández", who: 'whoever', asunto: "Do whatever you want", context: 'aaaaaaaaaaaa' },
        { name: "Carlos Fernández", who: 'whoever', asunto: "Do whatever you want", context: 'aaaaaaaaaaaa' },
        { name: "Carlos Fernández", who: 'whoever', asunto: "Do whatever you want", context: 'aaaaaaaaaaaa' },
        { name: "Carlos Fernández", who: 'whoever', asunto: "Do whatever you want", context: 'aaaaaaaaaaaa' },
    ];
//text-gray-300 p-6 w-full h-full grid grid-rows-3 gap-y-8 gap-x-12 overflow-x-auto rounded-lg"
    return (
        <div className="grid grid-flow-col grid-rows-3 auto-cols-max gap-x-6 gap-y-36 overflow-x-auto max-w-full h-full
    bg-[#121F0A] text-gray-300 p-6 rounded-lg">
            {Messages.map((message, index) => (
                <MensajeCard
                    key={index}
                    img={blank}
                    name={message.name}
                    who={message.who}
                    asunto={message.asunto}
                    context={message.context}
                />
            ))}
        </div>
    );
};

export default MensajesGrid;    