import React, { useState, useEffect } from 'react';
import firebase from 'firebase';
import { makeStyles } from '@material-ui/styles';
import {  Checkbox,
          List,
          ListItem,
          ListItemText,
          ListItemSecondaryAction,
          IconButton,
          TextField,
          Fab
        } from '@material-ui/core';
  import { ThumbUpRounded, ThumbDownRounded  } from '@material-ui/icons';
  import AddIcon from '@material-ui/icons/Add'

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column'
  },
   root: {
     width: '40%',
   },
  section: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    marginTop: '2rem'
  }
}));

const Topics = () => {
  const classes = useStyles();
  const [topics, setTopics] = useState([]);
  const [newTopic, setNewTopic] = useState({name: '', presented: false});

  useEffect(() => {
    const topicsRef = firebase
      .app()
      .firestore()
      .collection('topics');

    topicsRef.onSnapshot(querySnapshot => {
      const topicRecords = [];

      querySnapshot.forEach(topic => {
        topicRecords.push({
          id: topic.id,
          ...topic.data(),
        });
      });

      setTopics(topicRecords);
    });
  });

  function addTopic() {
    const topicsRef = firebase
    .app()
    .firestore()
    .collection('topics');

    topicsRef.add(newTopic)
    setNewTopic({name: '', presented: false})
  }

  function changePresented() {

  }

  return (
    <div className={classes.container}>
      <div className={classes.section}>
        <TextField id="newTopic" value={newTopic.name} label="Nuevo Topic" onChange={ event => setNewTopic({...newTopic, name: event.target.value})} />
        <Fab size="small" color="primary" aria-label="Add">
          <AddIcon onClick={addTopic} />
        </Fab>
      </div>
      <div className={classes.section}>
        <List className={classes.root}>
          {topics.map(topic => (
            <ListItem key={topic.id} button={true} divider={true}>
              <Checkbox checked={topic.presented} onChange={changePresented} ></Checkbox>
              <ListItemText>{topic.name}</ListItemText>
              <ListItemSecondaryAction>
                <IconButton aria-label="Comments">
                  <ThumbUpRounded />
                </IconButton>
                <IconButton aria-label="Comments">
                  <ThumbDownRounded />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </div>
    </div>
  );
};

export default Topics;
