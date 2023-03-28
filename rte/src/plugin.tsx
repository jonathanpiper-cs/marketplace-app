import React from "react";
import ContentstackSDK from "@contentstack/app-sdk";
import { createRateRTE } from "./rate/index";
import { removeHeadingMargin } from "./rate/removeheadingmargin";
import { setFontColor } from "./rate/setfontcolor";
import { setFontSize } from "./rate/setfontsize";
import { setFontWeight } from "./rate/setfontweight";
import { insertBoilerplate } from "./rate/boilerplate";

export default ContentstackSDK.init().then(async (sdk) => {
  const extensionObj = await sdk["location"];
  const RTE = await extensionObj["RTEPlugin"];
  if (!RTE) return;

  const Rate = createRateRTE(RTE)
  const RemoveHeadingMargin = removeHeadingMargin(RTE);
  const SetFontColor = setFontColor(RTE);
  const SetFontSize = setFontSize(RTE);
  const SetFontWeight = setFontWeight(RTE);
  const InsertBoilerplate = insertBoilerplate(RTE);

  Rate.addPlugins(RemoveHeadingMargin);

  return {
    Rate,
    RemoveHeadingMargin,
    InsertBoilerplate,
    SetFontColor,
    SetFontSize,
    SetFontWeight
  };
});