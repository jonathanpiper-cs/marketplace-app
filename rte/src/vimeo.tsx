import { Icon, Dropdown } from "@contentstack/venus-components";
import React from "react";

declare global {
    interface Window {
        rte: any;
    }
}

const UniCHComponent: React.FC<any> = (props) => {
    const { leaf } = props;
    return (
        <span {...props.attributes}>
            {props.children}
        </span>
    );
};

export const vimeo = (RTE: any) => {
    const Vimeo = RTE('uni-ch', () => ({
        title: 'Vimeo',
        icon: <Icon icon={'Save'} />,
        render: (props: any) => {
            return <UniCHComponent {...props} />;
        },
        display: ['toolbar'],
        elementType: ['inline'],
    }));

    Vimeo.on('change', (rte: any) => {
        if (!window.rte) {
            window.rte = rte;
        }
        console.log(rte);
    });

    return Vimeo;
};