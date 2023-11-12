import React, { useState } from 'react';
import {
    Select,
    Input,
    FormControl,
    FormLabel,
    Button,
    Spinner,
} from '@chakra-ui/react';
import reps from './reps.json'; // Assuming reps.json is in the src directory
import config from './config';

const StateZipForm = () => {
    // Extract state names from the JSON object keys
    const US_STATES = Object.keys(reps);
    const [selectedState, setSelectedState] = useState('');
    const [loading, setLoading] = useState(false); // Add loading state

    const [showEmailInfo, setShowEmailInfo] = useState(false); // New state for controlling the display of email info
    const [emailInfo, setEmailInfo] = useState({ emails: [], body: '' });
    const [showHelpMessage, setShowHelpMessage] = useState(false);
    const [copyEmailsText, setCopyEmailsText] = useState('Copy Emails');
    const [copyMessageText, setCopyMessageText] = useState('Copy Message');
    const [copySubjectText, setCopySubjectText] = useState('Copy Subject');

    // Handle state selection change
    const handleStateChange = (event) => {
        setSelectedState(event.target.value);
    };

    // Function for copying emails to clipboard
    const copyEmailsToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(emailInfo.emails.join(', '));
            setCopyEmailsText('Emails Copied!');
            setTimeout(() => setCopyEmailsText('Copy Emails'), 2000); // Reset text after 2 seconds
        } catch (err) {
            console.error('Failed to copy emails:', err);
        }
    };

    const copySubjectToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(config.emailSubject);
            setCopySubjectText('Subject Copied!');
            setTimeout(() => setCopySubjectText('Copy Subject'), 2000); // Reset text after 2 seconds
        } catch (err) {
            console.error('Failed to copy subject:', err);
        }
    };

    // Function for copying message to clipboard
    const copyMessageToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(emailInfo.body);
            setCopyMessageText('Message Copied!');
            setTimeout(() => setCopyMessageText('Copy Message'), 2000); // Reset text after 2 seconds
        } catch (err) {
            console.error('Failed to copy message:', err);
        }
    };

    const toggleEmailInfoDisplay = () => {
        setShowEmailInfo(!showEmailInfo);
    };

    // Form submission handler
    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true); // Set loading to true when the API call starts

        const formData = new FormData(event.target);
        const state = formData.get('state');
        const zipCode = formData.get('zipcode');

        // Get senators for the selected state from your local JSON file
        const localSenators = reps[state]?.senators || [];

        // Fetch additional representatives based on the zip code
        try {
            const response = await fetch(`${config.getRepresentativesApiUrl}?zipcode=${zipCode}`);
            if (response.ok) {
                const additionalReps = await response.json();

                // Combine local senators' emails with the ones from the API response
                const allEmails = localSenators.map((senator) => senator.email).concat(additionalReps.map((rep) => rep.email));

                const emailBody = config.emailBodyTemplate(state, zipCode);
                // Generate the mailto link with all emails
                const mailtoLink = generateMailtoLink(allEmails, emailBody);

                setEmailInfo({ emails: allEmails, body: emailBody });

                // Redirect to the mailto link
                window.location.href = mailtoLink;

                setTimeout(() => {
                    setShowHelpMessage(true);
                }, 5000);
            } else {
                throw new Error('API call failed');
            }
        } catch (error) {
            console.error('Failed to fetch representatives:', error);
        } finally {
            setLoading(false); // Reset loading to false when done or failed
        }
    };

    // Generate mailto link function now accepts an array of emails
    const generateMailtoLink = (emails, body) => {
        return `mailto:${emails.join(',')}?subject=${config.emailSubject}&body=${encodeURIComponent(body)}`;
    };

    return (
        <>
            <form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>
                <FormControl id="state" isRequired>
                    <FormLabel>State</FormLabel>
                    <Select name="state" placeholder="Select state" onChange={handleStateChange} value={selectedState}>
                        {US_STATES.map((state) => (
                            <option value={state} key={state}>
                                {state}
                            </option>
                        ))}
                    </Select>
                </FormControl>

                <FormControl id="zipcode" mt={4} isRequired>
                    <FormLabel>Zipcode</FormLabel>
                    <Input name="zipcode" placeholder="Enter your Zipcode" />
                </FormControl>
                <Button mt={4} colorScheme="blue" type="submit" isLoading={loading}>
                    {loading ? <Spinner size="sm" /> : 'Submit'}
                </Button>
            </form>

            {showHelpMessage && (
                <div style={{ marginTop: "10px", textAlign: "center" }}>
                    <button
                        onClick={toggleEmailInfoDisplay}
                        style={{ background: "none", color: "#007bff", textDecoration: "underline", border: "none", padding: "0", cursor: "pointer" }}>
                        Having Trouble with Your Email Client? Click here
                    </button>
                </div>
            )}

            {/* Email info display and copy button */}
            {showEmailInfo && (
                <div style={{ marginTop: "20px", padding: "20px", border: "1px solid #2D3748", borderRadius: "8px", backgroundColor: "#1A202C" }}>
                    <h2 style={{ marginBottom: "15px", color: "#CBD5E0", fontSize: "1.3em", textAlign: "center" }}>Having Trouble with Your Email Client?</h2>
                    <p style={{ marginBottom: "20px", color: "#A0AEC0", fontSize: "1em", textAlign: "center" }}>No worries! You can manually copy the content below.</p>

                    <div style={{ marginBottom: "10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ color: "#ddd", fontSize: "1.2em" }}>Email Addresses:</span>
                        <button onClick={copyEmailsToClipboard} style={{ background: "none", color: "#007bff", border: "none", cursor: "pointer" }}>
                            {copyEmailsText}
                        </button>
                    </div>
                    <p style={{ marginBottom: "20px", color: "#bbb", fontSize: "1em", wordBreak: "break-all" }}>{emailInfo.emails.join(', ')}</p>

                    <div style={{ marginBottom: "10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ color: "#ddd", fontSize: "1.2em" }}>Subject:</span>
                        <button onClick={copySubjectToClipboard} style={{ background: "none", color: "#007bff", border: "none", cursor: "pointer" }}>
                            {copySubjectText}
                        </button>
                    </div>
                    <p style={{ marginBottom: "20px", color: "#bbb", fontSize: "1em" }}>{config.emailSubject}</p>

                    <div style={{ marginBottom: "10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ color: "#ddd", fontSize: "1.2em" }}>Message:</span>
                        <button onClick={copyMessageToClipboard} style={{ background: "none", color: "#007bff", border: "none", cursor: "pointer" }}>
                            {copyMessageText}
                        </button>
                    </div>
                    <div style={{ marginBottom: "20px", color: "#bbb", fontSize: "1em", border: "1px solid #555", padding: "15px", borderRadius: "4px", backgroundColor: "#0b0d12", maxHeight: "300px", overflowY: "auto" }}>
                        {emailInfo.body}
                    </div>
                </div>
            )}

        </>
    );
};

export default StateZipForm;
