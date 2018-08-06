import React from 'react';
import PropTypes from 'prop-types';

import ErrorPage from '../components/ErrorPage';
import CreateCollective from '../components/CreateCollective';

import { addCollectiveCoverData } from '../graphql/queries';

import withData from '../lib/withData';
import withIntl from '../lib/withIntl';
import withLoggedInUser from '../lib/withLoggedInUser';

class CreateCollectivePage extends React.Component {

  static getInitialProps ({ query: { hostCollectiveSlug } }) {
    return { slug: hostCollectiveSlug || 'opencollective-host' };
  }

  static propTypes = {
    slug: PropTypes.string, // for addCollectiveCoverData
    data: PropTypes.object.isRequired, // from withData
    getLoggedInUser: PropTypes.func.isRequired, // from withLoggedInUser
  };

  constructor(props) {
    super(props);
    this.state = { loading: true };
  }

  async componentDidMount() {
    const { getLoggedInUser } = this.props;
    const LoggedInUser = await getLoggedInUser();
    this.setState({ LoggedInUser, loading: false });
  }

  render() {

    const { data } = this.props;

    if (this.state.loading || !data.Collective) {
      return (<ErrorPage loading={this.state.loading} data={data} />);
    }

    return (
      <CreateCollective host={data.Collective} LoggedInUser={this.state.LoggedInUser} />
    );
  }
}

export default withData(withIntl(withLoggedInUser(addCollectiveCoverData(CreateCollectivePage))));
