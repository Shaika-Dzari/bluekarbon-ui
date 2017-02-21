import React from 'react';
import tr from '../../i18n/i18n.js';

const PublishStatus = ({published, lang, callback}) => {

    let status = tr(lang, 'editor_published_' + (published ? 'true': 'false'));

    return (
        <div className="box">
            <div className="heading">
                <h4>{tr(lang, 'editor_published_title')}</h4>
            </div>
            <div className="body">
                <select name="pub" value={published ? 'true': 'false'} onChange={callback}>
                    <option value="true">{tr(lang, 'editor_published_true')}</option>
                    <option value="false">{tr(lang, 'editor_published_false')}</option>
                </select>
            </div>
        </div>

    );
}

export default PublishStatus;