"use client";

import React from "react";
import InputWithTitle from "../../components/generic/InputWithTitle";
import PermissionManager from "../../components/permissionManager";

const Permission = () => {
  return (
    <div>
      <div style={{ fontSize: "24px", fontWeight: 600 }}>User</div>

      <div
        className="mt-10"
        style={{ display: "flex", justifyContent: "space-between" }}
      >
        <div style={{ flex: 1, marginRight: "10px" }}>
          <InputWithTitle
            title="Name"
            type="text"
            placeholder="Name"
            name="person_name"
          />
        </div>
        <div style={{ flex: 1, marginLeft: "10px" }}>
          <InputWithTitle
            title="Email"
            type="text"
            placeholder="Email"
            name="email"
          />
        </div>
        <div style={{ flex: 1, marginLeft: "10px" }}>
          <InputWithTitle
            title="Passowrd"
            type="text"
            placeholder="Passowrd"
            name="passowrd"
          />
        </div>
      </div>

      <div>
        <PermissionManager />
      </div>
    </div>
  );
};

export default Permission;
