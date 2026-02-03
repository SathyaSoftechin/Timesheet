
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import StarIcon from '@mui/icons-material/Star';
import { selectUser } from '../state/features/authSlice';

const TimesheetCard = ({ _id, projectName, date, employee, rating }) => {
  const navigate = useNavigate();
  const user = useSelector(selectUser);

  const roleId = user?.role?.roleId;

  // ✅ Admin (0) & Manager (1) only
  const canAddTask = roleId === 0 || roleId === 1;
    // (rating !== null || rating === undefined );

  return (
    <Box sx={{ minWidth: 275 }}>
      <Card variant="outlined">
        <CardContent>
          {/* <Typography variant="h5">{projectName}</Typography> */}
          <Typography variant="h5">{employee?.name}</Typography>

          {/* <Typography color="text.secondary">
            {employee?.name}
          </Typography> */}
          <Typography color="text.secondary">
            {projectName}
          </Typography>


          <Typography fontSize={14} color="text.secondary">
            {new Date(date).toLocaleDateString('en-IN')}
          </Typography>

          <Stack direction="row" alignItems="center" gap={0.5} mt={1}>
            Rating:{' '}
            {rating !== null && rating !== undefined ? (
              <>
                {rating} <StarIcon color="warning" />
              </>
            ) : (
              'N/A'
            )}
          </Stack>
        </CardContent>

        <CardActions>
          <Button size="small" onClick={() => navigate(`/timesheet/${_id}`)}>
            View
          </Button>

          {canAddTask && (
            <Button
              size="small"
              variant="contained"
              onClick={() => navigate(`/add-to-timesheet/${_id}`)}
            >
              Add Task
            </Button>
          )}
        </CardActions>
      </Card>
    </Box>
  );
};

export default TimesheetCard;
