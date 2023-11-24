import React from 'react';
import { Helmet } from 'react-helmet';

const MetaData = ({ title }) => {
  // Log the title to check if it's being received correctly
  console.log('Received title:', title);

  // Use React Helmet to set the title
  return (
    <Helmet>
      <title>{`${title} - Cleopatra`}</title>
    </Helmet>
  );
};
export default MetaData;
