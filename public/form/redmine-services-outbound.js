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
        new Cla.ui.comboBox({
            name: 'synchronizeWhen',
            fieldLabel: _('Action'),
            data: [
                ['create', _('Create')],
                ['update', _('Update')],
                ['change_status', _('Change Status')]
            ],
            value: params.data.synchronizeWhen || '',
            disabled: false,
            hidden: false,
            allowBlank: false,
            anchor: '50%',
            singleMode: true
        }),
        new Cla.ui.ciCombo({
            name: 'redmineCategory',
            value: params.data.redmineCategory || '',
            class: 'RedmineCategory',
            fieldLabel: _('Redmine Category'),
            allowBlank: false,
            with_vars: 1,
            singleMode: true
        }),

    ]
})