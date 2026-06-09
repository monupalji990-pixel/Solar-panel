import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from "@material-ui/core/CircularProgress";

const useStyles = makeStyles((theme) => ({
    loadingComponent: {
        textAlign: 'center',
        position: 'relative',
        top: '4rem'
    }
}));

export default function HistoryNotes(props) {

    const classes = useStyles();
    const [notes, setNotes] = useState([]);
    const [isLoading, setLoading] = useState(false);

    let baseURL;
    if (process.env.NODE_ENV === "development") {
        baseURL = "http://localhost:8087/api/";
    } else {
        baseURL = "/api/";
    }

    useEffect(() => {
        setLoading(true);
        const fetchHistoryNotes = async () => {
            await fetch(`${baseURL}users/regUser/history_list?sortType=desc&sort=createdAt&skip=${0}&limit=${20}&historyFor=Quote&isComplete${0}&Quote=${props.data?._id}`, {
                'credentials': 'include'
            })
                .then(response => response.json())
                .then(data => {
                    setNotes(data.data);
                    setLoading(false);
                });
        }

        fetchHistoryNotes()
    }, [])

    if (isLoading) {
        return (
            <div className={classes.loadingComponent}>
                <CircularProgress />
            </div>
        )
    }

    return (
        <div>
            {notes && notes.length > 0 ?
                <table style={{
                    padding: 20,
                    width: '100%'
                }}>
                    {notes.map((x) => x.notes && (
                        <tr style={{
                            display: 'block',
                            width: '100%',
                            borderLeft: '5px solid #ccc',
                            padding: '10px',
                            borderRadius: '5px',
                            boxShadow: '0 0 10px -2px #bababa',
                            fontStyle: 'italic',
                            fontSize: '14px',
                            marginBottom: 15
                        }}>
                            <td>
                                <span style={{
                                    fontSize: 12,
                                    color: 'rgb(66 66 66)',
                                    display:'block',
                                    marginBottom:'-10px',
                                    fontStyle:'normal'
                                }}>
                                    {new Date(x.createdAt).toLocaleString()}
                                </span> <br />
                                {x.notes}
                            </td>
                        </tr>
                    ))}
                </table>
                :
                <table>
                    <tr>
                        <div>No Notes Available</div>
                    </tr>
                </table>
            }
        </div>
    )
}