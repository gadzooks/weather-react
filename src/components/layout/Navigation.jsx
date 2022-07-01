import React from 'react';

import {
  Anchor, Box, Header, Nav,
} from 'grommet';

export const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Forecast (mock)', href: '/forecasts/mock' },
  { label: 'Forecast (real)', href: '/forecasts/real' },
];

function OnHeaderNav() {
  return (
    <Header background='dark-1' pad='small'>
      <Box direction='row' align='center' gap='small'>
        <Anchor color='white' href='https://github.com/gadzooks'>
          gadzooks
        </Anchor>
      </Box>
      <Nav direction='row'>
        {navItems.map((item) => (
          <Anchor href={item.href} label={item.label} key={item.label} />
        ))}
      </Nav>
    </Header>
  );
}

export function OnHeader() {
  return <OnHeaderNav />;
}
OnHeader.storyName = 'On Header';

export default {
  title: 'Controls/Nav/On Header',
};
