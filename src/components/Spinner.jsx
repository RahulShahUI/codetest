import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';

function Spinner() {
  return (
    <div className="loader-outer">
      <div className="loader-inner">
        <CircularProgress />
      </div>
    </div>
  );
}

export default Spinner;
