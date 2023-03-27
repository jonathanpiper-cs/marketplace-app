import { Icon } from "@contentstack/venus-components";
import React from "react";

export const createRateRTE = (RTE: any) => {

    const R: any = (props: any) => {
        console.log(props);
        return (<span>{props.children}</span>);
    }

    const Rate = RTE('plugins', () => ({
        title: 'Plugins',
        icon: <Icon style={{ padding: '0 6px' }} icon="Edit" size="original" />,
        render: (props: any) => {<span>{props.children}</span>},
        displayOn: ['toolbar'],
        elementType: ['text']
    }));

    return Rate;
}