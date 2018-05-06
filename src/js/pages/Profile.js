/*** IMPORTS ***/
// Module imports
import React, { Component } from "react"
import { Link } from "react-router-dom"
import Cookies from "js-cookie"
import Icon from "@fortawesome/react-fontawesome"
import {
  faMapMarkerAlt,
  faPlusCircle,
  faCheck
} from "@fortawesome/fontawesome-free-solid"

// Components
import Page from "./Page"
import MiniScenario from "../components/MiniScenario"
import Main from "../components/Main"

// Utilities
import Database from "../resources/Database"
import { toFirstCap } from "../resources/Util"
/*** [end of imports] ***/

export default class Info extends Component {
  constructor(props) {
    super(props)

    // NOTE: Here we see if we want to show the profile for a different person:
    // TODO: is there a better React way to do this?
    let otherUser = this.props.match.params.otherUserId;

    this.state = {
      scenarioId: this.props.match.params.scenarioId || 1,
      userDonations: null,
      userDos: null,
      userRequests: null,
      userVerifications: null,
      currentUserData: null,
      userId: otherUser || Cookies.get("userId") || 1,
      isMyProfile: (otherUser == undefined)
    }
  }

  componentDidMount = () => {
    this.userDataMount()
    this.userDonationsMount()
    this.userDosMount()
    this.userRequestsMount()
    this.userVerificationsMount()
  }

  userDataMount = () => {
    Database.getUserById({ id: this.state.userId })
      .then(result => {
        // console.log("User successfully found:", result)
        this.setState({
          currentUserData: result.body.data.attributes
        })
      })
      .catch(error => {
        // console.error("Error getting user:", error)
        this.setState({
          currentUserData: null
        })
      })
  }
  userDonationsMount = () => {
    const json = { id: this.state.userId }

    Database.getUserDonations(json)
      .then(result => {
        const { data } = result.body
        // console.info("Donations call complete:", data)

        this.setState({
          userDonations: data
        })
      })
      .catch(error => {
        // console.error("Error getting donations:", error)
        this.setState({
          userDonations: null
        })
      })
  }
  userDosMount = () => {
    const json = { id: this.state.userId }

    Database.getUserDos(json)
      .then(result => {
        const { data } = result.body
        // console.info("Dos call complete:", data)

        this.setState({
          userDos: data
        })
      })
      .catch(error => {
        // console.error("Error getting dos:", error)
        this.setState({
          userDos: null
        })
      })
  }
  userRequestsMount = () => {
    const json = { id: this.state.userId }

    Database.getUserRequests(json)
      .then(result => {
        const { data } = result.body
        // console.info("Requests call complete:", data)

        this.setState({
          userRequests: data
        })
      })
      .catch(error => {
        // console.error("Error getting requests:", error)
        this.setState({
          userRequests: null
        })
      })
  }
  userVerificationsMount = () => {
    const json = { id: this.state.userId }

    Database.getUserVerifications(json)
      .then(result => {
        const { data } = result.body
        // console.info("Verifications call complete:", data)

        this.setState({
          userVerifications: data
        })
      })
      .catch(error => {
        // console.error("Error getting verifications:", error)
        this.setState({
          userVerifications: null
        })
      })
  }

  createMiniList = (list) => {
    var toShow = [];
    var hidSome = false;
    for (var ii in list) {
      var sc = list[ii];
      if (toShow.length < 7) {
        toShow.push({ 
          item:sc, 
          isGood:(Math.random() > 0.1), // TODO: currently random
        });
      } else {
        hidSome = true;
      }
    }
    var good = String.fromCharCode(9786); // happy face 
    var bad = String.fromCharCode(9785); // sad face
    var middle = String.fromCharCode(9775); // ying-yang
    // TODO: I was not able to get React to let me color these... :-(
    return <h4>  
      { toShow.map(k => (k.isGood?good:bad)) }
      { (hidSome ? "..." : "") } 
      </h4>
  }

