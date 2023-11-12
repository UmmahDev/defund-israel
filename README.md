# defund-israel.com

## Introduction

Welcome to the repository for `defund-israel.com`, an open-source project aimed at empowering developers to create applications that facilitate emailing representatives about various issues. This project is designed to be forked and adapted, allowing for a wide range of applications beyond its initial scope.

## Project Goal

The primary goal of this project is to enable developers to take this codebase and modify it to create apps that can email representatives about different issues, tailored to their needs.

## Project Structure

The project consists of two main parts: the frontend and the backend.

### Backend

- **Technology**: The backend is built using Node.js lambdas, with DynamoDB as the database, and is deployed using the Serverless framework.
- **Functionality**: It maps ZIP codes to representatives, sourced from [Find Your Representative](https://www.house.gov/representatives/find-your-representative).
- **Caching**: To prevent overuse of external services, responses are cached in DynamoDB. The cache is consulted first for existing ZIP codes.
- **Deployment**: Deploy the backend using the command `npm run deploy`, which internally runs `npx sls deploy`.

### Frontend

- **Technology**: The frontend is a React application, set up with Create React App, and deployed to an S3 bucket.
- **Structure**: Frontend code is stored in the `client` directory.
- **Deployment**: It's deployed using `serverless-finch`. Use the command `npm run deploy_react_app` to build and deploy the app. This command runs `npm run build && npx serverless client deploy`.
- **Additional Setup**: 
  - The frontend is managed outside the main repo. A CloudFront distribution is set up on top of the S3 bucket, with a custom domain tied in Route53 to the CloudFront distribution.
  - For a detailed guide on deploying a React app to S3 and setting up a CloudFront distribution, watch this tutorial: [Deploying a React App to S3 & CloudFront](https://www.youtube.com/watch?v=FEI-uEdb2y8&ab_channel=WornOffKeys).
  - To learn how to configure a custom domain on a CloudFront distribution, refer to this video: [Configuring a Custom Domain on CloudFront](https://www.youtube.com/watch?v=qUiMdiHjJx8&ab_channel=WornOffKeys).
    
## Getting Started

1. **Fork the Repository**: Start by forking this repository to your account.
2. **Set Up Backend**: Follow the instructions in the backend section to set up and deploy the Node.js lambdas.
3. **Configure Frontend**: Set up the frontend by following the instructions in the frontend section.
4. **Customization**: Customize the application according to your needs, focusing on the emailing functionality.
5. **Deploy**: Use the provided commands to deploy both the backend and frontend.

## Contributing

Contributions are welcome! If you have suggestions or want to contribute to the project, please feel free to fork the repository and submit pull requests.
