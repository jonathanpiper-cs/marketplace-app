import { Icon, Dropdown } from "@contentstack/venus-components";
import React from "react";

const UNI_CH = [
  { ch: "NBSP", enc: "\u{00A0}" },
  { ch: "NBH", enc: "\u2011" },
  { ch: "SHY", enc: "\u00AD" },
  { ch: "@", enc: "@" },
];

declare global {
  interface Window {
    rte: any;
  }
}

const UniCHComponent = (props) => {
  return <span {...props.attributes}>{props.children}</span>;
};

export const insertUniCH = (RTE: any) => {
  const UniCH = RTE("uniCh", () => ({
    title: "Insert Uni Character",
    icon: <FCIcon />,
    render: (props: any) => {
      return <UniCHComponent {...props} />;
    },
    display: ["toolbar"],
    elementType: ["inline"],
  }));

  UniCH.on("exec", (rte: any) => {
    if (!window.rte) {
      window.rte = rte;
    }
  });

  return UniCH;
};

const list = UNI_CH.map((ch) => ({
  label: <span>{ch.ch}</span>,
  value: ch.enc,
  showAsActive: false,
  action: () => {
    const { rte } = window;
    try {
      //   const { anchor } = rte.selection.get();
      //   const focus = {
      //     offset: anchor.offset + 1,
      //     path: anchor.path,
      //   };
      //   const selection = {
      //     anchor: anchor,
      //     focus: focus,
      //   };
      rte.insertText(ch.enc);
    //   rte.addMark("uniCh", true);
    } catch (err) {
      console.log(err);
    }
  },
}));

const FCIcon: React.FC = () => {
  return (
    <Dropdown list={list} type={"click"} closeAfterSelect>
      <Icon style={{ padding: "0 6px" }} icon="SingleLineText" size="original" />
    </Dropdown>
  );
};
