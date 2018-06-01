import React from 'react';
import PropTypes from 'prop-types';

import ErrorPage from '../components/ErrorPage';
import Collective from '../components/Collective';
import UserCollective from '../components/UserCollective';

import { addCollectiveData } from '../graphql/queries';

import withData from '../lib/withData';
import withIntl from '../lib/withIntl';
import withLoggedInUser from '../lib/withLoggedInUser';

class CollectivePage extends React.Component {

  static getInitialProps ({ query, res }) {

    if (res){
      res.setHeader('Cache-Control','public, max-age=300');
    }

    return { slug: query && query.slug, query };
  }

  static propTypes = {
    slug: PropTypes.string, // for addCollectiveData
    query: PropTypes.object,
    data: PropTypes.object.isRequired, // from withData
    getLoggedInUser: PropTypes.func.isRequired, // from withLoggedInUser
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {
    const { getLoggedInUser } = this.props;
    const LoggedInUser = await getLoggedInUser();
    this.setState({ LoggedInUser });
  }

  render() {
    const { data, query } = this.props;
    const { LoggedInUser } = this.state;

    if (!data.Collective) return (<ErrorPage data={data} />);

    const collective = data.Collective;

    return (
      <div>
        { collective.type === 'COLLECTIVE' &&
          <Collective
            collective={collective}
            LoggedInUser={LoggedInUser}
            query={query}
            />
        }
        { ['USER', 'ORGANIZATION'].includes(collective.type) &&
          <UserCollective
            collective={collective}
            LoggedInUser={LoggedInUser}
            query={query}
            />
        }
      </div>
    );
  }
}

export default withData(withIntl(withLoggedInUser(addCollectiveData(CollectivePage))));
