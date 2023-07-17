//@ts-nocheck
import Icon from "../../assets/customfield.svg";
import React, { useEffect, useState } from 'react';
import localeTexts from "../../common/locales/en-us/index";
import parse from "html-react-parser";
import ContentstackAppSDK from "@contentstack/app-sdk";
import { useCustomField } from "../../common/hooks/useCustomField";
import { AsyncLoader, InfiniteScrollTable } from "@contentstack/venus-components";
import '@contentstack/venus-components/build/main.css';
import { isEmpty } from "lodash";




const StackDashboardExtension = () => {
    const [stack, setStack] = useState<any>({});
    const [entries, setEntries] = useState<any[]>();
    const [users, setUsers] = useState<any>({});

    const getStackUsers = async () => {
        const stackData = await stack.getData();
        const collaborators = stackData.collaborators;
        console.log('users', collaborators);
        return (collaborators.map((u: any) => {
            u['full_name'] = `${u.first_name} ${u.last_name}`;
            return u;
        }));
    }

    const getEntriesFromContentTypes = async (conTypes: any) => {
        return Promise.all(
            conTypes.map((conType: any) => {
                const uid = conType.uid;
                const entries = stack.ContentType(uid).Entry.Query().includeContentType().find();
                return entries;
            })
        )
    }

    const compareUpdatedDate = (a, b) => {
        if (a.updated_at < b.updated_at) {
            return 1;
        }
        if (a.updated_at > b.updated_at) {
            return -1;
        }
        return 0;
    }

    ContentstackAppSDK.init().then(async (appSDK: any) => {
        const dashboardWidget = await appSDK.location.DashboardWidget;
        setStack(await appSDK.stack);
        const frame = dashboardWidget.frame;
        frame.enableResizing();
        frame.updateHeight(800);
        // setStack(cs);
    })

    useEffect(() => {
        const setDashboardData = async () => {
            const conTypes = await stack.getContentTypes();
            const e = await getEntriesFromContentTypes(conTypes.content_types);
            const collaborators = await getStackUsers();
            setEntries(e.map((cte: any) => {
                return cte.entries.map((ct: any) => {
                    ct['content_type'] = cte.content_type;
                    ct['user_name'] = collaborators.filter(u => u.uid === ct.updated_by)[0].full_name;
                    return ct;
                })
            }).flat().sort(compareUpdatedDate))
        }
        // const setDashboardData = async () => {
        //     await getFlatEntriesList();
        // };
        setDashboardData();
    }, [stack]);

    return (
        <div className="dashboard">
            <div className="dashboard-container">
                <div className="large-entries-list">
                    {entries ? (
                        <>
                            <InfiniteScrollTable
                                canRefresh
                                canSearch
                                columnSelector
                                columns={[
                                    {
                                        Header: 'Title',
                                        accessor: function noRefCheck() { },
                                        addToColumnSelector: true,
                                        id: 'title'
                                    },
                                    {
                                        Header: 'Locale',
                                        accessor: 'locale',
                                        default: false,
                                        addToColumnSelector: true,
                                    },
                                ]}
                                data={[entries]}
                                fetchTableData={function noRefCheck() { }}
                                getViewByValue={function noRefCheck() { }}
                                initialSortBy={[
                                    {
                                        desc: true,
                                        id: 'title'
                                    }
                                ]}
                                itemStatusMap={{
                                    '0': 'loading'
                                }}
                                loadMoreItems={function noRefCheck() { }}
                                loading
                                minBatchSizeToFetch={50}
                                searchPlaceholder="Search"
                                totalCounts={null}
                                uniqueKey="uid"
                                viewSelector
                            />
                            <table>
                                <tbody>
                                    {entries?.map((entry, key) => (
                                        <tr key={key}>
                                            <td>{entry.title ? entry.title : 'Untitled'}</td>
                                            <td>{entry.content_type.title ? entry.content_type.title : ''}</td>
                                            <td>{entry._version ? entry._version : ''}</td>
                                            <td>{entry.locale ? entry.locale : ''}</td>
                                            <td>{entry.updated_by ? entry.user_name : ''}</td>
                                            <td>{entry.updated_at ? entry.updated_at : ''}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </>
                    ) : (<AsyncLoader className="loader" />)
                    }
                </div>
            </div>
        </div >
    );
};

export default StackDashboardExtension;