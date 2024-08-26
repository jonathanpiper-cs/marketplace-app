import { Icon, Dropdown } from "@contentstack/venus-components";
import React, { useState } from "react";
// import ReactDOM from "react-dom";
import "./index.css";

const COLORS = [
  { name: "Blue", color: "rgb(30,144,255)" },
  { name: "Orange", color: "rgb(255,127,80)" },
  { name: "Green", color: "rgb(34,139,34)" },
  { name: "Purple", color: "rgb(138,43,226)" },
  { name: "Default", color: "" },
];

declare global {
  interface Window {
    rte: any;
  }
}

const activeElement = (color: any) => {
  return { color: color, fontSize: "18px" };
};
const defaultElement = (color: any) => {
  return { color: color, fontSize: "14px" };
};

const ColorComponent = (props) => {
  const { leaf } = props;
  return (
    <span {...props.attributes} style={{ color: leaf["fontColor"] }}>
      {props.children}
    </span>
  );
};

export const SetFontColor = (RTE: any) => {
  let selectedColor;
  let list = COLORS.map((color) => {
    return {
      label: (
        <span style={{ color: color.color, display: "flex" }} id={color.color}>
          <span>{color.name}</span>
        </span>
      ),
      value: color.color,
      action: () => {
        const { rte } = window;
        if (color.name === "Default") {
          rte.removeMark("fontColor");
        } else {
          rte.addMark("fontColor", color.color);
        }
      },
    };
  });
  const FontColor = RTE("fontColor", () => ({
    title: "Set Font Color",
    icon: <FCIcon />,
    render: (props: any) => {
      return <ColorComponent {...props} />;
    },
    display: ["toolbar"],
    elementType: ["text"],
  }));

  FontColor.on("exec", (rte: any) => {
    if (!window.rte) {
      window.rte = rte;
    }
    const sel = rte.selection.get();
    // console.log(rte, sel)
    if (sel) {
      const comp = rte.getNode(sel.anchor.path)[0];
      selectedColor = comp.fontColor ? comp.fontColor : "none";
    //   console.log(comp, selectedColor)
      list.forEach((m) => {
        if (m.value !== selectedColor) {
          m.label.props = { ...m.label.props, style: defaultElement(m.value) };
        } else {
        //   console.log(m, selectedColor);
          m.label.props = { ...m.label.props, style: activeElement(m.value) };
        }
      });
    }
  });

  const FCIcon = () => {
    return <Droppy list={list} />;
  };

  return FontColor;
};

const Droppy = (props) => {
  const { list } = props;
  return (
    <Dropdown list={list} type={"click"} closeAfterSelect highlightActive>
      <Icon style={{ padding: "0 6px" }} icon="Edit" fill="blue" size="original" />
    </Dropdown>
  );
};
