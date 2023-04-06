import { Icon, Dropdown } from "@contentstack/venus-components";
import React from "react";

declare global {
    interface Window {
        rte: any;
    }
}

let img: any;

const R: React.FC<any> = (props) => {
    console.log(props);
    const { leaf } = props;
    console.log(leaf)
    return (
        <span>{props.children}</span>
    )
}

export const cloudinary = (RTE: any) => {

    const cloudinary = RTE('cloudinary', () => ({
        title: 'Cloudinary',
        icon: <Icon icon="MinusSign" />,
        render: (props: any) => {
            return <R {...props} />
        },
        displayOn: ['toolbar'],
        elementType: ['text']
    }));

    return cloudinary;
}