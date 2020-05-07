// import React from 'react';
// import ReactDom from 'react-dom'
// import { configure, shallow } from 'enzyme';
// import Adapter from 'enzyme-adapter-react-16';
// import RouterRapper from './components/RouteRapper'
// import Home from './components/home'
// import { Route } from 'react-router-dom'


// configure({ adapter: new Adapter() })

// describe('renders correct routes', () => {
//   it('renders correct routes', () => {
//     const wrapper = shallow(<Routes />);
//     const pathMap = wrapper.find(Route).reduce((pathMap, route) => {
//       const routeProps = route.props();
//       pathMap[routeProps.path] = routeProps.component;
//       return pathMap;
//     }, {});


//     expect(pathMap['/home']).toBe(Home);
//   });
// })

import PrivateRoute from './components/RouteRapper';
import React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter } from 'react-router';

// import Home from './components/home'
describe('renders correct routes', () => {
  it('should render component if user has been authenticated', () => {
    const AComponent = () => <div>AComponent</div>;
    const props = { path: '/aprivatepath', component: AComponent };

    const enzymeWrapper = mount(
      <MemoryRouter initialEntries={[props.path]}>
        <PrivateRoute authenticated={true} ownProps={props} />
      </MemoryRouter>,
    );

    expect(enzymeWrapper.exists(AComponent)).toBe(true);
  });

  it('should redirect if user is not authenticated', () => {
    const AComponent = () => <div>AComponent</div>;
    const props = { path: '/aprivatepath', component: AComponent };

    const enzymeWrapper = mount(
      <MemoryRouter initialEntries={[props.path]}>
        <PrivateRoute authenticated={false} ownProps={props} />
      </MemoryRouter>,
    );
    const history: any = enzymeWrapper.find('Router').prop('history');
    expect(history.location.pathname).toBe('/');
  });
});