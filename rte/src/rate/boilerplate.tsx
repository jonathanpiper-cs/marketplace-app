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
        <span>{props.children}</span>
    )
}

export const insertBoilerplate = (RTE: any) => {

    const boilerplate = RTE('insert', () => ({
        title: 'Insert Boilerplate',
        icon: <Icon icon="PlusSign" />,
        render: (props: any) => {
            return <R {...props} />
        },
        display: ['toolbar'],
        elementType: ['block']
    }));

    boilerplate.on('exec', (rte: any) => {
        if (!window.rte) {
            window.rte = rte;
        }
        if (rte.getVariable('boilerplateSet') === null || rte.getVariable('boilerplateSet') === false) {
            rte.insertNode({
                type: 'h1',
                children: [
                    {
                        type: 'h1',
                        children: [{
                            text: 'Boilerplate'
                        }]
                    },
                    {
                        type: 'p',
                        children: [{
                            text: `Here's some text.`,
                            highlight: 40
                        }]
                    }
                ]
            })
            rte.setVariable('boilerplateSet', true);
        }
    });

    return boilerplate;
}