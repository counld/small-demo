import React from "react";
import { Tabs } from "antd";
import TableList from "./components/TableLIst";
import RenderUpload from "./components/Upload";
import OnlyUpload from "./components/OnlyUpload";
const { TabPane } = Tabs;

export default function MyAntd() {
  
	
	return (<Tabs defaultActiveKey="1" centered>
    <TabPane tab="Tab 1" key="1">
      Content of Tab Pane 1
      <RenderUpload />
      <OnlyUpload />
    </TabPane>
    <TabPane tab="Tab 2" key="2">
			这是我的表格
      <TableList />
    </TabPane>
    <TabPane tab="Tab 3" key="3">
      Content of Tab Pane 3
    </TabPane>
  </Tabs>)
}