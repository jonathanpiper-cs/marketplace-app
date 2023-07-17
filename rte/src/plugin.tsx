import React from "react";
import ContentstackSDK from "@contentstack/app-sdk";
// import { createRateRTE } from "./rate/index";
import { removeHeadingMargin } from "./rate/removeheadingmargin";
import { setFontColor } from "./rate/setfontcolor";
import { setFontSize } from "./rate/setfontsize";
import { setFontWeight } from "./rate/setfontweight";
import { insertBoilerplate } from "./rate/boilerplate";
import { cloudinary } from "./rate/cloudinary";
import { insertUniCH } from "./unicode";
import { highlight } from "./highlight";
// import { vimeo } from "./vimeo";
import { nofollow } from "./nofollow";
import { html } from "./html";
import { getEntryValue } from './getEntryValue';

export default ContentstackSDK.init().then(async (sdk) => {
  const extensionObj = await sdk["location"];
  console.log(extensionObj)
  const RTE = await extensionObj["RTEPlugin"];
  if (!RTE) return;

  // const Rate = createRateRTE(RTE)
  // const RemoveHeadingMargin = removeHeadingMargin(RTE);
  const SetFontColor = setFontColor(RTE);
  const SetFontSize = setFontSize(RTE);
  const SetFontWeight = setFontWeight(RTE);
  const Cloudinary = cloudinary(RTE);
  const InsertBoilerplate = insertBoilerplate(RTE);
  const InsertUniCH = insertUniCH(RTE);
  const Highlight = highlight(RTE)
  // const Vimeo = vimeo(RTE);
  const Nofollow = nofollow(RTE)
  const Html = html(RTE)
  const GetEntryValue = getEntryValue(RTE);

  // Rate.addPlugins(RemoveHeadingMargin, Cloudinary);

  return {
    // Rate,
    // RemoveHeadingMargin,
    InsertBoilerplate,
    SetFontColor,
    SetFontSize,
    SetFontWeight,
    InsertUniCH,
    Highlight,
    // Vimeo,
    Nofollow,
    Html
  };
});