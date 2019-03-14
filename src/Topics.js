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
          Fab,
          Badge,
          Snackbar,
          SnackbarContent
        } from '@material-ui/core';
  import { ThumbUpRounded, ThumbDownRounded, Add as AddIcon, Check as CheckIcon  } from '@material-ui/icons';

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
  const [newTopic, setNewTopic] = useState({name: '', presented: false, downvotes: 0, upvotes: 0, ranking: 0});
  const [messageOpen, openMessage] = useState(false);
  const topicsRef = firebase
      .app()
      .firestore()
      .collection('topics');

  useEffect(() => {
    topicsRef.onSnapshot(querySnapshot => {
      let topicRecords = [];

      querySnapshot.forEach(topic => {
        topicRecords.push({
          id: topic.id,
          ...topic.data(),
        });
      });

      topicRecords = topicRecords.sort((a,b) => a.presented || a.ranking < b.ranking);
      setTopics(topicRecords);
    });
  });

  function addTopic() {
    topicsRef.add(newTopic)
    .then(() => {
      console.log('Topic added', newTopic);
      setNewTopic({name: '', presented: false, downvotes:0, upvotes: 0, ranking:0});
    })
    .catch(error => console.log(error));
  }


  function changePresented(topic) {
    topic.presented = true;
    topicsRef.doc(topic.id).update(topic)
    .then(() => {
      console.log('Topic Presented change', topic)
    })
    .catch(error => console.log(error));
  }

  function upVote(topic){
    topic.upvotes++;
    topicsRef.doc(topic.id).set(topic)
    .then(() => {
      console.log('Topic upvoted', topic)
    })
    .catch(error => console.log(error));
    /*const updateTopics = topics.filter(t => !t.presented).sort((a,b) => (a.upvotes - a.downvotes) < (b.upvotes - b.downvotes));

    let ranking = 1;
    updateTopics.forEach(updateTopic => {
      updateTopic.ranking = ranking;
      topicsRef.doc(updateTopic.id).set(updateTopic)
      ranking++;
    })*/
  }

  function downVote(topic) {
    topic.downvotes++;
    topicsRef.doc(topic.id).set(topic)
    .then(() => {
      console.log('Topic downvoted', topic)
    })
    .catch(error => console.log(error));

  }

  return (
    <div className={classes.container}>
      <div className={classes.section}>

        <TextField id="newTopic" value={newTopic.name} label="Nuevo Tema" onChange={ event => setNewTopic({...newTopic, name: event.target.value})} />
        <Fab size="small" color="primary" aria-label="Add">
          <AddIcon onClick={addTopic} />
        </Fab>
      </div>
      <div className={classes.section}>
        <List className={classes.root}>
          {topics.map(topic => (
            <ListItem key={topic.id} button={true} divider={true}>
              {topic.presented &&
              <CheckIcon aria-hidden="true"></CheckIcon>
              }
              {!topic.presented &&
              <Checkbox checked={topic.presented} onChange={() => changePresented(topic)} ></Checkbox>
              }
              <ListItemText>{topic.name}</ListItemText>
              {!topic.presented &&
              <ListItemSecondaryAction>
                <IconButton aria-label="Comments" onClick={ () => upVote(topic)}>
                  <ThumbUpRounded />
                </IconButton>
                <Badge badgeContent={topic.upvotes || 0} color="primary"></Badge>
                <IconButton aria-label="Comments" onClick={ () => downVote(topic)}>
                  <ThumbDownRounded />
                </IconButton>
                <Badge badgeContent={topic.downvotes || 0} color="secondary"></Badge>
              </ListItemSecondaryAction>
              }
            </ListItem>
          ))}
        </List>
      </div>
    </div>
  );
};

export default Topics;
