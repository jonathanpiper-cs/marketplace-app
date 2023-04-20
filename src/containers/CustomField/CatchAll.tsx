import React, { useEffect, useState } from 'react';
import localeTexts from "../../common/locales/en-us/index";
import parse from "html-react-parser";
import ContentstackAppSDK from "@contentstack/app-sdk";
import { useCustomField } from "../../common/hooks/useCustomField";
import { Icon, Button, Select, Checkbox, Accordion } from "@contentstack/venus-components";
import '@contentstack/venus-components/build/main.css';
import { isEmpty } from "lodash";

const Ajv = require('ajv');
const ajv = new Ajv({ removeAddition: true });
const jsonSchemaGenerator = require('json-schema-generator');

const CatchAll = () => {

    // const { customField, setFieldData }: any = useCustomField();
    const [endpoint, setEndpoint] = useState('');
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
        setCatchallData(json.data);
    }

    useEffect(() => {
        ContentstackAppSDK.init().then(async (appSDK: any) => {
            const customFieldObject = await appSDK.location.CustomField;
            setCustomField(customFieldObject);
            var fieldData = await customFieldObject.field.getData()
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
        })
    }, []);

    // const saveSchema = async () => {
    //     const jsonSchema = jsonSchemaGenerator(catchallData)
    //     delete jsonSchema.$schema;
    //     setCatchallSchema(jsonSchema);
    // }

    // const saveSchemaToField = async () => {
    //     customField.field.setData({
    //         catchallSchema: catchallSchema,
    //         catchallData: catchallData
    //     })
    //     setFetching(false);
    //     setSchemaSavedToEntry(true);
    // }

    const saveDataToField = async () => {
        customField.field.setData({
            // catchallSchema: catchallSchema,
            catchallData: catchallData
        })
        setFetching(false);
        setUnsaved(false);
    }

    const RecursiveRender = (obj: any, level: number = 0, path: any[] = []): any => {
        if (Array.isArray(obj)) {
            obj = obj.find(x => x !== undefined);
        }
        return (
            (typeof obj === 'object') ? (
                <ul>
                    {Object.keys(obj).map((key, index) => {
                        while (path.length > level) {
                            path.pop();
                        }
                        path[level] = key;
                        return (
                            <li data-key={String(path)} key={key}>
                                <p id={String([...path])}>{`${key} ${typeof obj[key] !== 'object' ? '(' + String(obj[key]).substring(0, 60) + (String(obj[key].length > 60 ? '...' : '')) + ')' : ''}`}</p>
                                {RecursiveRender(obj[key], level + 1, path)}
                            </li>
                        )
                    })}
                </ul>
            ) : (
                <></>
            )
        )
    }

    // const RecursiveRenderSchema = (obj: any, level: number = 0): any => {
    //     return (
    //         <ul>
    //             {typeof obj === 'object' ? (
    //                 Object.keys(obj).map((key, index) => {
    //                     console.log(obj[key])
    //                     return (
    //                         <li key={key}>{`${key} (${obj[key].type})`}
    //                             {
    //                                 obj[key].type === 'array' ? (RecursiveRenderSchema(obj[key].items.properties, level + 1)) :
    //                                     (obj[key].type === 'object' ? (RecursiveRenderSchema(obj[key].properties, level + 1)) : '')
    //                             }
    //                         </li>
    //                     )
    //                 })
    //             ) : ('')}
    //         </ul>
    //     )
    // }

    // const RecursiveRenderThroughSchema = (obj: any, level: number = 0, arrayName: string = ''): any => {
    //     return (
    //         (typeof obj === 'object') ? (
    //             Object.keys(obj).map((key, index) => {
    //                 if (!Number(key)) {
    //                     if (typeof obj[key] === 'object') {
    //                         return (
    //                             <Accordion
    //                                 renderExpanded={index === 0}
    //                                 title={Array.isArray(obj) ? (`${arrayName} entry #${index + 1}`) : (key)}>
    //                                 <p>{Array.isArray(obj) ? ('') : (
    //                                     typeof obj[key] === 'object' ? ('')
    //                                         : (
    //                                             key + ': ' + obj[key]
    //                                         )
    //                                 )}</p>
    //                                 {RecursiveRenderThroughSchema(obj[key], level + 1, key)}
    //                             </Accordion>
    //                         )
    //                     } else {
    //                         return (
    //                             <div>
    //                                 <p>{key}: {obj[key]}</p>
    //                                 {RecursiveRenderThroughSchema(obj[key], level + 1)}
    //                             </div>
    //                         )
    //                     }
    //                 } else {
    //                     { RecursiveRenderThroughSchema(obj[key], level + 1) }
    //                 }
    //             })
    //         ) : (
    //             <></>
    //         )
    //     )
    // }

    const RenderObj = (props: any) => {
        return (
            <div>
                {catchallData ? (<p>The endpoint returned:</p>) : ('')}
                {RecursiveRender(props.obj)}
            </div>
        )
    }

    // const RenderSchema = (props: any) => {
    //     return (
    //         <div>
    //             {catchallData ? (<p>The returned data can be defined by this schema:</p>) : ('')}
    //             {RecursiveRenderSchema(props.obj)}
    //         </div>
    //     )
    // }

    // const RenderBySchema = (props: any) => {
    //     const data = props.obj;
    //     let valid;
    //     if (catchallSchema) {
    //         const validate = ajv.compile(catchallSchema);
    //         valid = validate(data);
    //         if (!valid) {
    //             console.log(validate.errors)
    //         } else {
    //             setCatchallData(data);
    //         }
    //     }
    //     return (
    //         <div>
    //             {!valid ? (
    //                 <p>The data fetched from the endpoint didn't conform to the defined schema.</p>
    //             ) : (catchallData ? (
    //                 <h6>Fetched data:</h6>
    //             ) : (<div />)
    //             )}
    //             {RecursiveRenderThroughSchema(props.obj)}
    //         </div >
    //     )
    // }

    return (
        <div className="custom-field">
            <div className="custom-field-container">
                <div className="catchall-header">
                    {/* {schemaSavedToEntry ? (
                        <div>
                            <p>A schema has already been saved to the custom field.</p>
                        </div>
                    ) : (<div />)} */}
                    <h6>API Catchall Endpoint:</h6>
                    <div className="catchall-action">
                        <p>{endpoint}</p>
                        <Button buttonType="secondary" icon='Reload' onClick={fetchEndpoint}>Load</Button>
                    </div>
                </div>
                {/* {schemaSavedToEntry ? (
                    <div className="catchall-body">
                        <div className="catchall-rendered">
                            <RenderBySchema obj={catchallData} />
                        </div>
                        <div className="catchall-bigbutton">
                            <Button disabled={!unsaved} icon={'SaveWhite'} size={'large'} onClick={saveDataToField}>Save this data to field?</Button>
                        </div>
                    </div>
                ) : ( */}
                    <div className="catchall-body">
                        <div className="catchall-entries">
                            <RenderObj obj={catchallData} />
                        </div>
                        <div className="catchall-bigbutton">
                            <Button disabled={!unsaved} icon={'SaveWhite'} size={'large'} onClick={saveDataToField}>Save this data to field?</Button>
                        </div>
                        {/* <div className="catchall-savebutton">
                            {fetching ? (
                                <Button size="small" buttonType="secondary" onClick={saveSchema}>Create schema?</Button>
                            ) : (<div />)}
                        </div>
                        {(Object.keys(catchallSchema).length > 0) ? (
                            <div className="catchall-schema">
                                <RenderSchema obj={catchallSchema?.items?.properties} />
                            </div>
                        ) : (<div />)}
                        {((Object.keys(catchallSchema).length > 0) && fetching) ? (
                            <div className="catchall-bigbutton">
                                <Button icon={'SaveWhite'} size={'large'} onClick={saveSchemaToField}>Save this schema to field?</Button>
                            </div>) : (<div />)} */}
                    </div>
                {/* )} */}
            </div>
        </div >
    );
};

export default CatchAll;
