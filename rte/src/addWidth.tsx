import { Icon, Dropdown } from "@contentstack/venus-components";
import React, { useState } from "react";

const WIDTHS = [{ width: "Default" }, { width: "80px" }, { width: "160px" }, { width: "320px" }];

declare global {
  interface Window {
    rte: any;
  }
}

const AddWidthComponent: any = (props: any) => {
  const { leaf } = props;
  return (
    <span {...props.attributes}>
      {props.children} ({leaf["addWidth"]})
    </span>
  );
};

export const addWidth = (RTE: any) => {
  const AddWidth = RTE("addWidth", () => ({
    title: "Add Width",
    icon: <FCIcon />,
    render: (props: any) => {
      return <AddWidthComponent {...props} />;
    },
    display: ["toolbar"],
    elementType: ["text"],
  }));

  AddWidth.on("exec", (rte: any) => {
    if (!window.rte) {
      window.rte = rte;
    }
  });

  return AddWidth;
};

const list = WIDTHS.map((w) => ({
  label: <span>{w.width}</span>,
  value: w.width,
  showAsActive: true,
  action: () => {
    const { rte } = window;
    console.log(w);
    if (w.width === "Default") {
      rte.removeMark("addWidth");
    } else {
      rte.addMark("addWidth", w.width);
    }
  },
}));

const FCIcon: React.FC = () => {
  return (
    <Dropdown list={list} type={"click"} highlightActive={true}>
      <Icon style={{ padding: "0 6px" }} icon="Code" size="original" version="v2" />
    </Dropdown>
  );
};
