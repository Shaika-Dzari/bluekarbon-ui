import React from 'react';

import FileGridItem from './filegriditem.jsx';
import './filegrid.scss';

const FileGrid = ({items, index, onRemove, onCopyToStore}) => {

    let fs = null;
    let startDate = null;
    let endDate = null;

    if (items && index) {
        fs = index.map(i => {
            let f = items[i];
            return <FileGridItem key={'fgi-' + f.id} file={f} onRemove={onRemove} onCopyToStore={onCopyToStore} />
        });
    }

    return (
        <div className="grid-list clear-float">
            {fs}
        </div>
    );
}

export default FileGrid;