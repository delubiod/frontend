import React from 'react';
import Header from '../components/Header';
import Body from '../components/Body';
import Footer from '../components/Footer';
import CollectiveCover from '../components/CollectiveCover';
import { addCollectiveCoverData, addGetLoggedInUserFunction } from '../graphql/queries';
import ErrorPage from '../components/ErrorPage';
import withData from '../lib/withData';
import withIntl from '../lib/withIntl';
import UpdateWithData from '../components/UpdateWithData';
import { defineMessages } from 'react-intl';

class UpdatePage extends React.Component {

  static getInitialProps (props) {
    const { query: { collectiveSlug, updateSlug }, data } = props;
    return { collectiveSlug, updateSlug, data }
  }

  constructor(props) {
    super(props);
    this.state = {};

    this.messages = defineMessages({
      'collective.contribute': { id: 'collective.contribute', defaultMessage: 'contribute' }
    });
  }

  async componentDidMount() {
    const { getLoggedInUser } = this.props;
    const LoggedInUser = getLoggedInUser && await getLoggedInUser(this.props.collectiveSlug);
    this.setState({LoggedInUser});
  }

  render() {
    const { intl, data, updateSlug } = this.props;
    const { LoggedInUser } = this.state;

    if (!data.Collective) {
      return (<ErrorPage data={data} />)
    }

    const collective = data.Collective;

    return (
      <div className="UpdatePage">

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
            cta={{ href: `#contribute`, label: intl.formatMessage(this.messages['collective.contribute']) }}
            href={`/${collective.slug}`}
            />

          <div className="content" >
            <UpdateWithData
              collectiveSlug={collective.slug}
              updateSlug={updateSlug}
              editable={true}
              LoggedInUser={LoggedInUser}
              />
          </div>

        </Body>

        <Footer />

      </div>
    );
  }

}

export default withData(addGetLoggedInUserFunction(addCollectiveCoverData(withIntl(UpdatePage))));
