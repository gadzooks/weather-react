import React from 'react';

import {
  Anchor, Box, Button, Header, Nav, Text,
} from 'grommet';

const navItems = [
  { label: 'M', href: '/forecasts/mock' },
  { label: 'R', href: '/forecasts/real' },
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

export function SideBar() {
  return (
    <>
      {navItems.map((item) => (
        <Button key={item.label} href={item.href} hoverIndicator>
          <Box align='center' pad={{ horizontal: 'medium', vertical: 'small' }}>
            <Text>{item.label}</Text>
          </Box>
        </Button>
      ))}
    </>
  );
}
