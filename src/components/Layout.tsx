/* eslint-disable react/require-default-props */
import React, { useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';

import {
  Box, Button, Grid, Text,
} from 'grommet';
import { Outlet } from 'react-router-dom';
import { SideBar as MySideBar } from './layout/Navigation';
import ForecastHeader, { ForecastHeaderProps } from './HeaderTab';

export interface LayoutProps extends ForecastHeaderProps {
  isLoaded?: boolean;
}

export function Layout(props: LayoutProps) {
  const [sidebar, setSidebar] = useState(true);

  return (
    <Grid
      fill
      rows={['auto', 'flex']}
      columns={['auto', 'flex']}
      areas={[
        { name: 'header', start: [0, 0], end: [1, 0] },
        { name: 'sidebar', start: [0, 1], end: [0, 1] },
        { name: 'main', start: [1, 1], end: [1, 1] },
      ]}
    >
      <Box
        gridArea='header'
        direction='row'
        align='center'
        justify='between'
        pad={{ horizontal: 'medium', vertical: 'small' }}
      >
        <Button onClick={() => setSidebar(!sidebar)}>
          <MenuIcon />
        </Button>
        <ForecastHeader {...props} />
        <Text>my@email</Text>
      </Box>
      {sidebar && (
        <Box
          gridArea='sidebar'
          background='dark-3'
          width='xxsmall'
          animation={[
            { type: 'fadeIn', duration: 300 },
            { type: 'slideRight', size: 'xlarge', duration: 150 },
          ]}
        >
          <MySideBar />
        </Box>
      )}
      <Box gridArea='main' justify='center' align='center'>
        <Outlet />
      </Box>
    </Grid>
  );
}

Layout.args = {
  full: true,
};

Layout.storyName = 'App';

export default {
  title: 'Layout/Grid/App',
};
