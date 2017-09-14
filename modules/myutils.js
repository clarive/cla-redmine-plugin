exports.buildContent = function(fieldMap, redmineCategory, topicData, listMapHashes) {
    var content = {};
    var data = {};
    for (var clariveField in fieldMap) {
        var redmineField = redmineCategory.fieldMap[clariveField];
        data = buildData(listMapHashes, clariveField, data, redmineField, topicData);
    }
    data['subject'] = topicData['title'];
    content[redmineCategory.redmineCategory] = data;
    content = JSON.stringify(content);
    return content;
};

function buildData(listMapHashes, clariveField, data, redmineField, topicData) {
    if (topicData[clariveField]) {
        if (listMapHashes[clariveField]) {
            for (var clariveValue in listMapHashes[clariveField]) {
                var redmineLabel = listMapHashes[clariveField][clariveValue];
                if (topicData[clariveField] == clariveValue) {
                    redmineField = redmineField + '_id';
                    data[redmineField] = redmineLabel;
                }
            }
        } else {
            data[redmineField] = topicData[clariveField];
        }
    }
    return data;
};

exports.buildContentClarive = function(fieldMap, redmineCategory, contentRedmine, listMapHashes) {
    var content = {};
    var data = {};
    for (var clariveField in fieldMap) {
        var redmineField = redmineCategory.fieldMap[clariveField];
        data = buildDataClarive(listMapHashes, clariveField, data, redmineField, contentRedmine);
    }
    return data;
};

function buildDataClarive(listMapHashes, clariveField, data, redmineField, contentRedmine) {
    if (contentRedmine[redmineField]) {
        if (listMapHashes[clariveField]) {
            for (var clariveValue in listMapHashes[clariveField]) {
                var redmineLabel = listMapHashes[clariveField][clariveValue];
                if (contentRedmine[redmineField].id == redmineLabel) {
                    data[clariveField] = clariveValue;
                }
            }
        } else {
            data[clariveField] = contentRedmine[redmineField];
        }
    }
    return data;
};