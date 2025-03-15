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

    return (
        <section className="bg-[#121F0A] text-gray-300 p-6 w-full h-full">
            <div className="grid grid-cols-1 gap-y-8 gap-x-12 overflow-x-auto md:grid-cols-3 md:grid-rows-3 rounded-lg">
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
        </section>
    );
};

export default MensajesGrid;    