import SideBar from "../components/sidebar"

export function LayoutWithSidebar({ children }) {
  return (
    <div className="layout-container with-sidebar">
      <div className="sidebar-container">
        <SideBar />
      </div>
      <div className="main-content">
        <main>{children}</main>
      </div>
    </div>
  );
}
