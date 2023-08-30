import React from "react";
import ContentstackSDK from "@contentstack/app-sdk";
import { removeHeadingMargin } from "./removeheadingmargin";
import { setFontColor } from "./setfontcolor";
import { setFontSize } from "./setfontsize";
import { setFontWeight } from "./setfontweight";
import { insertBoilerplate } from "./boilerplate";
import { insertUniCH } from "./unicode";
import { highlight } from "./highlight";
import { addWidth } from "./addWidth";

import { html } from "./html";

import { nofollow } from "./nofollow";

export default ContentstackSDK.init().then(async (sdk) => {
  const extensionObj = await sdk["location"];
  console.log(extensionObj)
  const RTE = await extensionObj["RTEPlugin"];
  if (!RTE) return;

  // const Nofollow = nofollow(RTE);
  const AddWidth = addWidth(RTE);
  const SetFontWeight = setFontWeight(RTE);

  return {
    SetFontWeight,
    AddWidth
  }
});

  // const Rate = createRateRTE(RTE)
  // const RemoveHeadingMargin = removeHeadingMargin(RTE);
  // const SetFontColor = setFontColor(RTE);
  // const SetFontSize = setFontSize(RTE);
  // const SetFontWeight = setFontWeight(RTE);
  // const InsertBoilerplate = insertBoilerplate(RTE);
  // const InsertUniCH = insertUniCH(RTE);
  // const Highlight = highlight(RTE)
  // const Nofollow = nofollow(RTE)
  // const Html = html(RTE)

  // const AddWidth = addWidth(RTE);

  // Rate.addPlugins(RemoveHeadingMargin, Cloudinary);



  // return {
  //   InsertBoilerplate,
  //   SetFontColor,
  //   SetFontSize,
  //   SetFontWeight,
  //   InsertUniCH,
  //   Highlight,
  //   Nofollow,
  //   Html
  // };