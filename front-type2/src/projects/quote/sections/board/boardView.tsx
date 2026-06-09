import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Board from 'react-trello';
import { quoteAction, selectQuoteState } from "../../redux/quote";
import { QuoteBoardLanes } from "sharedUtils/globalHelper/status";
import BoardHeader from '../board/boardHeader';
import '../../assets/board.css';

export default function QuoteBoardViewApp(props) {
    const dispatch = useDispatch();
    const quoteState = useSelector(selectQuoteState);
    const quoteData = quoteState.quotes
    const [selectedSubServiceOpt, setSelectedSubServiceOpt] = useState(null);
    const [selectedServiceOpt, setSelectedServiceOpt] = useState(selectedSubServiceOpt === 'Solar' ? 'Eco' : null);
    const [swimLanes, setSwimLanes] = useState(QuoteBoardLanes);

    const otherLanes = [
        {
            label: 'New Quote',
            value: '1000'
        },
        {
            label: 'Quote Provided',
            value: '1001'
        },
        {
            label: 'Quote Accepted',
            value: '1002'
        },
        {
            label: 'Quote Rejected',
            value: '1003'
        },
        {
            label: 'Quote Live',
            value: '1004'
        },
        {
            label: 'Revised Quote Provided',
            value: '1005'
        },
        {
            label: 'Quote Expired',
            value: '1008'
        },
        {
            label: 'DND',
            value: '1009'
        },
        {
            label: 'Contract End Date',
            value: '1010'
        },
        {
            label: 'Pending Supplier Confirmation',
            value: '1011'
        },
        {
            label: 'Revised Supplier Rates',
            value: '1012'
        },
        {
            label: 'Inquiry From Website',
            value: '1013'
        },
        {
            label: 'DNO Applied',
            value: '1031'
        },
        {
            label: 'Roofer Booked',
            value: '1032'
        },
        {
            label: 'Electrian Booked',
            value: '1033'
        },
    ]

    const paidSolarLanes = [
        {
            label: 'New Quote',
            value: '1000'
        },
        {
            label: 'Inquiry From Website',
            value: '1013'
        },
        {
            label: 'Survey Booked',
            value: '1015'
        },
        {
            label: 'Redesign',
            value: '1016'
        },
        {
            label: 'Contract Sent',
            value: '1017'
        },
        {
            label: 'Contract Signed',
            value: '1018'
        },
        {
            label: 'Deposit',
            value: '1030'
        },
        {
            label: 'Hies Registration Started',
            value: '1027'
        },
        {
            label: 'DNO Applied',
            value: '1031'
        },
        {
            label: 'DNO Accepted',
            value: '1019'
        },
        {
            label: 'DNO Rejected',
            value: '1020'
        },
        {
            label: 'Scaffolding Booked',
            value: '1021'
        },
        {
            label: 'Roofer Booked',
            value: '1032'
        },
        {
            label: 'Electrian Booked',
            value: '1033'
        },
        {
            label: 'Install Complete',
            value: '1023'
        },
        {
            label: 'MCS Registration',
            value: '1025'
        },
        {
            label: 'Hies Registration Completed',
            value: '1028'
        },
        {
            label: 'Building Regulations Done',
            value: '1029'
        },
        {
            label: 'Job Completed',
            value: '1026'
        }
    ]

    useEffect(() => {
        const h: any = {};
        h.limit = 100;
        dispatch(quoteAction.LoaderStart(false));
        dispatch(quoteAction.BasicActions({ quoteCount: -1 }));
        dispatch(quoteAction.ChangeLimit(h));
    }, []);

    const cardsFetch = (status) => {
        let newData = [];

        quoteData && quoteData.forEach((x) => {
            if (x.quoteStatus == status.value) {
                newData.push({
                    id: x._id,
                    title: x.company ? x.company : x.Consumer,
                    metadata: x,
                    label: x.assignee || '',
                    description: x.serviceType || '',
                    tags: [
                        {
                            bgcolor: "rgba(25,53,98,.08)",
                            color: "#193562",
                            title: x.quoteID
                        },
                    ]
                })
            }
        })
        return newData;
    }

    useEffect(() => {
        switch (selectedServiceOpt) {
            case 'Eco':
                setSwimLanes([
                    {
                        label: 'New Quote',
                        value: '1000'
                    },
                    {
                        label: 'EPC Checked',
                        value: '1034'
                    },
                    {
                        label: 'Phone Vetted',
                        value: '1035'
                    },
                    {
                        label: 'Data Matched',
                        value: '1036'
                    },
                    {
                        label: 'LA Flex sent',
                        value: '1037'
                    },
                    {
                        label: 'LA Flex accepted',
                        value: '1038'
                    },
                    {
                        label: 'Post EPR',
                        value: '1039'
                    },
                    {
                        label: 'Survey Docs and Picture',
                        value: '1040'
                    },
                    {
                        label: 'Job Rejected',
                        value: '1041'
                    },
                    {
                        label: 'Job Accepted',
                        value: '1042'
                    },
                    {
                        label: 'RC Assigned',
                        value: '1043'
                    },
                    {
                        label: 'RC Completed',
                        value: '1044'
                    },
                    {
                        label: 'Tech Survey',
                        value: '1045'
                    },
                    {
                        label: 'Insulation Booked',
                        value: '1046'
                    },
                    {
                        label: 'Ventilation Booked',
                        value: '1047'
                    },
                    {
                        label: 'Heating Booked',
                        value: '1048'
                    },
                    {
                        label: 'Solar Renewables Booked',
                        value: '1049'
                    },
                    {
                        label: 'Trust Mark',
                        value: '1050'
                    },
                    {
                        label: 'Submissions Started',
                        value: '1051'
                    },
                    {
                        label: 'Submitted to Funders',
                        value: '1052'
                    },
                    {
                        label: 'Funder Quiries',
                        value: '1053'
                    },
                    {
                        label: 'Funded Approved',
                        value: '1054'
                    },
                    {
                        label: 'Payment Received',
                        value: '1055'
                    },
                    {
                        label: 'Job Completed',
                        value: '1026'
                    }
                ])
                break;
            case 'Gas':
                setSwimLanes(otherLanes);
                break;
            case 'Electric':
                setSwimLanes(otherLanes);
                break;
            case 'TelecomAndBroadband':
                setSwimLanes(otherLanes);
                break;
            case 'Water':
                setSwimLanes(otherLanes);
                break;
            case 'ChipAndPin':
                setSwimLanes(otherLanes);
                break;
            case 'Telecoms':
                setSwimLanes(otherLanes);
                break;
            case 'Broadband':
                setSwimLanes(otherLanes);
                break;
            case 'Energy':
                setSwimLanes(otherLanes);
                break;
            case 'Waste':
                setSwimLanes(otherLanes);
                break;
            case 'Insurance':
                setSwimLanes(otherLanes);
                break;
            case 'BusinessRates':
                setSwimLanes(otherLanes);
                break;
            case 'PaidSolar':
                setSwimLanes(paidSolarLanes);
                break;
            default:
                setSwimLanes(QuoteBoardLanes);
                break;
        }
    }, [selectedServiceOpt]);

    const [quoteLanes, setQuoteLanes]: any = useState(
        {
            lanes: swimLanes && swimLanes.map((status) => ({
                id: status.value,
                title: status.label,
                label: '',
                cards: [],
                currentPage: 1,
            }))
        }
    );

    useEffect(() => {
        setQuoteLanes({
            lanes: swimLanes && swimLanes.map((status) => ({
                id: status.value,
                title: status.label,
                label: '',
                cards: cardsFetch(status),
                currentPage: 1,
            }))
        });
    }, [quoteData])

    const handleCardDrawer = (cardId, metadata, laneId) => {
        props.setEditDrawer(metadata)
    }

    return (
        <div className="app task_board_new">
            <BoardHeader
                {...props}
                loader={quoteState.remote}
                setSelectedServiceOpt={setSelectedServiceOpt}
                setSelectedSubServiceOpt={setSelectedSubServiceOpt}
            />

            <Board
                data={quoteLanes}
                // handleDragEnd={handleDragEnd}
                // onLaneScroll={onLaneScroll}
                hideCardDeleteIcon={true}
                onCardClick={handleCardDrawer}
                draggable={false}
                cardDraggable={false}
                laneDraggable={false}
                style={{
                    height: '78vh'
                }}
            />
        </div>
    )
}