//@ts-nocheck

import { Icon, Dropdown } from "@contentstack/venus-components";
import React from "react";

const UniCHComponent = (props) => {
    const { leaf } = props;
    return (
        <span {...props.attributes} style={{ backgroundColor: '#FF0000' }}>
            {props.children}
        </span>
    );
};

export const highlight = (RTE) => {
    const Highlight = RTE('highlight', () => ({
        title: 'Highlight',
        icon: <Icon style={{ padding: '0 6px' }} icon="Edit" size="original" />,
        render: (props: any) => {
            return <span style={{ background: 'rgba(251, 243, 219, 1)' }}>{props.children}</span>
        },
        displayOn: ['toolbar'],
        elementType: ['text']
    }));

    return Highlight;
};