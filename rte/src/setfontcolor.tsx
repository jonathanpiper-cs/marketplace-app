import { Icon, Dropdown, Paragraph } from "@contentstack/venus-components";
import React, { useState } from "react";
import ReactDOM from "react-dom";
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

const activeElement = () => {
  return { backgroundColor: "#6c5ce7", color: "white" };
};
const defaultElement = (color: any) => {
  return { backgroundColor: "#fff", color: color };
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
  let rtePlaceholder;
  let selectedColor;
  let list = COLORS.map((color) => {
    return {
      label: (
        <span style={{ color: color.color, display: "flex" }} id={color.color}>
          <Paragraph text={color.name} />
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
    rtePlaceholder = rte;
    if (!window.rte) {
      window.rte = rte;
    }
    const sel = rte.selection.get();
    console.log(rte, sel)
    if (sel) {
      const comp = rte.getNode(sel.anchor.path)[0];
      selectedColor = comp.fontColor ? comp.fontColor : "none";
      console.log(comp, selectedColor)
      list.forEach((m) => {
        if (m.value !== selectedColor) {
          m.label.props = { ...m.label.props, style: defaultElement(m.value) };
        } else {
          console.log(m, selectedColor);
          m.label.props = { ...m.label.props, style: activeElement() };
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
  const handleChange = (e) => {
    const el = document.getElementById(e.value).parentElement;
    // el.classList.add('style-module_dropdown__menu__default__list--active__T7iCN');
    // console.log(e, el);
  };
  return (
    <Dropdown list={list} onChange={handleChange} type={"click"} closeAfterSelect highlightActive>
      <Icon style={{ padding: "0 6px" }} icon="Edit" fill="blue" size="original" />
    </Dropdown>
  );
};
