import React from 'react';

const Reviews = () => {
  const userImage = "https://via.placeholder.com/50"; // Placeholder image

  return (
    <>
      <h2 className="text-4xl font-bold text-white mb-2 tracking-widest">Reseñas Recientes</h2>
      <p className="text-sm text-white mb-4 tracking-widest">Estos son los últimos comentarios que nos han enviado nuestros usuarios</p>

      <div className="w-[1447px] h-auto rounded-[20px] bg-[#16260C] shadow-[5px_5px_15px_5px_rgba(0,0,0,0.40)] p-5">
        <div className="overflow-x-auto overflow-y-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {/* Review Card 1 */}
            <div className="w-[450px] p-4 rounded-[100px] bg-[#C3D8B4] text-black">
              <div className="flex items-start">
                <img src={userImage} alt="User Avatar" className="w-12 h-12 rounded-full mr-8" />
                <div className="text-left">
                  <p><b>USUARIO #471:</b> ⭐⭐⭐⭐⭐</p>
                  <p className="text-black text-[15px] font-medium leading-normal break-words">
                    Me encantó cada minuto de la excursión. La belleza del parque es asombrosa, y los guías hicieron que todo fuera aún más especial. ¡Totalmente recomendado!
                  </p>
                </div>
              </div>
            </div>

            {/* Review Card 2 */}
            <div className="w-[450px] p-4 rounded-[100px] bg-[#C3D8B4] text-black">
              <div className="flex items-start">
                <img src={userImage} alt="User Avatar" className="w-12 h-12 rounded-full mr-8" />
                <div className="text-left">
                  <p><b>USUARIO #471:</b> ⭐⭐⭐⭐⭐</p>
                  <p className="text-black text-[15px] font-medium leading-normal break-words">
                    Una de las mejores aventuras de mi vida. La fauna que vimos fue impresionante, ¡los guías son excepcionales!
                  </p>
                </div>
              </div>
            </div>

            {/* Review card 3*/}
            <div className="w-[450px] p-4 rounded-[100px] bg-[#C3D8B4] text-black">
              <div className="flex items-start">
                <img src={userImage} alt="User Avatar" className="w-12 h-12 rounded-full mr-8" />
                <div className="text-left">
                  <p><b>USUARIO #471:</b> ⭐⭐⭐⭐</p>
                  <p className="text-black text-[15px] font-medium leading-normal break-words">
                    Gran oportunidad para explorar la naturaleza. El único inconveniente fue la duración de la excursión.
                  </p>
                </div>
              </div>
            </div>

            {/* Review Card 4 */}
            <div className="w-[450px] p-4 rounded-[100px] bg-[#C3D8B4] text-black">
              <div className="flex items-start">
                <img src={userImage} alt="User Avatar" className="w-12 h-12 rounded-full mr-8" />
                <div className="text-left">
                  <p><b>USUARIO #471:</b> ⭐⭐⭐⭐⭐</p>
                  <p className="text-black text-[15px] font-medium leading-normal break-words">
                    Increíble experiencia. Las vistas desde la cima son espectaculares. ¡Definitivamente regresaré!
                  </p>
                </div>
              </div>
            </div>

            {/* Review Card 5 */}
            <div className="w-[450px] p-4 rounded-[100px] bg-[#C3D8B4] text-black">
              <div className="flex items-start">
                <img src={userImage} alt="User Avatar" className="w-12 h-12 rounded-full mr-8" />
                <div className="text-left">
                  <p><b>USUARIO #471:</b> ⭐⭐⭐⭐⭐</p>
                  <p className="text-black text-[15px] font-medium leading-normal break-words">
                    Disfruté mucho de la ruta de la finca. Un recorrido fácil y recomendable para familias.
                  </p>
                </div>
              </div>
            </div>

            {/* Review Card 6 */}
            <div className="w-[450px] p-4 rounded-[100px] bg-[#C3D8B4] text-black">
              <div className="flex items-start">
                <img src={userImage} alt="User Avatar" className="w-12 h-12 rounded-full mr-8" />
                <div className="text-left">
                  <p><b>USUARIO #471:</b> ⭐⭐⭐⭐</p>
                  <p className="text-black text-[15px] font-medium leading-normal break-words">
                    Los guías son muy conocedores y compartieron mucho sobre la flora y fauna local. ¡Gran experiencia!
                  </p>
                </div>
              </div>
            </div>

            {/* Review Card 7 */}
            <div className="w-[450px] p-4 rounded-[100px] bg-[#C3D8B4] text-black">
              <div className="flex items-start">
                <img src={userImage} alt="User Avatar" className="w-12 h-12 rounded-full mr-8" />
                <div className="text-left">
                  <p><b>USUARIO #471:</b> ⭐⭐⭐⭐</p>
                  <p className="text-black text-[15px] font-medium leading-normal break-words">
                    Rutas bien organizadas y guías muy profesionales. Solo desearía que hubiera más áreas de descanso.
                  </p>
                </div>
              </div>
            </div>

            {/* Review Card 8 */}
            <div className="w-[450px] p-4 rounded-[100px] bg-[#C3D8B4] text-black">
              <div className="flex items-start">
                <img src={userImage} alt="User Avatar" className="w-12 h-12 rounded-full mr-8" />
                <div className="text-left">
                  <p><b>USUARIO #471:</b> ⭐⭐⭐</p>
                  <p className="text-black text-[15px] font-medium leading-normal break-words">
                    La ruta estaba más llena de lo esperado, lo que hizo la experiencia menos placentera. Mejoraré la elección de la ruta la próxima vez.
                  </p>
                </div>
              </div>
            </div>

            {/* Review Card 9 */}
            <div className="w-[450px] p-4 rounded-[100px] bg-[#C3D8B4] text-black">
              <div className="flex items-start">
                <img src={userImage} alt="User Avatar" className="w-12 h-12 rounded-full mr-8" />
                <div className="text-left">
                  <p><b>USUARIO #471:</b> ⭐⭐⭐⭐</p>
                  <p className="text-black text-[15px] font-medium leading-normal break-words">
                    La ruta fue buena, pero eché de menos más interactividad con la naturaleza. Aun así, lo disfruté.
                  </p>
                </div>
              </div>
            </div>

            {/* Review Card 10 */}
            <div className="w-[450px] p-4 rounded-[100px] bg-[#C3D8B4] text-black">
              <div className="flex items-start">
                <img src={userImage} alt="User Avatar" className="w-12 h-12 rounded-full mr-8" />
                <div className="text-left">
                  <p><b>USUARIO #471:</b> ⭐⭐⭐⭐</p>
                  <p className="text-black text-[15px] font-medium leading-normal break-words">
                    La excursión fue buena, pero el clima no cooperó. Aún así, la experiencia fue agradable.
                  </p>
                </div>
              </div>
            </div>

            {/* Review Card 11 */}
            <div className="w-[450px] p-4 rounded-[100px] bg-[#C3D8B4] text-black">
              <div className="flex items-start">
                <img src={userImage} alt="User Avatar" className="w-12 h-12 rounded-full mr-8" />
                <div className="text-left">
                  <p><b>USUARIO #471:</b> ⭐⭐⭐⭐⭐</p>
                  <p className="text-black text-[15px] font-medium leading-normal break-words">
                    ¡Maravilloso! La organización fue impecable y el paisaje simplemente hermoso. ¡Volveré sin duda!
                  </p>
                </div>
              </div>
            </div>

            {/* Review Card 12 */}
            <div className="w-[450px] p-4 rounded-[100px] bg-[#C3D8B4] text-black">
              <div className="flex items-start">
                <img src={userImage} alt="User Avatar" className="w-12 h-12 rounded-full mr-8" />
                <div className="text-left">
                  <p><b>USUARIO #471:</b> ⭐⭐⭐⭐</p>
                  <p className="text-black text-[15px] font-medium leading-normal break-words">
                    Perfecto para los amantes de la naturaleza. Cada rincón tiene algo especial que ofrecer.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Reviews;