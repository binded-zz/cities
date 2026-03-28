import React from 'react';
import { Tabs, Tab, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

const TaxProductionWindow = () => {
    return (
        <div>
            <Tabs>
                <TabList>
                    <Tab>Resources</Tab>
                    <Tab>Stats</Tab>
                    <Tab>Tax Settings</Tab>
                </TabList>

                <TabPanel>
                    <h2>Resource List</h2>
                    {/* Add your resource list code here */}
                </TabPanel>
                <TabPanel>
                    <h2>Statistics</h2>
                    {/* Add your stats display code here */}
                </TabPanel>
                <TabPanel>
                    <h2>Tax Sliders</h2>
                    {/* Add your tax sliders code here */}
                </TabPanel>
            </Tabs>
        </div>
    );
};

export default TaxProductionWindow;