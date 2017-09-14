(function(params) {

    var apiKey = Cla.ui.textField({
        name: 'apiKey',
        fieldLabel: _('API Key'),
        allowBlank: false
    });

    var redmineUrl = Cla.ui.textField({
        name: 'redmineUrl',
        fieldLabel: _('Redmine URL'),
        allowBlank: false
    });

    return [
        apiKey,
        redmineUrl
    ]
})