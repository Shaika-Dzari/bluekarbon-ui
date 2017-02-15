import React from 'react';
import './alertbox.scss';

const AlertBox = ({message}) => {
    let msg = null;
    if (!message) {
        return null;
    }

    if (message instanceof Error) {
        msg = message.name + ': ' + message.message;
    } else {
        msg = '' + message;
    }

    return (
        <div className="alert">
            <p>{msg}</p>
        </div>
    );
};

export default AlertBox;