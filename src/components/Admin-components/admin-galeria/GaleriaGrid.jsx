
import ImgDefault from "../../../assets/images/AdminLandingPage/CrearExperiencias/Subirimagen.png";

const GaleriaGrid = () => {
  const Pictures = [
    { img: ImgDefault, alt: "abc" },
    { img: ImgDefault, alt: "abc" },
    { img: ImgDefault, alt: "abc" },
    { img: ImgDefault, alt: "abc" },
    { img: ImgDefault, alt: "abc" },
    { img: ImgDefault, alt: "abc" },
    { img: ImgDefault, alt: "abc" },
    { img: ImgDefault, alt: "abc" }, 
    { img: ImgDefault, alt: "abc" },
    { img: ImgDefault, alt: "abc" },
    { img: ImgDefault, alt: "abc" },
    { img: ImgDefault, alt: "abc" },
    { img: ImgDefault, alt: "abc" },

  ];
  return (
    <section className="bg-[#121F0A] text-gray-300 p-6 h-[726px] w-auto rounded-lg">
        <div className="flex flex-nowrap gap-y-16 gap-x-12 overflow-x-auto h-[336px]">
            {Pictures.map((picture, index) => (
                <div key={index} className="w-44 h-24 bg-gray-600 rounded-lg">
                    <img className="object-cover object-center" src={picture.img} alt={picture.alt} />
                </div>
            ))}
        </div>
    </section>
);
};

export default GaleriaGrid;