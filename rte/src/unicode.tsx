import { Icon, Dropdown } from "@contentstack/venus-components";
import React from "react";

const UNI_CH = [
    { ch: 'NBSP', enc: '\u{00A0}' },
    { ch: 'NBH', enc: '\u2011' },
    { ch: 'SHY', enc: '\u00AD' },
]

declare global {
    interface Window {
        rte: any;
    }
}

interface UCP {
    attributes: any;
    children: React.ReactNode;
    leaf: {
        'uni_ch': boolean;
    }
}

const UniCHComponent: React.FC<UCP> = (props) => {
    const { leaf } = props;
    return (
        <span {...props.attributes} style={{backgroundColor: '#EEEEEE'}}>
            {props.children}
        </span>
    );
};

export const insertUniCH = (RTE: any) => {
    const UniCH = RTE('uni-ch', () => ({
        title: 'Insert Uni Character',
        icon: <FCIcon />,
        render: (props: any) => {
            return <UniCHComponent {...props} />;
        },
        display: ['toolbar'],
        elementType: ['inline'],
    }));

    UniCH.on('exec', (rte: any) => {
        if (!window.rte) {
            window.rte = rte;
        }
    });

    return UniCH;
};

const list = UNI_CH.map((ch) => ({
    label: (
        <span>
            {ch.ch}
        </span>
    ),
    value: ch.enc,
    showAsActive: false,
    action: () => {
        const { rte } = window;
        const { anchor } = rte.selection.get()
        // console.log(anchor)
        const focus = {
            offset: anchor.offset + 1,
            path: anchor.path
        }
        const selection = {
            anchor: anchor,
            focus: focus
        }
        rte.insertText(ch.enc)
        rte.selection.set(selection);
        rte.addMark('uni-ch', true);
    },
}));

const FCIcon: React.FC = () => {
    return (
        <Dropdown list={list} type={'click'} highlightActive={true}>
            <Icon style={{ padding: '0 6px' }} icon="ExpandArrow" size="original" />
        </Dropdown>
    );
};