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
  const [availableCategories, setAvailableCategories] = useState<any>();
  const [field, setCF] = useState<any>();

  useEffect(() => {
    ContentstackAppSDK.init().then(async (appSDK: any) => {
      const cF = await appSDK.location.CustomField;
      setCF(cF);
      try {
        const req = await fetch("http://localhost:3001/api/products");
        const res = await req.json();
        setAvailableCategories(res.products?.categories);
      } catch {
        setErrorMessage(`Couldn't find categories listing.`);
      }
      if (!isEmpty(customField) && customField !== null) {
        setSelectOption({ ...customField });
      }
      cF.frame.updateHeight(200);
    });
  }, [customField]);

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
      field.frame.updateHeight(300);
    } else {
      field.frame.updateHeight(200);
    }
  };

  return (
    <div onClick={(e) => adjustHeight(e)}>
      {availableCategories ? (
        <Select
          width="300px"
          selectLabel="Select a category"
          options={availableCategories.map((c: any, index: number) => ({
            id: index,
            label: `${c.title.substring(0, 1).toUpperCase()}${c.title.substring(1)}`,
            searchableLable: c.title,
            value: c.title,
          }))}
          onChange={(e: any) => setSelectOption(e)}
          value={selectOption}
        />
      ) : (
        <></>
      )}
    </div>
  );
};

export default CustomFieldExtension;
