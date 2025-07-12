import React, { useContext } from 'react';
import Layout from '../components/Layout/Layout';
import My_Jobs from './MyJobs';
import { userContext } from '../components/shared/Context.js';
import Applied from './Applied';

const DashBoard = () => {
    const { userT } = useContext(userContext);
    return (
        <Layout>
            {/* <My_Jobs /> */}
            
            {(userT=="Applicant")?
                <My_Jobs />:<Applied />
            }
        </Layout>
    )
};
export default DashBoard;