import { Icon, Dropdown } from "@contentstack/venus-components";
import React from "react";

declare global {
    interface Window {
        rte: any;
    }
}

const R: React.FC<any> = (props) => {
    const { leaf } = props;
    return (
        <span style={{ margin: leaf['heading-margin'] }}>{props.children}</span>
    )
}

export const removeHeadingMargin = (RTE: any) => {

    const RemoveHeadingMargin = RTE('heading-margin', () => ({
        title: 'Remove Heading Margin',
        icon: <Icon icon="MinusSign" />,
        render: (props: any) => {
            return <R {...props} />
        },
        displayOn: ['toolbar'],
        elementType: ['text']
    }));

    RemoveHeadingMargin.on('exec', (rte: any) => {
        if (!window.rte) {
            window.rte = rte;
        }
        const curNode = rte.selection.get();
        const parentPath = curNode.anchor.path.slice(0, -1);
        const parentNode = rte.getNode(parentPath);
        if (parentNode[0].type.substring(0, 1) === 'h') {
            if (rte.hasMark('heading-margin')) {
                rte.removeMark('heading-margin');
            } else {
                rte.addMark('heading-margin', 0);
            }
        }
    });

    return RemoveHeadingMargin;
}