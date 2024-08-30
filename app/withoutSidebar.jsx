"use client";

export function LayoutWithoutSidebar({ children }) {
  return (
    <div className="layout-container without-sidebar">
      <div className="main-content full-width">
        <main>{children}</main>
      </div>
    </div>
  );
}
