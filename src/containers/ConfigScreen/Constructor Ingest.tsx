import React, { useEffect, useState, useRef } from "react";
import localeTexts from "../../common/locales/en-us/index";
import parse from "html-react-parser";
import ContentstackAppSDK from "@contentstack/app-sdk";
import { Button } from "@contentstack/venus-components";
import Extension from "@contentstack/app-sdk/dist/src/extension";
import { IInstallationData, ValidationOptions } from "@contentstack/app-sdk/dist/src/types";

const ConstructorIngest = () => {
  const [endpoint, setEndpoint] = useState(
    "https://ac.cnstrc.com/search/?key=key_FNlcaUSzF3ulbjoM&fmt_options[fields]="
  );
  const [headers, setHeaders] = useState({});
  const [constructorData, setConstructorData] = useState<any>();
  const [constructorGroups, setConstructorGroups] = useState<any>();
  const [fetching, setFetching] = useState(false);
  const [customField, setCustomField] = useState<any>();
  const [unsaved, setUnsaved] = useState(false);
  const [sdk, setSdk] = useState<any>();
  // const [appConfig, setAppConfig] = useState<any>();
  const appConfig = useRef<{
    setInstallationData: (installationData: IInstallationData) => Promise<{ [key: string]: string }>;
    getInstallationData: () => Promise<IInstallationData>;
    setValidity: (isValid: boolean, options?: ValidationOptions | undefined) => void;
  } | null>(null);

  const fetchEndpoint = async () => {
    console.log(`Fetching groups from Contructor.io endpoint`);
    setFetching(true);
    setUnsaved(true);
    const response = await fetch(endpoint, { headers });
    const json = await response.json();
    console.log(json);
    setConstructorData(json.response);
    setConstructorGroups(
      json.response.groups[0].children.map((g: any) => {
        return g.display_name;
      })
    );
  };

  useEffect(() => {
    async function getAppConfiguration() {
      if (appConfig.current) {
        const config = await appConfig.current.getInstallationData();
        if (config.configuration?.constructorGroups && config.configuration?.constructorGroups.length > 0) {
          setConstructorGroups(config.configuration.constructorGroups);
        }
        console.log(config);
      }
    }
    ContentstackAppSDK.init()
      .then(async (appSdk) => {
        appConfig.current = appSdk.location.AppConfigWidget?.installation || null;
        setSdk(appSdk);
      })
      .then(() => getAppConfiguration());
  }, []);

  useEffect(() => {
    if (appConfig.current) {
      appConfig.current.setInstallationData({ configuration: { constructorGroups }, serverConfiguration: {} });
    }
  }, [appConfig, constructorGroups]);

  return (
    <div className="app-config">
      <div className="app-config-container">
        <div className="constructor-cats-config">
          <Button buttonType="primary" onClick={fetchEndpoint}>
            Fetch groups
          </Button>
          {typeof constructorGroups === "object" && Object.keys(constructorGroups).length > 0 ? (
            <div>
              <ul>
                {constructorGroups.map((group: any, key: any) => {
                  return <li key={key}>{group}</li>;
                })}
              </ul>
              <p>Click Save below to save these categories</p>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
};

export default ConstructorIngest;
