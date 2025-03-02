import HamburgerMenu from "../menus/HamburgerMenu";
// import TopMenu from "../menus/TopMenu";

const Layout = ({ children }) => {
    return (
      <div className="pt-16">
        <HamburgerMenu />
        {/* <TopMenu /> */}
        {children}
      </div>
    );
  };
  
  export default Layout;