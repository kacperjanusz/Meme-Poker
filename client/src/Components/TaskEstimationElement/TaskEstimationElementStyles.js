import { makeStyles } from '@material-ui/core/styles';

const TaskEstimatedElementStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexFlow: 'column nowrap',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
}));

export default TaskEstimatedElementStyles;
