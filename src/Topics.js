import React, {useState, useEffect} from 'react';
import firebase from 'firebase';
import {makeStyles} from '@material-ui/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import ThumbUpRounded from '@material-ui/icons/ThumbUpRounded';
import ThumbDownRounded from '@material-ui/icons/ThumbDownRounded';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    justifyContent: 'center'
  },
  root: {
    width: '40%'
  },
}));

const Topics = () => {
  const classes = useStyles();
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    const topicsRef = firebase.app().firestore().collection('topics');

    topicsRef.onSnapshot(querySnapshot => {
        const topicRecords = []

        querySnapshot.forEach(topic => {
          topicRecords.push({
                id: topic.id,
                ...topic.data()
            });
        })

        setTopics(topicRecords);
    });
  });

  return (
    <div className={classes.container}>
      <List className={classes.root}>
      {topics.map(topic => (
        <ListItem key={topic.id} button={true} divider={true}>
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
  );
}

export default Topics;