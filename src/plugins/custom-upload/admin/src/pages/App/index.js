import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import FileList from "../../components/FileList";
import pluginId from "../../pluginId";
import UploadCustomPage from "../CustomPage1";

const App = () => {
  return (
    <div>
      <Switch>
        <Route path={`/plugins/${pluginId}`} component={FileList} exact />
        <Route
          path={`/plugins/${pluginId}/custom-link-1`}
          component={UploadCustomPage}
        />
      </Switch>
    </div>
  );
};

export default App;
