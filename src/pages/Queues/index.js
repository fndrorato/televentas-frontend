import React, { useContext, useEffect, useReducer, useState } from "react";

import {
  Button,
  IconButton,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@material-ui/core";

import { DeleteOutline, Edit } from "@material-ui/icons";
import { toast } from "react-toastify";
import ConfirmationModal from "../../components/ConfirmationModal";
import MainContainer from "../../components/MainContainer";
import MainHeader from "../../components/MainHeader";
import MainHeaderButtonsWrapper from "../../components/MainHeaderButtonsWrapper";
import QueueModal from "../../components/QueueModal";
import TableRowSkeleton from "../../components/TableRowSkeleton";
import Title from "../../components/Title";
import toastError from "../../errors/toastError";
import api from "../../services/api";
import { i18n } from "../../translate/i18n";
// import { SocketContext } from "../../context/Socket/SocketContext";
import ForbiddenPage from "../../components/ForbiddenPage";
import { AuthContext } from "../../context/Auth/AuthContext";

const useStyles = makeStyles((theme) => ({
  mainPaper: {
    flex: 1,
    padding: theme.spacing(1),
    overflowY: "scroll",
    ...theme.scrollbarStyles,
  },
  customTableCell: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
}));

const reducer = (state, action) => {
  if (action.type === "LOAD_QUEUES") {
    const queues = action.payload;
    const newQueues = [];

    queues.forEach((queue) => {
      const queueIndex = state.findIndex((q) => q.id === queue.id);
      if (queueIndex !== -1) {
        state[queueIndex] = queue;
      } else {
        newQueues.push(queue);
      }
    });

    return [...state, ...newQueues];
  }

  if (action.type === "UPDATE_QUEUES") {
    const queue = action.payload;
    const queueIndex = state.findIndex((u) => u.id === queue.id);

    if (queueIndex !== -1) {
      state[queueIndex] = queue;
      return [...state];
    } else {
      return [queue, ...state];
    }
  }

  if (action.type === "DELETE_QUEUE") {
    const queueId = action.payload;
    const queueIndex = state.findIndex((q) => q.id === queueId);
    if (queueIndex !== -1) {
      state.splice(queueIndex, 1);
    }
    return [...state];
  }

  if (action.type === "RESET") {
    return [];
  }
};

const Queues = () => {
  const classes = useStyles();

  const [queues, dispatch] = useReducer(reducer, []);
  const [loading, setLoading] = useState(false);

  const [queueModalOpen, setQueueModalOpen] = useState(false);
  const [selectedQueue, setSelectedQueue] = useState(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  //   const socketManager = useContext(SocketContext);
  const { user, socket } = useContext(AuthContext);
  const companyId = user.companyId;

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { data } = await api.get("/queue");
        dispatch({ type: "LOAD_QUEUES", payload: data });

        setLoading(false);
      } catch (err) {
        toastError(err);
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    const onQueueEvent = (data) => {
      if (data.action === "update" || data.action === "create") {
        dispatch({ type: "UPDATE_QUEUES", payload: data.queue });
      }

      if (data.action === "delete") {
        dispatch({ type: "DELETE_QUEUE", payload: data.queueId });
      }
    };
    socket.on(`company-${companyId}-queue`, onQueueEvent);

    return () => {
      socket.off(`company-${companyId}-queue`, onQueueEvent);
    };
  }, [socket, companyId]);

  const handleOpenQueueModal = () => {
    setQueueModalOpen(true);
    setSelectedQueue(null);
  };

  const handleCloseQueueModal = () => {
    setQueueModalOpen(false);
    setSelectedQueue(null);
  };

  const handleEditQueue = (queue) => {
    setSelectedQueue(queue);
    setQueueModalOpen(true);
  };

  const handleCloseConfirmationModal = () => {
    setConfirmModalOpen(false);
    setSelectedQueue(null);
  };

  const handleDeleteQueue = async (queueId) => {
    try {
      await api.delete(`/queue/${queueId}`);
      toast.success(i18n.t("Queue deleted successfully!"));
    } catch (err) {
      toastError(err);
    }
    setSelectedQueue(null);
  };

  return (
    <MainContainer>
      <ConfirmationModal
        title={
          selectedQueue &&
          `${i18n.t("queues.confirmationModal.deleteTitle")} ${
            selectedQueue.name
          }?`
        }
        open={confirmModalOpen}
        onClose={handleCloseConfirmationModal}
        onConfirm={() => handleDeleteQueue(selectedQueue.id)}
      >
        {i18n.t("queues.confirmationModal.deleteMessage")}
      </ConfirmationModal>
      <QueueModal
        open={queueModalOpen}
        onClose={handleCloseQueueModal}
        queueId={selectedQueue?.id}
        onEdit={(res) => {
          if (res) {
            setTimeout(() => {
              handleEditQueue(res);
            }, 500);
          }
        }}
      />
      {user.profile === "user" ? (
        <ForbiddenPage />
      ) : (
        <>
          <MainHeader>
            <Title>
              {i18n.t("queues.title")} ({queues.length})
            </Title>
            <MainHeaderButtonsWrapper>
              <Button
                variant="contained"
                color="primary"
                onClick={handleOpenQueueModal}
                style={{ borderRadius: "22px" }}
              >
                {i18n.t("queues.buttons.add")}
              </Button>
            </MainHeaderButtonsWrapper>
          </MainHeader>
          <Paper className={classes.mainPaper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell align="center">
                    {i18n.t("queues.table.ID")}
                  </TableCell>
                  <TableCell align="center">
                    {i18n.t("queues.table.name")}
                  </TableCell>
                  <TableCell align="center">
                    {i18n.t("queues.table.color")}
                  </TableCell>
                  <TableCell align="center">
                    {i18n.t("queues.table.orderQueue")}
                  </TableCell>
                  <TableCell align="center">
                    {i18n.t("queues.table.greeting")}
                  </TableCell>
                  <TableCell align="center">
                    {i18n.t("queues.table.actions")}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <>
                  {queues.map((queue) => (
                    <TableRow key={queue.id}>
                      <TableCell align="center">{queue.id}</TableCell>
                      <TableCell align="center">{queue.name}</TableCell>
                      <TableCell align="center">
                        <div className={classes.customTableCell}>
                          <span
                            style={{
                              backgroundColor: queue.color,
                              width: 60,
                              height: 20,
                              alignSelf: "center",
                            }}
                          />
                        </div>
                      </TableCell>
                      <TableCell align="center">
                        <div className={classes.customTableCell}>
                          <Typography
                            style={{ width: 300, align: "center" }}
                            noWrap
                            variant="body2"
                          >
                            {queue.orderQueue}
                          </Typography>
                        </div>
                      </TableCell>
                      <TableCell align="center">
                        <div className={classes.customTableCell}>
                          <Typography
                            style={{ width: 300, align: "center" }}
                            noWrap
                            variant="body2"
                          >
                            {queue.greetingMessage}
                          </Typography>
                        </div>
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          size="small"
                          onClick={() => handleEditQueue(queue)}
                        >
                          <Edit />
                        </IconButton>

                        <IconButton
                          size="small"
                          onClick={() => {
                            setSelectedQueue(queue);
                            setConfirmModalOpen(true);
                          }}
                        >
                          <DeleteOutline />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                  {loading && <TableRowSkeleton columns={4} />}
                </>
              </TableBody>
            </Table>
          </Paper>
        </>
      )}
    </MainContainer>
  );
};

export default Queues;
