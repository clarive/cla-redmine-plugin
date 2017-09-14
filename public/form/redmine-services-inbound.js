(function(params) {

    return [
        new Cla.ui.ciCombo({
            name: 'server',
            value: params.data.server || '',
            class: 'RedmineServer',
            fieldLabel: _('Redmine Server'),
            allowBlank: false,
            with_vars: 1
        }),
        new Cla.ui.ciCombo({
            name: 'redmineCategory',
            value: params.data.redmineCategory || '',
            class: 'RedmineCategory',
            fieldLabel: _('Redmine Category'),
            allowBlank: false,
            with_vars: 1,
            singleMode: false
        }),

    ]
})