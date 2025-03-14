//<div class="w-4 h-4 bg-red-600 rounded-full"></div>

const MensajeCard = ({img, name, who, asunto, context}) => {
    return (
        <div className="bg-green-800 text-black p-4 w-[28rem] h-full rounded-full flex-shrink-0 flex flex-row space-x-5">
            <img src={img} className="w-20 h-20 rounded-full"></img>
            <div className="flex flex-col">
                <div className="flex flex-row space-x-5 w-auto">
                    <p className="font-bold whitespace-nowrap text-white w-auto">{name}</p>
                    <div className="w-auto h-6 bg-green-900 rounded-full Justify-center">
                        <p className="text-xs text-white">{who}</p>
                    </div>
                </div>
                <div className="flex flex-row space-x-2 py-2">
                    <p className="text-sm text-white font-bold">Asunto:</p>
                    <p className="text-sm text-white">{asunto}</p>
                </div>
                <div className="flex flex-row space-x-3">
                    <p className="text-xs text-white">{context}</p>
                </div>
            </div>
        </div>
    );
}

export default MensajeCard;