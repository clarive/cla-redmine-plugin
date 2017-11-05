var ci = require("cla/ci");

ci.createRole("Redmine");

ci.createClass("RedmineServer", {
    form: '/plugin/cla-redmine-plugin/form/redmine-server.js',
    icon: '/plugin/cla-redmine-plugin/icon/redmine.svg',
    roles: ["Redmine", "ClariveSE"],
    has: {
        apiKey: {
            is: "rw",
            isa: "Str",
            required: true
        },
        redmineUrl: {
            is: "rw",
            isa: "Str",
            required: true
        }
    }
});

ci.createClass("RedmineCategory", {
    form: '/plugin/cla-redmine-plugin/form/redmine-category.js',
    icon: '/plugin/cla-redmine-plugin/icon/redmine.svg',
    roles: ["Redmine", "ClariveSE"],
    has: {
        clariveCategory: {
            is: "rw",
            isa: "Str",
            required: false
        },
        redmineCategory: {
            is: "rw",
            isa: "Str",
            required: false
        },
        fieldMap: {
            is: "rw",
            isa: "HashRef",
            required: false
        },        
        listMap: {
            is: "rw",
            isa: "HashRef",
            required: false
        }
    }
});