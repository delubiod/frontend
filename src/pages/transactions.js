import React from 'react';
import withData from '../lib/withData';
import withIntl from '../lib/withIntl';

import { addCollectiveCoverData, addGetLoggedInUserFunction } from '../graphql/queries';
import Header from '../components/Header';
import Body from '../components/Body';
import Footer from '../components/Footer';
import CollectiveCover from '../components/CollectiveCover';
import ErrorPage from '../components/ErrorPage';

import TransactionsWithData from '../apps/expenses/components/TransactionsWithData';


class TransactionsPage extends React.Component {

  static getInitialProps ({ query: { collectiveSlug }, data }) {
    return { slug: collectiveSlug, data }
  }

  constructor(props) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {
    const { getLoggedInUser } = this.props;
    const LoggedInUser = getLoggedInUser && await getLoggedInUser(this.props.collectiveSlug);
    this.setState({ LoggedInUser });
  }

  render() {
    const { data } = this.props;
    const { LoggedInUser } = this.state;

    if (!data.Collective) return (<ErrorPage data={data} />);

    const collective = data.Collective;
    const cta = ['USER', 'ORGANIZATION'].indexOf(collective.type) === -1 && { href: `/${collective.slug}#contribute`, label: 'contribute' };

    return (
      <div className="TransactionsPage">

        <Header
          title={collective.name}
          description={collective.description}
          twitterHandle={collective.twitterHandle}
          image={collective.image || collective.backgroundImage}
          className={this.state.status}
          LoggedInUser={LoggedInUser}
          />

        <Body>

          <CollectiveCover
            collective={collective}
            href={`/${collective.slug}`}
            cta={cta}
            LoggedInUser={LoggedInUser}
            />

          <div className="content" >

            <TransactionsWithData
              collective={collective}
              LoggedInUser={this.state.LoggedInUser}
              showCSVlink={true}
              filters={true}
              />

          </div>

        </Body>

        <Footer />

      </div>
    );
  }

}

export default withData(addGetLoggedInUserFunction(addCollectiveCoverData(withIntl(TransactionsPage))));
