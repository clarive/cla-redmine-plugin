(function(params) {

    return [
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