  profileArea = () => {
    const {
      userDonations,
      userDos,
      userRequests,
      userVerifications
    } = this.state

    return (
      <section className="profile">
        <article className="profile-article">
          <header className="profile-article-header">
            <h4>Honey</h4>
            <Icon className="profile-icon" icon="caret-down" />
          </header>
        </article>
        <article className="profile-article">
          <header
            className="profile-article-header"
            onClick={() => this.toggleArticle("donations")} // note, was crashing
          >
            <h4>Donations ({userDonations ? userDonations.length : 0})</h4>
            <Icon className="profile-icon" icon="caret-down" />
          </header>
          {userDonations && this.createMiniList(userDonations)}
          {userDonations && (
            <div className="profile-content-wrap">
              {userDonations.map(scenario => (
                <MiniScenario
                  key={scenario.id}
                  id={scenario.id}
                  {...scenario.attributes}
                />
              ))}
            </div>
          )}
        </article>
        <article className="profile-article">
          <header className="profile-article-header">
            <h4>Tasks ({userDos ? userDos.length : 0})</h4>
            <Icon className="profile-icon" icon="caret-down" />
          </header>
          {userDos && this.createMiniList(userDos)}
          {userDos && (
            <div className="profile-content-wrap">
              {userDos.map(scenario => (
                <MiniScenario
                  key={scenario.id}
                  id={scenario.id}
                  {...scenario.attributes}
                />
              ))}
            </div>
          )}
        </article>
        <article className="profile-article">
          <header className="profile-article-header">
            <h4>Requests ({userRequests ? userRequests.length : 0})</h4>
            <Icon className="profile-icon" icon="caret-down" />
          </header>
          {userRequests && this.createMiniList(userRequests)}
          {userRequests && (
            <div className="profile-content-wrap">
              {userRequests.map(scenario => (
                <MiniScenario
                  key={scenario.id}
                  id={scenario.id}
                  {...scenario.attributes}
                />
              ))}
            </div>
          )}
        </article>
        <article className="profile-article">
          <header className="profile-article-header">
            <h4>
              Verifications ({userVerifications ? userVerifications.length : 0})
            </h4>
            <Icon className="profile-icon" icon="caret-down" />
          </header>
          {userVerifications && this.createMiniList(userVerifications)}
          {userVerifications && (
            <div className="profile-content-wrap">
              {userVerifications.map(scenario => (
                <MiniScenario
                  key={scenario.id}
                  id={scenario.id}
                  {...scenario.attributes}
                />
              ))}
            </div>
          )}
        </article>
        <br/>
      </section>
    )
  }

  render() {
    const { currentUserData, isMyProfile } = this.state

    return (
      <Page clas="profile-page">
        <Main>
          <header className="settings-header">
            <h3>Profile</h3>
          </header>
          {currentUserData && currentUserData.firstname !== "" ? (
            <div className="user-info-area">
              {currentUserData.avatar ? (
                <div className="user-image">
                  <img
                    src={currentUserData.avatar}
                    alt={currentUserData.firstname}
                  />
                </div>
              ) : (
                <Icon className="user-icon" icon="user" />
              )}

              <div className="user-name">
                <span>{toFirstCap(currentUserData.firstname)}</span>
                <span className="user-verified-icon">
                  <Icon icon={faCheck} />
                </span>
              </div>
            </div>
          ) : (
            <div className="user-info-area">
              <Icon className="user-icon" icon="question" />
              <Link className="user-name not-signed-in" to="/login/">
                Please sign in
              </Link>
            </div>
          )}
          {(!isMyProfile) && this.profileArea()}
          {isMyProfile && (<section className="discovery-settings-area">
            <header className="discovery-settings-header">
              <h3>Discovery Settings</h3>
            </header>
            <article className="discovery-settings card">
              <div className="settings-box">
                <div className="setting-icon">
                  <Icon icon={faMapMarkerAlt} />
                </div>
                <h4 className="setting-label">Location</h4>
                <div className="location-setting">Wellington, NZ</div>
              </div>
              <div className="settings-box">
                <div className="setting-icon">
                  <Icon icon={faPlusCircle} />
                </div>
                <h4 className="setting-label">I want to do</h4>
                <div className="scenario-tags">
                  <ul className="tag-list">
                    <li className="tag">
                      <Link to="/" className="tag-link">
                        #Donations
                      </Link>
                    </li>
                    <li className="tag">
                      <Link to="/" className="tag-link">
                        #Jobs
                      </Link>
                    </li>
                    <li className="tag">
                      <Link to="/" className="tag-link">
                        #Painting
                      </Link>
                    </li>
                    <li className="tag">
                      <Link to="/" className="tag-link">
                        #Roofing
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="settings-box">
                <div className="setting-icon">
                  <Icon icon={faPlusCircle} />
                </div>
                <h4 className="setting-label">Events I follow</h4>
                <div className="scenario-tags">
                  <ul className="tag-list">
                    <li className="tag">
                      <Link to="/" className="tag-link">
                        #HurricaneKatrina
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </article>
        </section> )}
        </Main>
      </Page>
    )
  }
}
