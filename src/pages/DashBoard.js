import React, { useContext } from 'react';
import Layout from '../components/Layout/Layout';
import MyJobs from './MyJobs';
import Applied from './Applied';
import DashboardStats from '../components/shared/DashboardStats';
import { userContext } from '../components/shared/Context.js';

const DashBoard = () => {
    const { userT } = useContext(userContext);
    return (
        <Layout>
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#f9fafb' }}>
                <DashboardStats userT={userT} />
                {userT === 'Applicant' ? <MyJobs /> : <Applied />}
            </div>
        </Layout>
    );
};

export default DashBoard;
