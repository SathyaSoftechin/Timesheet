

import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import StarIcon from '@mui/icons-material/Star';

import Loader from '../common/Loader';
import Alert from '../common/Alert';
import FlexBetween from '../common/FlexBetween';
import RateTimesheet from '../components/RateTimesheet';

import {
  useGetTimesheetDetailsQuery,
  useUpdateTaskStatusMutation,
} from '../state/features/apiSlice';

import { selectUser } from '../state/features/authSlice';

const cellStyle = {
  padding: '10px',
  border: '1px solid black',
  textAlign: 'center',
};

const TimesheetDetails = () => {
  const { id } = useParams();
  const user = useSelector(selectUser);

  const {
    isLoading,
    data,
    error,
    refetch,
  } = useGetTimesheetDetailsQuery(id);

  const [updateTaskStatus] = useUpdateTaskStatusMutation();

  useEffect(() => {
    refetch();
  }, [id]);

  if (isLoading) return <Loader />;
  if (error) return <Alert message={error?.data?.message || error.message} />;
  if (!data) return null;

  const { timesheet } = data;
  const role = user?.role?.roleName?.toLowerCase();
  const isEmployee = role === 'employee';
  const isManager = role === 'manager';

  return (
    <Container>
      <Typography my={4} variant="h2" textAlign="center">
        Timesheet Details
      </Typography>

      {/* HEADER */}
      <FlexBetween
        flexWrap="wrap"
        gap={2}
        p={2}
        mb={4}
        border="2px solid"
        borderColor="primary.main"
        borderRadius="40px"
      >
        <Typography variant="h6">
          Project: {timesheet.projectName}
        </Typography>

        <Typography variant="h6">
          Employee: {timesheet.employee.name}
        </Typography>

        <Typography variant="h6">
          Date:{' '}
          {new Date(timesheet.date).toLocaleDateString('en-IN')}
        </Typography>

        <Typography variant="h6">
          {timesheet.rating === undefined ? (
            'Rating: N/A'
          ) : (
            <Stack direction="row" gap={0.5} alignItems="center">
              Rating: {timesheet.rating}
              <StarIcon color="warning" />
            </Stack>
          )}
        </Typography>
      </FlexBetween>

      {/* TASK TABLE */}
      <table
        style={{
          width: '100%',
          marginBottom: '40px',
          borderCollapse: 'collapse',
          border: '1px solid black',
        }}
      >
        <thead>
          <tr>
            <th style={cellStyle}>Time</th>
            <th style={cellStyle}>Description</th>
            <th style={cellStyle}>Remarks</th>
            <th style={cellStyle}>Status</th>
            {isEmployee && <th style={cellStyle}>Action</th>}
          </tr>
        </thead>

        <tbody>
          {timesheet.tasks.map((task) => {
            // ✅ DEFAULT STATUS SAFETY
            const status = task.status || 'pending';

            return (
              <tr key={task._id}>
                <td style={cellStyle}>
                  {task.hour.toString().padStart(2, '0')}:
                  {task.minute.toString().padStart(2, '0')}
                </td>

                <td style={cellStyle}>{task.description}</td>
                <td style={cellStyle}>{task.remarks}</td>

                {/* STATUS */}
                <td style={cellStyle}>
                  <Chip
                    label={status === 'completed' ? 'Completed' : 'Pending'}
                    color={status === 'completed' ? 'success' : 'warning'}
                  />
                </td>

                {/* EMPLOYEE ACTION */}
                {isEmployee && (
                  <td style={cellStyle}>
                    <Button
                      size="small"
                      variant="contained"
                      color={status === 'completed' ? 'success' : 'primary'}
                      onClick={async () => {
                        await updateTaskStatus({
                          taskId: task._id,
                          status:
                            status === 'completed'
                              ? 'pending'
                              : 'completed',
                        });
                        refetch();
                      }}
                    >
                      {status === 'completed'
                        ? 'Mark Incomplete'
                        : 'Mark Complete'}
                    </Button>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* RATE TIMESHEET – MANAGER ONLY */}
      {isManager &&
        user?._id === timesheet.employee.reportsTo &&
        timesheet.rating === undefined && (
          <RateTimesheet
            timesheetId={id}
            employee={timesheet.employee}
          />
        )}
    </Container>
  );
};

export default TimesheetDetails;
