import React, { useEffect, useState } from "react";
import ContentstackAppSDK from "@contentstack/app-sdk";
import { useCustomField } from "../../common/hooks/useCustomField";
import { Icon, Button, Select, Checkbox, Accordion } from "@contentstack/venus-components";
import "@contentstack/venus-components/build/main.css";
import { isEmpty } from "lodash";

const ConstructorCats = () => {
  const [groups, setGroups] = useState<any>([]);
  const [customField, setCustomField] = useState<any>();
  const [config, setConfig] = useState<any>();

  useEffect(() => {
    ContentstackAppSDK.init().then(async (appSDK: any) => {
      setConfig(await appSDK.getConfig());
      if (config && Object.keys(config).length === 0) {
        console.log(`No configuration available`);
      }
      const customFieldObject = await appSDK.location.CustomField;
      setCustomField(customFieldObject);
      var fieldData = await customFieldObject.field.getData();
      const fieldConfig = await customFieldObject.fieldConfig;
      if (!isEmpty(fieldData) && fieldData !== null) {
        if (fieldData.constructorGroups) {
          setGroups(fieldData.constructorGroups);
        }
      }
    });
  }, []);

  const updateCheckbox = (e: any) => {
    if (e.target.checked && groups.indexOf(e.target.name) === -1) {
      setGroups([...groups, e.target.name]);
    } else {
      setGroups(groups.filter((g: string) => g !== e.target.name));
    }
  };

  useEffect(() => {
    customField?.field
    .setData({
      constructorGroups: groups,
    })
    .then(console.log(`Groups selected: ${groups.length > 0 ? groups : 'none'}`));
  }, [groups])

  const displayData = () => {
    console.log(groups);
  };

  return (
    <div className="custom-field">
      <div className="custom-field-container">
        {config ? (
          <div className="constructor-cats">
            <h6>Select at least one category below:</h6>
            <ul>
              {config.constructorGroups.map((cat: string, key: any) => {
                return (
                  <li key={key}>
                    <Checkbox isLabelFullWidth label={cat} name={cat} onChange={updateCheckbox} checked={groups?.indexOf(cat) !== -1} />
                  </li>
                );
              })}
            </ul>
            <Button onClick={displayData}>Print to console</Button>
          </div>
        ) : (
          <div><p>No configuration found.</p></div>
        )}
      </div>
    </div>
  );
};

export default ConstructorCats;
