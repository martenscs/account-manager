[![Build Status](https://travis-ci.org/pingidentity/account-manager.svg?branch=master)](https://travis-ci.org/pingidentity/account-manager)

account-manager
===============

Data Governance Broker sample UI for delegated account management


### Simple Deployment (within the Data Governance Broker)

1. Extract the account-manager.tar.gz file (found in the samples directory).
2. Use dsconfig to run the commands in the setup.dsconfig file.  This will create a Web Application Extension, assign
   the Web Application Extension to the HTTPS Connection Handler, and add the required Scopes to
   the Data Governance Broker's configuration.  If you are installing the sample on a Data Governance Broker server
   group, you can apply the script to the entire server group using the "--applyChangeTo server-group" argument. For
   Data Governance Brokers added later, untar the account-manager archive before cloning the configuration from an
   existing server.
3. Restart the HTTP Connection Handler by disabling and re-enabling it, or by restarting the server.
4. Access the sample at the HTTP Connection Handler's address and the /samples/account-manager context.  For example:
   "https://1.2.3.4:8443/samples/account-manager/".


### Advanced Deployment (in an external servlet container such as Tomcat or Jetty)

1. Extract the account-manager.tar.gz file (found in the samples directory).
2. Extract the source from the account-manager-source.tar.gz file in a development environment.
3. Customize the configuration values and optionally the other application source files and build account-manager.war
   (see the "Customization" section for additional details).
4. Deploy the custom account-manager.war file into your servlet container as appropriate (e.g. copy it into the webapps
   directory of your Tomcat installation and restart).
5. Use dsconfig to run the commands in the setup.dsconfig file that add the required Scopes to
   the Data Governance Broker's configuration.
6. Use dsconfig or the console application to edit the HTTP Servlet Cross Origin Policy configuration to allow for
   cross-domain AJAX requests to the Data Governance Broker's SCIM2 HTTP Servlet Extension. The sample application's
   origin and the Data Governance Broker's origin should be added to "cors-allowed-origins", and "GET", "DELETE", "POST"
   and "PUT" should be added to "cors-allowed-methods". E.g.,

```
dsconfig create-http-servlet-cross-origin-policy --policy-name account-manager \
   --set cors-allowed-origins:http://localhost:3006 --set cors-allowed-origins:https://localhost:8445 \
   --set cors-allowed-methods:GET --set cors-allowed-methods:DELETE --set cors-allowed-methods:POST \
   --set cors-allowed-methods:PUT
```

   dsconfig set-http-servlet-extension-prop --extension-name SCIM2 --set cross-origin-policy:account-manager

8. Access the sample at your servlet container's address and the appropriate context.


### Deployment with PingFederate as the Identity Provider

The application's default configuration assumes a Data Governance Broker server is performing the Resource Server role 
and a PingFederate server is performing the Identity Provider (IDP) role.

The steps below assume that both the Data Governance Broker and PingFederate server have been configured so that the
Broker's SCIM endpoint can accept and validate the PingFederate server's access tokens.  Refer to the Data Governance
Broker documentation for the required configuration to enable this feature.

1. Extract the account-manager.tar.gz file (found in the samples directory).
2. Extract the source from the account-manager-source.tar.gz file in a development environment.
3. Customize the configuration values and optionally the other application source files and build account-manager.war.
   At a minimum, values to be customized will include `IDENTITY_PROVIDER_URL`, `RESOURCE_SERVER_URL`, and
   `IDENTITY_PROVIDER_TYPE` (see the "Customization" section for additional details).
4. If you are deploying the custom account-manager.war file in the Data Governance Broker, perform the following:
   * Use dsconfig to run the commands in the setup.dsconfig file that add the Web Application Extension and add it to
     the HTTPS Connection Handler.
   * Restart the HTTP Connection Handler by disabling and re-enabling it, or by restarting the server.
5. If you are deploying the custom account-manager.war file in an external servlet container, perform the following:
   * Deploy the custom account-manager.war file into your servlet container as appropriate (e.g. copy it into the
     webapps directory of your Tomcat installation and restart).
   * Use dsconfig or the console application to edit the HTTP Servlet Cross Origin Policy configuration to allow for
     cross-domain AJAX requests to the Data Governance Broker's SCIM2 HTTP Servlet Extension. The sample application's
     origin and the Data Governance Broker's origin should be added to "cors-allowed-origins", and "GET", "DELETE",
     "POST" and "PUT" should be added to "cors-allowed-methods". E.g.,

```   
dsconfig create-http-servlet-cross-origin-policy --policy-name account-manager \
 --set cors-allowed-origins:http://localhost:3006 --set cors-allowed-origins:https://localhost:8445 \
 --set cors-allowed-methods:GET --set cors-allowed-methods:DELETE --set cors-allowed-methods:POST \
 --set cors-allowed-methods:PUT

dsconfig set-http-servlet-extension-prop --extension-name SCIM2 --set cross-origin-policy:account-manager
```

6. Use dsconfig to run the commands in the setup.dsconfig file that add the required Scope objects to the Data
   Governance Broker's configuration.
7. Configure the following in PingFederate:
   * Under Scope Management, configure scopes with names that match those that were added to the Data Governance Broker
     in step 6 (also listed in the "Scopes" section below).  NOTE: These scopes are configured to be highly privileged
     in the Broker so it is recommended that the "Restrict Scopes" option be used for all OAuth Clients and only this
     application's OAuth Client be given access to these scopes.
   * Configure an OAuth Client for this application.  The Client ID should match the `CLIENT_ID` value in the
     application configuration.  Client Authentication should be set to "None".  The Redirect URI should be the address
     the sample application will be accessible at, and should match the `CLIENT_REDIRECT_URL` value in the application
     configuration.  Allowed Grant Type should be "Implicit".
   * The OAuth Client must use an Access Token Manager of type 'JSON Web Tokens'
   * To allow Sign Out from the application, configure Asynchronous Front-Channel Logout settings in the
     OAuth Settings > Authorization Server Settings screen. Select the Track User Sessions for Logout and Revoke User
     Session on Logout check boxes.  Add the application's domain and path to the allowed redirect list in the Server
     Configuration > Redirect Validation screen.
   * This application allows access to user accounts that should be restricted.  One option for doing so would be to
     configure the OAuth Client to use an Access Token Manager with an Issuance Criteria that ensures only privileged
     accounts can get an access token via the OAuth Settings > Access Token Management and OAuth Settings > Access Token
     Mapping screens (e.g. require the account to have the "admin" entitlement). 

     For example, if the Access Token Manager and mapping were configured to use an LDAP data source 'PingDirectory',
     that included "ubidEntitlement" in the attribute contract, the following OGNL expression could be used as an
     Issuance Criteria to limit access (requires Expressions to be enabled):

     get("ds.PingDirectory.ubidEntitlement").getValues().toString().contains("admin")
8. Access the sample at the appropriate address and context.


### Scopes


The sample's default configuration depends on scopes that are created by the setup.dsconfig file:

1. `urn:pingidentity:scope:admin:profiles`
   Allows searching, reading and modifying user profile attributes.
   This scope is configured with resource attributes that are defined by the Data Governance Broker's reference app
   schema.
2. `urn:pingidentity:scope:admin:register_account`
   Allows creating user account profiles.
   This scope is configured with resource attributes that are defined by the Data Governance Broker's reference app
   schema.
3. `urn:pingidentity:scope:admin:entitlements`
   Allows searching, viewing and modifying user's entitlements.
4. `urn:pingidentity:scope:admin:account_state`
   Allows reading and modifying user account state.  This includes the ability to enable and disable accounts.
5. `urn:pingidentity:scope:admin:change_password`
   Allows changing and resetting a user's password.

As noted above the `urn:pingidentity:scope:admin:profiles` and `urn:pingidentity:scope:admin:register_account` scopes
are configured with resource attributes that are defined by the Data Governance Broker's reference app schema.  If
another schema is used these scopes will need to be re-configured (see the "Customization" section for additional
details).


### Customization

The sample application source is available so that the application can be easily customized and rebuilt (it is not
recommended to edit the contents of the packaged war file directly).  The source is available in the
account-manager-source.tar.gz file within the account-manager.tar.gz file.

The build process requires node and npm to be installed on the development machine
(https://docs.npmjs.com/getting-started/installing-node).  This project was verified to work with node v6.2.2 and
npm v3.10.2, but there are not currently any known version compatibility issues.

Once node and npm are installed, the project's dependencies can be installed by running "npm install" within the source
directory.  When executed as root on linux, use "npm install --unsafe-perm" instead.

The package.json file defines several project scripts that can be run via "npm run [SCRIPT NAME]".  Examples include
"prod" which will rebuild the project and package it in a war file, "dev" for running the project in the development
environment, and "test" for running the referenced jasmine test spec files within the development environment.  NOTE:
The scripts assume a UNIX-based operating system.  They will need to be modified if you are using a Windows development
environment.

If you wish to run the application in the development environment ("npm run dev"), some additional configuration will be
required:

1. The `IDENTITY_PROVIDER_URL` and `RESOURCE_SERVER_URL` constants in app/app.config.ts will need to be updated to use
   absolute URLs since the application will be running in the development environment rather than the Data Governance
   Broker (see the commented out example override values in app/app.config.ts).
2. The dev server's origin (http://localhost:3006) will need to be added to the HTTP Servlet Cross Origin Policy
   configuration to allow for cross-domain AJAX requests to the Data Governance Broker's SCIM2 HTTP Servlet Extension
   (see step 7 in the "Advanced Deployment" section above).

When ready to deploy a customization, run "npm run prod" from the command-line to rebuild the project and package it
into a war file.

The Account Manager Web Application Extension can then be updated to reference the custom account-manager.war file (make
sure to remove "tmp/Account Manager" so that the Data Governance Broker will redeploy from the new war file when the
HTTP connection handler and/or the server are restarted).

Several configuration values are defined in the app/app.config.ts file for easy customization.  The configuration values
can be found near the top of the script (search for the "export" statements). Values include:

1. `IDENTITY_PROVIDER_URL`
   The URI of the IDP's OAuth connection handler.  A value like "https://1.2.3.4:8443" should be used.
2. `RESOURCE_SERVER_URL`
   The URI of the Data Governance Broker's SCIM connection handler.  A value like "https://1.2.3.4:8443" should be used.
3. `CLIENT_REDIRECT_URL`
   The redirect URI for the client in the OAuth flow.  This should be the address used to view the sample, and
   should be one of the Redirect URLs configured for the sample OAuth2 Client in the Data Governance Broker.  A value
   like "https://1.2.3.4:8443/samples/account-manager/" should be used.
4. `CLIENT_ID`
   The Client ID assigned to the Account Manager OAuth2 Client in the PingFederate configuration.  
5. `URN_PREFIX`
   A prefix used by various URNs in the Data Governance Broker and the PingFederate configuration.
6. `SCOPE_PREFIX`
   A prefix used for this sample's scope URNs in the Data Governance Broker and the PingFederate configuration.
7. `REQUIRED_SCOPES`
   A list of scopes that are required for access to this sample.
8. `OPTIONAL_SCOPES_BY_FUNCTIONALITY`
   A list of scopes grouped by areas of functionality that are required for access to that functionality in this sample.

Changes such as using a schema other than the Data Governance Broker's reference app schema will require more extensive
customization of the sample's files and configuration.  This includes modifying the application files as well as
updating the configuration of the scopes' resource attributes.


### Known issues

1. Google Chrome prior to version 34 had an issue that would cancel ORIGIN requests with headers.  If using
   Google Chrome, make sure you are running version 34 or greater with the sample.  Please see this issue report for
   additional information:

   https://code.google.com/p/chromium/issues/detail?id=96007

2. This sample uses the OAuth 2 implicit grant for retrieving access tokens, and sessionStorage for temporarily
   persisting data for use by client scripts in the browser.  You should not do the same in your own applications
   without considering the security implications of this approach.  When using the implicit grant, the access tokens are
   exposed to the user and potentially other applications with access to the user's browser.  Additionally,
   sessionStorage is scoped per origin and window/tab, which makes it accessible to other applications running on the
   same server and port (Data Governance Broker connection handler) loaded in the same tab.  An alternate approach would
   be to use the OAuth 2 authentication code grant, which would keep the access token on the server so that it would not
   be exposed to the user or stored in the browser.  Please see the following specifications for additional information
   on this issue:

   http://tools.ietf.org/html/rfc6749#section-1.3.2
   https://html.spec.whatwg.org/multipage/webstorage.html#the-sessionstorage-attribute

### Support and reporting bugs

This is unsupported sample code. Help will be provided on a best-effort basis through GitHub. Please report issues 
using the project's [issue tracker](https://github.com/pingidentity/account-manager/issues).

### License

This is licensed under the Apache License 2.0.
