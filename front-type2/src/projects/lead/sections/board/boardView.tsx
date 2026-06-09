import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Board from "react-trello";
import BoardHeader from "../board/boardHeader";
import "../../assets/board.css";
import { leadAction, LeadState } from "projects/lead/redux/lead";
import {
  EcoLane,
  SolarLane,
  leadOptions,
} from "sharedUtils/globalHelper/constantValues";

export default function QuoteBoardViewApp(props) {
  const dispatch = useDispatch();
  const leadStates = useSelector(LeadState);
  const leadData = leadStates.leads;
  const [swimLanes, setSwimLanes] = useState(leadOptions);
  const [selectedLeadRadio, setSelectedLeadRadio] = useState("solar");

  useEffect(() => {
    const h: any = {};
    h.limit = 100;
    dispatch(leadAction.LoaderStart(false));
    dispatch(leadAction.BasicActions({ filterData: {}, leadCount: -1 }));
    dispatch(leadAction.ChangeLimit(h));
  }, []);

  useEffect(() => {
    let data = [];
    if (selectedLeadRadio === "solar") {
      SolarLane &&
        SolarLane.map((e) => {
          data.push(e.value);
        });
    } else if (selectedLeadRadio === "eco4") {
      EcoLane &&
        EcoLane.map((e) => {
          data.push(e.value);
        });
    } else {
      swimLanes &&
        swimLanes.map((e) => {
          data.push(e.value);
        });
    }

    const h: any = {};
    h.StatusArray = data;
    dispatch(leadAction.LoaderStart(false));
    dispatch(leadAction.FilterData(h));
  }, [selectedLeadRadio]);

  let taskRoles;
  if (selectedLeadRadio === "solar") {
    taskRoles = SolarLane;
  } else if (selectedLeadRadio === "eco4") {
    taskRoles = EcoLane;
  } else if (selectedLeadRadio === "b2b") {
    taskRoles = swimLanes;
  } else {
    taskRoles = swimLanes;
  }

  const cardsFetch = (status) => {
    let newData = [];

    leadData &&
      leadData.forEach((x) => {
        if (x.status == status.value) {
          newData.push({
            id: x._id,
            title: x.company ? x.company : x.Consumer,
            metadata: x,
            label: x.assignee || "",
            description: x.type || "",
            tags: [
              {
                bgcolor: "rgba(25,53,98,.08)",
                color: "#193562",
                title: x.lead,
              },
            ],
          });
        }
      });
    return newData;
  };

  const [updatedLeadData, setUpdatedLeadData]: any = useState({
    lanes:
      taskRoles &&
      taskRoles.map((status) => ({
        id: status.value,
        title: status.label,
        label: "",
        cards: cardsFetch(status),
        currentPage: 1,
      })),
  });

  useEffect(() => {
    setUpdatedLeadData({
      lanes:
        taskRoles &&
        taskRoles.map((status) => ({
          id: status.value,
          title: status.label,
          label: "",
          cards: cardsFetch(status),
          currentPage: 1,
        })),
    });
  }, [leadData]);

  const handleCardDrawer = (cardId, metadata, laneId) => {
    props.viewLeadDetail(metadata);
  };

  const handleDragEnd = (
    cardId,
    sourceLaneId,
    targetLaneId,
    position,
    cardDetails
  ) => {
    const obj: any = {};

    let updateField = "";
    if (cardDetails.id && cardDetails.laneId) {
      obj.status = cardDetails.laneId;
      obj.leadId = cardDetails.id;
      if (cardDetails.laneId) {
        updateField = "status";
        obj.status = cardDetails.laneId;
        obj.historyStatus = `Status changed from ${cardDetails?.metadata?.status} to ${cardDetails.laneId}`;
      }
    }

    props._leadUpdate({
      data: obj,
      updateField,
    });
  };

  const handleChangeLeadRadio = (radio) => {
    setSelectedLeadRadio(radio);
  };

  return (
    <div className="app task_board_new">
      <BoardHeader
        {...props}
        loader={leadStates.remote}
        handleChangeLeadRadio={handleChangeLeadRadio}
      />

      <Board
        draggable
        data={updatedLeadData}
        handleDragEnd={handleDragEnd}
        // onLaneScroll={onLaneScroll}
        hideCardDeleteIcon={true}
        onCardClick={handleCardDrawer}
        style={{
          height: "78vh",
        }}
      />
    </div>
  );
}
