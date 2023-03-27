import React, { useEffect, useState } from 'react';
import localeTexts from "../../common/locales/en-us/index";
import parse from "html-react-parser";
import ContentstackAppSDK from "@contentstack/app-sdk";
import { useCustomField } from "../../common/hooks/useCustomField";
import { Select, Paragraph } from "@contentstack/venus-components";
import '@contentstack/venus-components/build/main.css';
import { isEmpty } from "lodash";

const LocalizedDropdown = () => {

    const [selectOption, setSelectOption] = useState<any>();
    const OPTIONS_UID = 'localized_dropdown_options'

    const [localizationOptions, setLocalizationOptions] = useState<any>();
    const { customField, setFieldData }: any = useCustomField();
    const [errorMessage, setErrorMessage] = useState<any>();

    useEffect(() => {
        ContentstackAppSDK.init().then(async (appSDK: any) => {
            const cF = await appSDK.location.CustomField;
            const stack = cF.stack;
            const entry = cF.entry;
            let localizationOptionsUID: any;
            try {
                localizationOptionsUID = entry._data.localization_options[0].uid;
                await stack.ContentType(OPTIONS_UID).Entry(localizationOptionsUID).language(entry.locale).fetch().then((options: any) => {
                    setLocalizationOptions(options.entry.localization_options.option)
                });
            } catch {
                setErrorMessage(`Couldn't find referenced localization options.`);
            }
            if (!isEmpty(customField) && customField !== null) {
                setSelectOption({ ...customField });
            }
            cF.frame.updateHeight(200);
        })
    }, [customField]);

    useEffect(() => {
        setFieldData(selectOption)
    }, [selectOption])

    return (
        <div className="custom-field">
            <div className="localizable-dropdown-container">
                {errorMessage ? (
                    <Paragraph text={errorMessage} />
                ) : (
                    (localizationOptions !== undefined && localizationOptions.length > 0 ? (
                        <div>
                            <Select
                                selectLabel="Select an option"
                                options={localizationOptions.map((entry: any, index: number) => (
                                    {
                                        id: index,
                                        label: entry.option_text,
                                        searchableLable: entry.option_text,
                                        value: entry.option_value
                                    }
                                ))}
                                onChange={(e: any) => setSelectOption(e)}
                                value={selectOption}
                            />

                        </div>
                    ) : (
                        <Paragraph text={`Loading`} />
                    ))
                )}

            </div>
        </div>
    );
};

export default LocalizedDropdown;
