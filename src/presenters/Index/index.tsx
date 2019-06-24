import * as React from 'react'

import { Switch, Route } from 'react-router'
import { Link, BrowserRouter } from 'react-router-dom'

import { Account } from '../../models'

import Home from '../../containers/Home/Index'
import NotFound from '../NotFound'
import Setting from '../../containers/Setting'

import Layout from '../../components/Layout'
import Header from '../../components/Layout/Header'
import HeaderLogo from '../../components/Layout/HeaderLogo'
import Container from '../../components/Layout/Container'

import * as styles from '../Index/index.css'

export default ({ me }: { me?: Account }) => {
  return (
    <BrowserRouter>
      <Layout>
        <Header>
          <HeaderLogo />
          <div className={styles.account}>
            {me ? (
              <>@{me.screenName}</>
            ) : (
              <span>
                <i>[誰?]</i>
              </span>
            )}
          </div>
          <div className={styles.setting}>
            <Link to={{ pathname: '/settings' }}>
              <i className="uil uil-cog" />
            </Link>
          </div>
        </Header>
        <Container>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/settings" component={Setting} />
            <Route component={NotFound} />
          </Switch>
        </Container>
      </Layout>
    </BrowserRouter>
  )
}
