import { useEffect, useState } from "react";
import { Paragraph, Heading, Button, AsyncLoader } from "@contentstack/venus-components";
import OpenAI from "openai";
import ContentstackAppSDK from "@contentstack/app-sdk";
import { useAppConfig } from "../../common/hooks/useAppConfig";
import "./AssetSidebar.css";

const EntrySidebarExtension = () => {
  async function getSingleEntry(entryUid: string, contentTypeUid: string) {
    const request = await fetch(`https://api.contentstack.io/v3/content_types/${contentTypeUid}/entries/${entryUid}`, {
      headers: headers,
    });
    const response = await request.json();
    return response.entry;
  }

  async function getParentEntryDescription(assetUid: string) {
    console.log("getting parent entry");
    const request = await fetch(`https://api.contentstack.io/v3/assets/${assetUid}/references?include_count=true`, {
      headers: headers,
    });
    const response = await request.json();
    if (response.count === 1) {
      const entry = await getSingleEntry(response.references[0].entry_uid, response.references[0].content_type_uid);
      if (entry?.description) {
        setParentDescription(entry.description);
        return entry.description;
      } else {
        return "None";
      }
    } else {
      return "None";
    }
  }

  const headers = {
    api_key: process.env.REACT_APP_API_KEY || "",
    authorization: process.env.REACT_APP_MANAGEMENT_TOKEN || "",
    "Content-Type": "application/json",
  };

  async function openAIGenerate(imageURL: string, description: string) {
    if (openai) {
      const response = await openai.chat.completions.create({
        model: "gpt-4-vision-preview",
        max_tokens: 999,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image_url",
                image_url: {
                  url: imageURL,
                },
              },
              {
                type: "text",
                text: `Start with the output from the previous step. Rewrite that in the context of this product description: ${description}. Turn that into alt text for an accessible-friendly and SEO-driven website with a maximum character count of 255. Remove quotation marks from your response`,
              },
            ],
          },
        ],
      });
      console.log(response);
      return response.choices[0].message.content as string;
    } else {
      return "null";
    }
  }
  const appConfig = useAppConfig();
  const [asset, setAsset] = useState<any>();
  const [generatedAltText, setGeneratedAltText] = useState<string>("");
  const [count, setCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [sidebar, setSidebar] = useState<any>();
  const [openai, setOpenai] = useState<any>();
  const [unsavedChanges, setUnsavedChanges] = useState<boolean>(false);
  const [parentDescription, setParentDescription] = useState<string>("");

  async function saveAltText() {
    sidebar.setData({ description: generatedAltText });
    setUnsavedChanges(true);
  }

  useEffect(() => {
    ContentstackAppSDK.init().then(async (appSDK: any) => {
      const sidebar = appSDK.location.AssetSidebarWidget;
      setSidebar(sidebar);
      setAsset(sidebar.getData());
      sidebar.updateWidth(400);
      sidebar.onSave(() => setUnsavedChanges(false));
      const metadata = await appSDK.metadata.retrieveMetaData({uid: "METADATA_UID"});
      console.log('metadata', metadata);
      appSDK.metadata.updateMetaData({uid: "METADATA_UID", thisValue: "changing this now!!"});
    });
  }, []);

  useEffect(() => {
    console.log(appConfig);
    setOpenai(
      new OpenAI({
        organization: appConfig?.openAIOrganization || "",
        apiKey: appConfig?.openAIAPIKey || "",
        dangerouslyAllowBrowser: true,
      })
    );
  }, [appConfig]);

  const generateAltText = async () => {
    setCount(count + 1);
    setIsLoading(true);
    const description = await getParentEntryDescription(asset.uid);
    const altText = await openAIGenerate(asset.url, description);
    setGeneratedAltText(altText);
    setIsLoading(false);
  };

  return (
    <div className="layout-container">
      <div className="ui-location-wrapper">
        <div className="ui-location">
          <div className="ui-container" style={{ marginTop: 20, marginBottom: 20 }}>
            <Heading tagName="h2" text="Alt Text POC" className="poc" />
            <Button buttonType="primary" onClick={generateAltText}>
              {count === 0 ? "Generate Alt Text" : "Retry"}
            </Button>
            {unsavedChanges ? (
              <Paragraph
                text={"You MUST save the asset using the button below to permanently save this alt text."}
                className="poc warning"
              />
            ) : (
              <></>
            )}
            {isLoading ? (
              <AsyncLoader className="CustomClass" color="#6C5CE7"></AsyncLoader>
            ) : (
              <>
                <Paragraph text={generatedAltText} className="poc" />
                {generatedAltText ? (
                  <Button buttonType="primary" onClick={saveAltText}>
                    Set Alt Text
                  </Button>
                ) : (
                  <></>
                )}
                {parentDescription ? (
                  <>
                    <Heading tagName="h3" text="Based on product description:" />
                    <Paragraph text={parentDescription} className="poc small-text" />
                  </>
                ) : (
                  <></>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EntrySidebarExtension;
