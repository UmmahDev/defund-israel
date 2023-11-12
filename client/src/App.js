// src/App.js
import React from 'react';
import StateZipForm from './StateZipForm';
import CampaignContentBefore from './CampaignContentBefore';
import CampaignContentAfter from './CampaignContentAfter';
import { Container } from '@chakra-ui/layout';

function App() {
  return (
    <Container mt="4" mb="4" maxW="container.xl" centerContent>
      <CampaignContentBefore />
      <StateZipForm />
      <CampaignContentAfter />
    </Container>
  );
}

export default App;
