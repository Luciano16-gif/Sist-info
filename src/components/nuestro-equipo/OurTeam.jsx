import React from 'react';
import { OurTeamCircles } from './BackgroundElements';
import ScrollFix from './ScrollFix';
import logoImage from '../../assets/images/Logo_Avilaventuras.webp';
import visionImage from '../../assets/images/nuestro-equipo/image_vision.webp';
import misionImage from '../../assets/images/nuestro-equipo/image_mision.webp';

// Button component for consistency
const Button = ({ text, className, onClick }) => (
  <button
    className={`px-3 py-3 rounded-full bg-white bg-opacity-20 text-white hover:bg-opacity-30 transition-colors duration-300  border-white - whitespace-nowrap font-bold  ${className}`}
    onClick={onClick} 
  >
    {text}
  </button>
);

// Main component for Ávila Venturas website
const OurTeam = () => {
  return (
    <div className="relative min-h-screen bg-[#2C3B23] text-white font-sans overflow-x-hidden">
      {/* Background circles */}
      <OurTeamCircles />

      {/* Scroll fix for the background circles */}
      <ScrollFix />

      {/* Main content container, made full width by removing container class and py */}
      <div className="relative w-full px-4 z-10">
        {/* Header - Nuestro Equipo */}
        <section className="py-12 px-4 md:px-16 lg:px-24 xl:px-32">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-light text-center mb-12">Nuestro Equipo</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="flex justify-center md:justify-end">
              <img
                src={logoImage}
                alt="Ávila Venturas Logo"
                className="w-3/4 max-w-sm"
              />
            </div>

            <div className="space-y-4">
              <h2 className="text-3xl font-light text-center">¿Quiénes somos?</h2>
              <p className="text-sm leading-relaxed text-justify">
                Nuestro equipo de Ingenieros de Sistemas de la Universidad
                Metropolitana se dedica a desarrollar una plataforma web
                innovadora para gestionar excursiones al magnífico parque
                nacional El Ávila. Con una pasión por la tecnología y el medio
                ambiente, nos esforzamos por fomentar el amor por la
                naturaleza y promover actividades al aire libre, asegurando que
                cada excursión se convierta en una aventura inolvidable y
                accesible para todos los estudiantes de nuestra universidad.
              </p>
            </div>
          </div>
        </section>

        {/* Nuestra Visión */}
        <section className="py-12 px-4 md:px-16 lg:px-24 xl:px-32">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1 space-y-4">
              <h2 className="text-3xl font-light text-center">Nuestra Visión</h2>
              <p className="text-sm leading-relaxed text-justify">
                Desarrollar una plataforma digital innovadora y atractiva que
                facilite a los estudiantes la gestión, participación y disfrute
                de excursiones en la espléndida naturaleza del parque nacional
                El Ávila. Nuestro propósito es incentivar el interés en
                actividades al aire libre, fomentar la formación de una vibrante
                comunidad apasionada por la naturaleza, y proporcionar
                información precisa y servicios adecuados para garantizar una
                experiencia enriquecedora y segura para todos los participantes.
                Además, la plataforma está diseñada para integrar herramientas
                de gestión y comunicación eficientes, permitiendo a los
                organizadores administrar las excursiones de manera óptima y sin
                complicaciones. Nuestra visión es hacer de cada excursión una
                experiencia inolvidable, conectando a los estudiantes con la
                maravilla y la belleza del entorno natural.
              </p>
            </div>

            <div className="order-1 md:order-2 flex justify-center">
              <img
                src={visionImage}
                alt="Excursionistas en El Ávila"
                className="w-full max-w-md rounded-lg"
              />
            </div>
          </div>
        </section>

        {/* Nuestra Misión */}
        <section className="py-12 px-4 md:px-16 lg:px-24 xl:px-32">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="flex justify-center md:justify-end">
              <img
                src={misionImage}
                alt="Senderismo en El Ávila"
                className="w-full max-w-md rounded-lg"
              />
            </div>

            <div className="space-y-4">
              <h2 className="text-3xl font-light text-center">Nuestra Misión</h2>
              <p className="text-sm leading-relaxed text-justify">
                Impulsar la conexión con la naturaleza y nutrir el espíritu
                aventurero de los estudiantes de la Universidad Metropolitana
                mediante la organización de excursiones al Parque Nacional El
                Ávila. Proveeremos información precisa y valiosa para
                garantizar una experiencia segura, enriquecedora y memorable
                para cada participante. Nuestra misión es incentivar la
                exploración y apreciación del entorno natural, fomentando así
                una comunidad universitaria comprometida con la aventura y la
                conservación del medio ambiente.
              </p>
            </div>
          </div>
        </section>

        {/* Nuestros Contactos */}
        <section className="py-12 px-4 md:px-16 lg:px-24 xl:px-32">
          <h2 className="text-3xl font-light text-center mb-8">Nuestros Contactos</h2>
          <div className="max-w-2xl mx-auto text-center mb-8">
            <p className="text-sm leading-relaxed text-justify">
              Estamos aquí para ayudarte en cada paso de tu aventura. Ponte en
              contacto con nosotros para obtener más información, resolver tus
              dudas o recibir asistencia personalizada. Nuestro equipo está
              comprometido en brindarte la mejor experiencia posible.
            </p>
          </div>

          <div className="flex justify-center mb-12">
            <Button text="Enviar Mensaje" onClick={() => {}} />
          </div>

          <h2 className="text-3xl font-light text-center mb-8">
            Forma parte de este equipo
          </h2>

          <div className="max-w-3xl mx-auto text-center mb-8">
            <p className="text-sm leading-relaxed text-justify mb-6">
              ¿Te apasiona la naturaleza y las aventuras al aire libre? ¿Te
              gustaría compartir tu amor por el Parque Nacional El Ávila con
              otros estudiantes? En Ávila Ventura, estamos buscando personas
              entusiastas y comprometidas para formar parte de nuestro equipo de
              guías de excursión.
            </p>

            <p className="text-sm leading-relaxed text-justify mb-6">
              Como guía de excursión, tendrás la oportunidad de liderar grupos
              de estudiantes en recorridos por los senderos más impresionantes
              de El Ávila, brindando información valiosa y asegurando una
              experiencia segura y memorable para todos los participantes.
              Serás parte de una comunidad apasionada por la naturaleza,
              ayudando a fomentar el espíritu aventurero y la apreciación del
              entorno natural.
            </p>

            <p className="text-sm leading-relaxed text-justify mb-8">
              Si tienes conocimientos sobre el parque, habilidades de liderazgo
              y una actitud positiva, ¡queremos conocerte! Únete a nosotros y sé
              parte de un equipo que inspira y conecta a los estudiantes con la
              belleza y el esplendor de la naturaleza.
            </p>
          </div>

          <div className="flex justify-center mb-12">
            <Button text="Unirse al Equipo" onClick={() => {}} />
          </div>

          <h2 className="text-3xl font-light text-center mb-8">
            ¿Qué estás esperando?
          </h2>

          <div className="max-w-2xl mx-auto text-center mb-12">
            <p className="text-sm leading-relaxed text-justify">
              Regístrate en nuestra plataforma, únete a la comunidad y comienza
              tu próxima gran aventura con Ávila Ventura. La naturaleza te está
              llamando, ¿estás listo para responder?
            </p>
          </div>

          {/* Footer */}
          <footer className="mt-16 text-center px-4 md:px-16 lg:px-24 xl:px-32">
            <p className="text-sm">©2025 | ÁvilaVenturas ALL RIGHT RESERVED</p>
          </footer>
        </section>
      </div>
    </div>
  );
};
export default OurTeam;