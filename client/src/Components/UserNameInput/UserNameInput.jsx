import React, { useState } from 'react';
import { useParams, useHistory, useLocation } from 'react-router-dom';
import { useEmit } from 'socketio-hooks';
import { useForm } from 'react-hook-form';
import TextField from '@material-ui/core/TextField';
import * as yup from 'yup';

import { useUserContext } from 'Contexts/UserContext';
import { useRoomContext } from 'Contexts/RoomContext';
import PromotedText from 'Components/PromotedText/PromotedText';
import VoteButton from 'Components/VoteButton';
import Tooltip from 'Components/Tooltip';
import ObserverCheckbox from 'Components/ObserverCheckbox';
import UserNameStyles from './UserNameStyles';
import photo1 from 'Assets/pngfind.com-meme-faces-png-13834.png';
import photo2 from 'Assets/pngfind.com-memes-png-401574.png';

const Schema = yup.object().shape({
  name: yup.string().required(),
});

const UserNameInput = () => {
  const defaultName = window.localStorage.getItem('DEFAULT_NAME') ?? '';

  const classes = UserNameStyles();
  const { updateRoomInfo } = useRoomContext();
  const { saveToken } = useUserContext();
  const { roomId } = useParams();
  const { state } = useLocation();
  const history = useHistory();
  const joinRoom = useEmit('USER_JOIN');

  const { register, handleSubmit, errors } = useForm({
    validationSchema: Schema,
    defaultValues: {
      name: defaultName,
    },
  });

  const onSubmitHandler = ({ name }) => {
    window.localStorage.setItem('DEFAULT_NAME', name);

    joinRoom({ name, roomId, isAdmin: state?.isAdmin, isObserver }, ({ room, token }) => {
      saveToken(token);
      updateRoomInfo(room);
      history.push(`/room/${roomId}`);
    });
  };

  const [isObserver, setObserver] = useState(false);

  const handleChange = () => {
    setObserver(!isObserver);
  };

  return (
    <>
      <PromotedText text={`JOIN THE MEETING AS...`} />
      <form onSubmit={handleSubmit(onSubmitHandler)} autoComplete="off">
        <div className={classes.root}>
          <div>
            <img src={photo1} alt="twitter avatar" className={classes.img} />
          </div>
          <div className={classes.wrapper}>
            <div className={classes.wrapperInput}>
              <TextField
                label="NAME"
                variant="outlined"
                id="name"
                placeholder="NAME"
                autoComplete="off"
                name="name"
                inputRef={register}
                error={!!errors.name}
                size="small"
                fullWidth
              ></TextField>
            </div>
            <div className={classes.wrapper}>
              <ObserverCheckbox handleChange={handleChange} checked={isObserver} />
            </div>
            <div className={classes.wrapperButton}>
              <VoteButton content={'JOIN SESSION'} height={2.8} className={classes.wrapperButton} />
            </div>
          </div>
          <div>
            <img src={photo2} alt="twitter avatar" className={classes.img} />
          </div>
        </div>
      </form>
    </>
  );
};

export default UserNameInput;
