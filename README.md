# Redmine Plugin

The Redmine plugin will allow you to keep issues (topics) from Redmine synchronized with Clarive and vice versa.

# What is Redmine 

Redmine is a flexible project management web application.

## Installation

To install the plugin, place the `cla-redmine-plugin folder` inside the `CLARIVE_BASE/plugins` directory in your Clarive
instance.

## How to Use

Once the plugin is placed in its folder and Clarive has been restarted, you can start using it by going to your Clarive
instance.

You will now have two new Resources, one named RedmineServer for the Redmine server, and the other named RedmineCategory
for the Redmine category correspondence. You will also have two new palette services; Redmine Outbound is used when you
modify something in Clarive and information needs to be sent to Redmine, and Redmine Inbound in order to receive
information on Redmine changes.

### RedmineServer

This Resource is used to save your Redmine Server settings:

- **API key **- Redmine API key.
- **Login URL **- The URL where Redmine is located.

Example:
        
        API Key: 2373928392028202
        Login URL: https://miredmine.example.com

### RedmineCategory

This Resource will synchronize any Clarive topic you choose with the desired Redmine issue. That way, when you create or
update a topic of this type, the same action will be performed at the other end.

- **Name** - The internal name of the issue you are going to create in Redmine.
- **Clarive Category Name** - The name in Clarive of the topic category you would like to be counterpart of the Redmine
  issue.
- **Redmine Category Name** - The name in Clarive of the issue category you would like to be counterpart of the Redmine
  issue.
- **Clarive - Redmine Field Correspondence** - The fields you wish to share between the two services must have their
  correspondence here, with Clarive field names written to the left, and Redmine field names written to the right.
Clarive names must be the `id_field` name you have used in the form rule associated with the topic, and Redmine names
must be the id names of the fields you wish to correspond.
- **Clarive - Redmine List Correspondence** - You will define the correspondence between the values of all fields. For
  example, if 'id_status' can take different values, that are represented as ids in Redmine, here you have to enter
those ids for each value.

Example:

    Redmine Category Name:        Incident
    Clarive Category Name:        issue
    Clarive - Redmine Field Correspondence:
        - description                       description
        - id_status                         status
        - system                            project
        
    Clarive - Redmine List Correspondence:
        - id_status (Type: Hash)
            - 2 (New)                       1
            - 22 (In Progress)              2
        - system (Type: Hash)
            - 1920                          1
            - 1300                          2

## Palette Services

### Redmine Inbound

This palette service will perform a Redmine action in Clarive. You need to place this palette service in a Webservice
rule.

You will also need to use a Webhook Redmine Plugin to set the URL and to keep this synchronization between Clarive and
Redmine. To call the service where the Inbound service is located, the URL should be as follows: `<your Clarive
url>/rule/ws/<inboundCreateRule>?api_key=<your API Key in Clarive>`, therefore you need to obtain a Clarive user API
key.

Service settings:

- **Redmine Server** - Server with the user data from Redmine that will create the topic in Clarive.
- **Redmine Category** - The Redmine category where correspondences are defined.

### Redmine Outbound

Use this service to perform an action remotely from Clarive. The *Create*, *Change Status* and *Update* events must be
"post-online".

Service settings:

- **Redmine Server** - The server with the user data from Redmine that will create the topic in Clarive.
- **Action** - The action to be performed. This can be *Create*, *Update* or *Change Status*.
- **Redmine Category** - The Redmine category where correspondences are defined.
