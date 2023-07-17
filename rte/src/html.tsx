import { Icon, Form, Field, FieldLabel, TextInput, cbModal, ModalHeader, ModalBody, ModalFooter, ButtonGroup, Button, ValidationMessage } from "@contentstack/venus-components";
import React, { useState } from 'react';
import { htmlFragmentSync as htmlf } from 'lit-ntml';
const prettify = require('html-prettify');

declare global {
    interface Window {
        rte: any;
    }
}
const HTMLComponent: any = (props: any) => {
    console.log(prettify(props.text.text, {count: 10}))
    return (
        <>
            {prettify(props.text.text)}
        </>
    )
};

export const html = (RTE: any) => {

    const HTMLModal = (props: any) => {
        const { rte } = props;
        const [submitDisabled, setSubmitDisabled] = useState(true)

        const handleSubmit = (e: any) => {
            e.preventDefault();
            const rteUrl = rte.getVariable('url');
            const rteDisplay = rte.getVariable('display');
            rte.insertNode(
                {
                    type: "html",
                    children: [{
                        text: `<p><b>Hello</b></p>`, html: true
                    }],
                }
            );
            props.closeModal();
        };

        const validateURL = (value: string) => {
            rte.setVariable('url', value);
            setSubmitDisabled(value === '' ? true : false);
        }

        return (
            <>
                <ModalHeader title='Insert nofollow link' closeModal={props.closeModal} />
                <ModalBody className='modalBodyCustomClass'>
                    <Form>
                        <Field>
                            <FieldLabel required htmlFor="url">
                                URL
                            </FieldLabel>
                            <TextInput required value={rte.getVariable('url')} placeholder="Enter nofollow URL" id="nofollowurl" name="url" onChange={(e: any) => validateURL(e.target.value)}></TextInput>
                            <ValidationMessage style={{ marginLeft: 10 }}>Required</ValidationMessage>
                        </Field>
                        <Field>
                            <FieldLabel required htmlFor="display">
                                Display text
                            </FieldLabel>
                            <TextInput value={rte.getVariable('display')} placeholder="Enter display text" name="display" onChange={(e: any) => rte.setVariable('display', e.target.value)}></TextInput>
                        </Field>
                    </Form>
                </ModalBody>

                <ModalFooter>
                    <ButtonGroup>
                        <Button buttonType='light' onClick={() => props.closeModal()}>
                            Cancel
                        </Button>
                        <Button onClick={handleSubmit} disabled={submitDisabled}>Save</Button>
                    </ButtonGroup>
                </ModalFooter>
            </>
        )
    }

    const html = RTE('html', () => ({
        title: 'html',
        icon: <Icon icon={'Link'} />,
        render: (props: any) => {
            return <HTMLComponent {...props.children[0].props} />;
        },
        display: ['toolbar'],
        elementType: ['inline'],
    }));

    html.on('exec', (rte: any) => {
        if (!window.rte) {
            window.rte = rte;
        }
        rte.setVariable('url', '');
        rte.setVariable('display', '');
        cbModal({
            component: (props: any) => <HTMLModal rte={rte} {...props} />,
            modalProps: {
                shouldReturnFocusAfterClose: false
            }
        });
    });

    return html;
};