import React from 'react';
import 'antd/dist/antd.css';
import './index.css';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import { Layout, Menu } from 'antd';
import { UploadOutlined, UserOutlined, VideoCameraOutlined } from '@ant-design/icons';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import AccountsContainer from './components/AccountsContainer';
import CategoriesView from './components/CategoriesView';
import ExpensesView from './components/ExpensesView';


const { Header, Content, Footer, Sider } = Layout;


function App() {
  return (
    <Router>
      <Layout>
       <Sider
         breakpoint="lg"
         collapsedWidth="0"
         onBreakpoint={broken => {
           console.log(broken);
         }}
         onCollapse={(collapsed, type) => {
           console.log(collapsed, type);
         }}
       >
         <div className="logo" />
         <Menu theme="dark" mode="inline" defaultSelectedKeys={['4']}>
           <Menu.Item key="1" icon={<UserOutlined />}>
             <Link to="/accounts">
                Accounts
             </Link>
           </Menu.Item>
           <Menu.Item key="2" icon={<VideoCameraOutlined />}>
             <Link to="/categories">
                Categories
             </Link>
           </Menu.Item>
           <Menu.Item key="3" icon={<UploadOutlined />}>
             <Link to="/expenses">
                Expenses
             </Link>
           </Menu.Item>
         </Menu>
         <AmplifySignOut />
       </Sider>
       <Layout>
         <Header className="site-layout-sub-header-background" style={{ padding: 0 }} />
         <Content style={{ margin: '24px 16px 0' }}>
           <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
             <Switch>
              <Route path="/accounts">
                <AccountsContainer />
              </Route>
              <Route path="/categories">
                <CategoriesView />
              </Route>
              <Route path="/expenses">
                <ExpensesView/>
              </Route>
              <Route path="/">
                 Bem vindo ao Poupa Ai!
              </Route>
            </Switch>
           </div>
         </Content>
         <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
       </Layout>
     </Layout>
    </Router>
  );
}

export default withAuthenticator(App);
