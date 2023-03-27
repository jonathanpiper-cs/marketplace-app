import { Icon, Dropdown } from "@contentstack/venus-components";
import React from "react";

const FONT_SIZES = [
    { size: 'Default' },
    { size: 12 },
    { size: 14 },
    { size: 16 },
    { size: 20 },
    { size: 24 },
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
        'font-size': string;
    };
}

const FontComponent: React.FC<FontComponentProps> = (props) => {
    const { leaf } = props;
    console.log(leaf)
    return (
        <span {...props.attributes} style={{ fontSize: leaf['font-size'] }}>
            {props.children}
        </span>
    );
};

export const setFontSize = (RTE: any) => {
    const FontSize = RTE('font-size', () => ({
        title: 'Set Font Size',
        icon: <FCIcon />,
        render: (props: any) => {
            return <FontComponent {...props} />;
        },
        display: ['toolbar'],
        elementType: ['text'],
    }));

    FontSize.on('exec', (rte: any) => {
        if (!window.rte) {
            window.rte = rte;
        }
    });

    return FontSize;
};

const list = FONT_SIZES.map((size) => ({
    label: (
        <span style={{ fontSize: size.size.toString() + 'px' }}>
            {size.size}
        </span>
    ),
    value: size.size,
    showAsActive: true,
    action: () => {
        const { rte } = window;
        if (size.size === 'Default') {
            rte.removeMark('font-size')
        } else {
            rte.addMark('font-size', size.size);
        }
    },
}));

console.log(list)

const FCIcon: React.FC = () => {
    return (
        <Dropdown list={list} type={'click'} highlightActive={true}>
            <Icon style={{ padding: '0 6px' }} icon="ExpandArrow" size="original" />
        </Dropdown>
    );
};