//@ts-nocheck

import { Icon, Dropdown } from "@contentstack/venus-components";
import React from "react";

const UniCHComponent = (props) => {
    const { leaf } = props;
    console.log(leaf.highlight)
    return (
        <span {...props.attributes} style={{ backgroundColor: '#FF0000', fontSize: leaf['highlight'] }}>
            {props.children}
        </span>
    );
};

export const highlight = (RTE) => {
    const Highlight = RTE('highlight', () => ({
        title: 'Highlight',
        icon: <Icon style={{ padding: '0 6px' }} icon="Edit" size="original" />,
        render: (props: any) => {
            return <span style={{ background: 'rgba(251, 243, 219, 1)', fontSize: props.leaf['highlight']}}>{props.children}</span>
        },
        displayOn: ['toolbar'],
        elementType: ['text']
    }));

    Highlight.on('exec', (rte) => {
        if (!window.rte) {
            window.rte = rte;
        }
        rte.addMark('highlight', 40);
        console.log(rte.getVariable('boilerplateSet'))
    })

    return Highlight;
};