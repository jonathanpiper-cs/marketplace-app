// Fetch attributes from localhost:3001

import { Select } from "@contentstack/venus-components";
import ContentstackAppSDK from "@contentstack/app-sdk";
import { useCustomField } from "../../common/hooks/useCustomField";
import "@contentstack/venus-components/build/main.css";
import { useState, useEffect } from "react";
import { isEmpty } from "lodash";

const CustomFieldExtension = () => {
  const { customField, setFieldData }: any = useCustomField();
  const [errorMessage, setErrorMessage] = useState<any>();
  const [selectOption, setSelectOption] = useState<any>();
  const [availableAttributes, setAvailableAttributes] = useState<any>();
  const [field, setCF] = useState<any>();

  useEffect(() => {
    ContentstackAppSDK.init().then(async (appSDK: any) => {
      const cF = await appSDK.location.CustomField;
      setCF(cF);
      await loadAttributes();
      if (!isEmpty(customField) && customField !== null) {
        setSelectOption({ ...customField });
      }
      cF.frame.updateHeight(200);
    });
  }, [customField]);

  const loadAttributes = async () => {
    console.log(field);
    if (field) {
      const parentTableIndex = field.field.schema.$uid.split(".")[1];
      const entry = field.entry._data;
      console.log(entry.table[parentTableIndex]);
      if (!entry.table[parentTableIndex] || !entry.table[parentTableIndex].hasOwnProperty("category")) {
        setErrorMessage("Category has not been set or saved. Click to retry.");
        return;
      } else {
        setErrorMessage(null);
      }
      const category = entry.table[parentTableIndex].category.value;
      console.log(category);
      try {
        const req = await fetch("http://localhost:3001/api/products");
        const res = await req.json();
        const attributes = res.products?.categories.filter((c: any) => c.title === category)[0].attributes;
        setAvailableAttributes(attributes);
      } catch {
        setErrorMessage(`Couldn't find categories listing.`);
      }
    }
  };

  useEffect(() => {
    try {
      setFieldData(selectOption);
    } catch (err) {
      console.log(err);
    }
    console.log(selectOption);
  }, [selectOption]);

  const adjustHeight = (e: any) => {
    const target = e.target;
    if (target.hasAttribute("id")) {
      field.frame.updateHeight(200);
    } else {
      field.frame.updateHeight(400);
    }
  };

  return (
    <div>
      {errorMessage ? (
        <p onClick={loadAttributes}>{errorMessage}</p>
      ) : availableAttributes ? (
        <div onClick={(e) => adjustHeight(e)}>
          <Select
            width="300px"
            selectLabel="Select an attribute"
            options={availableAttributes.map((attr: any, index: number) => ({
              id: index,
              label: attr.title,
              searchableLabel: attr.shortCode,
              value: attr.shortCode,
            }))}
            onChange={(e: any) => setSelectOption(e)}
            value={selectOption}
          />
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default CustomFieldExtension;
