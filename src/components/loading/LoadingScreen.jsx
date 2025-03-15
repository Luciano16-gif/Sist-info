import './loading-animation.css'; 

const LoadingScreen = ({ appName = "ÁvilaVenturas" }) => {
  return (
    <div className="loading-container min-h-screen">
      <div className="app-name">{appName}</div>
      <div className="loading-spinner">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <div className="loading-text">Loading...</div>
    </div>
  );
};

export default LoadingScreen;