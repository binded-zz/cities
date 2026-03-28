import React from 'react';
import ResourceRow from '../ResourceRow';
import ProductionDisplay from '../ProductionDisplay';
import TaxSlider from '../TaxSlider';

const TaxProductionWindow = () => {
    return (
        <div>
            <Tabs>
                <TabPanel>
                    {/* Use ResourceRow component */}
                    <ResourceRow />
                </TabPanel>
                <TabPanel>
                    {/* Use ProductionDisplay component */}
                    <ProductionDisplay />
                </TabPanel>
                <TabPanel>
                    {/* Use TaxSlider component */}
                    <TaxSlider />
                </TabPanel>
            </Tabs>
        </div>
    );
};

export default TaxProductionWindow;