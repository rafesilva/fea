import styles from './app.module.css'

import React, {useState} from 'react';
import { MetadataForm } from '../components/MetadataForm';
import {Tab, TabList} from "@fluentui/react-components";


const App: React.FC = () => {

    const [selectedTab, setSelectedTab] = useState<string>('tab1')

    return (
        <div className={styles.appContainer}>
            <div className={styles.appHeader}>Page Layout Builder</div>
                <TabList className={styles.appMenu} size={"small"} selectedValue={selectedTab} onTabSelect={(_, d) =>setSelectedTab(d.value as string)}>
                    <Tab className={styles.appMenuTab} value="tab1">Design</Tab>
                    <Tab className={styles.appMenuTab} value="tab2" disabled>Related Objects</Tab>
                </TabList>
                <div className={styles.appFrame}>
                    {selectedTab === "tab1" && <MetadataForm/>}
                    {selectedTab === "tab2" && <div></div>}
                </div>
        </div>
    );
};

export default App;