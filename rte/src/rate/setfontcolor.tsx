import { Icon, Dropdown } from "@contentstack/venus-components";
import React from "react";

const COLORS = [
    { name: 'Blue', color: 'rgb(30,144,255)' },
    { name: 'Orange', color: 'rgb(255,127,80)' },
    { name: 'Green', color: 'rgb(34,139,34)' },
    { name: 'Purple', color: 'rgb(138,43,226)' },
    { name: 'Default', color: '' },
]

declare global {
    interface Window {
        rte: any;
    }
}

interface ColorComponentProps {
    attributes: any;
    children: React.ReactNode;
    leaf: {
        'font-color': string;
    };
}

const ColorComponent: React.FC<ColorComponentProps> = (props) => {
    const { leaf } = props;
    return (
        <span {...props.attributes} style={{ color: leaf['font-color'] }}>
            {props.children}
        </span>
    );
};

export const setFontColor = (RTE: any) => {
    const FontColor = RTE('font-color', () => ({
        title: 'Set Font Color',
        icon: <FCIcon />,
        render: (props: any) => {
            return <ColorComponent {...props} />;
        },
        display: ['toolbar'],
        elementType: ['text'],
    }));

    FontColor.on('exec', (rte: any) => {
        if (!window.rte) {
            window.rte = rte;
        }
    });

    return FontColor;
};

const list = COLORS.map((color) => ({
    label: (
        <span style={{ color: color.color }}>
            {color.name}
        </span>
    ),
    value: color.color,
    showAsActive: true,
    action: () => {
        const { rte } = window;
        if (color.name === 'Default') {
            rte.removeMark('font-color')
        } else {
            console.log(color.color)
            rte.addMark('font-color', color.color);
        }
    },
}));

const FCIcon: React.FC = () => {
    return (
        <Dropdown list={list} type={'click'} highlightActive={true}>
            <Icon style={{ padding: '0 6px' }} icon="Edit" fill="blue" size="original" />
        </Dropdown>
    );
};