// src/CampaignContent.js
import React from 'react';
import { Heading, Text, VStack } from '@chakra-ui/react';

const CampaignContentBefore = () => {
    return (
        <VStack spacing={4} align="stretch">
            <Heading size="md" mt={6}>Our Focus</Heading>
            <Text>
                The core issue at the forefront of our current campaign is the United States' financial and military support to Israel. Many constituents have expressed deep concerns over the U.S.'s role in the ongoing conflict between Israel and Palestine. This platform is a response to a collective call for action—a way for you to express your stance against the funding and aid that, according to some perspectives, contribute to the hostilities in the region.
            </Text>

            <Heading size="md" mt={6}>Why Participate?</Heading>
            <Text>
                <strong>Influence Policy:</strong> Elected officials take constituent communications seriously. Your voice can shape their policy positions and voting decisions.
            </Text>
            <Text>
                <strong>Express Your Views:</strong> This platform ensures your specific concerns are conveyed clearly and accurately to the people representing you.
            </Text>
            <Text>
                <strong>Hold Officials Accountable:</strong> Remind your representatives that their actions are scrutinized and will influence your voting decisions.
            </Text>

            <Heading size="md" mt={6}>A Call to Stand Against Genocide</Heading>
            <Text>
                We stand against the violence that has claimed thousands of lives. Through this campaign, you have the power to urge the U.S. government to take a stand against what some view as atrocities and war crimes against the Palestinian people.
            </Text>

            <Heading size="md" mt={6}>Take a Stand Now</Heading>
            <Text>
                If you believe that U.S. funds could be better allocated toward domestic programs rather than foreign aid that some argue fuels conflict, make your voice heard. Our elected officials need to understand the gravity of their constituents' concerns—concerns that could shape the upcoming elections and future policy decisions.
            </Text>

            <Heading size="md" mt={6}>It's Time to Act</Heading>
            <Text>
                Join the movement of citizens across the nation demanding a change in how we engage with the global community. Your participation could redefine foreign policy and help prevent further loss of life.
            </Text>

            <Heading size="md" mt={6}>Raise your voice. Demand action. Let’s make a difference together.</Heading>
        </VStack>
    );
};

export default CampaignContentBefore;
