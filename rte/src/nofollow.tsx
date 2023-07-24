import {
  Icon,
  Form,
  Field,
  FieldLabel,
  TextInput,
  cbModal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ButtonGroup,
  Button,
  ValidationMessage,
} from "@contentstack/venus-components";
import React, { useState } from "react";

declare global {
  interface Window {
    rte: any;
  }
}

const NoFollowComponent: any = (props: any) => {
  console.log(props);
  return (
    <a href={props.element.attrs.url} rel={props.element.attrs.nofollow ? "nofollow" : ""}>
      {props.children} (nofollow)
    </a>
  );
};

export const nofollow = (RTE: any) => {
  const ModalComponent = (props: any) => {
    const { rte } = props;
    const [submitDisabled, setSubmitDisabled] = useState(true);

    const handleSubmit = (e: any) => {
      e.preventDefault();
      const rteUrl = rte.getVariable("url");
      const rteDisplay = rte.getVariable("display");
      rte.insertNode(
          {
              type: "a-nofollow",
              attrs: {
                  url: rteUrl,
                  nofollow: true
              },
              children: [{ text: rteDisplay, nofollow: true }],
          }
      );
      props.closeModal();
    };

    const validateURL = (value: string) => {
      rte.setVariable("url", value);
      setSubmitDisabled(value === "" ? true : false);
    };

    return (
      <>
        <ModalHeader title="Insert nofollow link" closeModal={props.closeModal} />
        <ModalBody className="modalBodyCustomClass">
          <Form>
            <Field>
              <FieldLabel required htmlFor="url">
                URL
              </FieldLabel>
              <TextInput
                required
                value={rte.getVariable("url")}
                placeholder="Enter nofollow URL"
                id="nofollowurl"
                name="url"
                onChange={(e: any) => validateURL(e.target.value)}></TextInput>
              <ValidationMessage style={{ marginLeft: 10 }}>Required</ValidationMessage>
            </Field>
            <Field>
              <FieldLabel required htmlFor="display">
                Display text
              </FieldLabel>
              <TextInput
                value={rte.getVariable("display")}
                placeholder="Enter display text"
                name="display"
                onChange={(e: any) => rte.setVariable("display", e.target.value)}></TextInput>
            </Field>
          </Form>
        </ModalBody>

        <ModalFooter>
          <ButtonGroup>
            <Button buttonType="light" onClick={() => props.closeModal()}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={submitDisabled}>
              Save
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </>
    );
  };

  const NoFollow = RTE("a-nofollow", () => ({
    title: "Insert Nofollow Link",
    icon: <Icon icon={"LinkSmall"} />,
    render: (props: any) => {
      return <NoFollowComponent {...props} />;
    },
    display: ["toolbar"],
    elementType: ["inline"],
  }));

  NoFollow.on("exec", (rte: any) => {
    console.log(rte);
    if (!window.rte) {
      window.rte = rte;
    }
    rte.setVariable("url", "");
    rte.setVariable("display", "");
    cbModal({
      component: (props: any) => <ModalComponent rte={rte} {...props} />,
      modalProps: {
        shouldReturnFocusAfterClose: false,
      },
    });
  });

  return NoFollow;
};
