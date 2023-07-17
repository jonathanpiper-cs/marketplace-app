import React, { useEffect, useState } from "react";
import localeTexts from "../../common/locales/en-us/index";
import parse from "html-react-parser";
import ContentstackAppSDK from "@contentstack/app-sdk";
import { useCustomField } from "../../common/hooks/useCustomField";
import {
  Icon,
  Button,
  Select,
  Checkbox,
  Accordion,
  Form,
  Field,
  FieldLabel,
  Help,
  ValidationMessage,
  TextInput,
  InstructionText,
} from "@contentstack/venus-components";
import "@contentstack/venus-components/build/main.css";
import { isEmpty } from "lodash";

const Ajv = require("ajv");
const ajv = new Ajv({ removeAddition: true });
const jsonSchemaGenerator = require("json-schema-generator");

const BCCTA = () => {
  // const { customField, setFieldData }: any = useCustomField();
  const [endpoint, setEndpoint] = useState("");
  const [headers, setHeaders] = useState({});
  const [catchallData, setCatchallData] = useState<any>();
  // const [catchallSchema, setCatchallSchema] = useState<any>({});
  const [fetching, setFetching] = useState(false);
  const [customField, setCustomField] = useState<any>();
  // const [schemaSavedToEntry, setSchemaSavedToEntry] = useState(false);
  const [unsaved, setUnsaved] = useState(false);

  const fetchEndpoint = async () => {
    setFetching(true);
    setUnsaved(true);
    const response = await fetch(endpoint, { headers });
    const json = await response.json();
    console.log(json);
    setCatchallData(json);
  };

  useEffect(() => {
    ContentstackAppSDK.init().then(async (appSDK: any) => {
      const customFieldObject = await appSDK.location.CustomField;
      setCustomField(customFieldObject);
      var fieldData = await customFieldObject.field.getData();
      const fieldConfig = await customFieldObject.fieldConfig;
      setEndpoint(fieldConfig?.endpoint);
      setHeaders(fieldConfig?.headers);
      customFieldObject.frame.enableResizing();
      customFieldObject.frame.updateHeight(800);
      if (!isEmpty(fieldData) && fieldData !== null) {
        // if (fieldData.catchallSchema) {
        //     setSchemaSavedToEntry(true);
        //     setCatchallSchema(fieldData.catchallSchema);
        // }
        if (fieldData.catchallData) {
          setCatchallData(fieldData.catchallData);
        }
      }
    });
  }, []);


  const saveDataToField = async () => {
    customField.field.setData({
      // catchallSchema: catchallSchema,
      catchallData: catchallData,
    });
    setFetching(false);
    setUnsaved(false);
  };

  return (
    <div className="custom-field">
      <div className="bc-cta">
        <Form>
          <Field>
            <FieldLabel htmlFor="cta-title">Title:</FieldLabel>
            <TextInput type="text" id="cta-title" name="cta-title" />
          </Field>
          <Field>
            <FieldLabel htmlFor="cta-target">Target URL:</FieldLabel>
            <TextInput type="text" id="cta-target" name="cta-target" />
          </Field>
          <Select
            selectLabel={"Style"}
            onChange={() => {}}
            options={[
              {
                id: 0,
                label: "Brand",
                searchableLabel: "Brand",
                value: "brand",
              },
              {
                id: 1,
                label: "Dark",
                searchableLabel: "Dark",
                value: "dark",
              },
            ]}
            value={null}
          />
          <Button onClick={saveDataToField}>Save</Button>
        </Form>
      </div>
    </div>
  );
};

export default BCCTA;
