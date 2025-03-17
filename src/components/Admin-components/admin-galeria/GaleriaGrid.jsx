
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
    <div className="grid grid-flow-col grid-rows-3 auto-cols-max gap-4 overflow-x-auto max-w-full
    bg-green-950 p-4 rounded-lg">
      {Pictures.map((picture, index) => (
        <div key={index} className="h-32 aspect-video">
          <img
            className="object-cover object-center w-full h-full rounded-lg"
            src={picture.img}
            alt={picture.alt}
          />
        </div>
      ))}
    </div>
  );
};

export default GaleriaGrid;