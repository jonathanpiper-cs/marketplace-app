import Icon from "../../assets/customfield.svg";
import React, { useEffect, useState } from 'react';
import localeTexts from "../../common/locales/en-us/index";
import parse from "html-react-parser";
import ContentstackAppSDK from "@contentstack/app-sdk";
import { useCustomField } from "../../common/hooks/useCustomField";
import { Select } from "@contentstack/venus-components";
import '@contentstack/venus-components/build/main.css';
import { isEmpty } from "lodash";

interface DropdownValues {
    Values: Value[],
    Default: number
}

interface Value {
    [key: string]: number
}

interface SelectOption {
    id?: number,
    label?: string,
    searchableLable?: string,
    value?: number
}

const Dropdown = () => {

    let datapointer: number;
    const { fieldData, setFieldData }: any = useCustomField();
    const [fieldConfig, setFieldConfig] = useState<DropdownValues>({
        Values: [],
        Default: 0
    });
    const [fieldValues, setFieldValues] = useState<Value[]>([]);
    const [fieldSelectValue, setFieldSelectValue] = useState<SelectOption>({});

    useEffect(() => {
        ContentstackAppSDK.init().then(async (appSDK: any) => {
            const customField = await appSDK.location.CustomField;
            setFieldConfig(customField.fieldConfig);
            customField.frame.updateHeight(400);
            datapointer = await customField.field.getData();
            if (!isEmpty(fieldData) && fieldData !== null) {
				setFieldData(fieldData)
			} else {
                setFieldData(fieldConfig.Default);
            };
        })
    }, []);

    // useEffect(() => {
    //     const obj: SelectOption = {
    //         id: datapointer,
    //         label: fieldValues.filter(val)
    //     }
    // })

    useEffect(() => {
        const values = fieldConfig.Values;
        setFieldValues(values);
    }, [fieldConfig]);

    useEffect(() => {
        console.log(fieldSelectValue.value)
        setFieldData(fieldSelectValue.value)
    }, [fieldSelectValue])

    return (
        <div className="custom-field">
            <div className="custom-field-container">
                {fieldValues?.length > 0 ? (
                    <Select
                        selectLabel="Select an option"
                        options={fieldValues.map((value, index) => (
                            {
                                id: index,
                                label: Object.keys(value)[0],
                                searchableLable: Object.keys(value)[0],
                                value: value[Object.keys(value)[0]]
                            }
                        ))}
                        onChange={(e: any) => setFieldSelectValue(e)}
                        value={fieldSelectValue}
                    />
                ) : (
                    <p>derp</p>
                )}
            </div>
        </div>
    );
};

export default Dropdown;
