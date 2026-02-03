
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Avatar from '@mui/material/Avatar';
import Drawer from '@mui/material/SwipeableDrawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import UserIcon from '@mui/icons-material/AccountCircleOutlined';
import AddUserIcon from '@mui/icons-material/PersonAdd';
import CreateTimesheetIcon from '@mui/icons-material/PostAdd';
import EmployeeTimesheetIcon from '@mui/icons-material/BadgeOutlined';
import AddTaskIcon from '@mui/icons-material/NoteAddOutlined';
import MyTimesheetsIcon from '@mui/icons-material/DescriptionOutlined';
import LogoutIcon from '@mui/icons-material/LogoutOutlined';

import { getUserRole, selectUser } from '../state/features/authSlice';

const Sidebar = ({ toggleSidebar, toggleDrawer }) => {
  return (
    <Drawer
      anchor="left"
      open={toggleSidebar}
      onClose={toggleDrawer()}
      onOpen={toggleDrawer()}
    >
      <SidebarList toggleDrawer={toggleDrawer} />
    </Drawer>
  );
};

const SidebarList = ({ toggleDrawer }) => {
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const role = useSelector(getUserRole); // admin | manager | employee

  const listItems = useMemo(() => {
    if (!role) return [];
    const r = role.toLowerCase();

    // 🔐 ADMIN
    if (r === 'admin') {
      return [
        { label: 'Create User', icon: AddUserIcon, link: '/create-user' },
        { label: 'Create Timesheet', icon: CreateTimesheetIcon, link: '/create-timesheet' },
         { label: 'Add Task', icon: AddTaskIcon, link: '/add-to-timesheet' },
        { label: 'Employees Timesheets', icon: EmployeeTimesheetIcon, link: '/employees-timesheets' },
        { label: 'My Timesheets', icon: MyTimesheetsIcon, link: '/my-timesheets' },
      ];
    }

    // 🔐 MANAGER
    if (r === 'manager') {
      return [
        { label: 'Create User', icon: AddUserIcon, link: '/create-user' },
        { label: 'Create Timesheet', icon: CreateTimesheetIcon, link: '/create-timesheet' },
         { label: 'Add Task', icon: AddTaskIcon, link: '/add-to-timesheet' },
        { label: 'Employees Timesheets', icon: EmployeeTimesheetIcon, link: '/employees-timesheets' },
        { label: 'My Timesheets', icon: MyTimesheetsIcon, link: '/my-timesheets' },
      ];
    }

    // 🔐 EMPLOYEE
    return [
      { label: 'My Timesheets', icon: MyTimesheetsIcon, link: '/my-timesheets' },
    ];
  }, [role]);

  return (
    <Box
      sx={{ width: 280 }}
      role="presentation"
      onClick={toggleDrawer()}
      onKeyDown={toggleDrawer()}
    >
      <Typography p={2} variant="h5" textAlign="center" fontWeight={700} color="primary">
        TIMESHEETS
      </Typography>

      <Divider />

      <Stack direction="row" alignItems="center" gap={2} p={2}>
        <Avatar sx={{ bgcolor: 'secondary.main' }}>
          <UserIcon />
        </Avatar>
        <Box>
          <Typography fontWeight={600}>{user?.name}</Typography>
          <Typography variant="caption">({role})</Typography>
        </Box>
      </Stack>

      <Divider />

      <List>
        {listItems.map(({ label, icon: Icon, link }) => (
          <ListItem key={label} disablePadding>
            <ListItemButton onClick={() => navigate(link)}>
              <ListItemIcon>
                <Icon color="primary" />
              </ListItemIcon>
              <ListItemText primary={label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider />

      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate('/logout')}>
            <ListItemIcon>
              <LogoutIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary="Log Out" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );
};

export default Sidebar;
