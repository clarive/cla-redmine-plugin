(function(params) {
    var clariveCategory = Cla.ui.form.categoryBox({
        name: 'clariveCategory',
        fieldLabel: _('Clarive Category Name'),
        value: params.rec.clariveCategory || '',
        allowBlank: false,
        singleMode: true,
        anchor: '50%'
    });

    var redmineCategory = Cla.ui.textField({
        name: 'redmineCategory',
        fieldLabel: _('Redmine Category Name'),
        allowBlank: false,
        anchor: '50%'
    });

    var fieldMap = Cla.ui.dataEditor({
        name: 'fieldMap',
        title: _('Clarive - Redmine Field Correspondence'),
        hide_save: true,
        hide_cancel: true,
        hide_type: true,
        height: 300,
        data: params.rec.fieldMap || {
            'description': 'description',
            'id_status': 'status',
            'priority_level': 'priority',
            'system': 'proyect'
        }
    });

    var listMap = Cla.ui.dataEditor({
        name: 'listMap',
        title: _('Clarive - Redmine List Correspondence'),
        hide_save: true,
        hide_cancel: true,
        height: 400,
        data: params.rec.listMap || {
            "priority_level": {
                "Critical": "5",
                "High": "4",
                "Low": "3",
                "Medium": "2",
                "Very Low": "1"
            },
            "status_new": {
                "2": "1",
                "22": "2",
                "1287": "3",
                "14": "5"
            },
            "system": {
                "1320": "1",
            }
        },
        hide_type: false
    });

    return [
        clariveCategory,
        redmineCategory,
        fieldMap,
        listMap
    ]
})