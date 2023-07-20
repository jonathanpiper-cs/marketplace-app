import { Icon, Dropdown } from "@contentstack/venus-components";
import React from "react";

const FONT_WEIGHTS = [
    { weight: 'Default' },
    { weight: 100 },
    { weight: 300 },
    { weight: 400 },
    { weight: 500 },
    { weight: 700 },
    { weight: 900 },
]

declare global {
    interface Window {
        rte: any;
    }
}

interface FontComponentProps {
    attributes: any;
    children: React.ReactNode;
    leaf: {
        'font-weight': string;
    };
}

const FontComponent: React.FC<FontComponentProps> = (props) => {
    const { leaf } = props;
    return (
        <span {...props.attributes} style={{ fontWeight: leaf['font-weight'] }}>
            {props.children}
        </span>
    );
};

export const setFontWeight = (RTE: any) => {
    const FontWeight = RTE('font-weight', () => ({
        title: 'Set Font Weight',
        icon: <FCIcon />,
        render: (props: any) => {
            return <FontComponent {...props} />;
        },
        display: ['toolbar'],
        elementType: ['text'],
    }));

    FontWeight.on('exec', (rte: any) => {
        if (!window.rte) {
            window.rte = rte;
        }
    });

    return FontWeight;
};

const list = FONT_WEIGHTS.map((weight) => ({
    label: (
        <span style={{ fontWeight: weight.weight.toString() + 'px' }}>
            {weight.weight}
        </span>
    ),
    value: weight.weight,
    showAsActive: true,
    action: () => {
        const { rte } = window;
        if (weight.weight === 'Default') {
            rte.removeMark('font-weight')
        } else {
            rte.addMark('font-weight', weight.weight);
        }
    },
}));

const FCIcon: React.FC = () => {
    return (
        <Dropdown list={list} type={'click'} highlightActive={true}>
            <Icon style={{ padding: '0 6px' }} icon="Bold" fill="blue" size="original" />
        </Dropdown>
    );
};