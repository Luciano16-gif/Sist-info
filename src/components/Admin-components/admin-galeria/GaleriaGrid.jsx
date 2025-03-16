import Fotos from "../admin-buttons/GaleriaFoto";
import ImgDefault from "../../../assets/images/AdminLandingPage/CrearExperiencias/Subirimagen.png";


const GaleriaGrid = () => {
    const Pictures = [
        {img: ImgDefault, alte: "abc"},
        {img: ImgDefault, alte: "abc"},
        {img: ImgDefault, alt: "abc"},
        {img: ImgDefault, alt: "abc"},
        {img: ImgDefault, alt: "abc"},
        {img: ImgDefault, alt: "abc"},
        {img: ImgDefault, alt: "abc"},
    ]
    return (
        <section className="bg-[#121F0A] text-gray-300 p-6  w-full h-full">
            <div className="grid grid-rows-3 grid-cols-3 gap-y-16 gap-x-12 overflow-x-auto rounded-lg">
                {Pictures.map((picture, index) => (
                    <Fotos key={index} img={picture.img} alt={picture.alt}/>
                ))}
            </div>
        </section>
    );
}

export default GaleriaGrid;