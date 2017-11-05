var reg = require("cla/reg");

reg.register('service.redmine.inbound', {
    name: _('Redmine Inbound'),
    icon: '/plugin/cla-redmine-plugin/icon/redmine.svg',
    form: '/plugin/cla-redmine-plugin/form/redmine-services-inbound.js',
    rulebook: {
        moniker: 'redmine_inbound',
        description: _('Redmine inbound service'),
        required: ['redmine_category'],
        allow: [ 'redmine_category'],
        mapper: {
            'redmine_category':'redmineCategory'
        },
        examples: [{
            redmine_inbound: {
                redmine_category: 'category_resource'
            }
        }]
    },
    handler: function(ctx, config) {
        var ci = require("cla/ci");
        var log = require("cla/log");
        var web = require("cla/web");
        var cla = require("cla/cla");
        var db = require("cla/db");
        var reg = require("cla/reg");
        var sem = require("cla/sem");
        var myutils = require("myutils");

        var category = config.redmineCategory;
        var redmineCategory = ci.findOne({
            mid: category + ''
        });
        var content = {};
        var stashWs = ctx.stash('ws_params');
        var wsBody = JSON.parse(ctx.stash('ws_body'));
        var topics = db.getCollection('topic');
        var redmineTopic;

        var mode = wsBody.payload.action;
        var contentRedmine = wsBody.payload[redmineCategory.redmineCategory];
        var redmineId = wsBody.payload[redmineCategory.redmineCategory].id;
        var projectId = wsBody.payload[redmineCategory.redmineCategory].project.id;

        if (mode == "opened") {
            sem.take('redmineControl', function() {
                redmineTopic = topics.findOne({
                    _redmine_id: redmineId
                });
                if (redmineTopic) {
                    topics.update({
                        mid: redmineTopic.mid + ''
                    }, {
                        $set: {
                            _redmine_update: '0',
                            _redmine_change_status: '0'
                        }
                    });
                    return;
                }
                if (wsBody.payload[redmineCategory.redmineCategory]) {
                    var fieldMap = redmineCategory.fieldMap;
                    var listMap = redmineCategory.listMap;
                    content = myutils.buildContentClarive(fieldMap, redmineCategory, contentRedmine, listMap);
                    var topicMid = reg.launch('service.topic.create', {
                        name: 'Service topic create',
                        config: {
                            title: wsBody.payload[redmineCategory.redmineCategory].subject,
                            category: redmineCategory.clariveCategory,
                            username: stashWs['username'],
                            status: content['id_status'],
                            variables: content
                        }
                    });

                    topics.update({
                        mid: topicMid + ''
                    }, {
                        $set: {
                            _redmine_id: redmineId,
                            _redmine_update: '1',
                            _redmine_change_status: '0'
                        }
                    });
                    log.info(_("Topic created with mid: ") + topicMid)
                    return topicMid;
                }
            });
        } else if (mode == "updated") {
            sem.take('redmineControl', function() {
                redmineTopic = topics.findOne({
                    _redmine_id: redmineId
                });

                if (!redmineTopic) {
                    log.error(_("Topic doesn't exist"));
                    return;
                }

                if (wsBody.payload[redmineCategory.redmineCategory]) {
                    var fieldMap = redmineCategory.fieldMap;
                    var listMap = redmineCategory.listMap;
                    content = myutils.buildContentClarive(fieldMap, redmineCategory, contentRedmine, listMap);
                    if (content['id_status'] && content['id_status'] != redmineTopic['status']) {
                        if (redmineTopic && redmineTopic._redmine_change_status == '1') {
                            topics.update({
                                mid: redmineTopic.mid + ''
                            }, {
                                $set: {
                                    _redmine_change_status: '0'
                                }
                            });
                            log.info(_("Topic already updated"));
                            return;
                        }

                        reg.launch('service.topic.change_status', {
                            name: _('Change topic status'),
                            config: {
                                topics: redmineTopic.mid,
                                new_status: content['id_status'],
                                username: stashWs.username
                            }
                        });
                        topics.update({
                            mid: redmineTopic.mid + ''
                        }, {
                            $set: {
                                _redmine_change_status: '1'
                            }
                        });
                    }

                    if (redmineTopic && redmineTopic._redmine_update == '1') {
                        topics.update({
                            mid: redmineTopic.mid + ''
                        }, {
                            $set: {
                                _redmine_update: '0'
                            }
                        });
                        log.info(_("Topic already updated"));
                        return;
                    }
                    content['title'] = wsBody.payload[redmineCategory.redmineCategory].subject;
                    var update = reg.launch('service.topic.update', {
                        name: _('Update topic'),
                        config: {
                            mid: redmineTopic['mid'],
                            username: stashWs['username'],
                            variables: content
                        }
                    });

                    topics.update({
                        mid: redmineTopic.mid + ''
                    }, {
                        $set: {
                            _redmine_update: '1'
                        }
                    });
                    log.info(_("Redmine topic updated"));
                    return;
                }
            });
        }
    }
});