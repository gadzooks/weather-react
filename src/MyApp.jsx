/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unused-state */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable class-methods-use-this */
/* eslint-disable react/prefer-stateless-function */
/* eslint-disable max-classes-per-file */
// import ons from 'onsenui';
import React, { Component } from 'react';
import Ons, {
  Navigator,
  Page,
  Button,
  Toolbar,
  BackButton,
  Card,
  Icon,
  List,
  ListHeader,
  ListItem,
  ListTitle,
  Input,
  Tab,
  Tabbar,
} from 'react-onsenui';

class Settings extends React.Component {
  render() {
    return (
      <Page>
        <h2>Settings</h2>
      </Page>
    );
  }
}

class PageNav2 extends React.Component {
  renderToolbar() {
    return (
      <Toolbar>
        <div className='left'>
          <BackButton>Back</BackButton>
        </div>
      </Toolbar>
    );
  }

  render() {
    return (
      <Page renderToolbar={this.renderToolbar.bind(this)}>
        <Card>
          <img
            src='https://monaca.io/img/logos/download_image_onsenui_01.png'
            alt='Onsen UI'
            style={{ width: '100%' }}
          />
          <div className='title'>
            {this.props.cardTitle ? this.props.cardTitle : 'Custom Card'}
          </div>
          <div className='content'>
            <div>
              <Button>
                <Icon icon='ion-thumbsup' />
              </Button>
              <Button>
                <Icon icon='ion-share' />
              </Button>
            </div>
            <List>
              <ListHeader>Bindings</ListHeader>
              <ListItem>Vue</ListItem>
              <ListItem>Angular</ListItem>
              <ListItem>React</ListItem>
            </List>
          </div>
        </Card>
      </Page>
    );
  }
}

class Cards extends React.Component {
  pushPage(event) {
    this.props.navigator.pushPage({
      component: PageNav2,
      props: { key: 'pageNav2', cardTitle: event.target.textContent },
    });
  }

  render() {
    return (
      <Page>
        <h2>Cards</h2>

        <ListTitle>Card List</ListTitle>
        <List>
          <ListItem onClick={this.pushPage.bind(this)}>
            Card One
          </ListItem>
          <ListItem onClick={this.pushPage.bind(this)}>
            Card Two
          </ListItem>
          <ListItem onClick={this.pushPage.bind(this)}>
            Card Three
          </ListItem>
        </List>
      </Page>
    );
  }
}

class PageNav1 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: props.title ? props.title : 'Custom Page',
      nextTitle: null,
    };
  }

  pushPage() {
    this.props.navigator.pushPage({
      component: PageNav1,
      props: {
        key: `pageNav${this.props.navigator.routes.length}`,
        title: this.state.nexTitle,
      },
    });
  }

  popPage() {
    this.props.navigator.popPage();
  }

  renderToolbar() {
    return (
      <Toolbar>
        <div className='left'>
          <BackButton>Back</BackButton>
        </div>
        <div className='center'>{this.state.title}</div>
      </Toolbar>
    );
  }

  render() {
    return (
      <Page renderToolbar={this.renderToolbar.bind(this)}>
        <div style={{ textAlign: 'center' }}>
          <h1>Custom Page</h1>
          <p>
            <Input
              modifier='underbar'
              placeholder='Title'
              float
              onChange={(evt) => this.setState({ nexTitle: evt.target.value })}
            />
          </p>
          <Button onClick={this.pushPage.bind(this)}>Push Page</Button>
          <Button onClick={this.popPage.bind(this)}>Pop Page</Button>
        </div>
      </Page>
    );
  }
}

class Home extends React.Component {
  pushPage() {
    this.props.navigator.pushPage({
      component: PageNav1,
      props: { key: 'pageNav1' },
    });
  }

  render() {
    return (
      <Page>
        <h2>Home</h2>
        <div style={{ textAlign: 'center' }}>
          <br />
          <Button onClick={this.pushPage.bind(this)}>Push Page</Button>
        </div>
      </Page>
    );
  }
}

class AppTabbar extends React.Component {
  renderToolbar() {
    return (
      <Toolbar>
        <div className='center'>Navigator+Tabbar</div>
      </Toolbar>
    );
  }

  renderTabs(navigator) {
    return [
      {
        content: <Home key='home' navigator={this.props.navigator} />,
        tab: <Tab key='home' label='Home' icon='ion-home' />,
      },
      {
        content: <Cards key='cards' navigator={this.props.navigator} />,
        tab: <Tab key='cards' label='Cards' icon='ion-card' badge='3' />,
      },
      {
        content: <Settings key='settings' />,
        tab: <Tab key='settings' label='Settings' icon='ion-ios-cog' />,
      },
    ];
  }

  render() {
    return (
      <Page renderToolbar={this.renderToolbar}>
        <Tabbar
          position='auto'
          index={0}
          renderTabs={this.renderTabs.bind(this)}
        />
      </Page>
    );
  }
}

class MyApp extends React.Component {
  renderPage(route, navigator) {
    route.props = route.props || {};
    route.props.navigator = navigator;

    return React.createElement(route.component, route.props);
  }

  render() {
    return (
      <Navigator
        initialRoute={{ component: AppTabbar, props: { key: 'appTabbar' } }}
        renderPage={this.renderPage}
      />
    );
  }
}
export default MyApp;
