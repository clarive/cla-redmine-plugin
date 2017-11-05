var reg = require("cla/reg");

reg.register('service.redmine.outbound', {
    name: _('Redmine Outbound'),
    icon: '/plugin/cla-redmine-plugin/icon/redmine.svg',
    form: '/plugin/cla-redmine-plugin/form/redmine-services-outbound.js',
    rulebook: {
        moniker: 'redmine_outbound',
        description: _('Redmine outbound service'),
        required: [ 'server', 'synchronize_when', 'redmine_category'],
        allow: ['server', 'synchronize_when', 'redmine_category'],
        mapper: {
            'synchronize_when':'synchronizeWhen',
            'redmine_category':'redmineCategory'
        },
        examples: [{
            redmine_outbound: {
                server: 'hpalm_resource',
                synchronize_when: 'create',
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
        var sem = require("cla/sem");
        var myutils = require("myutils");
        var server = config.server || '';
        var synchronizeWhen = config.synchronizeWhen || '';
        var redmineServer = ci.findOne({
            mid: server + ''
        });

        if (synchronizeWhen == '') {
            log.error(_("Action option undefined."));
            return;
        }
        if (!redmineServer) {
            log.error(_("Redmine Server undefined. Please choose one. "));
            return;
        }
        var category = config.redmineCategory;
        var redmineCategory = ci.findOne({
            mid: category + ''
        });

        var urlServer = redmineServer.redmineUrl;
        var agent = web.agent();
        var agentNotParsed = web.agent({
            auto_parse: 0
        });
        var headers = {
            'X-Redmine-API-Key': redmineServer.apiKey,
            'content-type': 'application/json'
        };
        if (!urlServer) {
            log.error(_("Missing URL parameter."));
            return;
        }
        var content = {};

        var topics = db.getCollection('topic');
        var topic;
        var topicData = ctx.stash('topic_data');
        if (topicData) {
            var categoryId = topicData.id_category;
        } else {
            var categoryId = ctx.stash('category_id');
            topicData = ctx.stash();
        }
        var urlCategory = urlServer + '/' + redmineCategory.redmineCategory + 's';
        switch (synchronizeWhen) {
            case 'create':
                sem.take('redmineControl', function() {
                    var redmineTopic = topics.findOne({
                        mid: topicData.mid + ''
                    });
                    if (redmineTopic && redmineTopic._redmine_update) {
                        topics.update({
                            mid: redmineTopic.mid + ''
                        }, {
                            $set: {
                                _redmine_update: '0'
                            }
                        });
                        return;
                    }
                    if (categoryId == redmineCategory.clariveCategory) {
                        var fieldMap = redmineCategory.fieldMap;
                        var listMap = redmineCategory.listMap;
                        content = myutils.buildContent(fieldMap, redmineCategory, topicData, listMap);
                        var response = agentNotParsed.post(urlCategory + '.json', {
                            content: content,
                            headers: headers
                        });
                        var responseContent = JSON.parse(response.content);
                        var redmineId = responseContent[redmineCategory.redmineCategory].id;
                        topics.update({
                            mid: topicData.mid + ''
                        }, {
                            $set: {
                                _redmine_id: redmineId,
                                _redmine_update: '1',
                                _redmine_change_status: '1'
                            }
                        });
                    }
                });
                break;

            case 'update':
                sem.take('redmineControl', function() {
                    var redmineTopic = topics.findOne({
                        mid: topicData.mid + ''
                    });
                    if (!redmineTopic) {
                        log.error(_('Topic with mid ') + topicData.mid + _(" not found"));
                        return;
                    }
                    if (!redmineTopic._redmine_id) {
                        log.error(_('Topic with mid ') + topicData.mid + _(' has no relation with Redmine'));
                        return;
                    }
                    if (redmineTopic && redmineTopic._redmine_update) {
                        if (redmineTopic._redmine_update == '1') {
                            topics.update({
                                mid: redmineTopic.mid + ''
                            }, {
                                $set: {
                                    _redmine_update: '0'
                                }
                            });
                            return;
                        }
                    }
                    if (categoryId == redmineCategory.clariveCategory) {
                        var fieldMap = redmineCategory.fieldMap;
                        var listMap = redmineCategory.listMap;
                        content = myutils.buildContent(fieldMap, redmineCategory, topicData, listMap);
                        var redmineId = redmineTopic._redmine_id;
                        var updateUrl = urlCategory + '/' + redmineId + '.json';
                        var response = agentNotParsed.put(updateUrl, {
                            content: content,
                            headers: headers
                        });
                        topics.update({
                            mid: redmineTopic.mid + ''
                        }, {
                            $set: {
                                _redmine_update: '1',
                            }
                        });
                    }
                });
                break;

            case 'change_status':
                sem.take('redmineControl', function() {
                    var redmineTopic = topics.findOne({
                        mid: topicData.mid + ''
                    });
                    var mid = ctx.stash('topic_mid');
                    topic = topics.findOne({
                        mid: mid + ''
                    });
                    if (!topic) {
                        log.error(_('Topic with mid ') + mid + _("not found"));
                        return;
                    }
                    if (!topic._redmine_id) {
                        log.error(_('Topic with mid ') + mid + _(' has no relation with Redmine'));
                        return;
                    }
                    if (redmineTopic && redmineTopic._redmine_update) {
                        if (redmineTopic._redmine_change_status == '1') {
                            topics.update({
                                mid: redmineTopic.mid + ''
                            }, {
                                $set: {
                                    _redmine_change_status: '0'
                                }
                            });
                            return;
                        }

                    } else {
                        log.error(_("Redmine topic doesn't exist"));
                        return;
                    }

                    if (categoryId == redmineCategory.clariveCategory) {
                        var fieldMap = redmineCategory.fieldMap;
                        var listMap = redmineCategory.listMap;
                        content = myutils.buildContent(fieldMap, redmineCategory, topicData, listMap);
                        var redmineId = topic._redmine_id;
                        var updateUrl = urlCategory + '/' + redmineId + '.json';
                        var response = agentNotParsed.put(updateUrl, {
                            content: content,
                            headers: headers
                        });
                        topics.update({
                            mid: redmineTopic.mid + ''
                        }, {
                            $set: {
                                _redmine_change_status: '1',
                            }
                        });
                    }
                });
                break;
        }
        return;
    }
});