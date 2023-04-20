import React, { useEffect, useState } from 'react';
import ContentstackAppSDK from "@contentstack/app-sdk";
import { Icon, Button, Select, Checkbox, Accordion } from "@contentstack/venus-components";
import '@contentstack/venus-components/build/main.css';
import { isEmpty } from "lodash";

const CatchAll = () => {

    const [endpoint, setEndpoint] = useState('');
    const [headers, setHeaders] = useState({});
    const [catchallData, setCatchallData] = useState<any>();
    const [fetching, setFetching] = useState(false);
    const [customField, setCustomField] = useState<any>();
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
                if (fieldData.catchallData) {
                    setCatchallData(fieldData.catchallData);
                }
            }
        })
    }, []);

    const saveDataToField = async () => {
        customField.field.setData({
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

    const RenderObj = (props: any) => {
        return (
            <div>
                {catchallData ? (<p>The endpoint returned:</p>) : ('')}
                {RecursiveRender(props.obj)}
            </div>
        )
    }

    return (
        <div className="custom-field">
            <div className="custom-field-container">
                <div className="catchall-header">
                    <h6>API Catchall Endpoint:</h6>
                    <div className="catchall-action">
                        <p>{endpoint}</p>
                        <Button buttonType="secondary" icon='Reload' onClick={fetchEndpoint}>Load</Button>
                    </div>
                </div>
                <div className="catchall-body">
                    <div className="catchall-entries">
                        <RenderObj obj={catchallData} />
                    </div>
                    <div className="catchall-bigbutton">
                        <Button disabled={!unsaved} icon={'SaveWhite'} size={'large'} onClick={saveDataToField}>Save this data to field?</Button>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default CatchAll;
