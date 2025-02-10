import Header from "../components/header";

export function LayoutWithSidebar({ children }) {
  return (
    <div className="layout-container">
      {/* Header Now at the Top */}
      <Header />

      {/* Main Content */}
      <div className="main-content">
        <main>{children}</main>
      </div>
    </div>
  );
}
