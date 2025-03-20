import './loading-animation.css'; 

const LoadingScreen = ({ appName = "Gestión Rutas y Excursiones" }) => {
  return (
    <div className="loading-container min-h-screen">
      <div className="sidebar-simulation"></div>
      <div className="loading-content">
        <div className="app-name">{appName}</div>
        <div className="loading-card">
          <div className="loading-spinner">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
          <div className="loading-text">Cargando información...</div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;