import React, { useState } from 'react';

import {
  Box, Button, Grid, Text,
} from 'grommet';
import { Outlet } from 'react-router-dom';
import { SideBar as MySideBar } from './layout/Navigation';

export function Layout() {
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
        background='dark-1'
      >
        <Button onClick={() => setSidebar(!sidebar)}>
          <Text size='large'>Menu</Text>
        </Button>
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
