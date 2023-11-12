// src/CampaignContent.js
import React from 'react';
import { Box, Heading, Text, VStack, Divider } from '@chakra-ui/react';

const CampaignContentBefore = () => {
    return (
        <VStack spacing={4} align="stretch">
            <Box>
                <Heading size="lg" mb={4}>Voice Your Stance - Take Action Today</Heading>
                <Text fontSize="md">Make Your Opinion Heard on U.S. Aid to Israel</Text>
            </Box>

            <Divider />

            <Text>
                Defund-Israel.com is a dedicated platform that empowers you, the constituents of the United States, to directly reach out to your senators and representatives concerning critical foreign policy decisions. Our mission is to facilitate informed civic engagement and ensure your voice is heard on Capitol Hill.
            </Text>

            <Heading size="md" mt={6}>How It Works</Heading>
            <Text>
                <strong>Enter Your Details:</strong>  Start by providing your zip code and state. This information will help us identify not only your senators but also your local House representative.
            </Text>
            <Text>
                <strong>Review Your Message:</strong> A pre-drafted email will be prepared, conveying a strong message reflecting your opposition to funding and support for Israel, citing specific bills and resolutions.
            </Text>
            <Text>
                <strong>Send with Your Email Client:</strong> Once you've reviewed the message, clicking "Submit" will open your default email application, allowing you to send it directly from your own account.
            </Text>
            <Text>
                <strong>Make Your Voice Heard:</strong> While our platform does not track sent emails, we encourage you to follow up on the response from your representatives regarding related legislation.
            </Text>
        </VStack>
    );
};

export default CampaignContentBefore;
