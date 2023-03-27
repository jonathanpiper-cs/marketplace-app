import Icon from "../../assets/customfield.svg";
import React, { useEffect, useState } from 'react';
import localeTexts from "../../common/locales/en-us/index";
import parse from "html-react-parser";
import ContentstackAppSDK from "@contentstack/app-sdk";
import { useCustomField } from "../../common/hooks/useCustomField";
import { Button, Heading, Paragraph } from "@contentstack/venus-components";
import '@contentstack/venus-components/build/main.css';
import { isEmpty } from "lodash";

interface MetObject {
	primaryImageSmall: string;
	title: string;
	objectDate: string;
	artistDisplayName: string;
	medium: string;
}

interface CustomFieldType {
	[key: string]: any;
}

const Metspo = () => {
	const [arrBadIDs, setBadIDs]: any = useState([]);
	const { customFieldPointer, setFieldData }: any = useCustomField();
	const [meta, setMeta]: any = useState({});
	const [noImage, setNoImage] = useState(false);
	const [fetchingImage, setFetchingImage] = useState(false);
	const [metObject, setMetObject] = useState<MetObject>({
		primaryImageSmall: '',
		title: '',
		objectDate: '',
		artistDisplayName: '',
		medium: '',
	});
	const [imgSrc, setImgSrc] = useState('');
	const [getCustomField, setCustomField] = useState<CustomFieldType>({});

	const getMetData = async (query: string) => {
		meta.get('badObjIDs').then((value: any) => (setBadIDs(value)));
		const response = await fetch(`https://collectionapi.metmuseum.org/public/collection/v1/search?q=${query}`)
		const metObjData: any = await response.json();
		// console.log(metObjData)
		if (metObjData.objectIDs === null || metObjData.length === 0) {
			setNoImage(true);
			setFetchingImage(false);
			return;
		}
		while (fetchingImage) {
			const metObjID: number = metObjData.objectIDs[Math.floor(Math.random() * metObjData.objectIDs.length)];
			let metObjectResponse: any;
			let metObjectJSON: MetObject = {
				primaryImageSmall: '',
				title: '',
				objectDate: '',
				artistDisplayName: '',
				medium: '',
			}
			try {
				if (arrBadIDs.indexOf(metObjID) === -1) {
					metObjectResponse = await fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${metObjID}`);
					metObjectJSON = await metObjectResponse.json();
				} else {
					console.log(`We already know that object ${metObjID} doesn't have an associated image.`)
				}
			} catch (error) {
				console.log(error);
			}
			if (metObjectJSON?.primaryImageSmall && (metObjectJSON.primaryImageSmall !== '')) {
				console.log('got an image!');
				setMetObject(metObjectJSON);
				break;
			}
			arrBadIDs.push(metObjID);
			setBadIDs(arrBadIDs);
			meta.set('badObjIDs', arrBadIDs);
			meta.get('badObjIDs').then((value: any) => console.log('IDs without images: ' + value));
			metObjData.objectIDs.splice(metObjData.objectIDs.indexOf(metObjID), 1);
			// console.log('rejected');
			if (metObjData.objectIDs.length == 0) {
				setNoImage(true);
			}
			// console.log(metObjData.objectIDs);
		}
	}

	const getMetImage = async () => {
		setFetchingImage(true);
		setNoImage(false);
		setMetObject({
			primaryImageSmall: '',
			title: '',
			objectDate: '',
			artistDisplayName: '',
			medium: ''
		});
		setImgSrc('');
	}

	useEffect(() => {
		fetchingImage &&
			getMetData(getCustomField.entry._data.title);
	}, [fetchingImage])

	useEffect(() => {
		if (metObject.primaryImageSmall !== '') {
			setImgSrc(metObject.primaryImageSmall);
			setFetchingImage(false);
			// console.log(getCustomField.frame)
			getCustomField.frame.updateHeight()
		}
	}, [metObject])

	const saveImage = async () => {
		setFieldData(metObject);
	}

	useEffect(() => {
		ContentstackAppSDK.init().then(async (appSDK: any) => {
			const customField = await appSDK.location.CustomField;
			const appMeta = await appSDK.store;
			setMeta(appMeta);
			var fieldData = await customField.field.getData()
			setCustomField(customField);
			customField.frame?.enableAutoResizing?.();
			customField.frame.enableResizing();
			customField.frame.updateHeight(400);
			if (!isEmpty(fieldData) && fieldData !== null) {
				setMetObject(fieldData);
			}
		})
	}, []);

	return (
		<div className="met-inspo-container">
			<div className="met-inspo-header">
				<Button onClick={getMetImage} disabled={fetchingImage}>Get inspired by an image from the Met</Button>
				<Button onClick={saveImage}>Save image to the Entry</Button>
			</div>

			{noImage ? (
				<div className="met-no-image">
					<Paragraph tagName="p" text={`Hmm, couldn't find an object based on the Entry title ("${getCustomField.entry._data.title}").`} />
				</div>
			) : (
				<div className="met-inspo-body">
					<div className="met-inspo-col-left">
						{fetchingImage ? (
							<p>Fetching image...</p>
						) : (metObject.primaryImageSmall !== '') ? (
							<img className="met-inspo-image" src={imgSrc} />
						) : (
							<div></div>
						)}
					</div>
					<div className="met-inspo-col-right">
						<Heading tagName="h6" text={metObject.title} />
						<Paragraph tagName="p" text={metObject.artistDisplayName} />
						<Paragraph tagName="p" text={metObject.objectDate} />
						<Paragraph tagName="p" text={metObject.medium} />
					</div>
				</div>
			)}
		</div>
	);
};

export default Metspo;
