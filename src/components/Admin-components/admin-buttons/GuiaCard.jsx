import star from "../../../assets/images/AdminLandingPage/profile_blank.webp";

const GuiaCard = ({img, name, stars, number, status, solicitudes}) => {
    return (
        <div className="bg-[#6b9e5a] text-black p-4 w-[27rem] h-full rounded-full flex-shrink-0 flex flex-row space-x-5">
            <img src={img} className="w-20 h-20 rounded-full"></img>
            <div className="flex flex-col">
                <div className="flex flex-row space-x-5 w-auto">
                    <p className="font-bold whitespace-nowrap">{name}</p>
                    <div className="flex flex-row space-x-1">
                        <img src={star} className="w-5 h-5 rounded-full"></img>
                        <img src={star} className="w-5 h-5 rounded-full"></img>
                        <img src={star} className="w-5 h-5 rounded-full"></img>
                        <img src={star} className="w-5 h-5 rounded-full"></img>
                        <img src={star} className="w-5 h-5 rounded-full"></img>
                    </div>
                </div>
                <p className="text-xs">Guía #{number}</p>
                <div className="flex flex-row space-x-2 py-2">
                    <p className="text-sm font-bold">Estatus:</p>
                    <p className="text-sm">{status} actividades asignadas actualmente</p>
                </div>
                <div className="flex flex-row space-x-3">
                    <div className="flex flex-row space-x-1">
                        <div class="w-4 h-4 bg-red-600 rounded-full"></div>
                        <p className="text-sm text-red-600">{solicitudes} solicitudes/sugerencias</p>
                    </div>
                    <a className="text-sm underline">Gestionar Guía</a>
                </div>
            </div>
        </div>
    );
}

export default GuiaCard;