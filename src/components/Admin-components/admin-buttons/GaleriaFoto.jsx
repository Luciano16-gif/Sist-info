const Fotos = ({img, alt}) => {
    return (
        <div className="w-44 h-24 bg-gray-600 rounded-lg">
            <img className=" object-cover object-center" src={img} alt={alt}></img>
        </div>
    )
}

export default Fotos;