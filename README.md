# Redmine Plugin

<img src="https://cdn.rawgit.com/clarive/cla-redmine-plugin/master/public/icon/redmine.svg?sanitize=true" alt="Redmine Plugin" title="Redmine Plugin" width="120" height="120">

The Redmine plugin will allow you to keep issues (topics) from Redmine synchronized with Clarive and vice versa.

# What is Redmine 

Redmine is a flexible project management web application. Written using the Ruby on Rails framework, it is cross-platform and cross-database.

## Installation

To install the plugin, place the `cla-redmine-plugin` folder inside the `$CLARIVE_BASE/plugins` directory in your Clarive
instance.

### RedmineServer

To configurate the Redmine Server Resource open:

In **Clarive SE**: Resources -> ClariveSE.

In **Clarive EE**: Resources -> Redmine.

This Resource is used to save your Redmine Server settings:

- **API key** - Redmine API key.
- **Login URL** - The URL where Redmine is located.

Example:
        
        API Key: 2373928392028202
        Login URL: https://miredmine.example.com

### RedmineCategory

To configurate the Redmine Category Resource open:

In **Clarive SE**: Resources -> ClariveSE.

In **Clarive EE**: Resources -> Redmine.

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

### Redmine Inbound

You need to set the inbound service as a Webservice.

You will also need to use a Webhook Redmine Plugin to set the URL and to keep this synchronization between Clarive and
Redmine. To call the service where the Inbound service is located, the URL should be as follows: `<your Clarive
url>/rule/ws/<inboundCreateRule>?api_key=<your API Key in Clarive>`, therefore you need to obtain a Clarive user API
key.

The various parameters are:

- **Redmine Category (variable name: redmine_category)** - The Redmine category where correspondences are defined.

### Redmine Outbound

Use this service to perform an action remotely from Clarive. The *Create*, *Change Status* and *Update* events must be
"post-online".

The various parameters are:

- **Redmine Server (server)** - The server with the user data from Redmine that will create the topic in Clarive.
- **Action (synchronize_when)** - The action to be performed. This can be *Create* **("create")**, *Update* **("update")** or *Change Status* **("change_status")**.
- **Redmine Category (redmine_category)** - The Redmine category where correspondences are defined.

## How to use

### In Clarive EE

Once the plugin is placed in its folder, you can find this service in the palette in the section of generic service and can be used like any other palette op.

Outbound example:

```yaml
    Redmine Server: Redmine server
    Action: Create
    Redmine Category: Redmine categories
``` 

Inbound example:

```yaml
    Redmine Category: Redmine categories
``` 

### In Clarive SE

#### Rulebook

If you want to use the plugin through the Rulebook, in any `do` block, use this ops as examples to configure the different parameters:

Outbound example:

```yaml
do:
   - redmine_outbound:
       server: 'redmine_resource'                # Required. Use the mid set to the resource you created 
       synchronize_when: 'create'                # Required.
       redmine_category: 'category_resource'     # Required. Use the mid set to the resource you created 
``` 

Inbound example:

```yaml
do:
   - redmine_inbound:
       redmine_category: 'category_resource'     # Required. Use the mid set to the resource you created 
```

##### Outputs

###### Success

The service will return the response from the Redmine API.

###### Possible configuration failures

**Task failed**

You will get the error from the Redmine API.

**Variable required**

```yaml
Error in rulebook (compile): Required argument(s) missing for op "redmine_outbound": "server"
```

Make sure you have all required variables defined.

**Not allowed variable**

```yaml
Error in rulebook (compile): Argument `Category` not available for op "redmine_inbound"
```

Make sure you are using the correct paramaters (make sure you are writing the variable names correctly).

## More questions?

Feel free to join **[Clarive Community](https://community.clarive.com/)** to resolve any of your doubts.
